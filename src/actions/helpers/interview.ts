import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { Difficulty, FocusArea, QuestionType } from "@prisma/client";

// Interface for creating an interview, aligned with schema
export interface CreateInterviewInput {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologyNames: string[];
}

// Interface for technologies, aligned with schema (no category)
export interface Technology {
  name: string;
}

// Interface for questions, aligned with InterviewQuestion model
export interface Question {
  text: string;
  type: QuestionType;
  technology?: string;
}

// Categorize technologies (returns names only, as schema has no category)
export async function categorizeTechnologies(
  techNames: string[],
): Promise<Technology[]> {
  if (techNames.length === 0) return [];

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

    // Clean the response to extract only the JSON
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);

    if (!Array.isArray(result))
      throw new Error("Invalid format: Expected array");

    // Validate and map to Technology interface
    return result.map((name: string) => {
      if (!name) throw new Error("Invalid item format: Missing name");

      return { name: name.trim() };
    });
  } catch (error) {
    console.error("Technology processing failed:", error);

    // Fallback - return original names
    return techNames.map((name) => ({ name: name.trim() }));
  }
}

// Generate questions with retry logic, tailored to difficulty
export async function generateQuestionsWithRetry(
  data: CreateInterviewInput,
  technologies: Technology[],
  difficulty: Difficulty,
  retries = 2,
): Promise<Question[]> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with the JSON array of theoretical interview questions.

      Generate questions based on:
      - Title: ${data.title}
      - Duration: ${data.duration} minutes
      - Difficulty: ${difficulty}
      - Focus Areas: ${data.focusAreas.join(", ")}
      - Technologies: ${technologies.map((t) => t.name).join(", ")}

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
        : determineQuestionType(q.text, data.focusAreas);

      return {
        text: q.text.trim(),
        type: questionType,
        technology: q.technology?.trim(),
      };
    });
  } catch (error) {
    console.error("Question generation failed:", error);
    if (retries > 0)
      return generateQuestionsWithRetry(
        data,
        technologies,
        difficulty,
        retries - 1,
      );

    // Fallback - simple questions tailored to difficulty
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with a JSON array of ${Math.floor(data.duration / 5)} basic theoretical interview question strings about ${
        data.technologyNames.join(", ") || data.title
      } for ${difficulty} level. Format: ["question1", "question2"]`,
    });

    const questions = JSON.parse(text.match(/\[.*\]/)?.[0] || "[]");

    return questions.map((text: string) => ({
      text: text.trim(),
      type: determineQuestionType(text, data.focusAreas),
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
