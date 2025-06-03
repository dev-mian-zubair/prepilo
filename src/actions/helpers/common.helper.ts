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

export function safeParseModelResponse(text: string): any {
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error("Invalid JSON response from AI model");
  }
  const jsonStr = text.slice(jsonStart, jsonEnd);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Failed to parse AI model response as JSON");
  }
} 
