import {
  generateInterviewDataWithAgentInfo,
  validateAndCreateInterview,
} from "@/actions/helpers/interview/create.interview";

export async function POST(request: Request) {
  try {
    const requestInfo = await request.json();
    const interviewInfo = await generateInterviewDataWithAgentInfo(requestInfo);

    await validateAndCreateInterview({
      title: interviewInfo.title,
      duration: 60,
      focusAreas: interviewInfo.focusAreas,
      technologyNames: interviewInfo.technologies,
      userId: requestInfo.userid,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to generate interview:", error);

    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU" }, { status: 200 });
}
