"use client";
import React, { useState } from "react";
import { useDisclosure } from "@heroui/modal";

import DiscoverTemplateCard from "./DiscoverTemplateCard";

import { Template } from "@/types/template";
import InterviewLauncherModal from "@/components/modals/InterviewLauncherModal";

const templates: Template[] = [
  {
    id: "1",
    title: "Full Stack Developer Interview",
    description:
      "A comprehensive mock interview for full stack roles, covering front-end, back-end, and database skills.",
    technologies: ["React", "Node.js", "PostgreSQL"],
    duration: 45,
    focusAreas: ["TECHNICAL", "COMMUNICATION", "PROBLEM_SOLVING"],
    versions: [
      { difficulty: "BEGINNER" },
      { difficulty: "INTERMEDIATE" },
      { difficulty: "ADVANCED" },
    ],
    participants: [
      {
        user: "Alice Smith",
        score: 85,
        avatar: "https://via.placeholder.com/24x24.png?text=AS",
      },
      {
        user: "Bob Johnson",
        score: 92,
        avatar: "https://via.placeholder.com/24x24.png?text=BJ",
      },
      {
        user: "Carol White",
        score: 78,
        avatar: "https://via.placeholder.com/24x24.png?text=CW",
      },
    ],
  },
  {
    id: "2",
    title: "Frontend Engineering Challenge",
    description:
      "Focus on UI/UX, browser performance, and JavaScript problem-solving.",
    technologies: ["HTML", "CSS", "JavaScript"],
    duration: 30,
    focusAreas: ["TECHNICAL", "BEHAVIORAL"],
    versions: [{ difficulty: "INTERMEDIATE" }, { difficulty: "ADVANCED" }],
    participants: [
      {
        user: "David Brown",
        score: 88,
        avatar: "https://via.placeholder.com/24x24.png?text=DB",
      },
      {
        user: "Emma Green",
        score: 90,
        avatar: "https://via.placeholder.com/24x24.png?text=EG",
      },
    ],
  },
];

export default function DiscoverTemplateGrid() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const handleCardClick = (template: Template) => {
    setSelectedTemplate(template);
    onOpen();
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    template: Template,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(template);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            aria-label={`Open ${template.title} interview details`}
            className="cursor-pointer outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 rounded-large"
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(template)}
            onKeyDown={(e) => handleCardKeyDown(e, template)}
          >
            <DiscoverTemplateCard template={template} />
          </div>
        ))}
      </div>

      <InterviewLauncherModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
