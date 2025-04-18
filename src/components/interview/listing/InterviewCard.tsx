import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { ExternalLinkIcon } from "lucide-react";
import React from "react";

import { Interview } from "@/types/interview";

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard = ({ interview }: InterviewCardProps) => {
  return (
    <Card
      className="border bg-background shadow-sm rounded-large hover:shadow-none hover:-translate-y-1 transition-all duration-300 h-full"
      radius="none"
    >
      <CardBody className="p-6 flex flex-col gap-4">
        {/* Title */}
        <h2 className="text-xl font-semibold line-clamp-2">
          {interview.title}
        </h2>

        {/* Description */}
        <p className="text-sm line-clamp-2">{interview.description}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {interview.technologies.map((tech) => (
            <Chip key={tech} radius="full" size="sm">
              {tech}
            </Chip>
          ))}
        </div>

        {/* Focus Areas */}
        <div className="flex flex-wrap gap-1">
          {interview.focusAreas.map((area) => (
            <Chip
              key={area}
              className="bg-background text-xs"
              radius="full"
              size="sm"
            >
              {area.replace("_", " ")}
            </Chip>
          ))}
        </div>

        <div className="flex justify-between items-start text-xs text-muted-foreground">
          {/* Participants */}
          {interview.participants && interview.participants.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1 text-muted-foreground">
                Attempted by
              </p>
              <div className="flex items-center -space-x-2">
                {interview.participants
                  .slice(0, 3)
                  .map((participant, index) => (
                    <Avatar
                      key={index}
                      className="border-2 border-background"
                      name={participant.user}
                      size="sm"
                      src={participant.avatar}
                    />
                  ))}
                {interview.participants.length > 3 && (
                  <span className="text-xs text-muted-foreground ml-3">
                    +{interview.participants.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          <span className="group hover:underline cursor-pointer text-xs flex items-center absolute right-4 bottom-8">
            Try Now
            <ExternalLinkIcon className="w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </span>
        </div>
      </CardBody>
    </Card>
  );
};

export default InterviewCard;
