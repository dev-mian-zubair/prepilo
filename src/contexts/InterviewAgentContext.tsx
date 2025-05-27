import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Session } from "@/types/session.types";
import { SidebarType } from "@/types/interview";
import { CallStatus } from "@/enums";
import { handleIncompleteSession } from "@/actions/interview-session";
import { useVapiCall } from "@/hooks/useVapiCall";
import { Interview } from "@/types/interview";

interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

interface InterviewAgentContextType {
  // States
  sidebarType: SidebarType;
  // elapsedTime: number; // Commented out
  error: string | null;
  isProcessing: boolean;
  messages: Message[];
  callStatus: CallStatus;
  isVideoOff: boolean;
  isAgentSpeaking: boolean;
  session: Session;
  interview: Interview;

  // Actions
  setSidebarType: (type: SidebarType) => void;
  toggleVideo: () => void;
  handleLeaveCall: () => Promise<void>;
  handleUserLeave: () => Promise<void>;
  handleFinalClose: () => Promise<void>;
  startCall: (params: { interviewer: any; variables: any }) => Promise<void>;
  // setElapsedTime: (time: number | ((prev: number) => number)) => void; // Commented out
  setError: (error: string | null) => void;
}

const InterviewAgentContext = createContext<InterviewAgentContextType | undefined>(undefined);

interface InterviewAgentProviderProps {
  children: React.ReactNode;
  session: Session;
  interview: Interview;
  onClose: () => void;
}

export const InterviewAgentProvider: React.FC<InterviewAgentProviderProps> = ({
  children,
  session,
  interview,
  onClose,
}) => {
  const [sidebarType, setSidebarType] = useState<SidebarType>("conversation");
  // const [elapsedTime, setElapsedTime] = useState(0); // Commented out
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const sidebarUpdateRef = useRef(false);

  const {
    callStatus,
    messages,
    isVideoOff,
    isSpeaking: isAgentSpeaking,
    toggleVideo,
    handleLeaveCall: originalHandleLeaveCall,
    startCall,
  } = useVapiCall();

  const handleLeaveCall = useCallback(async () => {
    await originalHandleLeaveCall();
  }, [originalHandleLeaveCall]);

  const handleFinalClose = useCallback(async () => {
    await handleLeaveCall();
    onClose();
  }, [handleLeaveCall, onClose]);

  const handleUserLeave = useCallback(async () => {
    try {
      setIsProcessing(true);
      await handleLeaveCall();
      
      const transcript = messages
        .filter((msg: Message) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg: Message) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      const result = await handleIncompleteSession(session.id, "User ended the call. Session will be evaluated for completion.", transcript);
      if (result.success && result.elapsedMinutes !== undefined && result.sessionDuration !== undefined && result.completionPercentage !== undefined) {
        const message = result.isComplete 
          ? `Session completed with feedback generated. (${result.elapsedMinutes.toFixed(1)}/${result.sessionDuration} minutes)`
          : `Session marked as incomplete (${result.elapsedMinutes.toFixed(1)}/${result.sessionDuration} minutes, ${result.completionPercentage.toFixed(1)}% complete).`;
        setError(message);
      } else {
        setError(result.error || "Failed to handle session error. Please try again.");
      }
    } catch (err) {
      console.error("Failed to handle session error:", err);
      setError("Failed to handle session error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [session, messages, handleLeaveCall]);

  const handleSidebarTypeChange = useCallback((type: SidebarType) => {
    if (sidebarUpdateRef.current) return;
    sidebarUpdateRef.current = true;
    setSidebarType(type);
    // Reset the ref after a short delay to allow for state updates
    setTimeout(() => {
      sidebarUpdateRef.current = false;
    }, 100);
  }, []);

  const value = {
    // States
    sidebarType,
    // elapsedTime, // Commented out
    error,
    isProcessing,
    messages,
    callStatus,
    isVideoOff,
    isAgentSpeaking,
    session,
    interview,

    // Actions
    setSidebarType: handleSidebarTypeChange,
    toggleVideo,
    handleLeaveCall,
    handleUserLeave,
    handleFinalClose,
    startCall,
    // setElapsedTime, // Commented out
    setError,
  };

  return (
    <InterviewAgentContext.Provider value={value}>
      {children}
    </InterviewAgentContext.Provider>
  );
};

export const useInterviewAgent = () => {
  const context = useContext(InterviewAgentContext);
  if (context === undefined) {
    throw new Error('useInterviewAgent must be used within an InterviewAgentProvider');
  }
  return context;
}; 