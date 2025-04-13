"use server";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

interface AddResponseInput {
  sessionId: string;
  questionId?: string;
  questionText: string;
  userAnswer: string;
  isCode?: boolean;
  timeTaken?: number;
}

export async function addQuestionResponse(data: AddResponseInput) {
  try {
    const response = await prisma.questionResponse.create({
      data: {
        sessionId: data.sessionId,
        questionId: data.questionId,
        questionText: data.questionText,
        userAnswer: data.userAnswer,
        isCode: data.isCode ?? false,
        timeTaken: data.timeTaken,
      },
    });

    revalidatePath(`/interview/${data.sessionId}`);

    return { success: true, response };
  } catch (error) {
    console.error("Failed to add response:", error);

    return { success: false, error: "Failed to add question response" };
  }
}

export async function updateResponseScore(
  responseId: string,
  score: number,
  feedback: string,
  improvementTips: string[],
) {
  try {
    const response = await prisma.questionResponse.update({
      where: { id: responseId },
      data: {
        score,
        feedback,
        improvementTips,
      },
    });

    revalidatePath(`/interview/${response.sessionId}`);

    return { success: true, response };
  } catch (error) {
    console.error("Failed to update response:", error);

    return { success: false, error: "Failed to update question response" };
  }
}
