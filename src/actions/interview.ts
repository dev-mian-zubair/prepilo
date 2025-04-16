"use server";
import { revalidatePath } from "next/cache";

import {
  categorizeTechnologies,
  CreateInterviewInput,
  generateQuestionsWithRetry,
  Question,
} from "./helpers/interview";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function createInterview(data: CreateInterviewInput | null) {
  // 1. Validate input payload
  if (!data) {
    throw new Error("Invalid request: Missing payload");
  }

  // 2. Validate required fields
  const requiredFields: Array<keyof CreateInterviewInput> = [
    "title",
    "duration",
    "difficulty",
    "focusAreas",
    "technologyNames",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Invalid request: Missing required field - ${field}`);
    }
    if (Array.isArray(data[field]) && data[field].length === 0) {
      throw new Error(`Invalid request: Empty array for field - ${field}`);
    }
  }

  try {
    // 3. Get authenticated user
    const user = await getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    // 4. Process technologies
    const techNames = Array.isArray(data.technologyNames)
      ? data.technologyNames
      : [data.technologyNames].filter(Boolean);

    if (techNames.length === 0) {
      throw new Error("At least one technology is required");
    }

    const categorizedTechs = await categorizeTechnologies(techNames);

    console.log("Categorized technologies:", categorizedTechs);

    // 5. Generate questions
    const questions = await generateQuestionsWithRetry(
      {
        ...data,
        technologyNames: techNames,
      },
      categorizedTechs,
    );

    console.log("Generated questions:", questions);

    // 6. Create database records
    const technologies = await Promise.all(
      categorizedTechs.map(async (tech) => {
        try {
          return await prisma.technology.upsert({
            where: { name: tech.name },
            create: { name: tech.name, category: tech.category },
            update: {},
          });
        } catch (error) {
          console.error(`Failed to process technology ${tech.name}:`, error);
          throw new Error(`Technology processing failed for ${tech.name}`);
        }
      }),
    );

    // 7. Create interview
    const interview = await prisma.interview.create({
      data: {
        creatorId: user.id,
        title: data.title,
        description: data.description || null,
        duration: Number(data.duration),
        difficulty: data.difficulty,
        focusAreas: data.focusAreas,
        isPublic: Boolean(data.isPublic ?? false),
        technologies: {
          create: technologies.map((t) => ({ technologyId: t.id })),
        },
        questions: {
          create: questions.map((q: Question) => ({
            text: q.text,
            type: q.type,
            technologyId: q.technology
              ? technologies.find((t) => t.name === q.technology)?.id
              : undefined,
            evaluationCriteria: q.evaluationCriteria,
          })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
        questions: true,
      },
    });

    revalidatePath("/dashboard/interviews");

    return { success: true, interview };
  } catch (error) {
    console.error("Interview creation failed:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getInterviewWithDetails(id: string) {
  try {
    return await prisma.interview.findUnique({
      where: { id },
      include: {
        technologies: {
          include: { technology: true },
        },
        questions: {
          include: { technology: true },
        },
        creator: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch interview:", error);

    return null;
  }
}

export async function getUserInterviews(userId: string) {
  try {
    return await prisma.interview.findMany({
      where: { creatorId: userId },
      include: {
        technologies: {
          include: { technology: true },
        },
        _count: {
          select: { questions: true, sessions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch interviewss:", error);

    return [];
  }
}
