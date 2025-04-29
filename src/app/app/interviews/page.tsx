import { getUserInterviews } from "@/actions/interview";
import InterviewLayout from "@/components/interview/listing/InterviewLayout";

export default async function InterviewsPage() {
  const response = await getUserInterviews();

  return <InterviewLayout interviews={response ?? []} />;
}
