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
  const consistencyRate = (stats.weeklySessions / 7) * 100;
  const successRate = (stats.highScoreSessions / stats.totalSessions) * 100;

  return (
    <Card className="col-span-2 bg-content1 shadow-lg">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Key Metrics</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="grid grid-cols-3 gap-6">
          {/* Completion Rate */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Completion Rate</p>
            <p className="text-2xl font-bold text-foreground">{completionRate.toFixed(1)}%</p>
            <Progress 
              value={completionRate} 
              classNames={{
                base: "overflow-hidden rounded-full bg-hover",
                indicator: "h-full bg-primary rounded-full"
              }}
            />
          </div>

          {/* Success Rate */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Success Rate</p>
            <p className="text-2xl font-bold text-success/90">{successRate.toFixed(1)}%</p>
            <Progress 
              value={successRate} 
              classNames={{
                base: "overflow-hidden rounded-full bg-hover",
                indicator: "h-full bg-success rounded-full"
              }}
            />
          </div>

          {/* Average Technical Score */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Average Technical Score</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgTechnicalScore?.toFixed(1) || 0}%</p>
            <Progress 
              value={stats.avgTechnicalScore || 0} 
              classNames={{
                base: "overflow-hidden rounded-full bg-hover",
                indicator: "h-full bg-primary rounded-full"
              }}
            />
          </div>

          {/* Communication Score */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Communication Score</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgCommunicationScore?.toFixed(1) || 0}%</p>
            <Progress 
              value={stats.avgCommunicationScore || 0} 
              classNames={{
                base: "overflow-hidden rounded-full bg-hover",
                indicator: "h-full bg-primary rounded-full"
              }}
            />
          </div>

          {/* Problem Solving Score */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Problem Solving Score</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgProblemSolvingScore?.toFixed(1) || 0}%</p>
            <Progress 
              value={stats.avgProblemSolvingScore || 0} 
              classNames={{
                base: "overflow-hidden rounded-full bg-hover",
                indicator: "h-full bg-primary rounded-full"
              }}
            />
          </div>

          {/* Weekly Consistency */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Weekly Consistency</p>
            <p className="text-2xl font-bold text-warning/90">{consistencyRate.toFixed(1)}%</p>
            <Progress 
              value={consistencyRate} 
              classNames={{
                base: "overflow-hidden rounded-full bg-hover",
                indicator: "h-full bg-warning rounded-full"
              }}
            />
          </div>

          {/* Average Session Length */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Average Session Length</p>
            <p className="text-2xl font-bold text-foreground">{avgSessionLength.toFixed(1)} min</p>
          </div>

          {/* Total Hours Practiced */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Total Hours Practiced</p>
            <p className="text-2xl font-bold text-success/90">{totalHours.toFixed(1)}</p>
          </div>

          {/* Total Sessions */}
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Total Sessions</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 