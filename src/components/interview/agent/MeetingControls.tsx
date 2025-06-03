import React, { useCallback } from "react";
import { Video, VideoOff, PhoneOff, Pause, Play } from "lucide-react";
import { Button } from "@heroui/button";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { MeetingType } from "@/types/interview";
import { SidebarType } from "@/types/interview";
import { ChatBubbleLeftRightIcon, XMarkIcon, InformationCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import PauseModal from "./PauseModal";

interface MeetingControlsProps {
  handleEndCall: () => void;
  isVideoOff: boolean;
  meetingType: MeetingType;
  toggleVideo: () => void;
  isPaused: boolean;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
}

const MeetingControls = ({
  handleEndCall,
  isVideoOff,
  meetingType,
  toggleVideo,
  isPaused,
  onPause,
  onResume,
}: MeetingControlsProps) => {
  const { sidebarType, setSidebarType, generateFeedback, isGeneratingFeedback } = useInterviewAgent();

  const handleSidebarAction = useCallback((type: SidebarType) => {
    setSidebarType(type);
  }, [setSidebarType]);

  const handleGenerateFeedback = useCallback(async () => {
    try {
      setSidebarType("feedback");
      await generateFeedback();
    } catch (error) {
      console.error("Failed to generate feedback:", error);
      setSidebarType("feedback");
    }
  }, [generateFeedback, setSidebarType]);

  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <Button
          onPress={toggleVideo}
          className="rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
        </Button>
        {meetingType === "interview" && (
          <>
            <div className="flex items-center gap-4">
              {isPaused ? (
                <Button
                  className="rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  onPress={onResume}
                >
                  <Play className="w-5 h-5 text-white" />
                </Button>
              ) : (
                <Button
                  className="rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  onPress={onPause}
                >
                  <Pause className="w-5 h-5 text-white" />
                </Button>
              )}
            </div>
            <Button
              onPress={() => handleSidebarAction("info")}
              className={`rounded-full transition-colors ${
                sidebarType === "info" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
              }`}
              title="Show interview information"
            >
              <InformationCircleIcon className="w-5 h-5 text-white" />
            </Button>
          </>
        )}
        <Button
          onPress={() => handleSidebarAction("conversation")}
          className={`rounded-full transition-colors ${
            sidebarType === "conversation" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
          }`}
          title="Conversation"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
        </Button>
        <Button
          onPress={handleEndCall}
          className="rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          title="End call"
        >
          <XMarkIcon className="w-5 h-5 text-gray-400 text-white" />
        </Button>
      </div>
      <PauseModal />
    </>
  );
};

export default MeetingControls;
