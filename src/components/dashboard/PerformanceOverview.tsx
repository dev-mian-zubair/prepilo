import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";

import { InterviewStats, Feedback } from "@/types/dashboard";

export default function PerformanceOverview() {
  const stats: InterviewStats = {
    totalSessions: 20,
    completedSessions: 15,
    weeklySessions: 5,
    highScoreSessions: 12,
    avgTechnicalScore: 85,
    avgCommunicationScore: 78,
    avgProblemSolvingScore: 82,
  };

  const recentFeedback: Feedback[] = [
    {
      technical: 88,
      communication: 75,
      problemSolving: 85,
      clarity: 80,
      confidence: 70,
    },
  ];

  const latestFeedback = recentFeedback[0];

  return (
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Performance Overview
        </h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress Snapshot */}
          <div className="space-y-6 bg-hover/40 rounded-medium p-6">
            <h3 className="text-medium font-semibold text-foreground">
              Progress Snapshot
            </h3>
            <div className="space-y-6">
              <div className="group">
                <p className="text-tiny text-foreground/80 mb-1">
                  Sessions Completed
                </p>
                <p className="text-large font-bold text-foreground">
                  {stats.completedSessions}/{stats.totalSessions}
                </p>
                <Progress
                  classNames={{
                    base: "h-3 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                    indicator:
                      "h-full bg-success/90 dark:bg-success transition-all duration-500 group-hover:opacity-90",
                  }}
                  value={(stats.completedSessions / stats.totalSessions) * 100}
                />
              </div>
              <div>
                <p className="text-tiny text-foreground/80 mb-1">
                  Current Streak
                </p>
                <p className="text-large font-bold text-success">3 days</p>
              </div>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="space-y-6">
            <h3 className="text-medium font-semibold text-foreground">
              Skill Assessment
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
                <p className="text-tiny text-foreground/80 mb-1">Technical</p>
                <p className="text-small font-medium text-foreground mb-2">
                  {latestFeedback?.technical || 0}%
                </p>
                <Progress
                  classNames={{
                    base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                    indicator:
                      "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90",
                  }}
                  value={latestFeedback?.technical || 0}
                />
              </div>
              <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
                <p className="text-tiny text-foreground/80 mb-1">Communication</p>
                <p className="text-small font-medium text-foreground mb-2">
                  {latestFeedback?.communication || 0}%
                </p>
                <Progress
                  classNames={{
                    base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                    indicator:
                      "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90",
                  }}
                  value={latestFeedback?.communication || 0}
                />
              </div>
              <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
                <p className="text-tiny text-foreground/80 mb-1">Problem Solving</p>
                <p className="text-small font-medium text-foreground mb-2">
                  {latestFeedback?.problemSolving || 0}%
                </p>
                <Progress
                  classNames={{
                    base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                    indicator:
                      "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90",
                  }}
                  value={latestFeedback?.problemSolving || 0}
                />
              </div>
              <div className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300">
                <p className="text-tiny text-foreground/80 mb-1">Confidence</p>
                <p className="text-small font-medium text-foreground mb-2">
                  {latestFeedback?.confidence || 0}%
                </p>
                <Progress
                  classNames={{
                    base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                    indicator:
                      "h-full bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary transition-all duration-500 group-hover:opacity-90",
                  }}
                  value={latestFeedback?.confidence || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
