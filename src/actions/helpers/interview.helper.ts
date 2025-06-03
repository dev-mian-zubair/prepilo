import { generateText } from "ai";
import { FocusArea } from "@prisma/client";

import {
  getCurrentUser,
  validateRequestFields,
} from "./common.helper";
import {
  buildInterviewDataWithJDPrompt,
  buildInterviewDataWithAgentPrompt,
  buildTechnologyConfirmationPrompt,
} from "@/actions/helpers/prompt.helper";
import { MODEL, SYSTEM_MESSAGES } from "@/actions/helpers/model.helper";

import prisma from "@/lib/prisma";
import { safeParseModelResponse } from "@/actions/helpers/common.helper";

// Interface for creating an interview, aligned with schema
export interface CreateInterviewInput {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologyNames: string[];
  userId?: string;
}

// Helper Method to validate and create interview
export async function validateAndCreateInterview(data: CreateInterviewInput) {
  try {
    // Validate data
    validateInterviewData(data);
    // Get authenticated user
    const user = data.userId ? { id: data.userId } : await getCurrentUser();
    // Process technologies
    const finalizedTechnologies = await confirmTechnologiesWithAI(
      data.technologyNames,
    );
    // Create database records for technologies
    const technologies = await createTechnologies(finalizedTechnologies);

    // Create interview
    return await prisma.interview.create({
      data: {
        creatorId: user.id,
        title: data.title,
        duration: Number(data.duration),
        focusAreas: data.focusAreas,
        isPublic: false,
        technologies: {
          create: technologies.map((t) => ({ technologyId: t.id })),
        },
      },
      include: {
        technologies: { include: { technology: true } },
        versions: { include: { questions: true } },
      },
    });
  } catch (error) {
    console.log(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
}

// Generate Interview data with job description
export async function generateInterviewDataWithJD(jobDescription: string) {
  try {
    const { text } = await generateText({
      model: MODEL,
      prompt: buildInterviewDataWithJDPrompt(jobDescription),
      system: SYSTEM_MESSAGES.INTERVIEW_DATA,
    });

    return safeParseModelResponse(text);
  } catch (error) {
    console.error("Interview data generation failed:", error);
  }
}

// Generate Interview with Agent
export async function generateInterviewDataWithAgentInfo(data: any) {
  try {
    const requiredFields = ["type", "role", "level", "techstack", "userid"];
    const validationError = validateRequestFields(data, requiredFields);

    if (validationError) throw new Error(validationError);

    const { type, role, level, techstack, userid } = data;

    if (!type || !role || !level || !techstack || !userid) {
      return new Response("Missing required fields", { status: 400 });
    }

    const { text } = await generateText({
      model: MODEL,
      prompt: buildInterviewDataWithAgentPrompt({ type, role, level, techstack }),
      system: SYSTEM_MESSAGES.INTERVIEW_DATA,
    });

    return safeParseModelResponse(text);
  } catch (error) {
    throw error;
  }
}

// Validate Interview data
export function validateInterviewData(data: CreateInterviewInput | null) {
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
  const validationError = validateRequestFields(data, requiredFields);

  if (validationError) throw new Error(validationError);
}

// Confirm technologies (returns names only)
export async function confirmTechnologiesWithAI(
  technologyNames: string[],
): Promise<string[]> {
  const techNames = Array.isArray(technologyNames)
    ? technologyNames
    : [technologyNames].filter(Boolean);

  if (techNames.length === 0) {
    throw new Error("At least one technology is required");
  }

  try {
    const { text } = await generateText({
      model: MODEL,
      prompt: buildTechnologyConfirmationPrompt(techNames),
      system: SYSTEM_MESSAGES.TECHNOLOGY_CONFIRMATION,
    });

    const result = safeParseModelResponse(text);

    if (!Array.isArray(result))
      throw new Error("Invalid format: Expected array");

    // Validate and map to Technology interface
    return result.map((name: string) => {
      if (!name) throw new Error("Invalid item format: Missing name");

      return name.trim();
    });
  } catch (error) {
    console.error("Technology processing failed:", error);

    // Fallback - return original names
    return techNames.map((name) => name.trim());
  }
}

// Create technologies
export async function createTechnologies(technologies: string[]) {
  return Promise.all(
    technologies.map(async (tech) => {
      try {
        return await prisma.technology.upsert({
          where: { name: tech },
          create: { name: tech },
          update: {},
        });
      } catch (e) {
        throw new Error(
          `Technology processing failed for ${tech}, error: ${e}`,
        );
      }
    }),
  );
}

// Create Interview response
export function createInterviewResponse(interview: any) {
  if (!interview) {
    throw new Error("Failed to create interview. Please try again.");
  }

  return {
    success: true,
    interview: {
      id: interview.id,
      title: interview.title,
      duration: interview.duration,
      focusAreas: interview.focusAreas,
      technologies: interview.technologies.map((t: any) => t.technology.name),
    },
  };
}
