"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SessionMode } from "@prisma/client";

import prisma from "@/lib/prisma";

interface CreateSessionInput {
  userId: string;
  templateId: string;
  mode?: SessionMode;
}

export async function createSessionFromTemplate(data: CreateSessionInput) {
  try {
    const template = await prisma.interviewTemplate.findUnique({
      where: { id: data.templateId },
      include: {
        technologies: true,
        questions: true,
      },
    });

    if (!template) {
      throw new Error("Template not found");
    }

    const session = await prisma.session.create({
      data: {
        userId: data.userId,
        templateId: template.id,
        title: template.title,
        description: template.description,
        duration: template.duration,
        difficulty: template.difficulty,
        focusAreas: template.focusAreas,
        status: "PLANNED",
        mode: data.mode || "MANUAL",
        technologies: {
          create: template.technologies.map((tech) => ({
            technologyId: tech.technologyId,
          })),
        },
      },
      include: {
        technologies: {
          include: { technology: true },
        },
        interviewTemplate: true,
      },
    });

    revalidatePath("/dashboard/sessions");

    return { success: true, session };
  } catch (error) {
    console.error("Failed to create session:", error);

    return { success: false, error: "Failed to create interview session" };
  }
}

export async function startSession(sessionId: string) {
  try {
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });

    revalidatePath(`/interview/${sessionId}`);

    return { success: true, session };
  } catch (error) {
    console.error("Failed to start session:", error);

    return { success: false, error: "Failed to start interview session" };
  }
}

export async function completeSession(sessionId: string) {
  try {
    // First get the session to calculate duration
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || !session.startedAt) {
      throw new Error("Session not found or not started");
    }

    const endedAt = new Date();
    const actualDuration = Math.floor(
      (endedAt.getTime() - session.startedAt.getTime()) / 60000, // Convert to minutes
    );

    // Now update the session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt,
        actualDuration,
      },
    });

    revalidatePath("/dashboard/sessions");
    redirect(`/interview/${sessionId}/review`);

    return { success: true, session: updatedSession };
  } catch (error) {
    console.error("Failed to complete session:", error);

    return { success: false, error: "Failed to complete interview session" };
  }
}

export async function getSessionDetails(sessionId: string) {
  try {
    return await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        interviewTemplate: {
          include: {
            questions: true,
            technologies: {
              include: { technology: true },
            },
          },
        },
        technologies: {
          include: { technology: true },
        },
        responses: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch session:", error);

    return null;
  }
}
