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

  // return stats;
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

  // return sessions.map((s) => ({
  //   score: s.overallScore!,
  //   date: s.endedAt ?? new Date(), // fallback if somehow endedAt is null
  // }));
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