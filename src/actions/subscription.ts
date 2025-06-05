"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export interface SubscriptionStatus {
  availableMinutes: number;
  totalMinutes: number;
  lastRenewedAt: Date;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  const user = await getUser();
  if (!user) return null;

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  return subscription;
}

export async function addMinutes(minutes: number): Promise<SubscriptionStatus | null> {
  const user = await getUser();
  if (!user) return null;

  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      availableMinutes: { increment: minutes },
      totalMinutes: { increment: minutes },
      lastRenewedAt: new Date(),
    },
    create: {
      userId: user.id,
      availableMinutes: minutes,
      totalMinutes: minutes,
    },
  });

  return subscription;
}

export async function deductMinutes(minutes: number): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription || subscription.availableMinutes < minutes) {
    return false;
  }

  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      availableMinutes: { decrement: minutes },
    },
  });

  return true;
}

export async function checkAvailableMinutes(minutes: number): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  return subscription ? subscription.availableMinutes >= minutes : false;
} 