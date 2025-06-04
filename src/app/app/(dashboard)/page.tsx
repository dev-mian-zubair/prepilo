import { getCompletedSessionScores } from "@/actions/dashboard";
import SessionDurationCard from "@/components/dashboard/SessionDurationCard";
import SessionsByDifficultyCard from "@/components/dashboard/SessionsByDifficultyCard";
import SessionScoreTimeline from "@/components/dashboard/SessionScoreTimeline";
import TotalInterviewsCard from "@/components/dashboard/TotalInterviewsCard";

export default async function DashboardPage() {
  const timelineData = await getCompletedSessionScores();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalInterviewsCard />
        <SessionsByDifficultyCard />
        <SessionDurationCard />
      </div>

      <div className="w-full">
        <SessionScoreTimeline data={timelineData} />
      </div>
    </div>
  );
}
