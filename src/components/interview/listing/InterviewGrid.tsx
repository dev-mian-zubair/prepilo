"use client";
import React, { useState } from "react";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";

import InterviewGridCard from "./InterviewGridCard";

import { InterviewListType } from "@/types/interview";
import InterviewLauncherModal from "@/components/modals/InterviewLauncherModal";
import NewInterviewButton from "@/components/header/NewInterviewButton";

const NoInterviewsCTA = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Plus className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No Interviews Yet</h3>
      <p className="text-foreground/60 mb-6 max-w-md">
        Start your interview preparation journey by creating your first interview. Choose from various methods to create questions tailored to your needs.
      </p>
      <NewInterviewButton />
    </div>
  );
};

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

  if (!interviews.length) {
    return <NoInterviewsCTA />;
  }

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
        interview={selectedInterview}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
