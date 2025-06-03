"use server";

import { Difficulty } from "@prisma/client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { findOrCreateVersion } from "./helpers/version/create.version";
import { getCurrentUser } from "./helpers/common.helper";

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

async function generateSessionFeedback(session: any, transcript: string, completionPercentage: number) {
  const sessionDuration = session.version?.interview.duration || 0;

  try {
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

      Questions:
      ${session.version.questions
        .map((q: { text: string; type: string }, i: number) => `${i + 1}. ${q.text} (Type: ${q.type})`)
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

    if (!text) {
      throw new Error("AI model returned empty response");
    }

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Invalid JSON response from AI model");
    }

    const jsonStr = text.slice(jsonStart, jsonEnd);
    let feedbackResult;
    
    try {
      feedbackResult = JSON.parse(jsonStr);
    } catch (e) {
      throw new Error("Failed to parse AI model response as JSON");
    }

    if (
      typeof feedbackResult.technical !== 'number' ||
      typeof feedbackResult.communication !== 'number' ||
      typeof feedbackResult.summary !== 'string' ||
      !Array.isArray(feedbackResult.questionAnalysis)
    ) {
      throw new Error("Invalid feedback format from AI model");
    }

    return {
      technical: Number(feedbackResult.technical),
      communication: Number(feedbackResult.communication),
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

    // If session is already completed or cancelled, return current state
    if (session.status !== "IN_PROGRESS") {
      return {
        success: true,
        session,
        isComplete: session.status === "COMPLETED",
        error: error || null
      };
    }

    // 3. Calculate completion percentage based on time
    const sessionDuration = session.version?.interview.duration || 0;
    const sessionStartTime = session.startedAt;
    const sessionEndTime = new Date();
    const completionPercentage = sessionDuration > 0 
      ? ((sessionEndTime.getTime() - sessionStartTime.getTime()) / (1000 * 60)) / sessionDuration * 100 
      : 0;

    // 4. Generate feedback if transcript is provided
    let feedback = null;
    if (transcript && session.version?.questions) {
      feedback = await generateSessionFeedback(session, transcript, completionPercentage);
    }

    // 5. Update session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: sessionEndTime,
        overallScore: feedback?.technical || null,
        ...(feedback && {
          feedback: {
            update: {
              technical: feedback.technical,
              communication: feedback.communication,
              summary: feedback.summary,
              questionAnalysis: feedback.questionAnalysis,
            },
            create: {
              technical: feedback.technical,
              communication: feedback.communication,
              summary: feedback.summary,
              questionAnalysis: feedback.questionAnalysis,
            },
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

    const sessionDuration = session.version.interview.duration || 0;
    const sessionStartTime = session.startedAt;
    const sessionEndTime = new Date();
    const elapsedMinutes = (sessionEndTime.getTime() - sessionStartTime.getTime()) / (1000 * 60);
    const completionPercentage = sessionDuration > 0 
      ? (elapsedMinutes / sessionDuration) * 100 
      : 0;

    const feedback = await generateSessionFeedback(session, transcript, completionPercentage);

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
