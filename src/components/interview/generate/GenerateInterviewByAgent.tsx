"use client";
import React, { useEffect } from "react";

import Agent from "../Agent";

import { vapi } from "@/lib/vapi.sdk";
import { useAuth } from "@/providers/AuthProvider";

interface GenerateInterviewByAgentProps {
  onClose: () => void;
}

const GenerateInterviewByAgent = ({
  onClose,
}: GenerateInterviewByAgentProps) => {
  const { user } = useAuth();

  const initializeCall = async () => {
    try {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: user.user_metadata.name,
          userid: user.id,
        },
      });
    } catch (error) {
      console.error("Error starting the call:", error);
    }
  };

  useEffect(() => {
    initializeCall();
  }, []);

  return <Agent onClose={onClose} />;
};

export default GenerateInterviewByAgent;
