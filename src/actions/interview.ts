"use server";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import {
  Difficulty,
  FocusArea,
  QuestionType,
  TechCategory,
} from "@prisma/client";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface CreateInterviewInput {
  title: string;
  description?: string;
  duration: number;
  difficulty: Difficulty;
  focusAreas: FocusArea[];
  technologyNames: string[];
  isPublic?: boolean;
}

interface TechnologyWithCategory {
  name: string;
  category: TechCategory;
}

interface Question {
  text: string;
  type: QuestionType;
  technology?: string;
  evaluationCriteria: string[];
}

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

async function categorizeTechnologies(
  techNames: string[],
): Promise<TechnologyWithCategory[]> {
  if (techNames.length === 0) return [];

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Strictly respond with ONLY a JSON array of technology categorizations. No additional text, explanations, or formatting.

      Input technologies: ${techNames.join(", ")}

      Possible categories: ${Object.values(TechCategory).join(", ")}

      Required output format (ONLY THIS FORMAT):
      [
        {"name": "TechnologyName", "category": "CATEGORY"},
        {"name": "TechnologyName", "category": "CATEGORY"}
      ]

      Example:
      [
        {"name": "React", "category": "FRONTEND"},
        {"name": "Node.js", "category": "BACKEND"}
      ]`,
      system:
        "You are a helpful assistant that categorizes technologies. Only respond with the requested JSON array, no additional text.",
    });

    // Clean the response to extract only the JSON
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);

    if (!Array.isArray(result))
      throw new Error("Invalid format: Expected array");

    // Validate each item
    return result.map((item) => {
      if (!item.name || !item.category) {
        throw new Error("Invalid item format: Missing name or category");
      }
      if (!Object.values(TechCategory).includes(item.category)) {
        throw new Error(`Invalid category: ${item.category}`);
      }

      return {
        name: item.name.trim(),
        category: item.category as TechCategory,
      };
    });
  } catch (error) {
    console.error("Technology categorization failed:", error);

    // Fallback - assign default category but keep original names
    return techNames.map((name) => ({
      name: name.trim(),
      category: "FRAMEWORK" as TechCategory,
    }));
  }
}

async function generateQuestionsWithRetry(
  data: CreateInterviewInput,
  technologies: TechnologyWithCategory[],
  retries = 2,
): Promise<Question[]> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with the JSON array of theoretical interview questions. No coding questions or examples.

      Generate questions based on:
      - Title: ${data.title}
      - Duration: ${data.duration} minutes
      - Difficulty: ${data.difficulty}
      - Focus Areas: ${data.focusAreas.join(", ")}
      - Technologies: ${technologies.map((t) => `${t.name} (${t.category})`).join(", ")}

      Question Types: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

      Required JSON format:
      {
        "questions": [
          {
            "text": "Question text",
            "type": "QUESTION_TYPE",
            "technology": "TechName", // if applicable
            "evaluationCriteria": ["Criteria1", "Criteria2", "Criteria3"]
          }
        ]
      }

      Important:
      - Only theoretical/conceptual questions
      - No coding problems or examples
      - No sample answers needed
      - Match the specified difficulty level`,
      system:
        "You are an interview question generator for theoretical/conceptual questions only. Never provide coding questions or examples.",
    });

    // Clean and validate response
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const result = JSON.parse(text.slice(jsonStart, jsonEnd));

    if (!result?.questions) throw new Error("Invalid question format");

    return result.questions.map((q: any) => {
      if (!q.text) throw new Error("Question missing text");

      // Validate question type
      const validTypes: QuestionType[] = [
        "TECHNICAL",
        "BEHAVIORAL",
        "SYSTEM_DESIGN",
        "PROBLEM_SOLVING",
      ];
      const questionType = validTypes.includes(q.type)
        ? q.type
        : determineQuestionType(q.text, data.focusAreas);

      return {
        text: q.text.trim(),
        type: questionType,
        technology: q.technology?.trim(),
        evaluationCriteria: Array.isArray(q.evaluationCriteria)
          ? q.evaluationCriteria.map((ec: string) => ec.trim())
          : getDefaultCriteria(questionType),
      };
    });
  } catch (error) {
    console.error("Question generation failed:", error);
    if (retries > 0)
      return generateQuestionsWithRetry(data, technologies, retries - 1);

    // Final fallback - simple questions without technology association
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with a JSON array of ${Math.floor(data.duration / 5)} basic theoretical interview question strings about ${
        data.technologyNames.join(", ") || data.title
      }. Format: ["question1", "question2"]`,
    });

    const questions = JSON.parse(text.match(/\[.*\]/)?.[0] || "[]");

    return questions.map((text: string) => ({
      text: text.trim(),
      type: determineQuestionType(text, data.focusAreas),
      evaluationCriteria: getDefaultCriteria("TECHNICAL"),
    }));
  }
}

// Helper functions
function determineQuestionType(
  text: string,
  focusAreas: FocusArea[],
): QuestionType {
  const lowerText = text.toLowerCase();

  if (
    focusAreas.includes("BEHAVIORAL") &&
    (lowerText.includes("tell me about") ||
      lowerText.includes("how would you handle"))
  ) {
    return "BEHAVIORAL";
  }

  if (
    focusAreas.includes("SYSTEM_DESIGN") &&
    (lowerText.includes("design") || lowerText.includes("architecture"))
  ) {
    return "SYSTEM_DESIGN";
  }

  if (
    focusAreas.includes("PROBLEM_SOLVING") &&
    (lowerText.includes("how would you solve") ||
      lowerText.includes("approach"))
  ) {
    return "PROBLEM_SOLVING";
  }

  return "TECHNICAL";
}

function getDefaultCriteria(type: QuestionType): string[] {
  switch (type) {
    case "BEHAVIORAL":
      return ["Clarity", "Relevance", "Self-awareness"];
    case "SYSTEM_DESIGN":
      return ["Scalability", "Tradeoffs", "Component design"];
    case "PROBLEM_SOLVING":
      return ["Logical approach", "Efficiency", "Edge cases"];
    default: // TECHNICAL
      return ["Accuracy", "Depth", "Practical application"];
  }
}
