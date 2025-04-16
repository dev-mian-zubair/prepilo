import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { InterviewStats } from "@/types/dashboard";

interface KeyMetricsProps {
  stats: InterviewStats;
  totalHours: number;
  avgSessionLength: number;
}

export default function KeyMetrics({ stats, totalHours, avgSessionLength }: KeyMetricsProps) {
  const completionRate = (stats.completedSessions / stats.totalSessions) * 100;
  const consistencyRate = (stats.weeklySessions / 7) * 100; // Assuming 7 sessions per week is the goal
  const successRate = (stats.highScoreSessions / stats.totalSessions) * 100; // Sessions with score >= 80%

  return (
    <Card className="col-span-2 bg-white shadow-lg">
      <CardHeader className="bg-indigo-50">
        <h2 className="text-xl font-semibold text-indigo-800">Key Metrics</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-3 gap-6">
          {/* Completion Rate */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-indigo-600">{completionRate.toFixed(1)}%</p>
            <Progress value={completionRate} className="bg-indigo-100" />
          </div>

          {/* Success Rate */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-teal-600">{successRate.toFixed(1)}%</p>
            <Progress value={successRate} className="bg-teal-100" />
          </div>

          {/* Average Technical Score */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Average Technical Score</p>
            <p className="text-2xl font-bold text-purple-600">{stats.avgTechnicalScore?.toFixed(1) || 0}%</p>
            <Progress value={stats.avgTechnicalScore || 0} className="bg-purple-100" />
          </div>

          {/* Communication Score */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Communication Score</p>
            <p className="text-2xl font-bold text-blue-600">{stats.avgCommunicationScore?.toFixed(1) || 0}%</p>
            <Progress value={stats.avgCommunicationScore || 0} className="bg-blue-100" />
          </div>

          {/* Problem Solving Score */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Problem Solving Score</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.avgProblemSolvingScore?.toFixed(1) || 0}%</p>
            <Progress value={stats.avgProblemSolvingScore || 0} className="bg-emerald-100" />
          </div>

          {/* Weekly Consistency */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Weekly Consistency</p>
            <p className="text-2xl font-bold text-amber-600">{consistencyRate.toFixed(1)}%</p>
            <Progress value={consistencyRate} className="bg-amber-100" />
          </div>

          {/* Average Session Length */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Average Session Length</p>
            <p className="text-2xl font-bold text-blue-600">{avgSessionLength.toFixed(1)} min</p>
          </div>

          {/* Total Hours Practiced */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Total Hours Practiced</p>
            <p className="text-2xl font-bold text-green-600">{totalHours.toFixed(1)}</p>
          </div>

          {/* Total Sessions */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Total Sessions</p>
            <p className="text-2xl font-bold text-rose-600">{stats.totalSessions}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 