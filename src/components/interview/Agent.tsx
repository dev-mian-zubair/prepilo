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
  } = useVapiCall({ onClose });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>("conversation");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
      // Reset timer when call ends
      if (callStatus === 'FINISHED') {
        setElapsedTime(0);
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

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
          const formattedQuestions = session.questions
            .map((question) => `- ${question.text}`)
            .join("\n");
          await startCall({
            interviewer,
            variables: {
              questions: formattedQuestions,
            },
          });
        }
      } catch (err) {
        console.error("Failed to start call:", err);
        setError("Failed to start the call. Please try again.");
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
  }, [meetingType, session, user, startCall]);

  return (
    <div className="fixed inset-0 bg-gray-900">
      {/* Error Display */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:pr-[360px]" : "pr-0"
        }`}
      >
        {/* Video Grid */}
        <div className="relative h-full p-2 sm:p-4 grid place-items-center">
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
          <MeetingControls
            elapsedTime={elapsedTime}
            handleEndCall={handleLeaveCall}
            handleSidebarAction={setSidebarType}
            isVideoOff={isVideoOff}
            meetingType={meetingType}
            toggleVideo={toggleVideo}
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
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
            className="fixed top-0 right-0 w-full sm:w-[360px] h-full bg-gray-900 border-l border-gray-800 shadow-xl z-50 overflow-hidden lg:z-0"
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
