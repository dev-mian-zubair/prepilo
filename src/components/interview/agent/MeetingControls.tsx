import React, { useCallback } from "react";
import { Video, VideoOff, PhoneOff, Pause, Play } from "lucide-react";
import { Button } from "@heroui/button";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { MeetingType } from "@/types/interview";
import { SidebarType } from "@/types/interview";
import { VideoCameraIcon, VideoCameraSlashIcon, ChatBubbleLeftRightIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

interface MeetingControlsProps {
  elapsedTime: number;
  handleEndCall: () => void;
  isVideoOff: boolean;
  meetingType: MeetingType;
  toggleVideo: () => void;
  isPaused: boolean;
  onPause: () => Promise<void>;
  onResume: () => Promise<void>;
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          className="rounded-xl"
          isIconOnly
          size="lg"
          variant="light"
          onPress={toggleVideo}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>
        <span className="text-sm text-gray-400">{formatTime(elapsedTime)}</span>
      </div>

      <div className="flex items-center gap-4">
        {isPaused ? (
          <Button
            className="rounded-xl"
            isIconOnly
            size="lg"
            variant="light"
            onPress={onResume}
          >
            <Play className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            className="rounded-xl"
            isIconOnly
            size="lg"
            variant="light"
            onPress={onPause}
          >
            <Pause className="w-5 h-5" />
          </Button>
        )}
        <Button
          className="rounded-xl"
          color="danger"
          size="lg"
          variant="light"
          onPress={handleEndCall}
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MeetingControls; 