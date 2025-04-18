"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import InterviewCard from "./InterviewCard";
import { Interview } from "@/types/interview";
import { mockInterviews } from "@/data/mockInterviews";

const InterviewGrid = () => {
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
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Available Interviews
        </h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockInterviews.map((interview) => (
            <div
              key={interview.id}
              aria-label={`Open ${interview.title} interview details`}
              className="cursor-pointer outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 rounded-large"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(interview)}
              onKeyDown={(e) => handleCardKeyDown(e, interview)}
            >
              <InterviewCard interview={interview} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default InterviewGrid;
