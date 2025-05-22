"use client";
import React from "react";
import { GenerateAgent } from "../agent";

interface GenerateInterviewByAgentProps {
  onClose: () => void;
}

const GenerateInterviewByAgent = ({
  onClose,
}: GenerateInterviewByAgentProps) => {
  return <GenerateAgent onClose={onClose} />;
};

export default GenerateInterviewByAgent;
