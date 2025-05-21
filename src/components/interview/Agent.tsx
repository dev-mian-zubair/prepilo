import React, { useCallback, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Webcam from "react-webcam";

import MeetingControls from "./MeetingControls";
import ActionSidebar from "./ActionSidebar";
import AgentCard from "@/components/call/AgentCard";

import { useVapiCall } from "@/hooks/useVapiCall";
import { MeetingType, SidebarType } from "@/types/interview";
import { Session } from "@/types/session.types";
import { useAuth } from "@/providers/AuthProvider";
import { interviewer } from "@/helpers/agent.helper";
import { CallStatus } from "@/enums";
import { handleIncompleteSession, saveSessionTranscript, pauseSession, resumeSession } from "@/actions/interview-session";
import "@/styles/scrollbar.css";

interface AgentProps {
  onClose: () => void;
  interview?: any;
  session?: Session;
  meetingType?: MeetingType;
}

const Agent = ({ onClose, interview, session, meetingType }: AgentProps) => {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const {
    callStatus,
    messages,
    isVideoOff,
    isSpeaking: isAgentSpeaking,
    toggleVideo,
    handleLeaveCall,
    startCall,
    restoreMessages,
  } = useVapiCall();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>("conversation");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  // Timer effect
  useEffect(() => {
    if (callStatus === 'ACTIVE') {
      // Start timer when call becomes active
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      // Clear timer when call is not active
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Only reset timer when component is unmounting
      if (callStatus === 'FINISHED' && !session) {
        setElapsedTime(0);
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus, session]);

  const handleError = async (error: string) => {
    try {
      if (session) {
        // Get the transcript from messages
        const transcript = messages
          .filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join('\n\n');

        // First save the transcript
        const saveResult = await saveSessionTranscript(session.id, transcript);
        if (!saveResult?.success) {
          console.error("Failed to save transcript:", saveResult?.error);
          setError("Failed to save session transcript. Please try again.");
          return;
        }

        // Then handle the incomplete session
        const result = await handleIncompleteSession(session.id, error, transcript);
        if (!result?.success) {
          console.error("Failed to handle session:", result?.error);
          setError("Failed to handle session. Please try again.");
          return;
        }

        if (result.elapsedMinutes !== undefined && 
            result.sessionDuration !== undefined && 
            result.completionPercentage !== undefined) {
          const message = result.isComplete 
            ? `Session completed with feedback generated. (${result.elapsedMinutes.toFixed(1)}/${result.sessionDuration} minutes)`
            : `Session marked as incomplete (${result.elapsedMinutes.toFixed(1)}/${result.sessionDuration} minutes, ${result.completionPercentage.toFixed(1)}% complete).`;
          setError(message);
        } else {
          setError("Session status updated but completion details are missing.");
        }
      } else {
        setError(error);
      }
    } catch (err) {
      console.error("Failed to handle session error:", err);
      setError("Failed to handle session error. Please try again.");
    }
  };

  useEffect(() => {
    const start = async () => {
      try {
        setError(null);
        if (meetingType === "generate") {
          const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
          if (!workflowId) {
            throw new Error("Workflow ID is not configured");
          }
          await startCall({
            workflowId,
            variables: {
              username: user?.user_metadata?.name || "User",
              userid: user?.id || "anonymous",
            },
          });
        } else if (meetingType === "interview" && session) {
          // Restore messages if session has a transcript
          if (session.transcript) {
            const savedMessages = session.transcript
              .split('\n\n')
              .map((msg: string) => {
                const [role, content] = msg.split(': ');
                return {
                  role: role.toLowerCase() as 'user' | 'assistant',
                  content: content || ''
                };
              });
            restoreMessages(savedMessages);
          }

          const formattedQuestions = session.questions
            ?.map((question) => `- ${question.text}`)
            .join("\n") || '';

          await startCall({
            interviewer,
            variables: {
              questions: formattedQuestions,
            },
          });
        }
      } catch (err) {
        console.error("Failed to start call:", err);
        handleError("Failed to start the call. Please try again.");
      }
    };

    start();

    // Cleanup function
    return () => {
      // Clean up webcam
      if (webcamRef.current) {
        const webcam = webcamRef.current;
        const stream = webcam.stream;
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
        }
      }

      // Force cleanup any remaining media tracks
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
        })
        .catch(() => {
          // Ignore errors as we're just cleaning up
        });
    };
  }, [meetingType, session, user, startCall, restoreMessages]);

  // Handle call status changes
  useEffect(() => {
    if (session && !isPaused) { // Only handle status changes when not paused
      switch (callStatus) {
        case CallStatus.FINISHED:
          // Only handle unexpected call termination
          if (!isProcessing) { // Don't handle if we're already processing an action
            handleError("Call was unexpectedly terminated. Session will be evaluated for completion.");
          }
          break;
        case CallStatus.INACTIVE:
          // Only handle unexpected inactivity
          if (!isProcessing) {
            handleError("Call failed to start. Session will be marked as incomplete.");
          }
          break;
        case CallStatus.CONNECTING:
          // Call is connecting, no action needed
          break;
        case CallStatus.ACTIVE:
          // Call is active, no action needed
          break;
      }
    }
  }, [callStatus, session, isPaused, isProcessing]);

  // Handle final close
  const handleFinalClose = useCallback(async () => {
    await handleLeaveCall();
    onClose();
  }, [handleLeaveCall, onClose]);

  // Handle user leaving the call
  const handleUserLeave = useCallback(async () => {
    if (session) {
      try {
        setIsProcessing(true);
        // Clean up VAPI first
        await handleLeaveCall();
        
        // Get the transcript from messages
        const transcript = messages
          .filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join('\n\n');

        // Save the transcript first
        const saveResult = await saveSessionTranscript(session.id, transcript);
        if (!saveResult.success) {
          throw new Error(saveResult.error || "Failed to save session transcript");
        }

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
    }
  }, [session, messages, handleLeaveCall]);

  // Handle pause session
  const handlePauseSession = useCallback(async () => {
    if (!session) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Get the transcript from messages
      const transcript = messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');

      // Update session status first
      const result = await pauseSession(session.id, transcript);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to pause session");
      }

      // Update UI state
      setIsPaused(true);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop VAPI call after session is paused
      await handleLeaveCall();

    } catch (err) {
      console.error("Failed to pause session:", err);
      setError(err instanceof Error ? err.message : "Failed to pause session. Please try again.");
      setIsPaused(false); // Reset pause state on error
    } finally {
      setIsProcessing(false);
    }
  }, [session, messages, handleLeaveCall]);

  // Handle resume session
  const handleResumeSession = useCallback(async () => {
    if (session) {
      try {
        setIsProcessing(true);
        
        // Update session status
        const result = await resumeSession(session.id);
        if (result.success) {
          setIsPaused(false);
          
          // Restart the VAPI call with context
          const transcript = session.transcript || '';
          const formattedQuestions = session.questions
            ?.map((question) => `- ${question.text}`)
            .join("\n") || '';

          await startCall({
            interviewer,
            variables: {
              questions: formattedQuestions,
              context: `Previous conversation:\n${transcript}\n\nPlease continue the interview from where we left off.`,
            },
          });

          // Calculate elapsed time from session duration
          const elapsedMinutes = session.endedAt 
            ? (session.endedAt.getTime() - session.startedAt.getTime()) / (1000 * 60)
            : 0;
          setElapsedTime(Math.floor(elapsedMinutes * 60));

          // Restart timer from the elapsed time
          timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
          }, 1000);
        } else {
          throw new Error(result.error || "Failed to resume session");
        }
      } catch (err) {
        console.error("Failed to resume session:", err);
        setError("Failed to resume session. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  }, [session, startCall]);

  return (
    <div className="fixed inset-0 bg-gray-900">
      {/* Main Content Area */}
      <div
        className={`h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:pr-[360px]" : "pr-0"
        }`}
      >
        {/* Video Grid */}
        <div className="relative h-full p-2 sm:p-4 grid place-items-center">
          {/* Error Display */}
          {error && (
            <div className="absolute top-4 left-4 right-4 z-[40] bg-red-500 text-white p-4 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={handleFinalClose}
                className="ml-4 px-4 py-2 bg-white text-red-500 rounded hover:bg-red-50 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="absolute top-4 left-4 right-4 z-[40] bg-blue-500 text-white p-4 rounded-lg flex justify-between items-center">
              <span>Processing session...</span>
            </div>
          )}

          {/* Paused Indicator */}
          {isPaused && (
            <div className="absolute top-4 left-4 right-4 z-[40] bg-yellow-500 text-white p-4 rounded-lg flex justify-between items-center">
              <span>Session is paused</span>
              <button
                onClick={handleResumeSession}
                className="ml-4 px-4 py-2 bg-white text-yellow-500 rounded hover:bg-yellow-50 transition-colors"
              >
                Resume
              </button>
            </div>
          )}

          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-gray-800">
            {/* User Video */}
            <div className="w-full h-full">
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
                className="w-full h-full object-cover"
                mirrored={true}
                style={{ display: isVideoOff ? 'none' : 'block' }}
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl text-gray-400">
                      {user?.user_metadata?.name?.[0] || "U"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Agent Video Overlay */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-24 sm:w-32 md:w-48 aspect-video">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full rounded-xl overflow-hidden shadow-lg"
              >
                <AgentCard
                  isSpeaking={isAgentSpeaking}
                  status={callStatus}
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Meeting Controls */}
        <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-4 pb-2 sm:pb-4">
          {!error && !isProcessing && (
          <MeetingControls
            elapsedTime={elapsedTime}
              handleEndCall={handleUserLeave}
            handleSidebarAction={setSidebarType}
            isVideoOff={isVideoOff}
            meetingType={meetingType}
            toggleVideo={toggleVideo}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
              isPaused={isPaused}
              onPause={handlePauseSession}
              onResume={handleResumeSession}
          />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full sm:w-[360px] h-full bg-gray-900 border-l border-gray-800 shadow-xl z-[50] overflow-hidden lg:z-[50]"
          >
            <ActionSidebar
              interview={interview}
              messages={messages}
              type={sidebarType}
              onClose={toggleSidebar}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agent;
