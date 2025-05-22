"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useInterview } from "@/hooks/useInterview";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { InterviewAgent } from "../agent";
import SessionList from "./SessionList";
import InterviewDetails from "./InterviewDetails";
import { createSession } from "@/actions/interview-session";
import { Difficulty } from "@prisma/client";
import { Session } from "@/types/session.types";
import { InterviewAgentProvider } from "@/contexts/InterviewAgentContext";

interface LaunchInterviewProps {
  interviewId: string;
  onClose: () => void;
}

const LaunchInterview = ({ interviewId, onClose }: LaunchInterviewProps) => {
  const router = useRouter();
  const { interview, isLoading: isInterviewLoading, error: interviewError } = useInterview(interviewId);
  const { sessions, isLoading: isSessionLoading, error: sessionError } = useInterviewSession(interviewId);
  const [error, setError] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  // Debug loading states and interviewId
  useEffect(() => {
    console.log('Interview ID:', interviewId);
    console.log('Loading states:', { isInterviewLoading, isSessionLoading });
    console.log('Data:', { interview, sessions });
    console.log('Errors:', { interviewError, sessionError });
  }, [interviewId, isInterviewLoading, isSessionLoading, interview, sessions, interviewError, sessionError]);

  useEffect(() => {
    if (!isInterviewLoading) {
      if (!interview) {
        setError(interviewError || "Interview not found");
      } else if (interviewError) {
        setError(interviewError);
      }
    }
  }, [isInterviewLoading, interview, interviewError]);

  useEffect(() => {
    if (!isSessionLoading) {
      if (sessions === null) {
        setError(sessionError || "Failed to load sessions");
      } else if (sessionError) {
        setError(sessionError);
      }
    }
  }, [isSessionLoading, sessions, sessionError]);

  const handleResume = (sessionId: string) => {
    const session = sessions?.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      setActiveSessionId(sessionId);
    }
  };

  const handleCreateSession = async (difficulty: Difficulty): Promise<Session> => {
    try {
      setError(null);
      const result = await createSession(interviewId, difficulty);
      if (result.success && result.session) {
        return {
          ...result.session,
          questions: (result.session.questions || []).map(q => ({
            id: q.id,
            text: q.text,
            type: q.type,
            technology: q.technologyId || undefined,
          })),
        };
      } else {
        throw new Error(result.error || "Failed to create new session");
      }
    } catch (err) {
      console.error("Failed to create session:", err);
      throw err;
    }
  };

  const handleStartInterview = (difficulty: Difficulty) => {
    handleCreateSession(difficulty).then(session => {
      setActiveSession(session);
      setActiveSessionId(session.id);
      setShowInterviewDetails(false);
    }).catch(err => {
      setError(err.message);
    });
  };

  const handleReattempt = () => {
    setShowInterviewDetails(true);
  };

  // Show loading state only when either interview or sessions are loading
  if (isInterviewLoading || isSessionLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">{error}</div>
      </div>
    );
  }

  // Show nothing if interview is not found
  if (!interview) {
    return null;
  }

  // Use the activeSession state variable directly
  if (activeSession) {
    return (
      <InterviewAgentProvider session={activeSession} onClose={() => {
        setActiveSession(null);
        setActiveSessionId(null);
      }}>
        <InterviewAgent
          interview={interview}
        />
      </InterviewAgentProvider>
    );
  }

  // Show interview details if no sessions exist or when creating a new attempt
  if (!sessions || sessions.length === 0 || showInterviewDetails) {
    return (
      <div className="fixed inset-0 bg-gray-900 p-6 overflow-y-auto">
        <InterviewDetails
          interview={interview}
          onCreateSession={handleCreateSession}
          onStartInterview={(session) => {
            setActiveSession(session);
            setActiveSessionId(session.id);
            setShowInterviewDetails(false);
          }}
          onClose={showInterviewDetails ? () => setShowInterviewDetails(false) : onClose}
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
        interviewId={interviewId}
        interview={interview}
        onClose={onClose}
      />
    </div>
  );
};

export default LaunchInterview;
