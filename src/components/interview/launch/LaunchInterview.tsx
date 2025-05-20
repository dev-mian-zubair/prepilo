"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Clock, Rocket } from "lucide-react";

import Agent from "../Agent";

import { DifficultyLevel, Interview } from "@/types/interview";
import { FocusArea } from "@/enums";
import {
  difficultyOptions,
  focusAreaOptions,
  technologyOptions,
} from "@/helpers/interview.helper";
import { createSession } from "@/actions/interview-session";
import { Session } from "@/types/session.types";

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
    useState<DifficultyLevel | null>("BEGINNER");
  const [launchInterview, setLaunchInterview] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Session>();

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

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      const response = await createSession(interview.id, selectedDifficulty!);
      if (response.success && response.session) {
        setSessionInfo(response.session as Session);
        setLaunchInterview(true);
      }
    } catch (error) {
      console.error("Failed to launch interview:", error);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <>
      {sessionInfo && launchInterview ? (
        <div className="animate-fade-in transition-opacity duration-300 ease-out w-full">
          <Agent
            interview={interview}
            meetingType="interview"
            session={sessionInfo}
            onClose={onClose}
          />
        </div>
      ) : (
        <Card className="group bg-content1 rounded-xl p-6 transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary/20 w-full max-w-3xl mx-auto">
          <CardBody className="flex flex-col gap-6">
            {/* Title */}
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {interview.title}
              </h2>
              {interview.description && (
                <p className="text-sm text-foreground/60 text-center">
                  {interview.description}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-6">
              {/* Duration */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Clock className="w-6 h-6 text-foreground/60" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-foreground/60">Duration</span>
                  <span className="text-foreground">{interview.duration} Min</span>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-foreground/60">Focus Areas</span>
                  <div className="flex flex-wrap gap-2">
                    {interview.focusAreas.map((area) => {
                      const { label, emoji } = getFocusAreaLabel(area);
                      return (
                        <Chip
                          key={area}
                          className="bg-primary/5 text-foreground/60 hover:bg-primary/10 transition-colors"
                          radius="full"
                          size="sm"
                          startContent={<span>{emoji}</span>}
                        >
                          {label}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-foreground/60">Technologies</span>
                  <div className="flex flex-wrap gap-2">
                    {interview.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        className="bg-primary/5 text-foreground/60 hover:bg-primary/10 transition-colors"
                        radius="full"
                        size="sm"
                        startContent={<span>{getTechEmoji(tech)}</span>}
                      >
                        {tech}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-foreground/60">Difficulty Level</span>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map(({ key, label, emoji }) => (
                      <Chip
                        key={key}
                        className={`transition-all duration-200 cursor-pointer ${
                          selectedDifficulty === key
                            ? "bg-primary text-white"
                            : "bg-primary/5 text-foreground/60 hover:bg-primary/10"
                        }`}
                        radius="full"
                        size="sm"
                        startContent={<span>{emoji}</span>}
                        onClick={() => handleDifficultySelect(key)}
                      >
                        {label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="bordered"
                className="bg-gray-800 hover:bg-gray-700 text-white"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                isLoading={isLaunching}
                endContent={<Rocket className="w-4 h-4" />}
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
