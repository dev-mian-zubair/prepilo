"use client";
import React, { useState } from "react";
import { interviews } from "@/data/interviews";
import InterviewGridCard from "./InterviewGridCard";
import { Interview } from "@/types/interview";

export default function InterviewGrid() {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );

  const handleCardClick = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    interview: Interview,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(interview);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          aria-label={`Open ${interview.title} interview details`}
          className="cursor-pointer outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 rounded-large"
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick(interview)}
          onKeyDown={(e) => handleCardKeyDown(e, interview)}
        >
          <InterviewGridCard interview={interview} />
        </div>
      ))}
    </div>
  );
}