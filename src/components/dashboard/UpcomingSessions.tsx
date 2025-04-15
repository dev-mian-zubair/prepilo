import { Card, CardBody, CardHeader } from "@heroui/card";
import { Session } from "@/types/dashboard";
import { format } from "date-fns";

interface UpcomingSessionsProps {
  sessions: Session[];
}

export default function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{session.title || "Untitled Session"}</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Status: {session.status}</span>
                <span>•</span>
                <span>Preparation needed</span>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2">Preparation Checklist</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Review previous feedback
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Practice key concepts
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Set up your environment
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 