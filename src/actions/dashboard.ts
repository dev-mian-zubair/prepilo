import { getUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function getInterviewStats() {
  const user = await getUser();

  if (!user) return { completed: 0, inProgress: 0, paused: 0 };

  const [completed, inProgress, paused] = await Promise.all([
    prisma.session.count({ where: { userId: user.id, status: "COMPLETED" } }),
    prisma.session.count({ where: { userId: user.id, status: "IN_PROGRESS" } }),
    prisma.session.count({ where: { userId: user.id, status: "PAUSED" } }),
  ]);

  return { completed, inProgress, paused };
}
