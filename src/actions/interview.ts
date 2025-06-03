"use server";

import {
  CreateInterviewInput,
  createInterviewResponse,
  generateInterviewDataWithJD,
  validateAndCreateInterview,
} from "./helpers/interview.helper";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InterviewFilters, PaginationOptions } from "@/types/interview";

export async function createInterview(data: CreateInterviewInput | null) {
  try {
    if (!data) {
      throw new Error("Please provide interview data.");
    }
    const interview = await validateAndCreateInterview(data);

    return createInterviewResponse(interview);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createInterviewWithJD(jobDescription: string) {
  try {
    const interviewData = await generateInterviewDataWithJD(jobDescription);

    if (Object.keys(interviewData).length === 0) {
      throw new Error("Failed to generate interview. Please try again.");
    }

    const interview = await validateAndCreateInterview({
      ...interviewData,
      technologyNames: interviewData.technologies,
      duration: 60,
    });

    return createInterviewResponse(interview);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getInterviewWithDetails(id: string) {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        technologies: {
          include: { technology: true },
        },
        versions: {
          include: { questions: { include: { technology: true } } },
        },
        creator: true,
      },
    });

    if (!interview) {
      throw new Error("Interview not found");
    }

    return interview;
  } catch (error) {
    console.error("Failed to fetch interview:", error);
    throw error; // Re-throw the error to be handled by the hook
  }
}

export async function getUserInterviews(
  options: PaginationOptions & InterviewFilters = {},
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Authentication required");
  }
  const {
    page = 1,
    pageSize = 10,
    technologyName,
    minDuration,
    maxDuration,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      creatorId: user.id,
    };

    // Apply filters
    if (technologyName) {
      where.technologies = {
        some: {
          technology: {
            name: { contains: technologyName, mode: "insensitive" },
          },
        },
      };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = Number(minDuration);
      if (maxDuration !== undefined) where.duration.lte = Number(maxDuration);
    }

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        technologies: {
          include: { technology: true },
        },
        versions: {
          include: {
            sessions: {
              select: {
                overallScore: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    // Transform interviews to match expected output
    const formattedInterviews = interviews.map((interview) => {
      // Map technologies to an array of names
      const technologies = interview.technologies.map((t) => t.technology.name);

      // Calculate average scores per difficulty
      const versions = {
        BEGINNER: 0,
        INTERMEDIATE: 0,
        ADVANCED: 0,
      };

      interview.versions.forEach((version) => {
        const difficulty = version.difficulty;
        const scores = version.sessions
          .filter((session) => session.overallScore !== null)
          .map((session) => session.overallScore!);

        const averageScore =
          scores.length > 0
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : 0;

        versions[difficulty] = Number(averageScore.toFixed(2));
      });

      return {
        id: interview.id,
        title: interview.title,
        technologies,
        focusAreas: interview.focusAreas,
        createdAt: interview.createdAt,
        duration: interview.duration,
        versions,
      };
    });

    return formattedInterviews;
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
  }
}

export async function getPublicInterviewsWithParticipants(
  options: PaginationOptions & InterviewFilters = {},
) {
  const {
    page = 1,
    pageSize = 10,
    technologyName,
    minDuration,
    maxDuration,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      isPublic: true,
    };

    // Apply filters
    if (technologyName) {
      where.technologies = {
        some: {
          technology: {
            name: { contains: technologyName, mode: "insensitive" },
          },
        },
      };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = Number(minDuration);
      if (maxDuration !== undefined) where.duration.lte = Number(maxDuration);
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          technologies: {
            include: { technology: true },
          },
          versions: {
            include: {
              _count: { select: { sessions: true } },
              sessions: {
                include: {
                  user: { select: { id: true, name: true, email: true } },
                },
                distinct: ["userId"], // Ensure unique participants
              },
            },
          },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.interview.count({ where }),
    ]);

    return {
      interviews: interviews.map((interview) => ({
        ...interview,
        participantCount: interview.versions.reduce(
          (sum, version) => sum + (version._count?.sessions || 0),
          0,
        ),
        participants: interview.versions
          .flatMap((version) => version.sessions)
          .map((session) => session.user)
          .filter(
            (user, index, self) =>
              index === self.findIndex((u) => u.id === user.id),
          ), // Deduplicate users
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch public interviews:", error);

    return {
      interviews: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    };
  }
}

export async function getUserAttemptedInterviews(
  userId: string,
  options: PaginationOptions & InterviewFilters = {},
) {
  const {
    page = 1,
    pageSize = 10,
    technologyName,
    minDuration,
    maxDuration,
  } = options;

  try {
    const skip = (page - 1) * pageSize;
    const where: any = {
      versions: {
        some: {
          sessions: {
            some: { userId },
          },
        },
      },
    };

    // Apply filters
    if (technologyName) {
      where.technologies = {
        some: {
          technology: {
            name: { contains: technologyName, mode: "insensitive" },
          },
        },
      };
    }
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = Number(minDuration);
      if (maxDuration !== undefined) where.duration.lte = Number(maxDuration);
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          technologies: {
            include: { technology: true },
          },
          versions: {
            include: {
              _count: { select: { questions: true, sessions: true } },
              sessions: {
                where: { userId },
                select: { id: true, startedAt: true, status: true },
              },
            },
          },
          creator: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.interview.count({ where }),
    ]);

    return {
      interviews,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to fetch user attempted interviews:", error);

    return {
      interviews: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    };
  }
}
