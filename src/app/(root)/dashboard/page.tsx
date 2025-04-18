import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import KeyMetrics from "@/components/dashboard/KeyMetrics";
import TechnologyBreakdown from "@/components/dashboard/TechnologyBreakdown";
import StrengthsWeaknesses from "@/components/dashboard/StrengthsWeaknesses";
import GoalProgress from "@/components/dashboard/GoalProgress";
import RecommendedActions from "@/components/dashboard/RecommendedActions";
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
        {/* <KeyMetrics />
        <RecommendedActions />
        <StrengthsWeaknesses />
        <TechnologyBreakdown />
        <GoalProgress /> */}
        <RecentActivity />
        <InterviewList />
      </div>
    </div>
  );
}
