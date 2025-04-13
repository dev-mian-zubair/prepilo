import prisma from "@/lib/prisma";

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  provider: "google" | "github" | "email";
}

export const users = {
  async getUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user as IUser | null;
  },

  async createUser(user: Partial<IUser>) {
    const newUser = await prisma.user.create({
      data: {
        id: user.id as string,
        email: user.email!,
        name: user.name!,
        avatar: user.avatar || "",
        provider: user.provider!,
      },
    });

    return newUser as IUser;
  },

  async captureUserDetails(authUser: any) {
    // Extract provider
    const provider = authUser.app_metadata.provider as IUser["provider"];
    // Check if user already exists
    const existingUser = await this.getUser(authUser.id).catch(() => null);

    if (existingUser) {
      const updatedUser = await this.updateUser(authUser.id, {
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

    return await this.createUser(newUser);
  },

  async updateUser(id: string, updates: Partial<IUser>) {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates as any,
    });

    return updatedUser as IUser;
  },
};
