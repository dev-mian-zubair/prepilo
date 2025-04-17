import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { InterviewStats } from "@/types/dashboard";

export default function KeyMetrics() {
  const stats: InterviewStats = {
    totalSessions: 20,
    completedSessions: 15,
    weeklySessions: 5,
    highScoreSessions: 12,
    avgTechnicalScore: 85,
    avgCommunicationScore: 78,
    avgProblemSolvingScore: 82,
  };

  const totalHours = 12.5;
  const avgSessionLength = 45;

  const completionRate = (stats.completedSessions / stats.totalSessions) * 100;
  const consistencyRate = (stats.weeklySessions / 7) * 100;
  const successRate = (stats.highScoreSessions / stats.totalSessions) * 100;

  return (
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">Key Metrics</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Completion Rate */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Completion Rate</p>
            <p className="text-medium font-bold text-foreground mb-2">{completionRate.toFixed(1)}%</p>
            <Progress 
              value={completionRate} 
              classNames={{
                base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                indicator: "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90"
              }}
            />
          </div>

          {/* Success Rate */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Success Rate</p>
            <p className="text-medium font-bold text-success mb-2">{successRate.toFixed(1)}%</p>
            <Progress 
              value={successRate} 
              classNames={{
                base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                indicator: "h-full bg-gradient-to-r from-success/90 to-success-500/90 dark:from-success dark:to-success-500 transition-all duration-500 group-hover:opacity-90"
              }}
            />
          </div>

          {/* Average Technical Score */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Average Technical Score</p>
            <p className="text-medium font-bold text-foreground mb-2">{stats.avgTechnicalScore?.toFixed(1) || 0}%</p>
            <Progress 
              value={stats.avgTechnicalScore || 0} 
              classNames={{
                base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                indicator: "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90"
              }}
            />
          </div>

          {/* Communication Score */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Communication Score</p>
            <p className="text-medium font-bold text-foreground mb-2">{stats.avgCommunicationScore?.toFixed(1) || 0}%</p>
            <Progress 
              value={stats.avgCommunicationScore || 0} 
              classNames={{
                base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                indicator: "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90"
              }}
            />
          </div>

          {/* Problem Solving Score */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Problem Solving Score</p>
            <p className="text-medium font-bold text-foreground mb-2">{stats.avgProblemSolvingScore?.toFixed(1) || 0}%</p>
            <Progress 
              value={stats.avgProblemSolvingScore || 0} 
              classNames={{
                base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                indicator: "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90"
              }}
            />
          </div>

          {/* Weekly Consistency */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Weekly Consistency</p>
            <p className="text-medium font-bold text-warning mb-2">{consistencyRate.toFixed(1)}%</p>
            <Progress 
              value={consistencyRate} 
              classNames={{
                base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                indicator: "h-full bg-gradient-to-r from-warning/90 to-warning-500/90 dark:from-warning dark:to-warning-500 transition-all duration-500 group-hover:opacity-90"
              }}
            />
          </div>

          {/* Average Session Length */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Average Session Length</p>
            <p className="text-medium font-bold text-foreground">{avgSessionLength.toFixed(1)} min</p>
          </div>

          {/* Total Hours Practiced */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Total Hours Practiced</p>
            <p className="text-medium font-bold text-success">{totalHours.toFixed(1)} hrs</p>
          </div>

          {/* Total Sessions */}
          <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
            <p className="text-tiny text-foreground/80 mb-1">Total Sessions</p>
            <p className="text-medium font-bold text-foreground">{stats.totalSessions}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 