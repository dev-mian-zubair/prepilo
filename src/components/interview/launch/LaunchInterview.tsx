"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useInterview } from "@/hooks/useInterview";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { InterviewAgent } from "../agent";
import SessionList from "./SessionList";
import InterviewDetails from "./InterviewDetails";
import { InterviewLauncherProvider, useInterviewLauncher } from "@/contexts/InterviewLauncherContext";


interface LaunchInterviewProps {
  interviewId: string;
  onClose: () => void;
}

const LaunchInterviewContent = () => {
  const {
    error,
    activeSession,
    showInterviewDetails,
    handleClose,
    interview,
    sessions,
    handleResume,
    handleReattempt,
    handleCreateSession,
    handleStartInterview,
  } = useInterviewLauncher();

  // Show error state if there's an error
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">{error}</div>
      </div>
    );
  }

  // Use the activeSession state variable directly
  if (activeSession) {
    return (
      <InterviewAgent
        interview={interview}
      />
    );
  }

  // Show interview details if no sessions exist or when creating a new attempt
  if (showInterviewDetails) {
    return (
      <div className="fixed inset-0 bg-gray-900 p-6 overflow-y-auto">
        <InterviewDetails
          interview={interview}
          onCreateSession={handleCreateSession}
          onStartInterview={handleStartInterview}
          onClose={handleClose}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900">
      <SessionList
        sessions={sessions}
        onResume={handleResume}
        onReattempt={handleReattempt}
        interviewId={interview.id}
        interview={interview}
        onClose={handleClose}
      />
    </div>
  );
};

const LaunchInterview = ({ interviewId, onClose }: LaunchInterviewProps) => {
  const router = useRouter();
  const { interview, isLoading: isInterviewLoading, error: interviewError } = useInterview(interviewId);
  const { sessions, isLoading: isSessionLoading, error: sessionError } = useInterviewSession(interviewId);

  // Debug loading states and interviewId
  useEffect(() => {
    console.log('Interview ID:', interviewId);
    console.log('Loading states:', { isInterviewLoading, isSessionLoading });
    console.log('Data:', { interview, sessions });
    console.log('Errors:', { interviewError, sessionError });
  }, [interviewId, isInterviewLoading, isSessionLoading, interview, sessions, interviewError, sessionError]);

  // Show loading state only when either interview or sessions are loading
  if (isInterviewLoading || isSessionLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (interviewError || sessionError) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">{interviewError || sessionError}</div>
      </div>
    );
  }

  // Show nothing if interview is not found
  if (!interview) {
    return null;
  }

  return (
    <InterviewLauncherProvider
      interview={interview}
      sessions={sessions || []}
      onClose={onClose}
    >
      <LaunchInterviewContent />
    </InterviewLauncherProvider>
  );
};

export default LaunchInterview;
