import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Clock } from "lucide-react";
import React from "react";
import { format } from "date-fns";

import { Interview } from "@/types/interview";
import { mockInterviews } from "@/data/mockInterviews";

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard = ({ interview }: InterviewCardProps) => {
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
    <Card
      className="border bg-background shadow-sm rounded-large hover:shadow-none hover:-translate-y-1 transition-all duration-300 h-full"
      radius="none"
    >
      <CardBody className="p-6 flex flex-col gap-4">
        {/* Title and Score */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold line-clamp-2">
            {interview.title}
          </h2>
          <div className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(interview.overallScore)} text-white font-medium text-tiny transition-all duration-300`}>
            Score: {interview.overallScore}% - {getScoreText(interview.overallScore)}
          </div>
        </div>

        {/* Difficulty and Status */}
        <div className="flex items-center gap-2">
          <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(interview.difficulty)}`}>
            {interview.difficulty.charAt(0) + interview.difficulty.slice(1).toLowerCase()}
          </span>
          <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getStatusColor(interview.status)}`}>
            {interview.status === "COMPLETED" ? "Completed" : "Left in Mid"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm line-clamp-2">{interview.description}</p>

        {/* Technologies */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-1">
            <span className="text-tiny font-medium text-foreground/70">Technologies:</span>
            {interview.technologies.map((tech) => (
              <Chip key={tech} radius="full" size="sm">
                {tech}
              </Chip>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-1">
            <span className="text-tiny font-medium text-foreground/70">Focus Areas:</span>
            {interview.focusAreas.map((area) => (
              <Chip
                key={area}
                className="bg-background text-tiny"
                radius="full"
                size="sm"
              >
                {area.replace("_", " ")}
              </Chip>
            ))}
          </div>
        </div>

        {/* Duration and Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{interview.duration} minutes</span>
          </div>
          <span>{format(interview.startedAt, "MMM d, yyyy h:mm a")}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default function InterviewGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockInterviews.map((interview) => (
        <InterviewCard key={interview.id} interview={interview} />
      ))}
    </div>
  );
}