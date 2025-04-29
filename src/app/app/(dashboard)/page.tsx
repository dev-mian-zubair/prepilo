import InterviewMetrics from "@/components/dashboard/interviewMetrics";
import LowestScoreInterviews from "@/components/dashboard/lowestScoreInterviews";
import PerformanceOverview from "@/components/dashboard/performanceOverview";
import InterviewList from "@/components/interview/listing/InterviewList";

export default function DashboardPage() {
  return (
    <div>
      <PerformanceOverview />
      <LowestScoreInterviews />
      <InterviewMetrics />
      <InterviewList />
    </div>
  );
}
