import { Card, CardBody, CardHeader } from "@heroui/card";
import { Session } from "@/types/dashboard";
import { format } from "date-fns";

interface RecentActivityProps {
  sessions: Session[];
}

export default function RecentActivity({ sessions }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">{session.title || "Untitled Session"}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {session.overallScore && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="font-bold">{session.overallScore}%</p>
                  </div>
                )}
                <div className={`w-3 h-3 rounded-full ${
                  session.status === 'COMPLETED' ? 'bg-green-500' :
                  session.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 