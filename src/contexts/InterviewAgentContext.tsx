import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Session } from "@/types/session.types";
import { SidebarType } from "@/types/interview";
import { CallStatus } from "@/enums";
import { handleInProgressSession, handlePauseSession, handleResumeSession, getSessionTranscript, generateFeedback } from "@/actions/interview-session";
import { useVapiCall } from "@/hooks/useVapiCall";
import { Interview } from "@/types/interview";
import { resumingInterviewer } from "@/helpers/agent.helper";
import { transcriptToMessages } from "@/helpers/transcript";

interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

interface InterviewAgentContextType {
  // States
  sidebarType: SidebarType;
  error: string | null;
  pauseError: string | null;
  endCallError: string | null;
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
  showEndCallModal: boolean;

  // Actions
  setSidebarType: (type: SidebarType) => void;
  toggleVideo: () => void;
  handleLeaveCall: () => Promise<void>;
  handleFinalClose: () => Promise<void>;
  startCall: (params: { interviewer: any; variables: any }) => Promise<void>;
  setError: (error: string | null) => void;
  setPauseError: (error: string | null) => void;
  setEndCallError: (error: string | null) => void;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  generateFeedback: () => Promise<void>;
  setShowEndCallModal: (show: boolean) => void;
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
  const [pauseError, setPauseError] = useState<string | null>(null);
  const [endCallError, setEndCallError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [storedMessages, setStoredMessages] = useState<Message[]>([]);
  const sidebarUpdateRef = useRef(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);

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
        const transcriptMessages = transcriptToMessages(session.transcript);
        
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
      setPauseError(null);
      
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
      originalHandleLeaveCall();
    } catch (err) {
      console.error("Failed to pause session:", err);
      setPauseError("Failed to pause session. Please try again.");
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
    try {
      setIsProcessing(true);
      setEndCallError(null);
      setShowEndCallModal(true);
      
      // End the VAPI call
      originalHandleLeaveCall();

      // If paused, just return without further processing
      if (isPaused) {
        return;
      }
      
      // Format transcript only if we have messages
      const transcript = messages.length > 0
        ? messages
            .filter((msg: Message) => msg.role === 'user' || msg.role === 'assistant')
            .map((msg: Message) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n')
        : '';

      const result = await handleInProgressSession(session.id, "User ended the call. Session will be evaluated for completion.", transcript);
      console.log("result", result);
      if (result.success) {
        if (!result.feedback) {
          throw new Error('No feedback was generated');
        }
        setFeedback(result.feedback);
      } else {
        setEndCallError(result.error || "Failed to handle session error. Please try again.");
      }
    } catch (err) {
      console.error("Failed to handle session error:", err);
      setEndCallError("Failed to handle session error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [session, messages, originalHandleLeaveCall, isPaused, showEndCallModal]);

  const handleFinalClose = useCallback(async () => {
    setShowEndCallModal(false);
    setIsPaused(false);
    onClose();
  }, [onClose, showEndCallModal, isPaused]);

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
    pauseError,
    endCallError,
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
    showEndCallModal,

    // Actions
    setSidebarType: handleSidebarTypeChange,
    toggleVideo,
    handleLeaveCall,
    handleFinalClose,
    startCall,
    setError,
    setPauseError,
    setEndCallError,
    pauseSession,
    resumeSession,
    generateFeedback: handleGenerateFeedback,
    setShowEndCallModal,
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