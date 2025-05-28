import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Session } from "@/types/session.types";
import { SidebarType } from "@/types/interview";
import { CallStatus } from "@/enums";
import { handleIncompleteSession, handlePauseSession, handleResumeSession, getSessionTranscript, generateFeedback } from "@/actions/interview-session";
import { useVapiCall } from "@/hooks/useVapiCall";
import { Interview } from "@/types/interview";
import { interviewer, resumingInterviewer } from "@/helpers/agent.helper";

interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

interface InterviewAgentContextType {
  // States
  sidebarType: SidebarType;
  error: string | null;
  isProcessing: boolean;
  messages: Message[];
  callStatus: CallStatus;
  isVideoOff: boolean;
  isAgentSpeaking: boolean;
  session: Session;
  interview: Interview;
  isPaused: boolean;
  feedback: string | null;
  isGeneratingFeedback: boolean;

  // Actions
  setSidebarType: (type: SidebarType) => void;
  toggleVideo: () => void;
  handleLeaveCall: () => Promise<void>;
  handleUserLeave: () => Promise<void>;
  handleFinalClose: () => Promise<void>;
  startCall: (params: { interviewer: any; variables: any }) => Promise<void>;
  setError: (error: string | null) => void;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  generateFeedback: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [storedMessages, setStoredMessages] = useState<Message[]>([]);
  const sidebarUpdateRef = useRef(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const {
    callStatus,
    messages,
    isVideoOff,
    isSpeaking: isAgentSpeaking,
    toggleVideo,
    handleLeaveCall: originalHandleLeaveCall,
    startCall,
    setMessages,
  } = useVapiCall();

  // Load transcript from session when component mounts or session changes
  const loadSessionTranscript = () => {
    if (session?.transcript) {
      try {
        // Convert transcript to messages format
        const transcriptMessages = session.transcript
          .split('\n\n')
          .map(line => {
            const [role, content] = line.split(': ');
            return {
              role: role.toLowerCase() as 'user' | 'assistant',
              content: content.trim()
            };
          });


        console.log("transcriptMessages", transcriptMessages);
        console.log("session", session);
        
        setMessages(transcriptMessages);
      } catch (err) {
        console.error("Failed to load session transcript:", err);
        setError("Failed to load session transcript");
      }
    }
  };

  useEffect(() => {
    loadSessionTranscript();
  }, [session]);

  const pauseSession = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      // Format transcript
      const transcript = messages
        .filter((msg: Message) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg: Message) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      // Handle pause session state
      const result = await handlePauseSession(session.id, transcript);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Store current messages for UI
      setStoredMessages([...messages]);
      setIsPaused(true);

      // End the call without triggering incomplete session
      await originalHandleLeaveCall();
    } catch (err) {
      console.error("Failed to pause session:", err);
      setError("Failed to pause session. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [messages, originalHandleLeaveCall, session.id]);

  const resumeSession = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Update session state to IN_PROGRESS
      const sessionResult = await handleResumeSession(session.id);
      console.log("sessionResult", sessionResult);
      if (!sessionResult.success) {
        throw new Error(sessionResult.error);
      }

      // Get stored transcript from database
      const result = await getSessionTranscript(session.id);
      if (!result.success || !result.transcript) {
        throw new Error(result.error || 'No transcript found');
      }

      // Format questions for context
      const formattedQuestions = session.questions
        .map((question: { text: string }) => `- ${question.text}`)
        .join("\n");

      // Start new call with previous transcript and questions
      await startCall({
        interviewer: resumingInterviewer,
        variables: {
          questions: formattedQuestions,
          previousTranscript: result.transcript,
        },
      });

      setIsPaused(false);
    } catch (err) {
      console.error("Failed to resume session:", err);
      setError("Failed to resume session. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [session.questions, session.id, startCall]);

  const handleLeaveCall = useCallback(async () => {
    if (isPaused) {
      // If paused, just close without handling incomplete session
      await originalHandleLeaveCall();
      return;
    }

    // Only handle incomplete session if not paused
    try {
      setIsProcessing(true);
      await originalHandleLeaveCall();
      
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
  }, [session, messages, originalHandleLeaveCall, isPaused]);

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

  const handleGenerateFeedback = useCallback(async () => {
    try {
      setIsGeneratingFeedback(true);
      setError(null);

      // Format transcript
      const transcript = messages
        .filter((msg: Message) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg: Message) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      if (!transcript) {
        throw new Error("No conversation transcript available");
      }

      const result = await generateFeedback(session.id, transcript);
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate feedback');
      }

      if (!result.feedback) {
        throw new Error('No feedback was generated');
      }

      setFeedback(result.feedback);
      setSidebarType("feedback");
    } catch (err) {
      console.error("Failed to generate feedback:", err);
      setError(err instanceof Error ? err.message : "Failed to generate feedback. Please try again.");
      setSidebarType("feedback");
    } finally {
      setIsGeneratingFeedback(false);
    }
  }, [messages, session.id, setSidebarType]);

  const value = {
    // States
    sidebarType,
    error,
    isProcessing,
    messages: isPaused ? storedMessages : messages,
    callStatus,
    isVideoOff,
    isAgentSpeaking,
    session,
    interview,
    isPaused,
    feedback,
    isGeneratingFeedback,

    // Actions
    setSidebarType: handleSidebarTypeChange,
    toggleVideo,
    handleLeaveCall,
    handleUserLeave,
    handleFinalClose,
    startCall,
    setError,
    pauseSession,
    resumeSession,
    generateFeedback: handleGenerateFeedback,
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