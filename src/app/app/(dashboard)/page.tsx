import InterviewMetrics from "@/components/dashboard/interviewMetrics";
import LowestScoreInterviews from "@/components/dashboard/lowestScoreInterviews";
import PerformanceOverview from "@/components/dashboard/performanceOverview";

export default function DashboardPage() {
  return (
    <div>
      <PerformanceOverview />
      <LowestScoreInterviews />
      <InterviewMetrics />
    </div>
  );
}
