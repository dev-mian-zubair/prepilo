"use server";
import { revalidatePath } from "next/cache";
import { Difficulty } from "@prisma/client";

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

    console.log("Processed technologies:", categorizedTechs);

    // 5. Create database records for technologies
    const technologies = await Promise.all(
      categorizedTechs.map(async (tech) => {
        try {
          return await prisma.technology.upsert({
            where: { name: tech.name },
            create: { name: tech.name },
            update: {},
          });
        } catch (error) {
          console.error(`Failed to process technology ${tech.name}:`, error);
          throw new Error(`Technology processing failed for ${tech.name}`);
        }
      }),
    );

    // 6. Generate questions for all difficulty levels
    const difficulties: Difficulty[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    const versionQuestions = await Promise.all(
      difficulties.map(async (difficulty) => {
        const questions = await generateQuestionsWithRetry(
          {
            ...data,
            technologyNames: techNames,
          },
          categorizedTechs,
          difficulty,
        );

        return { difficulty, questions };
      }),
    );

    console.log("Generated questions for versions:", versionQuestions);

    // 7. Create interview with versions for all difficulties
    const interview = await prisma.interview.create({
      data: {
        creatorId: user.id,
        title: data.title,
        description: data.description || null,
        duration: Number(data.duration),
        focusAreas: data.focusAreas,
        isPublic: Boolean(data.isPublic ?? false),
        technologies: {
          create: technologies.map((t) => ({ technologyId: t.id })),
        },
        versions: {
          create: versionQuestions.map(({ difficulty, questions }) => ({
            difficulty,
            questions: {
              create: questions.map((q: Question) => ({
                text: q.text,
                type: q.type,
                technologyId: q.technology
                  ? technologies.find((t) => t.name === q.technology)?.id
                  : undefined,
              })),
            },
          })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
        versions: { include: { questions: true } },
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

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface InterviewFilters {
  technologyName?: string;
  minDuration?: number;
  maxDuration?: number;
}

export async function getInterviewWithDetails(id: string) {
  try {
    return await prisma.interview.findUnique({
      where: { id },
      include: {
        technologies: {
          include: { technology: true },
        },
        versions: {
          include: { questions: { include: { technology: true } } },
        },
        creator: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch interview:", error);

    return null;
  }
}

export async function getUserInterviews(
  userId: string,
  options: PaginationOptions & InterviewFilters = {},
) {
  const {
    page = 1,
    pageSize = 10,
    technologyName,
    minDuration,
    maxDuration,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      creatorId: userId,
    };

    // Apply filters
    if (technologyName) {
      where.technologies = {
        some: {
          technology: {
            name: { contains: technologyName, mode: "insensitive" },
          },
        },
      };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = Number(minDuration);
      if (maxDuration !== undefined) where.duration.lte = Number(maxDuration);
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          technologies: {
            include: { technology: true },
          },
          versions: {
            include: {
              _count: { select: { questions: true, sessions: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.interview.count({ where }),
    ]);

    return {
      interviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch interviews:", error);

    return {
      interviews: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    };
  }
}

export async function getPublicInterviewsWithParticipants(
  options: PaginationOptions & InterviewFilters = {},
) {
  const {
    page = 1,
    pageSize = 10,
    technologyName,
    minDuration,
    maxDuration,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      isPublic: true,
    };

    // Apply filters
    if (technologyName) {
      where.technologies = {
        some: {
          technology: {
            name: { contains: technologyName, mode: "insensitive" },
          },
        },
      };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = Number(minDuration);
      if (maxDuration !== undefined) where.duration.lte = Number(maxDuration);
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          technologies: {
            include: { technology: true },
          },
          versions: {
            include: {
              _count: { select: { sessions: true } },
              sessions: {
                include: {
                  user: { select: { id: true, name: true, email: true } },
                },
                distinct: ["userId"], // Ensure unique participants
              },
            },
          },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.interview.count({ where }),
    ]);

    return {
      interviews: interviews.map((interview) => ({
        ...interview,
        participantCount: interview.versions.reduce(
          (sum, version) => sum + (version._count?.sessions || 0),
          0,
        ),
        participants: interview.versions
          .flatMap((version) => version.sessions)
          .map((session) => session.user)
          .filter(
            (user, index, self) =>
              index === self.findIndex((u) => u.id === user.id),
          ), // Deduplicate users
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch public interviews:", error);

    return {
      interviews: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    };
  }
}

export async function getUserAttemptedInterviews(
  userId: string,
  options: PaginationOptions & InterviewFilters = {},
) {
  const {
    page = 1,
    pageSize = 10,
    technologyName,
    minDuration,
    maxDuration,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      versions: {
        some: {
          sessions: {
            some: { userId },
          },
        },
      },
    };

    // Apply filters
    if (technologyName) {
      where.technologies = {
        some: {
          technology: {
            name: { contains: technologyName, mode: "insensitive" },
          },
        },
      };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = Number(minDuration);
      if (maxDuration !== undefined) where.duration.lte = Number(maxDuration);
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          technologies: {
            include: { technology: true },
          },
          versions: {
            include: {
              _count: { select: { questions: true, sessions: true } },
              sessions: {
                where: { userId },
                select: { id: true, startedAt: true, status: true },
              },
            },
          },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.interview.count({ where }),
    ]);

    return {
      interviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch user attempted interviews:", error);

    return {
      interviews: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    };
  }
}
