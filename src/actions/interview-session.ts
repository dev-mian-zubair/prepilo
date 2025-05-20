"use server";

import { Difficulty, SessionStatus } from "@prisma/client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

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

export async function processInterviewDiscussion(
  sessionId: string,
  transcript: string,
) {
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
        responses: true,
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
    if (session.status !== "IN_PROGRESS") {
      throw new Error("Session is not in progress");
    }

    // 3. Fetch questions for the version
    const questions = session.version?.questions;

    if (!questions?.length) {
      throw new Error("No questions found for this interview version");
    }

    // 4. Send transcript to AI for processing
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with a JSON object containing an array of question responses.

      Given the following interview discussion transcript and questions, identify user answers, match them to the provided questions, determine expected answers, and generate scores and feedback for each response.

      Transcript:
      ${transcript}

      Questions:
      ${questions
        .map(
          (q, i) =>
            `${i + 1}. ${q.text} (Type: ${q.type}, ID: ${q.id}${
              q.technologyId ? ", Technology: " + q.technologyId : ""
            })`,
        )
        .join("\n")}

      Required JSON format:
      {
        "responses": [
          {
            "questionId": "question-id",
            "questionText": "Question text",
            "userAnswer": "User's answer extracted from transcript",
            "expectedAnswer": "Expected answer for the question",
            "score": 0-100,
            "feedback": "Brief feedback on the answer"
          }
        ]
      }

      Important:
      - Match user answers to questions based on content and context.
      - Generate expected answers based on question type, difficulty (${session.version?.difficulty}), and focus areas (${session.version?.interview.focusAreas.join(", ")}).
      - Scores are 0-100, reflecting answer quality.
      - Feedback should be concise and constructive.
      - Only include responses for questions that have identifiable answers in the transcript.`,
      system:
        "You are an AI assistant that analyzes interview transcripts, matches user answers to questions, generates expected answers, and provides scores and feedback.",
    });

    // 5. Parse and validate AI response
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const result = JSON.parse(text.slice(jsonStart, jsonEnd));

    if (!result?.responses || !Array.isArray(result.responses)) {
      throw new Error("Invalid AI response format");
    }

    // 6. Create or update question responses
    const responses = await Promise.all(
      result.responses.map(async (res: any) => {
        if (
          !res.questionId ||
          !res.questionText ||
          !res.userAnswer ||
          !res.expectedAnswer ||
          res.score === undefined ||
          !res.feedback
        ) {
          throw new Error("Invalid response data from AI");
        }

        // Verify question belongs to version
        const question = questions.find((q) => q.id === res.questionId);

        if (!question) {
          throw new Error(`Question ${res.questionId} not found in version`);
        }

        return prisma.questionResponse.upsert({
          where: {
            sessionId_questionId: {
              sessionId,
              questionId: res.questionId,
            },
          },
          create: {
            sessionId,
            questionId: res.questionId,
            questionText: res.questionText,
            userAnswer: res.userAnswer,
            score: Number(res.score),
            feedback: res.feedback,
          },
          update: {
            questionText: res.questionText,
            userAnswer: res.userAnswer,
            score: Number(res.score),
            feedback: res.feedback,
          },
          include: { question: true },
        });
      }),
    );

    return { success: true, responses };
  } catch (error) {
    console.error("Interview discussion processing failed:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function completeSession(sessionId: string) {
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
        responses: true,
        version: { include: { interview: true } },
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }
    if (session.userId !== user.id) {
      throw new Error("Access denied: You are not the session owner");
    }
    if (session.status !== "IN_PROGRESS") {
      throw new Error("Session is not in progress");
    }

    // 3. Calculate overall score
    const overallScore = session.responses.length
      ? session.responses.reduce((sum, r) => sum + (r.score || 0), 0) /
        session.responses.length
      : null;

    // 4. Generate AI feedback (based on responses and interview context)
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `ONLY respond with a JSON object containing feedback details.

      Based on the following session details and question responses, generate overall feedback for the interview.

      Session Details:
      - Interview: ${session.version?.interview.title}
      - Difficulty: ${session.version?.difficulty}
      - Focus Areas: ${session.version?.interview.focusAreas.join(", ")}
      - Responses:
        ${session.responses
          .map(
            (r, i) =>
              `${i + 1}. Question: ${r.questionText}\n   Answer: ${r.userAnswer}\n   Score: ${r.score}\n   Feedback: ${r.feedback}`,
          )
          .join("\n")}

      Required JSON format:
      {
        "technical": 0-100,
        "communication": 0-100,
        "summary": "Overall feedback summary"
      }

      Important:
      - Technical score reflects technical accuracy and depth.
      - Communication score reflects clarity and articulation.
      - Summary is a concise evaluation of performance.`,
      system:
        "You are an AI assistant that generates feedback for interview sessions based on question responses.",
    });

    // 5. Parse AI feedback
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const feedbackResult = JSON.parse(text.slice(jsonStart, jsonEnd));

    if (
      feedbackResult.technical === undefined ||
      feedbackResult.communication === undefined ||
      !feedbackResult.summary
    ) {
      throw new Error("Invalid AI feedback format");
    }

    // 6. Update session
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
        overallScore,
        feedback: {
          create: {
            technical: Number(feedbackResult.technical),
            communication: Number(feedbackResult.communication),
            summary: feedbackResult.summary,
          },
        },
      },
      include: {
        version: { include: { interview: true } },
        responses: { include: { question: true } },
        feedback: true,
      },
    });

    return { success: true, session: updatedSession };
  } catch (error) {
    console.error("Session completion failed:", error);

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
    if (session.status !== "IN_PROGRESS") {
      throw new Error("Session is not in progress");
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

export async function getUserSessions(
  userId: string,
  options: PaginationOptions & SessionFilters = {},
) {
  const {
    page = 1,
    pageSize = 10,
    interviewId,
    status,
    startDate,
    endDate,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      userId,
    };

    // Apply filters
    if (interviewId) {
      where.version = {
        interviewId,
      };
    }
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) {
        where.startedAt.gte =
          startDate instanceof Date ? startDate : new Date(startDate);
      }
      if (endDate) {
        where.startedAt.lte =
          endDate instanceof Date ? endDate : new Date(endDate);
      }
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          version: {
            include: {
              interview: { select: { id: true, title: true, isPublic: true } },
            },
          },
          _count: { select: { responses: true } },
        },
        orderBy: { startedAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.session.count({ where }),
    ]);

    return {
      sessions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch user sessions:", error);

    return {
      sessions: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    };
  }
}

export async function getSessionDetails(sessionId: string) {
  try {
    // 1. Get authenticated user
    const user = await getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    // 2. Fetch session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        version: {
          include: {
            interview: {
              select: {
                id: true,
                title: true,
                creatorId: true,
                isPublic: true,
              },
            },
            questions: { include: { technology: true } },
          },
        },
        responses: { include: { question: true } },
        feedback: true,
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    // 3. Check access (user is session owner or interview creator)
    if (
      session.userId !== user.id &&
      session.version?.interview.creatorId !== user.id
    ) {
      throw new Error(
        "Access denied: You are not authorized to view this session",
      );
    }

    return { success: true, session };
  } catch (error) {
    console.error("Failed to fetch session details:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
