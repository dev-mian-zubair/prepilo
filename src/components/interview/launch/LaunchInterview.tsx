"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Clock, Rocket } from "lucide-react";

import Agent from "../Agent";

// Define types (reused from GenerateInterviewManually)
enum FocusArea {
  TECHNICAL = "TECHNICAL",
  SYSTEM_DESIGN = "SYSTEM_DESIGN",
  BEHAVIORAL = "BEHAVIORAL",
  COMMUNICATION = "COMMUNICATION",
  PROBLEM_SOLVING = "PROBLEM_SOLVING",
}

type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

interface Interview {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologies: string[];
  description?: string;
}

interface FocusAreaOption {
  key: FocusArea;
  label: string;
  emoji: string;
}

interface TechnologyOption {
  key: string;
  label: string;
  emoji: string;
}

interface DifficultyOption {
  key: DifficultyLevel;
  label: string;
  emoji: string;
}

const focusAreaOptions: FocusAreaOption[] = [
  { key: FocusArea.TECHNICAL, label: "Technical Skills", emoji: "💻" },
  { key: FocusArea.SYSTEM_DESIGN, label: "System Design", emoji: "🏗️" },
  { key: FocusArea.BEHAVIORAL, label: "Behavioral Skills", emoji: "🤝" },
  { key: FocusArea.COMMUNICATION, label: "Communication Skills", emoji: "💬" },
  { key: FocusArea.PROBLEM_SOLVING, label: "Problem Solving", emoji: "🧩" },
];

const technologyOptions: TechnologyOption[] = [
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

const difficultyOptions: DifficultyOption[] = [
  { key: "Beginner", label: "Beginner", emoji: "🌱" },
  { key: "Intermediate", label: "Intermediate", emoji: "🚀" },
  { key: "Advanced", label: "Advanced", emoji: "🧠" },
];

interface LaunchInterviewProps {
  interview: Interview;
  onClose: () => void;
}

const LaunchInterview: React.FC<LaunchInterviewProps> = ({
  interview,
  onClose,
}) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel | null>("Beginner");
  const [launchInterview, setLaunchInterview] = useState(false);

  const getFocusAreaLabel = (area: FocusArea) => {
    const option = focusAreaOptions.find((opt) => opt.key === area);

    return option
      ? { label: option.label, emoji: option.emoji }
      : { label: area.replace("_", " "), emoji: "🌟" };
  };

  const getTechEmoji = (tech: string) => {
    const option = technologyOptions.find((opt) => opt.key === tech);

    return option ? option.emoji : "🌟";
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      setLaunchInterview(true);
    } catch (error) {
      console.error("Failed to launch interview:", error);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <>
      {launchInterview ? (
        <div className="animate-fade-in transition-opacity duration-300 ease-out w-full">
          <Agent onClose={onClose} />
        </div>
      ) : (
        <Card className="group border border-divider bg-transparent rounded-md transition-all duration-200 w-full max-w-3xl mx-auto mt-10 shadow-none hover:shadow-sm hover:scale-[1.01]">
          <CardBody className="p-4 flex flex-col gap-4">
            {/* Title */}
            <h2 className="text-xl font-bold text-center line-clamp-2">
              {interview.title}
            </h2>

            {/* Description (if available) */}
            {interview.description && (
              <p className="text-sm text-foreground/70 text-center line-clamp-2">
                {interview.description}
              </p>
            )}

            {/* Details */}
            <div className="flex flex-col gap-4">
              {/* Duration */}
              <div>
                <p className="text-tiny text-foreground/70 mb-2">Duration</p>
                <div className="flex items-center gap-2">
                  <Clock className="text-foreground/70" size={14} />
                  <span className="text-sm">{interview.duration} Min</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <p className="text-tiny text-foreground/70 mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-3">
                  {interview.focusAreas.map((area) => {
                    const { label, emoji } = getFocusAreaLabel(area);

                    return (
                      <Chip
                        key={area}
                        className="hover:scale-105 transition-all duration-200"
                        color="default"
                        radius="md"
                        size="sm"
                        startContent={<span aria-hidden="true">{emoji}</span>}
                        variant="bordered"
                      >
                        {label}
                      </Chip>
                    );
                  })}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <p className="text-tiny text-foreground/70 mb-2">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-3">
                  {interview.technologies.map((tech) => (
                    <Chip
                      key={tech}
                      className="hover:scale-105 transition-all duration-200"
                      color="default"
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
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <p className="text-tiny text-foreground/70 mb-2">
                  Difficulty Level
                </p>
                <div className="flex flex-wrap gap-3">
                  {difficultyOptions.map(({ key, label, emoji }) => (
                    <Chip
                      key={key}
                      className="hover:scale-105 transition-all duration-200 cursor-pointer"
                      color={selectedDifficulty === key ? "primary" : "default"}
                      radius="md"
                      size="sm"
                      startContent={<span aria-hidden="true">{emoji}</span>}
                      variant={
                        selectedDifficulty === key ? "solid" : "bordered"
                      }
                      onClick={() => handleDifficultySelect(key)}
                    >
                      {label}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                className="rounded-md border-divider hover:bg-default-100"
                isDisabled={isLaunching}
                radius="md"
                size="sm"
                variant="bordered"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="rounded-md"
                color="primary"
                endContent={<Rocket className="w-4 h-4" />}
                isLoading={isLaunching}
                radius="md"
                size="sm"
                onPress={handleLaunch}
              >
                {isLaunching ? "Launching..." : "Launch Interview"}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default LaunchInterview;
