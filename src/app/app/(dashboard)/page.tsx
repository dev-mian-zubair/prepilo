import InterviewMetrics from "@/components/dashboard/interviewMetrics";
import LowestScoreInterviews from "@/components/dashboard/lowestScoreInterviews";
import PerformanceOverview from "@/components/dashboard/performanceOverview";
import TotalInterviewsCard from "@/components/dashboard/TotalInterviewsCard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top row with 2 cards: 33% + 66% */}
      <div className="flex gap-6 items-stretch">
        <div className="w-1/3">
          <TotalInterviewsCard />
        </div>
        <div className="w-2/3">
          <div className="h-full bg-gray-100 dark:bg-content1 rounded-2xl p-6 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
            Demo Block — Place anything here (e.g., charts, next goals, etc.)
          </div>
        </div>
      </div>

      {/* Other full-width dashboard sections */}
      <PerformanceOverview />
      <LowestScoreInterviews />
      <InterviewMetrics />
    </div>
  );
}
