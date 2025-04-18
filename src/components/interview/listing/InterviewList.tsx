'use client';

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Interview } from "@/types/interview";
import { mockInterviews } from "@/data/mockInterviews";
import { format } from "date-fns";

export default function InterviewList() {
  const [showAll, setShowAll] = useState(false);
  
  const displayInterviews = showAll ? mockInterviews : mockInterviews.slice(0, 3);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "text-success bg-success/10";
      case "INTERMEDIATE":
        return "text-warning bg-warning/10";
      case "ADVANCED":
        return "text-danger bg-danger/10";
      default:
        return "text-secondary bg-secondary/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-success bg-success/10";
      case "LEFT_IN_MID":
        return "text-danger bg-danger/10";
      default:
        return "text-secondary bg-secondary/10";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-success to-success/80";
    if (score >= 75) return "from-warning to-warning/80";
    if (score >= 60) return "from-primary to-primary/80";
    return "from-danger to-danger/80";
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-large font-bold text-foreground tracking-tight">This Week's Interviews</h2>
            <div className="flex items-center gap-1 px-2 py-1 rounded-small bg-foreground/5 text-foreground/80 dark:text-foreground/70">
              <span className="text-tiny font-medium">{displayInterviews.length}</span>
            </div>
          </div>
          <Link 
            href="/interviews" 
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-small bg-foreground/5 text-foreground/80 dark:text-foreground/70 font-medium text-tiny transition-colors hover:bg-foreground/10"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {displayInterviews.length === 0 ? (
            <p className="text-center text-foreground/70">No interviews this week</p>
          ) : (
            <>
              {displayInterviews.map((interview) => (
                <div 
                  key={interview.id} 
                  className="group border border-border rounded-medium p-4 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{interview.title}</h3>
                        <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(interview.difficulty)}`}>
                          {interview.difficulty.charAt(0) + interview.difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getStatusColor(interview.status)}`}>
                          {interview.status === "COMPLETED" ? "Completed" : "Left in Mid"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/70 line-clamp-1">{interview.description}</p>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-wrap gap-1">
                          <span className="text-tiny font-medium text-foreground/70">Technologies:</span>
                          {interview.technologies.map((tech) => (
                            <span 
                              key={tech} 
                              className="text-tiny px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-tiny font-medium text-foreground/70">Focus Areas:</span>
                          {interview.focusAreas.map((area) => (
                            <span 
                              key={area} 
                              className="text-tiny px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70"
                            >
                              {area.replace("_", " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(interview.overallScore)} text-white font-medium text-tiny transition-all duration-300`}>
                        Score: {interview.overallScore}% - {getScoreText(interview.overallScore)}
                      </div>
                      <div className="flex flex-col items-end gap-1 text-tiny text-foreground/70">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{interview.duration} minutes</span>
                        </div>
                        <span>
                          {format(interview.startedAt, "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {mockInterviews.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-2 text-tiny font-medium text-foreground/70 hover:text-foreground transition-colors rounded-medium hover:bg-hover/40"
                >
                  {showAll ? 'Show Less' : `Show ${mockInterviews.length - 3} More`}
                </button>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
} 