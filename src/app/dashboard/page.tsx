import PerformanceOverview from "@/components/dashboard/PerformanceOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import KeyMetrics from "@/components/dashboard/KeyMetrics";
import TechnologyBreakdown from "@/components/dashboard/TechnologyBreakdown";
import StrengthsWeaknesses from "@/components/dashboard/StrengthsWeaknesses";
import GoalProgress from "@/components/dashboard/GoalProgress";
import RecommendedActions from "@/components/dashboard/RecommendedActions";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import { DashboardData } from "@/types/dashboard";

// Mock data - replace with actual data fetching
const mockData: DashboardData = {
  stats: {
    totalSessions: 20,
    completedSessions: 15,
    avgTechnicalScore: 85,
    avgCommunicationScore: 78,
    avgProblemSolvingScore: 82,
  },
  recentFeedback: [
    {
      technical: 88,
      communication: 75,
      problemSolving: 85,
      clarity: 80,
      confidence: 70,
    },
  ],
  recentSessions: [
    {
      id: "1",
      title: "React Advanced Interview",
      startedAt: new Date(),
      overallScore: 85,
      status: "COMPLETED",
    },
  ],
  technologies: [
    { id: "1", name: "React", score: 85, count: 10 },
    { id: "2", name: "Node.js", score: 75, count: 5 },
  ],
  strengths: [
    {
      category: "React Hooks",
      description: "Strong understanding of useEffect and useState",
      sessionIds: ["1", "2"],
    },
  ],
  weaknesses: [
    {
      category: "System Design",
      description: "Need to improve scalability discussions",
      improvementTips: ["Study common patterns", "Practice whiteboarding"],
    },
  ],
  goals: [
    {
      type: "Weekly Practice",
      target: 5,
      current: 3,
      period: "WEEKLY",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ],
  upcomingSessions: [
    {
      id: "2",
      title: "System Design Interview",
      startedAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "PLANNED",
    },
  ],
};

const mockActions = [
  {
    title: "Practice System Design",
    description: "Your score is 15% below average in system design interviews",
    priority: "high" as const,
  },
  {
    title: "Try Advanced React",
    description: "You've mastered Intermediate React concepts",
    priority: "medium" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <PerformanceOverview
          stats={mockData.stats}
          recentFeedback={mockData.recentFeedback}
        />
        <RecentActivity sessions={mockData.recentSessions} />
        <KeyMetrics
          stats={mockData.stats}
          totalHours={12.5}
          avgSessionLength={45}
        />
        <TechnologyBreakdown technologies={mockData.technologies} />
        <StrengthsWeaknesses
          strengths={mockData.strengths}
          weaknesses={mockData.weaknesses}
        />
        <GoalProgress goals={mockData.goals} />
        <RecommendedActions actions={mockActions} />
        <UpcomingSessions sessions={mockData.upcomingSessions} />
      </div>
    </div>
  );
} 