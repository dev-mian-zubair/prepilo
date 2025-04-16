'use client';

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { format } from "date-fns";
import { Session } from "@/types/dashboard";

interface RecentActivityProps {
  sessions: Session[];
}

export default function RecentActivity({ sessions }: RecentActivityProps) {
  const [showAll, setShowAll] = useState(false);
  const displaySessions = showAll ? sessions : sessions.slice(0, 3);

  return (
    <Card className="col-span-2 bg-white shadow-lg w-full">
      <CardHeader className="bg-indigo-50">
        <h2 className="text-xl font-semibold text-indigo-800">Recent Activity</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-center text-indigo-600">No recent activities</p>
          ) : (
            <>
              {displaySessions.map((session) => (
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
              ))}
              {sessions.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {showAll ? 'Show Less' : `Show ${sessions.length - 3} More`}
                </button>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
} 