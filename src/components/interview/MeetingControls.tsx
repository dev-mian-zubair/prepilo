import { Button } from "@heroui/button";
import {
  Video,
  VideoOff,
  MessageSquare,
  Users,
  PhoneOff,
  ChevronRight,
  ChevronLeft,
  Clock,
  Pause,
  Play,
  X,
} from "lucide-react";
import { MeetingType, SidebarType } from "@/types/interview";
import { formatTime } from "@/helpers/time.helper";

interface MeetingControlsProps {
  handleEndCall: () => void;
  handleSidebarAction: (type: SidebarType) => void;
  isVideoOff: boolean;
  meetingType?: MeetingType;
  toggleVideo: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  elapsedTime: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
}

const MeetingControls = ({
  handleEndCall,
  handleSidebarAction,
  isVideoOff,
  meetingType,
  toggleVideo,
  toggleSidebar,
  isSidebarOpen,
  elapsedTime,
  isPaused,
  onPause,
  onResume,
}: MeetingControlsProps) => {
  const handleSidebarClick = (type: SidebarType) => {
    handleSidebarAction(type);
    if (!isSidebarOpen) {
      toggleSidebar();
    }
  };

  const activeSidebarType: SidebarType = "conversation";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-50">
      <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-gray-700/50">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
        <Button
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-xl p-2"
            onClick={toggleVideo}
        >
          {isVideoOff ? (
              <VideoOff className="w-5 h-5" />
          ) : (
              <Video className="w-5 h-5" />
          )}
        </Button>
          <span className="text-sm text-white/80 font-medium">
            {formatTime(elapsedTime)}
          </span>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3">
        <Button
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-xl p-2"
            onClick={isPaused ? onResume : onPause}
        >
            {isPaused ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
        </Button>
        <Button
            variant="ghost"
            className={`w-12 h-12 rounded-full hover:bg-white/10 p-2 ${
              isSidebarOpen && activeSidebarType === "conversation" ? "bg-white/10" : ""
          }`}
            onClick={() => handleSidebarClick("conversation")}
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </Button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-xl p-2"
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        <Button
            variant="solid"
            className="text-white bg-red-500 hover:bg-red-600 rounded-xl px-4"
            onClick={handleEndCall}
        >
            End Call
        </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingControls;
