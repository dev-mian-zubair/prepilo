import React, { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";

import AgentLayout from "./AgentLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { interviewer } from "@/helpers/agent.helper";
import "@/styles/scrollbar.css";
import { Interview } from "@/types/interview";

interface InterviewAgentProps {
  interview: Interview;
}

const InterviewAgent = ({ interview }: InterviewAgentProps) => {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const {
    isSidebarOpen,
    sidebarType,
    elapsedTime,
    error,
    isProcessing,
    messages,
    callStatus,
    isVideoOff,
    isAgentSpeaking,
    toggleSidebar,
    setSidebarType,
    toggleVideo,
    handleUserLeave,
    handleFinalClose,
    startCall,
    setElapsedTime,
    setError,
    session,
  } = useInterviewAgent();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const start = async () => {
      try {
        setError(null);
        const formattedQuestions = session.questions
          .map((question: { text: string }) => `- ${question.text}`)
          .join("\n");
        await startCall({
          interviewer,
          variables: {
            questions: formattedQuestions,
          },
        });
      } catch (err) {
        console.error("Failed to start call:", err);
        setError("Failed to start the call. Please try again.");
      }
    };

    start();

    return () => {
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
  }, [session, startCall, setError]);

  // Timer effect
  useEffect(() => {
    if (callStatus === 'ACTIVE') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (callStatus === 'FINISHED') {
        setElapsedTime(0);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus, setElapsedTime]);

  return (
    <AgentLayout
      webcamRef={webcamRef}
      isVideoOff={isVideoOff}
      isAgentSpeaking={isAgentSpeaking}
      callStatus={callStatus}
      isSidebarOpen={isSidebarOpen}
      sidebarType={sidebarType}
      messages={messages}
      error={error}
      isProcessing={isProcessing}
      meetingType="interview"
      userInitial={user?.user_metadata?.name?.[0] || "U"}
      elapsedTime={elapsedTime}
      session={session}
      interview={interview}
      onClose={handleFinalClose}
      onEndCall={handleUserLeave}
      onSidebarAction={setSidebarType}
      onToggleVideo={toggleVideo}
      onToggleSidebar={toggleSidebar}
    />
  );
};

export default InterviewAgent; 