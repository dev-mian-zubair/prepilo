import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { InterviewStats, Feedback } from "@/types/dashboard";

interface PerformanceOverviewProps {
  stats: InterviewStats;
  recentFeedback: Feedback[];
}

export default function PerformanceOverview({ stats, recentFeedback }: PerformanceOverviewProps) {
  const latestFeedback = recentFeedback[0];
  
  return (
    <Card className="col-span-2 bg-white shadow-lg">
      <CardHeader className="bg-blue-50">
        <h2 className="text-xl font-semibold text-blue-800">Performance Overview</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-6">
          {/* Progress Snapshot */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Progress Snapshot</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Sessions Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completedSessions}/{stats.totalSessions}</p>
                <Progress value={(stats.completedSessions / stats.totalSessions) * 100} className="bg-blue-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-green-600">3 days</p>
              </div>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Skill Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Technical</p>
                <Progress value={latestFeedback?.technical || 0} className="bg-purple-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Communication</p>
                <Progress value={latestFeedback?.communication || 0} className="bg-green-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Problem Solving</p>
                <Progress value={latestFeedback?.problemSolving || 0} className="bg-yellow-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clarity</p>
                <Progress value={latestFeedback?.clarity || 0} className="bg-pink-100" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Confidence</p>
                <Progress value={latestFeedback?.confidence || 0} className="bg-indigo-100" />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 