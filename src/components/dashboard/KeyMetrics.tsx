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

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-indigo-50">
        <h2 className="text-xl font-semibold text-indigo-800">Key Metrics</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-6">
          {/* Completion Rate */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-2xl font-bold text-indigo-600">{completionRate.toFixed(1)}%</p>
            <Progress value={completionRate} className="bg-indigo-100" />
          </div>

          {/* Average Scores */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Average Technical Score</p>
            <p className="text-2xl font-bold text-purple-600">{stats.avgTechnicalScore?.toFixed(1) || 0}%</p>
            <Progress value={stats.avgTechnicalScore || 0} className="bg-purple-100" />
          </div>

          {/* Time Investment */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Total Hours Practiced</p>
            <p className="text-2xl font-bold text-green-600">{totalHours.toFixed(1)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Average Session Length</p>
            <p className="text-2xl font-bold text-blue-600">{avgSessionLength.toFixed(1)} min</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 