"use client";
import React, { useState } from "react";
import { useDisclosure } from "@heroui/modal";

import InterviewGridCard from "./InterviewGridCard";

import { InterviewListType } from "@/types/interview";
import InterviewLauncherModal from "@/components/modals/InterviewLauncherModal";

export default function InterviewGrid({
  interviews,
}: {
  interviews: InterviewListType[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedInterview, setSelectedInterview] =
    useState<InterviewListType | null>(null);

  const handleCardClick = (interview: InterviewListType) => {
    setSelectedInterview(interview);
    onOpen();
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    interview: InterviewListType,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(interview);
      onOpen();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
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

      <InterviewLauncherModal
        isOpen={isOpen}
        onClose={onClose}
        interview={selectedInterview}
      />
    </>
  );
}
