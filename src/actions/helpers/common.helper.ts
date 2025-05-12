import { getUser } from "@/lib/auth";

// Get User
export async function getCurrentUser() {
  const user = await getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

export function extractJSON(text: string) {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;
  const jsonString = text.slice(jsonStart, jsonEnd);

  return JSON.parse(jsonString);
}

export function validateRequestFields(
  fields: Record<string, any>,
  required: string[],
) {
  for (const key of required) {
    if (!fields[key]) return `Missing required field: ${key}`;
  }

  return null;
}
