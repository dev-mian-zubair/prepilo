"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

interface CreateFeedbackInput {
  sessionId: string;
  technical?: number;
  problemSolving?: number;
  communication?: number;
  clarity?: number;
  confidence?: number;
  fillerWords?: number;
  pacing?: number;
  summary?: string;
  improvementPlan?: string;
  techScores: Array<{
    technologyId: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
  }>;
}

export async function createSessionFeedback(data: CreateFeedbackInput) {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        sessionId: data.sessionId,
        technical: data.technical,
        problemSolving: data.problemSolving,
        communication: data.communication,
        clarity: data.clarity,
        confidence: data.confidence,
        fillerWords: data.fillerWords,
        pacing: data.pacing,
        summary: data.summary,
        improvementPlan: data.improvementPlan,
        techScores: {
          create: data.techScores.map((tech) => ({
            technologyId: tech.technologyId,
            score: tech.score,
            strengths: tech.strengths,
            weaknesses: tech.weaknesses,
          })),
        },
      },
      include: {
        techScores: {
          include: { technology: true },
        },
      },
    });

    // Update session with overall score
    await prisma.session.update({
      where: { id: data.sessionId },
      data: {
        overallScore: calculateOverallScore(feedback),
      },
    });

    revalidatePath(`/interview/${data.sessionId}/review`);

    return { success: true, feedback };
  } catch (error) {
    console.error("Failed to create feedback:", error);

    return { success: false, error: "Failed to create session feedback" };
  }
}

function calculateOverallScore(feedback: {
  technical?: number | null;
  problemSolving?: number | null;
  communication?: number | null;
}): number {
  const scores = [
    feedback.technical,
    feedback.problemSolving,
    feedback.communication,
  ].filter((score) => score !== null) as number[];

  return scores.length > 0
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0;
}
