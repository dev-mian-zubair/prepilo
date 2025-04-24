import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import InterviewMetrics from "@/components/dashboard/InterviewMetrics";
import LowestScoreInterviews from "@/components/dashboard/LowestScoreInterviews";
import InterviewList from "@/components/interview/listing/InterviewList";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <PerformanceOverview />
        <LowestScoreInterviews />
        <InterviewMetrics />
        <InterviewList />
      </div>
    </div>
  );
}
