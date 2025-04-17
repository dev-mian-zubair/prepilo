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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500/90 to-emerald-400/90 dark:from-emerald-400 dark:to-emerald-300';
    if (score >= 80) return 'from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary';
    if (score >= 70) return 'from-amber-500/90 to-amber-400/90 dark:from-amber-400 dark:to-amber-300';
    return 'from-rose-500/90 to-rose-400/90 dark:from-rose-400 dark:to-rose-300';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-r from-amber-500 to-amber-400 dark:from-amber-400 dark:to-amber-300';
      default:
        return 'bg-gradient-to-r from-default-500 to-default-400 dark:from-default-400 dark:to-default-300';
    }
  };

  return (
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-large font-bold text-foreground tracking-tight">Recent Activity</h2>
          <div className="flex items-center gap-2 px-2 py-1 rounded-small bg-default-100 dark:bg-default-50">
            <span className="text-tiny font-medium text-default-600">{sessions.length}</span>
            <span className="text-tiny text-default-500">Sessions This Week</span>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-center text-foreground/70">No recent activities</p>
          ) : (
            <>
              {displaySessions.map((session) => (
                <div 
                  key={session.id} 
                  className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{session.title || "Untitled Session"}</h3>
                      <p className="text-tiny text-foreground/70">
                        {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {session.overallScore && (
                        <div className="text-right">
                          <p className="text-tiny text-foreground/70 mb-1">Score</p>
                          <div className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(session.overallScore)} text-white font-medium text-tiny transition-all duration-300 group-hover:opacity-90`}>
                            {session.overallScore}%
                          </div>
                        </div>
                      )}
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                    </div>
                  </div>
                </div>
              ))}
              {sessions.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-tiny font-medium text-foreground/70 hover:text-foreground transition-colors rounded-medium hover:bg-hover/40"
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