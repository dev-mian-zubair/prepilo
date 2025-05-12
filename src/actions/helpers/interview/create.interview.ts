import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { FocusArea } from "@prisma/client";

import {
  extractJSON,
  getCurrentUser,
  validateRequestFields,
} from "../common.helper";

import prisma from "@/lib/prisma";

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
      model: google("gemini-2.0-flash-001"),
      prompt: `Strictly respond with ONLY a object with three keys: title, focusAreas and technologies. The title should be a job title, the focus areas should be an array of focus area names, and the technologies should be an array of technology names. No additional text or formatting.

      Input job description: ${jobDescription}

      Focus Areas: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

      Required output format (ONLY THIS FORMAT):
      {
        "title": "Job title",
        "focusAreas": ["FOCUS_AREA_1", "FOCUS_AREA_2"],
        "technologies": ["TechName_1", "TechName_2"]
      }

      Example:
      {
        "title": "Software Engineer",
        "focusAreas": ["BEHAVIORAL", "TECHNICAL"],
        "technologies": ["React", "Node.js"]
      }`,
      system:
        "You are a helpful assistant that processes job description. Only respond with the requested object, no additional text.",
    });

    return extractJSON(text);
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
      model: google("gemini-2.0-flash-001"),
      prompt: `Strictly respond with ONLY a object with three keys: title, focusAreas and technologies. The title should be a job title, the focus areas should be an array of focus area names, and the technologies should be an array of technology names. No additional text or formatting.

      Input:
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      The focus areas: ${type}.

      Focus Areas: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

      Required output format (ONLY THIS FORMAT):
      {
        "title": "Job title",
        "focusAreas": ["FOCUS_AREA_1", "FOCUS_AREA_2"],
        "technologies": ["TechName_1", "TechName_2"]
      }

      Example:
      {
        "title": "Software Engineer",
        "focusAreas": ["BEHAVIORAL", "TECHNICAL"],
        "technologies": ["React", "Node.js"]
      }`,
      system:
        "You are a helpful assistant that processes job description. Only respond with the requested object, no additional text.",
    });

    return extractJSON(text);
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
      model: google("gemini-2.0-flash-001"),
      prompt: `Strictly respond with ONLY a JSON array of technology names. No additional text or formatting.

      Input technologies: ${techNames.join(", ")}

      Required output format (ONLY THIS FORMAT):
      ["TechnologyName", "TechnologyName"]

      Example:
      ["React", "Node.js"]`,
      system:
        "You are a helpful assistant that processes technology names. Only respond with the requested JSON array, no additional text.",
    });

    const result = extractJSON(text);

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
