"use client";
import React from "react";

import Agent from "../Agent";

interface GenerateInterviewByAgentProps {
  onClose: () => void;
}

const GenerateInterviewByAgent = ({
  onClose,
}: GenerateInterviewByAgentProps) => {
  return <Agent meetingType="generate" onClose={onClose} />;
};

export default GenerateInterviewByAgent;
