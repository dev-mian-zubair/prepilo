"use server";

import prisma from "@/lib/prisma";
import { Subscription } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: "google" | "github" | "email";
  createdAt: Date;
  updatedAt: Date;
  subscription?: Subscription | null;
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true
    }
  });

  return user as IUser | null;
}

export async function createUser(user: Partial<IUser>) {
  const newUser = await prisma.user.create({
    data: {
      id: user.id as string,
      email: user.email!,
      name: user.name!,
      avatar: user.avatar || "",
      provider: user.provider!,
      subscription: {
        create: {
          availableMinutes: 20,
          totalMinutes: 20,
          lastRenewedAt: new Date(),
        }
      }
    },
    include: {
      subscription: true
    }
  });

  return newUser as IUser;
}

export async function updateUser(id: string, updates: Partial<IUser>) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updates as any,
    include: {
      subscription: true
    }
  });

  return updatedUser as IUser;
}

export async function captureUserDetails(authUser: any) {
  // Extract provider
  const provider = authUser.app_metadata.provider as IUser["provider"];
  // Check if user already exists
  const existingUser = await getUser(authUser.id).catch(() => null);

  if (existingUser) {
    const updatedUser = await updateUser(authUser.id, {
      name: authUser.user_metadata.full_name || authUser.email!.split("@")[0],
      avatar: authUser.user_metadata.avatar_url || "",
      provider,
    });

    return updatedUser;
  }

  // Create new user
  const newUser: Partial<IUser> = {
    id: authUser.id,
    email: authUser.email!,
    name: authUser.user_metadata.full_name || authUser.email!.split("@")[0],
    avatar: authUser.user_metadata.avatar_url || "",
    provider,
  };

  return await createUser(newUser);
}
