import React, { createContext, useContext, useState } from "react";
import { Session } from "@/types/session.types";
import { Interview } from "@/types/interview.types";
import { Difficulty } from "@prisma/client";
import { startSession } from "@/actions/interview-session";
import { handleResumeSession } from "@/actions/interview-session";

interface InterviewLauncherContextType {
  // States
  error: string | null;
  isLoading: boolean;
  activeSession: Session | null;
  activeSessionId: string | null;
  showInterviewDetails: boolean;
  interview: Interview;
  sessions: Session[];

  // Actions
  setError: (error: string | null) => void;
  handleResume: (sessionId: string) => void;
  handleCreateSession: (difficulty: Difficulty) => Promise<Session>;
  handleStartInterview: (session: Session) => void;
  handleReattempt: () => void;
  handleClose: () => void;
}

const InterviewLauncherContext = createContext<InterviewLauncherContextType | undefined>(undefined);

interface InterviewLauncherProviderProps {
  children: React.ReactNode;
  interview: Interview;
  sessions: Session[];
  onClose: () => void;
}

export const InterviewLauncherProvider = ({ children, interview, sessions, onClose }: InterviewLauncherProviderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const handleResume = async (sessionId: string) => {
    try {
      const result = await handleResumeSession(sessionId);
      if (result.success && result.session) {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          setActiveSession(session);
          setActiveSessionId(sessionId);
        }
      } else {
        throw new Error(result.error || "Failed to resume session");
      }
    } catch (err) {
      console.error("Failed to resume session:", err);
      setError(err instanceof Error ? err.message : "Failed to resume session");
    }
  };

  const handleCreateSession = async (difficulty: Difficulty): Promise<Session> => {
    try {
      setError(null);
      const result = await startSession(interview.id, difficulty);
      if (result.success && result.session) {
        return {
          ...result.session,
          status: result.session.status as 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED',
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

  const handleStartInterview = (session: Session) => {
    setActiveSession(session);
    setActiveSessionId(session.id);
    setShowInterviewDetails(false);
  };

  const handleReattempt = () => {
    setShowInterviewDetails(true);
  };

  const handleClose = () => {
    if (showInterviewDetails) {
      setShowInterviewDetails(false);
    } else {
      onClose();
    }
  };

  const value = {
    // States
    error,
    isLoading,
    activeSession,
    activeSessionId,
    showInterviewDetails,
    interview,
    sessions,

    // Actions
    setError,
    handleResume,
    handleCreateSession,
    handleStartInterview,
    handleReattempt,
    handleClose,
  };

  return (
    <InterviewLauncherContext.Provider value={value}>
      {children}
    </InterviewLauncherContext.Provider>
  );
};

export const useInterviewLauncher = () => {
  const context = useContext(InterviewLauncherContext);
  if (context === undefined) {
    throw new Error("useInterviewLauncher must be used within an InterviewLauncherProvider");
  }
  return context;
}; 