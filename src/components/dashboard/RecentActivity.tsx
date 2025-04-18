'use client';

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { format, formatDistanceStrict } from "date-fns";
import { Session, Difficulty } from "@/types/dashboard";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RecentActivity() {
  const [showAll, setShowAll] = useState(false);
  
  const sessions: Session[] = [
    {
      id: "1",
      title: "React Advanced Interview",
      startedAt: new Date(),
      endedAt: new Date(Date.now() + 45 * 60000),
      overallScore: 85,
      status: "COMPLETED",
      difficulty: "ADVANCED"
    },
    {
      id: "2",
      title: "System Design Practice",
      startedAt: new Date(Date.now() - 86400000),
      endedAt: new Date(Date.now() - 86400000 + 30 * 60000),
      overallScore: 45,
      status: "LEFT_IN_MID",
      difficulty: "INTERMEDIATE"
    },
    {
      id: "3",
      title: "Data Structures & Algorithms",
      startedAt: new Date(Date.now() - 172800000),
      endedAt: new Date(Date.now() - 172800000 + 50 * 60000),
      overallScore: 92,
      status: "COMPLETED",
      difficulty: "ADVANCED"
    },
    {
      id: "4",
      title: "Backend Architecture",
      startedAt: new Date(Date.now() - 259200000),
      endedAt: new Date(Date.now() - 259200000 + 20 * 60000),
      overallScore: 35,
      status: "LEFT_IN_MID",
      difficulty: "INTERMEDIATE"
    },
    {
      id: "5",
      title: "Frontend Performance",
      startedAt: new Date(Date.now() - 345600000),
      endedAt: new Date(Date.now() - 345600000 + 40 * 60000),
      overallScore: 78,
      status: "COMPLETED",
      difficulty: "BEGINNER"
    },
    {
      id: "6",
      title: "Database Optimization",
      startedAt: new Date(Date.now() - 432000000),
      endedAt: new Date(Date.now() - 432000000 + 15 * 60000),
      overallScore: 28,
      status: "LEFT_IN_MID",
      difficulty: "INTERMEDIATE"
    },
    {
      id: "7",
      title: "API Design",
      startedAt: new Date(Date.now() - 518400000),
      endedAt: new Date(Date.now() - 518400000 + 45 * 60000),
      overallScore: 89,
      status: "COMPLETED",
      difficulty: "ADVANCED"
    },
    {
      id: "8",
      title: "Cloud Architecture",
      startedAt: new Date(Date.now() - 604800000),
      endedAt: new Date(Date.now() - 604800000 + 60 * 60000),
      overallScore: 83,
      status: "COMPLETED",
      difficulty: "INTERMEDIATE"
    },
    {
      id: "9",
      title: "Basic JavaScript Concepts",
      startedAt: new Date(Date.now() - 691200000),
      endedAt: new Date(Date.now() - 691200000 + 25 * 60000),
      overallScore: 42,
      status: "LEFT_IN_MID",
      difficulty: "BEGINNER"
    },
    {
      id: "10",
      title: "Web Security Fundamentals",
      startedAt: new Date(Date.now() - 777600000),
      endedAt: new Date(Date.now() - 777600000 + 55 * 60000),
      overallScore: 62,
      status: "COMPLETED",
      difficulty: "INTERMEDIATE"
    }
  ];

  // Sort sessions by date (newest first)
  const sortedSessions = sessions.sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  const displaySessions = showAll ? sortedSessions : sortedSessions.slice(0, 3);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-success to-success/80';
    if (score >= 75) return 'from-warning to-warning/80';
    if (score >= 60) return 'from-primary to-primary/80';
    return 'from-danger to-danger/80';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-success/5 border-success/20';
    if (score >= 75) return 'bg-warning/5 border-warning/20';
    if (score >= 60) return 'bg-primary/5 border-primary/20';
    return 'bg-danger/5 border-danger/20';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gradient-to-r from-success-500 to-success-400 dark:from-success-400 dark:to-success-300';
      case 'LEFT_IN_MID':
        return 'bg-gradient-to-r from-danger-500 to-danger-400 dark:from-danger-400 dark:to-danger-300';
      default:
        return 'bg-gradient-to-r from-default-500 to-default-400 dark:from-default-400 dark:to-default-300';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'text-success bg-success/10';
      case 'INTERMEDIATE':
        return 'text-warning bg-warning/10';
      case 'ADVANCED':
        return 'text-danger bg-danger/10';
      default:
        return 'text-secondary bg-secondary/10';
    }
  };

  return (
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-large font-bold text-foreground tracking-tight">This Week's Interviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-1 py-1 rounded-small bg-default-100 dark:bg-default-50">
              <span className="text-tiny font-medium text-default-600">{sessions.length}</span>
            </div>
            <Link 
              href="/interviews" 
              className="flex items-center gap-1 text-tiny font-medium text-primary hover:text-primary-500 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {sortedSessions.length === 0 ? (
            <p className="text-center text-foreground/70">No interviews this week</p>
          ) : (
            <>
              {displaySessions.map((session) => (
                <div 
                  key={session.id} 
                  className={`group border rounded-medium p-4 transition-all duration-300 ${
                    session.overallScore ? getScoreBackground(session.overallScore) : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{session.title || "Untitled Session"}</h3>
                        <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(session.difficulty)}`}>
                          {session.difficulty.charAt(0) + session.difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${
                          session.status === 'COMPLETED' ? 'text-success bg-success/10' :
                          'text-danger bg-danger/10'
                        }`}>
                          {session.status === 'COMPLETED' ? 'Completed' : 'Left in Mid'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-tiny text-foreground/70">
                          {format(new Date(session.startedAt), "MMM d, yyyy h:mm a")}
                        </p>
                        {session.endedAt && (
                          <div className="flex items-center gap-1 text-tiny text-foreground/70">
                            <Clock size={12} />
                            <span>{formatDistanceStrict(new Date(session.endedAt), new Date(session.startedAt))}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {session.overallScore && (
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(session.overallScore)} text-white font-medium text-tiny transition-all duration-300`}>
                            Score: {session.overallScore}% - {getScoreText(session.overallScore)}
                          </div>
                        </div>
                      )}
                      {/* <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} /> */}
                    </div>
                  </div>
                </div>
              ))}
              {sortedSessions.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-tiny font-medium text-foreground/70 hover:text-foreground transition-colors rounded-medium hover:bg-hover/40"
                >
                  {showAll ? 'Show Less' : `Show ${sortedSessions.length - 3} More`}
                </button>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
} 