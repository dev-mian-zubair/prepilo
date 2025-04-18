'use client';

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Difficulty } from "@/types/dashboard";
import { format, formatDistanceStrict } from "date-fns";
import { Clock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Technology {
  name: string;
}

interface LowestScoreInterview {
  id: string;
  title: string;
  difficulty: Difficulty;
  score: number;
  startedAt: Date;
  endedAt: Date;
  technologies: Technology[];
}

export default function LowestScoreInterviews() {
  const [showAll, setShowAll] = useState(false);
  
  const interviews: LowestScoreInterview[] = [
    {
      id: "1",
      title: "Advanced System Design Interview",
      difficulty: "ADVANCED",
      score: 45,
      startedAt: new Date("2024-03-15T10:00:00"),
      endedAt: new Date("2024-03-15T11:00:00"),
      technologies: [
        { name: "System Design" },
        { name: "Microservices" },
        { name: "Distributed Systems" },
      ],
    },
    {
      id: "2",
      title: "Full Stack Development Interview",
      difficulty: "INTERMEDIATE",
      score: 52,
      startedAt: new Date("2024-03-10T14:30:00"),
      endedAt: new Date("2024-03-10T15:45:00"),
      technologies: [
        { name: "React" },
        { name: "Node.js" },
        { name: "MongoDB" },
      ],
    },
    {
      id: "3",
      title: "Cloud Architecture Interview",
      difficulty: "ADVANCED",
      score: 48,
      startedAt: new Date("2024-03-05T09:15:00"),
      endedAt: new Date("2024-03-05T10:30:00"),
      technologies: [
        { name: "AWS" },
        { name: "Kubernetes" },
        { name: "DevOps" },
      ],
    },
    {
      id: "4",
      title: "Data Structures & Algorithms",
      difficulty: "ADVANCED",
      score: 42,
      startedAt: new Date("2024-03-01T13:00:00"),
      endedAt: new Date("2024-03-01T14:15:00"),
      technologies: [
        { name: "Algorithms" },
        { name: "Data Structures" },
        { name: "Problem Solving" },
      ],
    },
    {
      id: "5",
      title: "Frontend Performance Optimization",
      difficulty: "INTERMEDIATE",
      score: 55,
      startedAt: new Date("2024-02-28T11:30:00"),
      endedAt: new Date("2024-02-28T12:45:00"),
      technologies: [
        { name: "React" },
        { name: "Performance" },
        { name: "Web Vitals" },
      ],
    },
  ];

  // Sort interviews by score (lowest first)
  const sortedInterviews = [...interviews].sort((a, b) => a.score - b.score);
  
  // Show only 3 interviews by default, or all if showAll is true
  const displayInterviews = showAll ? sortedInterviews : sortedInterviews.slice(0, 3);

  const getDifficultyColor = (difficulty: Difficulty) => {
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
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Interviews Needing Improvement
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {displayInterviews.map((interview) => (
            <div
              key={interview.id}
              className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-small font-medium text-foreground">
                      {interview.title}
                    </h3>
                    <span
                      className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(
                        interview.difficulty
                      )}`}
                    >
                      {interview.difficulty.charAt(0) +
                        interview.difficulty.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-tiny text-foreground/70">
                      {format(interview.startedAt, "MMM d, yyyy h:mm a")}
                    </p>
                    <div className="flex items-center gap-1 text-tiny text-foreground/70">
                      <Clock size={12} />
                      <span>
                        {formatDistanceStrict(interview.endedAt, interview.startedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(
                    interview.score
                  )} text-white font-medium text-tiny`}
                >
                  Score: {interview.score}% - {getScoreText(interview.score)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {interview.technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center gap-2 bg-default-100 dark:bg-default-50/50 px-3 py-1.5 rounded-full"
                    >
                      <span className="text-tiny font-medium text-foreground">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link
                  href={`/interviews/${interview.id}/retry`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-small bg-foreground/5 text-foreground/80 font-medium text-tiny transition-colors hover:bg-foreground/10"
                >
                  <RotateCcw size={14} />
                  <span>Re-attempt</span>
                </Link>
              </div>
            </div>
          ))}
          
          {sortedInterviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-tiny font-medium text-foreground/70 hover:text-foreground transition-colors rounded-medium hover:bg-hover/40"
            >
              {showAll ? 'Show Less' : `Show ${sortedInterviews.length - 3} More`}
            </button>
          )}
        </div>
      </CardBody>
    </Card>
  );
} 