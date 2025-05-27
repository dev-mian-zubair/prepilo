import React, { useCallback, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

import { useVapiCall } from "@/hooks/useVapiCall";
import { useAuth } from "@/providers/AuthProvider";
import "@/styles/scrollbar.css";
import { AgentLayout } from ".";

interface GenerateAgentProps {
  onClose: () => void;
}

const GenerateAgent = ({ onClose }: GenerateAgentProps) => {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const [isPaused, setIsPaused] = useState(false);
  const {
    callStatus,
    messages,
    isVideoOff,
    isSpeaking: isAgentSpeaking,
    toggleVideo,
    handleLeaveCall,
    startCall,
  } = useVapiCall();
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const start = async () => {
      try {
        setError(null);
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
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to start call:", err);
        setError("Failed to start the call. Please try again.");
      }
    };

    start();

    return () => {
      if (webcamRef.current?.stream) {
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [user, startCall, isInitialized]);

  const handleFinalClose = useCallback(() => {
    handleLeaveCall();
    onClose();
  }, [handleLeaveCall, onClose]);

  const handleUserLeave = useCallback(() => {
    handleLeaveCall();
    onClose();
  }, [handleLeaveCall, onClose]);

  const handlePause = useCallback(async () => {
    await handleLeaveCall();
    setIsPaused(true);
  }, [handleLeaveCall]);

  const handleResume = useCallback(async () => {
    await startCall({
      workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
      variables: {
        username: user?.user_metadata?.name || "User",
        userid: user?.id || "anonymous",
      },
    });
    setIsPaused(false);
  }, [startCall, user]);

  return (
    <AgentLayout
      webcamRef={webcamRef}
      isVideoOff={isVideoOff}
      isAgentSpeaking={isAgentSpeaking}
      callStatus={callStatus}
      messages={messages}
      error={error}
      meetingType="generate"
      userInitial={user?.user_metadata?.name?.[0] || "U"}
      onClose={handleFinalClose}
      onEndCall={handleUserLeave}
      onToggleVideo={toggleVideo}
      isPaused={isPaused}
      onPause={handlePause}
      onResume={handleResume}
    />
  );
};

export default GenerateAgent; 