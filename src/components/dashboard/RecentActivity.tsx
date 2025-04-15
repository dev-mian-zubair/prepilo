import { Card, CardBody, CardHeader } from "@heroui/card";
import { format } from "date-fns";

interface Session {
  id: string;
  title: string;
  startedAt: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  overallScore?: number;
}

interface RecentActivityProps {
  sessions?: Session[];
}

const sampleSessions: Session[] = [
  {
    id: "1",
    title: "System Design Interview",
    startedAt: new Date().toISOString(),
    status: "COMPLETED",
    overallScore: 92,
  },
  {
    id: "2",
    title: "Data Structures Practice",
    startedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "COMPLETED",
    overallScore: 78,
  },
  {
    id: "3",
    title: "Algorithm Optimization",
    startedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: "IN_PROGRESS",
    overallScore: 65,
  },
  {
    id: "4",
    title: "Frontend Development",
    startedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: "COMPLETED",
    overallScore: 85,
  },
  {
    id: "5",
    title: "Backend Architecture",
    startedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    status: "COMPLETED",
    overallScore: 88,
  },
];

export default function RecentActivity({ sessions = sampleSessions }: RecentActivityProps) {
  const displaySessions = sessions || sampleSessions;

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-indigo-50">
        <h2 className="text-xl font-semibold text-indigo-800">Recent Activity</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {displaySessions.length === 0 ? (
            <p className="text-center text-indigo-600">No recent activities</p>
          ) : (
            displaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-indigo-100 rounded-lg bg-indigo-50/30 hover:bg-indigo-50/50 transition-colors">
                <div className="space-y-1">
                  <h3 className="font-medium text-indigo-900">{session.title || "Untitled Session"}</h3>
                  <p className="text-sm text-indigo-600">
                    {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {session.overallScore && (
                    <div className="text-right">
                      <p className="text-sm text-indigo-600">Score</p>
                      <p className={`font-bold ${
                        session.overallScore >= 90 ? 'text-emerald-600' :
                        session.overallScore >= 80 ? 'text-indigo-600' :
                        session.overallScore >= 70 ? 'text-amber-600' :
                        'text-rose-600'
                      }`}>
                        {session.overallScore}%
                      </p>
                    </div>
                  )}
                  <div className={`w-3 h-3 rounded-full ${
                    session.status === 'COMPLETED' ? 'bg-emerald-500' :
                    session.status === 'IN_PROGRESS' ? 'bg-amber-500' :
                    'bg-gray-500'
                  }`} />
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
} 