"use client";
import React from "react";

import Agent from "../Agent";

interface GenerateInterviewByAgentProps {
  onClose: () => void;
  onGenerate: (interview: any) => void;
}

const GenerateInterviewByAgent = ({
  onClose,
  onGenerate,
}: GenerateInterviewByAgentProps) => {
  return <Agent meetingType="generate" onClose={onClose} />;
};

export default GenerateInterviewByAgent;
