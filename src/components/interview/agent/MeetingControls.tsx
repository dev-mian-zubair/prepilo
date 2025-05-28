import React, { useCallback } from "react";
import { Video, VideoOff, PhoneOff, Pause, Play } from "lucide-react";
import { Button } from "@heroui/button";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { MeetingType } from "@/types/interview";
import { SidebarType } from "@/types/interview";
import { ChatBubbleLeftRightIcon, XMarkIcon, InformationCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface MeetingControlsProps {
  elapsedTime: number;
  handleEndCall: () => void;
  isVideoOff: boolean;
  meetingType: MeetingType;
  toggleVideo: () => void;
  isPaused: boolean;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
  onGenerateFeedback: () => Promise<void>;
}

const MeetingControls = ({
  elapsedTime = 0,
  handleEndCall,
  isVideoOff,
  meetingType,
  toggleVideo,
  isPaused,
  onPause,
  onResume,
  onGenerateFeedback,
}: MeetingControlsProps) => {
  const { sidebarType, setSidebarType } = useInterviewAgent();

  const handleSidebarAction = useCallback((type: SidebarType) => {
    setSidebarType(type);
  }, [setSidebarType]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="flex justify-center items-center gap-4">
      {meetingType === "interview" && (
        <div className="text-white text-lg font-medium">
          {formatTime(elapsedTime)}
        </div>
      )}
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
          <Button
            onPress={onGenerateFeedback}
            className="rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Generate feedback"
          >
            <DocumentTextIcon className="w-5 h-5 text-white" />
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
  );
};

export default MeetingControls;
