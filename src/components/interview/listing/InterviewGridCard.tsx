import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { ExternalLinkIcon, Clock, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";

import { DifficultyLevel, InterviewListType } from "@/types/interview";

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
  interview: InterviewListType;
}

export default function InterviewGridCard({
  interview,
}: InterviewGridCardProps) {
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

  const getScoreColorForCircle = (score: number | null) => {
    if (score === null) return "stroke-default-200/50";
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
    <Card className="group border border-divider bg-transparent rounded-md transition-all duration-200 h-full min-h-[350px] shadow-none hover:shadow-sm hover:scale-[1.01]">
      <CardBody className="p-4 flex flex-col gap-2">
        {/*Score circles and Try Now button */}
        <div className="flex justify-start gap-1">
          {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map(
            (difficulty: string) => {
              const score = interview.versions[difficulty as DifficultyLevel];

              return (
                <div key={difficulty} className="flex flex-col items-center">
                  <div className="w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <circle
                        className="stroke-default-200/50 dark:stroke-default-500/20"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="16"
                        strokeWidth="3"
                      />
                      {/* Progress circle */}
                      <circle
                        className={`${getScoreColorForCircle(score)} transition-all duration-500`}
                        cx="18"
                        cy="18"
                        fill="none"
                        r="16"
                        strokeDasharray={`${score ? (score / 100) * 100 : 0} 100`}
                        strokeWidth="3"
                        transform="rotate(-90 18 18)"
                      />
                      {/* Score text */}
                      <text
                        className="text-[8px] font-bold fill-foreground"
                        dominantBaseline="central"
                        textAnchor="middle"
                        x="18"
                        y="18"
                      >
                        {score ? `${score}%` : "-"}
                      </text>
                    </svg>
                  </div>
                  <span className="text-[8px] text-foreground/70">
                    {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                  </span>
                </div>
              );
            },
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold line-clamp-2">{interview.title}</h2>
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
                aria-label={
                  showAllTechnologies
                    ? "Show less technologies"
                    : "Show more technologies"
                }
                className="text-tiny text-primary hover:text-primary-500 p-0 min-w-0 h-auto"
                endContent={
                  showAllTechnologies ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                }
                size="sm"
                variant="light"
                onClick={() => setShowAllTechnologies(!showAllTechnologies)}
              >
                {showAllTechnologies
                  ? "Show Less"
                  : `+${interview.technologies.length - 3} More`}
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
                aria-label={
                  showAllFocusAreas
                    ? "Show less focus areas"
                    : "Show more focus areas"
                }
                className="text-tiny text-primary hover:text-primary-500 p-0 min-w-0 h-auto"
                endContent={
                  showAllFocusAreas ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )
                }
                size="sm"
                variant="light"
                onClick={() => setShowAllFocusAreas(!showAllFocusAreas)}
              >
                {showAllFocusAreas
                  ? "Show Less"
                  : `+${interview.focusAreas.length - 3} More`}
              </Button>
            )}
          </div>
        </div>

        {/* Duration, Date and Try Now */}
        <div className="relative flex items-center mt-auto">
          <div className="flex items-center gap-2 text-tiny text-foreground/70">
            <Clock size={12} />
            <span>{interview.duration} minutes</span>
            <span>•</span>
            <span>{format(interview.createdAt, "MMM d, yyyy h:mm a")}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
