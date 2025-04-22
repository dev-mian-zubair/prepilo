import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { ExternalLinkIcon, Clock, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";

import { Interview } from "@/types/interview";

const technologyOptions = [
  { key: "JavaScript", label: "JavaScript", emoji: "🌐" },
  { key: "Python", label: "Python", emoji: "🐍" },
  { key: "React", label: "React", emoji: "⚛️" },
  { key: "Node.js", label: "Node.js", emoji: "🖥️" },
  { key: "Java", label: "Java", emoji: "☕" },
  { key: "TypeScript", label: "TypeScript", emoji: "📜" },
  { key: "SQL", label: "SQL", emoji: "🗃️" },
  { key: "AWS", label: "AWS", emoji: "☁️" },
  { key: "Docker", label: "Docker", emoji: "🐳" },
  { key: "Kubernetes", label: "Kubernetes", emoji: "☸️" },
];

const focusAreaOptions = [
  { key: "TECHNICAL", label: "Technical Skills", emoji: "💻" },
  { key: "SYSTEM_DESIGN", label: "System Design", emoji: "🏗️" },
  { key: "BEHAVIORAL", label: "Behavioral Skills", emoji: "🤝" },
  { key: "COMMUNICATION", label: "Communication Skills", emoji: "💬" },
  { key: "PROBLEM_SOLVING", label: "Problem Solving", emoji: "🧩" },
];

interface InterviewGridCardProps {
  interview: Interview;
}

export default function InterviewGridCard({ interview }: InterviewGridCardProps) {
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);
  const [showAllFocusAreas, setShowAllFocusAreas] = useState(false);

  const getTechEmoji = (tech: string) => {
    const option = technologyOptions.find((opt) => opt.key === tech);

    return option ? option.emoji : "🌟";
  };

  const getFocusAreaLabel = (area: string) => {
    const option = focusAreaOptions.find((opt) => opt.key === area);

    return option
      ? { label: option.label, emoji: option.emoji }
      : { label: area.replace("_", " "), emoji: "🌟" };
  };

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

  const getScoreColorForCircle = (score: number) => {
    if (score >= 90) return "stroke-success";
    if (score >= 75) return "stroke-warning";
    if (score >= 60) return "stroke-primary";
    return "stroke-danger";
  };

  const displayedTechnologies = showAllTechnologies 
    ? interview.technologies 
    : interview.technologies.slice(0, 3);
  
  const displayedFocusAreas = showAllFocusAreas 
    ? interview.focusAreas 
    : interview.focusAreas.slice(0, 3);

  return (
    <Card className="group border border-divider bg-transparent rounded-md transition-all duration-200 h-full min-h-[400px] shadow-none hover:shadow-sm hover:scale-[1.01]">
      <CardBody className="p-4 flex flex-col gap-4">
        {/* Title and Score */}
        <div className="relative">
          <h2 className="text-xl font-bold line-clamp-2 pr-12">{interview.title}</h2>
          
          {/* Score positioned absolutely in the top right */}
          <div className="absolute top-0 right-0 w-10 h-10">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-default-200/50 dark:stroke-default-500/20"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`${getScoreColorForCircle(interview.overallScore)} transition-all duration-500`}
                strokeWidth="3"
                strokeDasharray={`${(interview.overallScore / 100) * 100} 100`}
                transform="rotate(-90 18 18)"
              />
              {/* Score text */}
              <text
                x="18"
                y="18"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[8px] font-bold fill-foreground"
              >
                {interview.overallScore}%
              </text>
            </svg>
          </div>
        </div>

        {/* Difficulty and Status */}
        <div className="flex flex-wrap gap-2">
          <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(interview.difficulty)}`}>
            {interview.difficulty.charAt(0) + interview.difficulty.slice(1).toLowerCase()}
          </span>
          <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getStatusColor(interview.status)}`}>
            {interview.status === "COMPLETED" ? "Completed" : "Left in Mid"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground line-clamp-2">
          {interview.description}
        </p>

        {/* Technologies */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {displayedTechnologies.map((tech) => (
              <Chip
                key={tech}
                className="hover:scale-105 transition-all duration-200"
                radius="md"
                size="sm"
                startContent={
                  <span aria-hidden="true">{getTechEmoji(tech)}</span>
                }
                variant="bordered"
              >
                {tech}
              </Chip>
            ))}
            {interview.technologies.length > 3 && (
              <Button
                aria-label={showAllTechnologies ? "Show less technologies" : "Show more technologies"}
                className="text-tiny text-primary hover:text-primary-500 p-0 min-w-0 h-auto"
                endContent={showAllTechnologies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                onClick={() => setShowAllTechnologies(!showAllTechnologies)}
                size="sm"
                variant="light"
              >
                {showAllTechnologies ? "Show Less" : `+${interview.technologies.length - 3} More`}
              </Button>
            )}
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {displayedFocusAreas.map((area) => {
              const { label, emoji } = getFocusAreaLabel(area);

              return (
                <Chip
                  key={area}
                  className="hover:scale-105 transition-all duration-200"
                  radius="md"
                  size="sm"
                  startContent={<span aria-hidden="true">{emoji}</span>}
                  variant="bordered"
                >
                  {label}
                </Chip>
              );
            })}
            {interview.focusAreas.length > 3 && (
              <Button
                aria-label={showAllFocusAreas ? "Show less focus areas" : "Show more focus areas"}
                className="text-tiny text-primary hover:text-primary-500 p-0 min-w-0 h-auto"
                endContent={showAllFocusAreas ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                onClick={() => setShowAllFocusAreas(!showAllFocusAreas)}
                size="sm"
                variant="light"
              >
                {showAllFocusAreas ? "Show Less" : `+${interview.focusAreas.length - 3} More`}
              </Button>
            )}
          </div>
        </div>

        {/* Duration, Date and Try Now */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col gap-1 text-tiny text-foreground/70">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{interview.duration} minutes</span>
            </div>
            <span>
              {format(interview.startedAt, "MMM d, yyyy h:mm a")}
            </span>
          </div>
          
          {/* Try Now button */}
          <Button
            aria-label="Try this interview"
            className="bg-teal-400 text-white hover:bg-teal-500 rounded-md transition-all duration-300 transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
            endContent={<ExternalLinkIcon className="w-4 h-4" />}
            radius="md"
            size="sm"
          >
            Try Now
          </Button>
        </div>
      </CardBody>
    </Card>
  );
} 