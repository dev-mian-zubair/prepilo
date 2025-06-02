import { getCompletedSessionScores } from "@/actions/dashboard";
import SessionScoreTimeline from "@/components/dashboard/SessionScoreTimeline";
import TotalInterviewsCard from "@/components/dashboard/TotalInterviewsCard";

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
    </div>
  );
}
