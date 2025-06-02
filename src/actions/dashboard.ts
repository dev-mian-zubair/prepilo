import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getInterviewStats() {
  const user = await getUser();

  if (!user) return { completed: 0, inProgress: 0, paused: 0 };

  const results = await prisma.session.groupBy({
    by: ["status"],
    where: { userId: user.id },
    _count: true,
  });

  const stats = {
    completed: 0,
    inProgress: 0,
    paused: 0,
  };

  for (const result of results) {
    const key = result.status.toLowerCase() as keyof typeof stats;
    stats[key] = result._count;
  }

  return stats;
  return {  
    completed: 10,
    inProgress: 12,
    paused: 2
  }
}

export async function getCompletedSessionScores() {
  const user = await getUser();
  if (!user) return [];

  const sessions = await prisma.session.findMany({
    where: {
      userId: user.id,
      status: "COMPLETED",
      overallScore: {
        not: null,
      },
    },
    orderBy: {
      endedAt: "asc", // You can use createdAt instead if you prefer
    },
    select: {
      overallScore: true,
      endedAt: true,
    },
  });

  return sessions.map((s) => ({
    score: s.overallScore!,
    date: s.endedAt ?? new Date(), // fallback if somehow endedAt is null
  }));
  return [
    { score: 75, date: new Date("2025-05-01") },
    { score: 82, date: new Date("2025-05-05") },
    { score: 0, date: new Date("2025-05-05") },
    { score: 90, date: new Date("2025-05-05") },
    { score: 100, date: new Date("2025-05-05") },
    { score: 68, date: new Date("2025-05-10") },
    { score: 90, date: new Date("2025-05-15") },
    { score: 77, date: new Date("2025-05-20") },
    { score: 85, date: new Date("2025-05-25") },
    { score: 80, date: new Date("2025-05-26") },
    { score: 65, date: new Date("2025-05-27") },
    { score: 70, date: new Date("2025-05-28") },
    { score: 95, date: new Date("2025-05-28") },
    { score: 100, date: new Date("2025-05-29") },
    { score: 90, date: new Date("2025-05-29") },
  ];
}

export async function getSessionsByDifficulty() {
  const user = await getUser();
  if (!user) {
    return {
      beginner: { count: 0, avgScore: 0 },
      intermediate: { count: 0, avgScore: 0 },
      advanced: { count: 0, avgScore: 0 },
      totalAvgScore: 0,
    };
  }

  const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

  const data = await Promise.all(
    difficulties.map(async (difficulty) => {
      const result = await prisma.session.aggregate({
        where: {
          userId: user.id,
          status: "COMPLETED",
          overallScore: { not: null },
          version: {
            difficulty,
          },
        },
        _count: true,
        _avg: {
          overallScore: true,
        },
      });

      return {
        difficulty: difficulty.toLowerCase(),
        count: result._count,
        avgScore: Math.round(result._avg.overallScore || 0),
      };
    })
  );

  const total = await prisma.session.aggregate({
    where: {
      userId: user.id,
      status: "COMPLETED",
      overallScore: { not: null },
    },
    _avg: {
      overallScore: true,
    },
  });

  return {
    beginner: data.find((d) => d.difficulty === "beginner")!,
    intermediate: data.find((d) => d.difficulty === "intermediate")!,
    advanced: data.find((d) => d.difficulty === "advanced")!,
    totalAvgScore: Math.round(total._avg.overallScore || 0),
  };
}

export async function getSessionDurationSummary() {
  const user = await getUser();
  if (!user) return { totalMinutes: 0 };

  const sessions = await prisma.session.findMany({
    where: {
      userId: user.id,
      status: "COMPLETED",
      AND: [
        { startedAt: { not: undefined } },
        { endedAt: { not: undefined } },
      ],
    },
    select: {
      startedAt: true,
      endedAt: true,
    },
  });

  const totalMs = sessions.reduce((acc, session) => {
    if (session.startedAt && session.endedAt) {
      const start = new Date(session.startedAt).getTime();
      const end = new Date(session.endedAt).getTime();
      const duration = end - start;
      return acc + (duration > 0 ? duration : 0);
    }
    return acc;
  }, 0);

  const totalMinutes = Math.floor(totalMs / 1000 / 60);

  return { totalMinutes };
}




