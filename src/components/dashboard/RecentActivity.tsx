'use client';

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { format } from "date-fns";
import { Session } from "@/types/dashboard";

export default function RecentActivity() {
  const [showAll, setShowAll] = useState(false);
  
  const sessions: Session[] = [
    {
      id: "1",
      title: "React Advanced Interview",
      startedAt: new Date(),
      overallScore: 85,
      status: "COMPLETED",
    },
    {
      id: "2",
      title: "System Design Practice",
      startedAt: new Date(Date.now() - 86400000), // 1 day ago
      overallScore: 78,
      status: "COMPLETED",
    },
    {
      id: "3",
      title: "Data Structures & Algorithms",
      startedAt: new Date(Date.now() - 172800000), // 2 days ago
      overallScore: 92,
      status: "COMPLETED",
    },
    {
      id: "4",
      title: "Backend Architecture",
      startedAt: new Date(Date.now() - 259200000), // 3 days ago
      overallScore: 88,
      status: "COMPLETED",
    },
    {
      id: "5",
      title: "Frontend Performance",
      startedAt: new Date(Date.now() - 345600000), // 4 days ago
      overallScore: 81,
      status: "COMPLETED",
    },
    {
      id: "6",
      title: "Database Optimization",
      startedAt: new Date(Date.now() - 432000000), // 5 days ago
      overallScore: 75,
      status: "COMPLETED",
    },
    {
      id: "7",
      title: "API Design",
      startedAt: new Date(Date.now() - 518400000), // 6 days ago
      overallScore: 89,
      status: "COMPLETED",
    },
    {
      id: "8",
      title: "Cloud Architecture",
      startedAt: new Date(Date.now() - 604800000), // 7 days ago
      overallScore: 83,
      status: "COMPLETED",
    },
  ];

  const displaySessions = showAll ? sessions : sessions.slice(0, 3);

  return (
    <Card className="col-span-2 bg-content1 shadow-lg w-full">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-center text-foreground/70">No recent activities</p>
          ) : (
            <>
              {displaySessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between p-4 border border-content2 rounded-lg bg-content2/40 hover:bg-content2/60 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium text-foreground">{session.title || "Untitled Session"}</h3>
                    <p className="text-sm text-foreground/70">
                      {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {session.overallScore && (
                      <div className="text-right">
                        <p className="text-sm text-foreground/70">Score</p>
                        <p className={`font-bold ${
                          session.overallScore >= 90 ? 'text-success/90' :
                          session.overallScore >= 80 ? 'text-primary/90' :
                          session.overallScore >= 70 ? 'text-warning/90' :
                          'text-danger/90'
                        }`}>
                          {session.overallScore}%
                        </p>
                      </div>
                    )}
                    <div className={`w-3 h-3 rounded-full ${
                      session.status === 'COMPLETED' ? 'bg-success' :
                      session.status === 'IN_PROGRESS' ? 'bg-warning' :
                      'bg-default-400'
                    }`} />
                  </div>
                </div>
              ))}
              {sessions.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
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