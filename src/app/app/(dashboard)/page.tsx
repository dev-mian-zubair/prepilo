import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import InterviewMetrics from "@/components/dashboard/InterviewMetrics";
import LowestScoreInterviews from "@/components/dashboard/LowestScoreInterviews";
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
