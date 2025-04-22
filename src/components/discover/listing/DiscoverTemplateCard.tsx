import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { ExternalLinkIcon } from "lucide-react";
import React from "react";

import { Template } from "@/types/template";

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

interface DiscoverCardProps {
  template: Template;
}

export default function DiscoverTemplateCard({ template }: DiscoverCardProps) {
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

  return (
    <Card className="group border border-divider bg-transparent rounded-md transition-all duration-200 h-full shadow-none hover:shadow-sm hover:scale-[1.01]">
      <CardBody className="p-4 flex flex-col gap-4">
        {/* Attempted by and Try Now */}
        <div className="flex justify-between items-center">
          {template.participants && template.participants.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Attempted by
              </p>
              <div className="flex items-center -space-x-2">
                {template.participants
                  .slice(0, 3)
                  .map((participant, index) => (
                    <Avatar
                      key={index}
                      className="border-2 border-background hover:scale-110 transition-all duration-200"
                      name={participant.user}
                      size="sm"
                      src={participant.avatar}
                    />
                  ))}
                {template.participants.length > 3 && (
                  <span className="text-sm text-muted-foreground ml-3">
                    +{template.participants.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Hidden until hover */}
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

        {/* Title */}
        <h2 className="text-xl font-bold line-clamp-2">{template.title}</h2>

        {/* Description */}
        <p className="text-sm text-foreground line-clamp-2">
          {template.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-3">
          {template.technologies.map((tech) => (
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
        </div>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-3">
          {template.focusAreas.map((area) => {
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
        </div>
      </CardBody>
    </Card>
  );
}
