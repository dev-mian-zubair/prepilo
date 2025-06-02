import { getCompletedSessionScores } from "@/actions/dashboard";
import SessionScoreTimeline from "@/components/dashboard/SessionScoreTimeline";
import TotalInterviewsCard from "@/components/dashboard/TotalInterviewsCard";
import PerformanceOverview from "@/components/dashboard/performanceOverview";
import LowestScoreInterviews from "@/components/dashboard/lowestScoreInterviews";
import InterviewMetrics from "@/components/dashboard/interviewMetrics";

export default async function DashboardPage() {
  const timelineData = await getCompletedSessionScores();

  return (
    <div className="p-4  space-y-6">
      <div className="flex flex-wrap gap-6">
        <div className="w-full md:w-1/3">
          <TotalInterviewsCard />
        </div>
        <div className="w-full md:w-3/3">
          <SessionScoreTimeline data={timelineData} />
        </div>
      </div>

      <PerformanceOverview />
      <LowestScoreInterviews />
      <InterviewMetrics />
    </div>
  );
}
