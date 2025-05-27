import React, { useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Webcam from "react-webcam";

import MeetingControls from "./MeetingControls";
import ActionSidebar from "./ActionSidebar";
import AgentCard from "@/components/call/AgentCard";

import { MeetingType } from "@/types/interview";
import { CallStatus } from "@/enums";
import { Session } from "@/types/session.types";
import { Interview } from "@/types/interview";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";

interface AgentLayoutProps {
  webcamRef: React.RefObject<Webcam>;
  isVideoOff: boolean;
  isAgentSpeaking: boolean;
  callStatus: CallStatus;
  messages: any[];
  error: string | null;
  isProcessing?: boolean;
  meetingType: MeetingType;
  userInitial?: string;
  elapsedTime?: number;
  session?: Session;
  interview?: Interview;
  onClose: () => void;
  onEndCall: () => void;
  onToggleVideo: () => void;
  isPaused: boolean;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
}

const AgentLayout = ({
  webcamRef,
  isVideoOff,
  isAgentSpeaking,
  callStatus,
  messages,
  error,
  isProcessing,
  meetingType,
  userInitial = "U",
  elapsedTime = 0,
  session,
  interview,
  onClose,
  onEndCall,
  onToggleVideo,
  isPaused,
  onPause,
  onResume,
}: AgentLayoutProps) => {
  const { sidebarType, setSidebarType } = useInterviewAgent();
  
  const isSidebarOpen = useMemo(() => sidebarType !== null, [sidebarType]);
  const sidebarPadding = useMemo(() => isSidebarOpen ? "lg:pr-[360px]" : "pr-0", [isSidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setSidebarType(null);
  }, [setSidebarType]);

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className={`h-full transition-all duration-300 ease-in-out ${sidebarPadding}`}>
        <div className="relative h-full p-2 sm:p-4 grid place-items-center">
          {error && (
            <div className="absolute top-4 left-4 right-4 z-[40] bg-red-500 text-white p-4 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={onClose}
                className="ml-4 px-4 py-2 bg-white text-red-500 rounded hover:bg-red-50 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="absolute top-4 left-4 right-4 z-[40] bg-blue-500 text-white p-4 rounded-lg flex justify-between items-center">
              <span>Processing session...</span>
            </div>
          )}

          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-gray-800">
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
                      {userInitial}
                    </span>
                  </div>
                </div>
              )}
            </div>

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

        <div className={`absolute bottom-0 left-0 right-0 px-2 sm:px-4 pb-2 sm:pb-4 transition-all duration-300 ease-in-out ${sidebarPadding}`}>
          {!error && !isProcessing && (
            <div className="max-w-4xl mx-auto">
              <MeetingControls
                elapsedTime={elapsedTime}
                handleEndCall={onEndCall}
                isVideoOff={isVideoOff}
                meetingType={meetingType}
                toggleVideo={onToggleVideo}
                isPaused={isPaused}
                onPause={onPause}
                onResume={onResume}
              />
            </div>
          )}
        </div>
      </div>

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
              messages={messages}
              type={sidebarType}
              onClose={handleSidebarClose}
              session={session}
              interview={interview}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentLayout; 