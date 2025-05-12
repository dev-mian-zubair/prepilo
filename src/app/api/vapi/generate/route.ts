import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { validateAndCreateInterview } from "@/actions/helpers/interview";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  const { type, role, level, techstack, userid } = await request.json();

  console.log(type, role, level, techstack, userid);

  if (!type || !role || !level || !techstack || !userid) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const user = await getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    if (user.id !== userid) {
      throw new Error("Access denied");
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Strictly respond with ONLY a object with three keys: title, focusAreas and technologies. The title should be a job title, the focus areas should be an array of focus area names, and the technologies should be an array of technology names. No additional text or formatting.

      Input:
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      The focus areas: ${type}.

      Focus Areas: TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PROBLEM_SOLVING

      Required output format (ONLY THIS FORMAT):
      {
        "title": "Job title",
        "focusAreas": ["FOCUS_AREA_1", "FOCUS_AREA_2"],
        "technologies": ["TechName_1", "TechName_2"]
      }

      Example:
      {
        "title": "Software Engineer",
        "focusAreas": ["BEHAVIORAL", "TECHNICAL"],
        "technologies": ["React", "Node.js"]
      }`,
      system:
        "You are a helpful assistant that processes job description. Only respond with the requested object, no additional text.",
    });

    // Clean the response to extract only the JSON
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);

    console.log(result);

    return await validateAndCreateInterview({
      title: result.title,
      duration: 60,
      focusAreas: result.focusAreas,
      technologyNames: result.technologies,
    });
  } catch (error) {
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU" }, { status: 200 });
}
