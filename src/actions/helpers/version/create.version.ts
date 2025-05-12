import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { Difficulty, FocusArea, QuestionType } from "@prisma/client";

import { getCurrentUser } from "../common.helper";

import prisma from "@/lib/prisma";

// Interface for questions, aligned with InterviewQuestion model
export interface Question {
  text: string;
  type: QuestionType;
  technology?: string;
}

export async function findOrCreateVersion(
  interviewId: string,
  difficulty: Difficulty,
) {
  try {
    const user = await getCurrentUser();
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        technologies: { include: { technology: true } },
        versions: { where: { difficulty } },
      },
    });

    if (!interview) {
      throw new Error("Interview not found");
    }

    let version = interview?.versions[0];

    if (!version) {
      if (!interview.isPublic && interview.creatorId !== user.id) {
        throw new Error(
          "Access denied: Interview is not public and you are not the creator",
        );
      }

      version = await createVersion(interview, difficulty);
    }

    return version;
  } catch (error) {
    throw error;
  }
}

export async function createVersion(interview: any, difficulty: Difficulty) {
  try {
    const versionQuestions = await generateVersionQuestionsWithAI(
      interview,
      difficulty,
    );

    return await prisma.interviewVersion.create({
      data: {
        interviewId: interview.id,
        difficulty,
        questions: {
          create: versionQuestions.map((q: Question) => ({
            text: q.text,
            type: q.type,
            technologyId: q.technology
              ? interview.technologies.find(
                  (t: any) => t.technology.name === q.technology,
                )?.id
              : undefined,
          })),
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

// Generate questions with AI
export async function generateVersionQuestionsWithAI(
  interview: any,
  difficulty: Difficulty,
  retries = 2,
) {
  try {
    const technologies = interview.technologies.map(
      (t: any) => t.technology.name,
    );
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with the JSON array of theoretical interview questions.

      Generate questions based on:
      - Title: ${interview.title}
      - Duration: ${interview.duration} minutes
      - Difficulty: ${difficulty}
      - Focus Areas: ${interview.focusAreas.join(", ")}
      - Technologies: ${technologies.join(", ")}

      Question Types: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

      Required JSON format:
      {
        "questions": [
          {
            "text": "Question text",
            "type": "QUESTION_TYPE",
            "technology": "TechName" // if applicable
          }
        ]
      }

      Important:
      - Only theoretical/conceptual questions
      - No coding problems or examples
      - No sample answers needed
      - Match the specified difficulty level (BEGINNER: basic concepts, INTERMEDIATE: practical applications, ADVANCED: complex scenarios)`,
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
        : determineQuestionType(q.text, interview.focusAreas);

      return {
        text: q.text.trim(),
        type: questionType,
        technology: q.technology?.trim(),
      };
    });
  } catch (error) {
    console.error("Question generation failed:", error);

    if (retries > 0) {
      return generateVersionQuestionsWithAI(interview, difficulty, retries - 1);
    }

    // Fallback - simple questions tailored to difficulty
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with a JSON array of ${Math.floor(interview.duration / 5)} basic theoretical interview question strings about ${
        interview.technologyNames.join(", ") || interview.title
      } for ${difficulty} level. Format: ["question1", "question2"]`,
    });

    const questions = JSON.parse(text.match(/\[.*\]/)?.[0] || "[]");

    return questions.map((text: string) => ({
      text: text.trim(),
      type: determineQuestionType(text, interview.focusAreas),
      technology: undefined, // Optional in schema
    }));
  }
}

// Helper function to determine question type
export function determineQuestionType(
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
