"use client";
import React from "react";
import { GenerateAgent } from "../agent";
import { InterviewAgentProvider } from "@/contexts/InterviewAgentContext";
import { Session } from "@/types/session.types";
import { Interview } from "@/types/interview";
import { SessionStatus } from "@prisma/client";

interface GenerateInterviewByAgentProps {
  onClose: () => void;
}

const GenerateInterviewByAgent = ({
  onClose,
}: GenerateInterviewByAgentProps) => {
  // Create mock session and interview for the generate agent
  const mockSession: Session = {
    id: "generate-session",
    questions: [],
    startedAt: new Date(),
    status: SessionStatus.IN_PROGRESS,
    version: {
      difficulty: "BEGINNER",
      interview: {
        title: "Generate Interview",
        focusAreas: [],
        duration: 30
      }
    }
  };

  const mockInterview: Interview = {
    id: "generate-interview",
    title: "Generate Interview",
    description: "Generate a new interview",
    duration: 30,
    focusAreas: [],
    technologies: []
  };

  return (
    <InterviewAgentProvider
      session={mockSession}
      interview={mockInterview}
      onClose={onClose}
    >
      <GenerateAgent onClose={onClose} />
    </InterviewAgentProvider>
  );
};

export default GenerateInterviewByAgent;
