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
}
