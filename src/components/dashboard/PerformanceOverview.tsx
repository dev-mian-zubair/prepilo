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
    <Card className="col-span-2 bg-content1 shadow-lg">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Performance Overview</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="grid grid-cols-2 gap-6">
          {/* Progress Snapshot */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Progress Snapshot</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-foreground/70">Sessions Completed</p>
                <p className="text-2xl font-bold text-foreground">{stats.completedSessions}/{stats.totalSessions}</p>
                <Progress 
                  value={(stats.completedSessions / stats.totalSessions) * 100} 
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover",
                    indicator: "h-full bg-primary rounded-full"
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Current Streak</p>
                <p className="text-2xl font-bold text-success">3 days</p>
              </div>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Skill Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/70">Technical</p>
                <p className="text-sm font-medium text-foreground mb-1">{latestFeedback?.technical || 0}%</p>
                <Progress 
                  value={latestFeedback?.technical || 0} 
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover",
                    indicator: "h-full bg-primary rounded-full"
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Communication</p>
                <p className="text-sm font-medium text-foreground mb-1">{latestFeedback?.communication || 0}%</p>
                <Progress 
                  value={latestFeedback?.communication || 0} 
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover",
                    indicator: "h-full bg-primary rounded-full"
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Problem Solving</p>
                <p className="text-sm font-medium text-foreground mb-1">{latestFeedback?.problemSolving || 0}%</p>
                <Progress 
                  value={latestFeedback?.problemSolving || 0} 
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover",
                    indicator: "h-full bg-primary rounded-full"
                  }}
                />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Confidence</p>
                <p className="text-sm font-medium text-foreground mb-1">{latestFeedback?.confidence || 0}%</p>
                <Progress 
                  value={latestFeedback?.confidence || 0} 
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover",
                    indicator: "h-full bg-primary rounded-full"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 