"use server";

import { Difficulty, SessionStatus } from "@prisma/client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { revalidatePath } from "next/cache";

import { findOrCreateVersion } from "./helpers/version/create.version";
import { getCurrentUser } from "./helpers/common.helper";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SessionFilters {
  interviewId?: string;
  status?: SessionStatus;
  startDate?: Date | string;
  endDate?: Date | string;
}

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

export async function handleIncompleteSession(sessionId: string, error?: string, transcript?: string) {
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

    // If session is already completed or cancelled, return current state
    if (session.status !== "IN_PROGRESS") {
      return {
        success: true,
        session,
        completionPercentage: session.endedAt ? 
          ((session.endedAt.getTime() - session.startedAt.getTime()) / (1000 * 60)) / (session.version?.interview.duration || 1) * 100 : 
          0,
        isComplete: session.status === "COMPLETED",
        elapsedMinutes: session.endedAt ? 
          (session.endedAt.getTime() - session.startedAt.getTime()) / (1000 * 60) : 
          0,
        sessionDuration: session.version?.interview.duration || 0,
        error: error || null
      };
    }

    // 3. Calculate completion percentage based on time
    const sessionDuration = session.version?.interview.duration || 0; // Duration in minutes
    const sessionStartTime = session.startedAt;
    const sessionEndTime = new Date();
    const elapsedMinutes = (sessionEndTime.getTime() - sessionStartTime.getTime()) / (1000 * 60);
    const completionPercentage = sessionDuration > 0 
      ? (elapsedMinutes / sessionDuration) * 100 
      : 0;

    // 4. Generate feedback only if 90% or more completed
    let feedback = null;
    if (completionPercentage >= 90 && transcript && session.version?.questions) {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
        prompt: `ONLY respond with a JSON object containing feedback details.

        Based on the following interview transcript and questions, generate overall feedback for the interview.
        Note: This is a partially completed interview (${completionPercentage.toFixed(1)}% complete).

        Session Details:
        - Interview: ${session.version?.interview.title}
        - Difficulty: ${session.version?.difficulty}
        - Focus Areas: ${session.version?.interview.focusAreas.join(", ")}
        - Duration: ${sessionDuration} minutes
        - Elapsed Time: ${elapsedMinutes.toFixed(1)} minutes

        Questions:
        ${session.version.questions
          .map((q, i) => `${i + 1}. ${q.text} (Type: ${q.type})`)
          .join("\n")}

      Transcript:
      ${transcript}

      Required JSON format:
      {
          "technical": 0-100,
          "communication": 0-100,
          "summary": "Overall feedback summary including note about partial completion",
          "questionAnalysis": [
            {
              "question": "Question text",
              "analysis": "Analysis of how well the candidate answered this question",
              "strengths": ["List of strengths in the answer"],
              "improvements": ["List of areas for improvement"]
          }
        ]
      }

      Important:
        - Technical score reflects technical accuracy and depth.
        - Communication score reflects clarity and articulation.
        - Summary should mention that this was a partially completed interview.
        - Consider the completion percentage when generating scores.
        - Analyze how well each question was answered in the transcript.
        - Provide specific strengths and areas for improvement for each question.`,
      system:
          "You are an AI assistant that generates feedback for interview sessions based on the transcript and questions.",
    });

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
      const feedbackResult = JSON.parse(text.slice(jsonStart, jsonEnd));

      if (
        feedbackResult.technical === undefined ||
        feedbackResult.communication === undefined ||
        !feedbackResult.summary ||
        !feedbackResult.questionAnalysis
      ) {
        throw new Error("Invalid AI feedback format");
    }

      feedback = {
        technical: Number(feedbackResult.technical),
        communication: Number(feedbackResult.communication),
        summary: feedbackResult.summary,
      };
        }

    // 5. Update session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: completionPercentage >= 90 ? "COMPLETED" : "CANCELLED",
        endedAt: sessionEndTime,
        overallScore: completionPercentage >= 90 ? feedback?.technical : null,
        ...(feedback && {
          feedback: {
            create: feedback,
          },
        }),
      },
      include: {
        version: { include: { interview: true } },
        feedback: true,
      },
    });

    return { 
      success: true, 
      session: updatedSession,
      completionPercentage,
      isComplete: completionPercentage >= 90,
      elapsedMinutes,
      sessionDuration,
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

export async function saveSessionTranscript(sessionId: string, transcript: string) {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        version: {
          include: {
            interview: true
          }
        }
      }
    });

    if (!session) {
      return {
        success: false,
        error: "Session not found"
      };
    }

    if (session.userId !== user.id) {
      return {
        success: false,
        error: "Access denied: You are not the session owner"
      };
    }

    // Update session with transcript
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        transcript
      }
    });

    // Revalidate the interview page
    revalidatePath(`/app/interviews/${session.version?.interview.id}`);

    return {
      success: true,
      session: updatedSession
    };
  } catch (error) {
    console.error("Failed to save session transcript:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

export async function pauseSession(sessionId: string, transcript: string) {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        version: {
          include: {
            interview: true,
            questions: true
          }
        }
      }
    });

    if (!session) {
      return {
        success: false,
        error: "Session not found"
      };
    }

    if (session.userId !== user.id) {
      return {
        success: false,
        error: "Access denied: You are not the session owner"
      };
    }

    if (session.status !== "IN_PROGRESS") {
      return {
        success: false,
        error: "Session is not in progress"
      };
    }

    // Update session status to PAUSED and save transcript
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "PAUSED",
        transcript,
        endedAt: new Date()
      },
      include: {
        version: {
          include: {
            interview: true,
            questions: true
          }
        }
      }
    });

    // Revalidate the interview page
    revalidatePath(`/app/interviews/${session.version?.interview.id}`);

    return {
      success: true,
      session: updatedSession
    };
  } catch (error) {
    console.error("Failed to pause session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

export async function resumeSession(sessionId: string) {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication required"
      };
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        version: {
          include: {
            interview: true,
            questions: true
          }
        }
      }
    });

    if (!session) {
      return {
        success: false,
        error: "Session not found"
      };
    }

    if (session.userId !== user.id) {
      return {
        success: false,
        error: "Access denied: You are not the session owner"
      };
    }

    if (session.status !== "PAUSED") {
      return {
        success: false,
        error: "Session is not paused"
      };
    }

    // Update session status back to IN_PROGRESS and clear endedAt
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "IN_PROGRESS",
        endedAt: null
      },
      include: {
        version: {
          include: {
            interview: true,
            questions: true
          }
        }
      }
    });

    // Revalidate the interview page
    revalidatePath(`/app/interviews/${session.version?.interview.id}`);

    return {
      success: true,
      session: updatedSession
    };
  } catch (error) {
    console.error("Failed to resume session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
