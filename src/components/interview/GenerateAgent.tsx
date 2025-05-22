import React, { useCallback, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

import { useVapiCall } from "@/hooks/useVapiCall";
import { SidebarType } from "@/types/interview";
import { useAuth } from "@/providers/AuthProvider";
import "@/styles/scrollbar.css";
import AgentLayout from "./AgentLayout";

interface GenerateAgentProps {
  onClose: () => void;
}

const GenerateAgent = ({ onClose }: GenerateAgentProps) => {
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
  } = useVapiCall();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>("conversation");
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  useEffect(() => {
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
  }, [user, startCall]);

  const handleFinalClose = useCallback(() => {
    handleLeaveCall();
    onClose();
  }, [handleLeaveCall, onClose]);

  const handleUserLeave = useCallback(() => {
    handleLeaveCall();
    onClose();
  }, [handleLeaveCall, onClose]);

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
      meetingType="generate"
      userInitial={user?.user_metadata?.name?.[0] || "U"}
      onClose={handleFinalClose}
      onEndCall={handleUserLeave}
      onSidebarAction={setSidebarType}
      onToggleVideo={toggleVideo}
      onToggleSidebar={toggleSidebar}
    />
  );
};

export default GenerateAgent; 