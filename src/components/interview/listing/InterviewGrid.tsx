"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import InterviewCard from "./InterviewCard";
import { Interview } from "@/types/interview";
// import { mockInterviews } from "@/data/mockInterviews";

const interviews: Interview[] = [
  {
    id: "1",
    title: "Full Stack Developer Interview",
    description:
      "A comprehensive mock interview for full stack roles, covering front-end, back-end, and database skills.",
    technologies: ["React", "Node.js", "PostgreSQL"],
    duration: 45,
    focusAreas: ["TECHNICAL", "COMMUNICATION", "PROBLEM_SOLVING"],
    versions: [
      { difficulty: "BEGINNER" },
      { difficulty: "INTERMEDIATE" },
      { difficulty: "ADVANCED" },
    ],
    participants: [
      {
        user: "Alice Smith",
        score: 85,
        avatar: "https://via.placeholder.com/24x24.png?text=AS",
      },
      {
        user: "Bob Johnson",
        score: 92,
        avatar: "https://via.placeholder.com/24x24.png?text=BJ",
      },
      {
        user: "Carol White",
        score: 78,
        avatar: "https://via.placeholder.com/24x24.png?text=CW",
      },
    ],
  },
  {
    id: "2",
    title: "Frontend Engineering Challenge",
    description:
      "Focus on UI/UX, browser performance, and JavaScript problem-solving.",
    technologies: ["HTML", "CSS", "JavaScript"],
    duration: 30,
    focusAreas: ["TECHNICAL", "BEHAVIORAL"],
    versions: [{ difficulty: "INTERMEDIATE" }, { difficulty: "ADVANCED" }],
    participants: [
      {
        user: "David Brown",
        score: 88,
        avatar: "https://via.placeholder.com/24x24.png?text=DB",
      },
      {
        user: "Emma Green",
        score: 90,
        avatar: "https://via.placeholder.com/24x24.png?text=EG",
      },
    ],
  },
];

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
              <InterviewCard interview={interview} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default InterviewGrid;
