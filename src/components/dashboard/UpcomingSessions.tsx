import { Card, CardBody, CardHeader } from "@heroui/card";
import { Session } from "@/types/dashboard";
import { format } from "date-fns";

interface UpcomingSessionsProps {
  sessions: Session[];
}

export default function UpcomingSessions({ sessions }: UpcomingSessionsProps) {
  return (
    <Card className="col-span-2 bg-white shadow-lg">
      <CardHeader className="bg-purple-50">
        <h2 className="text-xl font-semibold text-purple-800">Upcoming Sessions</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 border border-purple-100 rounded-lg space-y-2 bg-purple-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-purple-900">{session.title || "Untitled Session"}</h3>
                <span className="text-sm text-purple-600">
                  {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-purple-600">
                <span>Status: {session.status}</span>
                <span>•</span>
                <span>Preparation needed</span>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-2 text-purple-700">Preparation Checklist</h4>
                <ul className="space-y-1 text-sm text-purple-600">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-purple-600" />
                    Review previous feedback
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-purple-600" />
                    Practice key concepts
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-purple-600" />
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