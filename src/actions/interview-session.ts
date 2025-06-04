"use server";

import { Difficulty } from "@prisma/client";
import { generateText } from "ai";
import { MODEL, SYSTEM_MESSAGES } from "@/actions/helpers/model.helper";

import { findOrCreateVersion } from "./helpers/version.helper";
import { getCurrentUser } from "./helpers/common.helper";
import { buildSessionFeedbackPrompt } from "@/actions/helpers/prompt.helper";
import { safeParseModelResponse } from "@/actions/helpers/common.helper";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { Session } from "@/types/session.types";

export async function createSession(
  interviewId: string,
  difficulty: Difficulty,
) {
  try {
    const user = await getCurrentUser();
    const version = await findOrCreateVersion(interviewId, difficulty);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        versionId: version.id,
        startedAt: new Date(),
      },
      include: {
        version: { include: { questions: true } },
      },
    });

    return {
      success: true,
      session: {
        id: session.id,
        questions: session.version?.questions,
        startedAt: session.startedAt,
        status: session.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

async function generateSessionFeedback(session: any, transcript: string) {
  try {
    const { text } = await generateText({
      model: MODEL,
      prompt: buildSessionFeedbackPrompt(session, transcript),
      system: SYSTEM_MESSAGES.INTERVIEW_FEEDBACK,
    });

    if (!text) {
      throw new Error("AI model returned empty response");
    }

    const feedbackResult = safeParseModelResponse(text);

    if (
      typeof feedbackResult.technical !== 'number' ||
      typeof feedbackResult.communication !== 'number' ||
      typeof feedbackResult.overallScore !== 'number' ||
      typeof feedbackResult.summary !== 'string' ||
      !Array.isArray(feedbackResult.questionAnalysis)
    ) {
      throw new Error("Invalid feedback format from AI model");
    }

    return {
      technical: Number(feedbackResult.technical),
      communication: Number(feedbackResult.communication),
      overallScore: Number(feedbackResult.overallScore),
      summary: feedbackResult.summary,
      questionAnalysis: feedbackResult.questionAnalysis,
    };
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw new Error(`Failed to generate feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function handleInProgressSession(sessionId: string, error?: string, transcript?: string) {
  try {
    // 1. Get authenticated user
    const user = await getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    // 2. Validate session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        version: { 
          include: { 
            interview: true,
            questions: true
          } 
        },
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }
    if (session.userId !== user.id) {
      throw new Error("Access denied: You are not the session owner");
    }

    const sessionEndTime = new Date();

    // Generate feedback if transcript is provided and not empty
    let feedback = null;
    if (transcript && transcript.trim() && session.version?.questions) {
      feedback = await generateSessionFeedback(session, transcript);
    }

    // First update the session without feedback
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: sessionEndTime,
        transcript: transcript || '',
        overallScore: feedback?.overallScore || null,
      },
      include: {
        version: { include: { interview: true } },
        feedback: true,
      },
    });

    // Then create feedback separately if it exists
    if (feedback) {
      await prisma.feedback.upsert({
        where: { sessionId },
        create: {
          sessionId,
          technical: feedback.technical,
          communication: feedback.communication,
          summary: feedback.summary,
          questionAnalysis: feedback.questionAnalysis,
        },
        update: {
          technical: feedback.technical,
          communication: feedback.communication,
          summary: feedback.summary,
          questionAnalysis: feedback.questionAnalysis,
        },
      });
    }

    return { 
      success: true, 
      session: updatedSession,
      feedback: JSON.stringify(feedback, null, 2),
      isComplete: true,
      error: error || null
    };
  } catch (error) {
    console.error("Session handling failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getInterviewSessions(interviewId: string): Promise<Session[]> {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        version: {
          interviewId
        }
      },
      include: {
        version: {
          include: {
            questions: {
              include: {
                technology: true
              }
            }
          }
        },
        feedback: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return sessions.map(session => ({
      id: session.id,
      transcript: session.transcript || "",
      overallScore: session.overallScore || 0,
      questions: session.version?.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        technology: q.technology?.name
      })) || [],
      startedAt: session.startedAt,
      status: session.status as 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED',
      version: session.version ? {
        difficulty: session.version.difficulty
      } : undefined,
      feedback: session.feedback ? {
        technical: session.feedback.technical,
        communication: session.feedback.communication,
        summary: session.feedback.summary,
        questionAnalysis: session.feedback.questionAnalysis as Array<{
          question: string;
          analysis: string;
          strengths: string[];
          improvements: string[];
        }>
      } : undefined
    }));
  } catch (error) {
    console.error("Failed to fetch interview sessions:", error);
    throw new Error('Failed to fetch interview sessions');
  }
}

export async function storeSessionTranscript(sessionId: string, transcript: string) {
  try {
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        transcript,
        updatedAt: new Date(),
      },
    });

    return { success: true, data: updatedSession };
  } catch (error) {
    console.error('Error storing session transcript:', error);
    return { success: false, error: 'Failed to store session transcript' };
  }
}

export async function getSessionTranscript(sessionId: string) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { transcript: true },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    return { success: true, transcript: session.transcript };
  } catch (error) {
    console.error('Error retrieving session transcript:', error);
    return { success: false, error: 'Failed to retrieve session transcript' };
  }
}

export async function handlePauseSession(sessionId: string, transcript: string) {
  try {
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "PAUSED",
        transcript,
        updatedAt: new Date(),
      },
      include: {
        version: {
          include: {
            questions: true,
            interview: true
          }
        }
      }
    });

    return { 
      success: true, 
      session,
      transcript: session.transcript
    };
  } catch (error) {
    console.error('Error pausing session:', error);
    return { 
      success: false, 
      error: 'Failed to pause session' 
    };
  }
}

export async function handleResumeSession(sessionId: string) {
  try {
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "IN_PROGRESS",
        updatedAt: new Date(),
      },
      include: {
        version: {
          include: {
            questions: true,
            interview: true
          }
        },
        feedback: true
      }
    });

    return { 
      success: true, 
      session
    };
  } catch (error) {
    console.error('Error resuming session:', error);
    return { 
      success: false, 
      error: 'Failed to resume session' 
    };
  }
}

export const generateFeedback = async (sessionId: string, transcript: string) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        version: { 
          include: { 
            interview: true,
            questions: true
          } 
        },
      },
    });

    if (!session || !session.version) {
      throw new Error("Session or version not found");
    }

    const feedback = await generateSessionFeedback(session, transcript);

    console.log(feedback);

    // Save feedback to database
    await prisma.feedback.upsert({
      where: {
        sessionId: session.id,
      },
      update: {
        technical: feedback.technical,
        communication: feedback.communication,
        summary: feedback.summary,
        questionAnalysis: feedback.questionAnalysis,
      },
      create: {
        sessionId: session.id,
        technical: feedback.technical,
        communication: feedback.communication,
        summary: feedback.summary,
        questionAnalysis: feedback.questionAnalysis,
      },
    });

    return {
      success: true,
      feedback: JSON.stringify(feedback, null, 2),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate feedback',
    };
  }
};
