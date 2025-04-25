import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Clock } from "lucide-react";
import React, { useEffect, useRef } from "react";

import { SidebarType } from "@/types/interview";

interface ParticipantsSidebarProps {
  type: SidebarType;
  interview: any;
  messages: any[];
}

const ActionSidebar = ({
  type,
  interview,
  messages,
}: ParticipantsSidebarProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="sidebar transition-transform duration-300 rounded-md mr-4 mt-8 shadow-none bg-default-100">
      <CardHeader className="p-4 border-b border-divider">
        <h2 className="text-sm font-semibold text-foreground">
          {type === "conversation" ? "Conversation" : "Information"}
        </h2>
      </CardHeader>
      <CardBody className="flex-1 overflow-y-auto p-4 space-y-3">
        {type === "info" ? (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold line-clamp-2">
              {interview.title}
            </h2>
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
                  {interview.focusAreas.map((area: string) => {
                    return (
                      <Chip
                        key={area}
                        className="hover:scale-105 transition-all duration-200"
                        color="default"
                        radius="md"
                        size="sm"
                        variant="bordered"
                      >
                        {area}
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
                  {interview.technologies.map((tech: string) => (
                    <Chip
                      key={tech}
                      className="hover:scale-105 transition-all duration-200"
                      color="default"
                      radius="md"
                      size="sm"
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
                <Chip
                  className="hover:scale-105 transition-all duration-200"
                  color="default"
                  radius="md"
                  size="sm"
                  variant="bordered"
                >
                  {interview.difficultyLevel || "Beginner"}
                </Chip>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-sm text-foreground-500">
                Conversation will appear here...
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-xs text-foreground-500 font-semibold">
                    {msg.role}
                  </div>
                  <div className="text-sm text-foreground">{msg.content}</div>
                </div>
              ))
            )}
            {/* Invisible div to mark the bottom of the messages */}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ActionSidebar;
