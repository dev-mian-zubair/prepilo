import React, { useState } from "react";
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
  elapsedTime?: number;
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
}: MeetingControlsProps) => {
  const [activeSidebarType, setActiveSidebarType] = useState<SidebarType>("conversation");

  const handleSidebarClick = (type: SidebarType) => {
    if (activeSidebarType === type && isSidebarOpen) {
      toggleSidebar();
    } else {
      handleSidebarAction(type);
      setActiveSidebarType(type);
      if (!isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  return (
    <div className="flex justify-center w-full p-4">
      <div className="flex items-center gap-2 p-4 rounded-full bg-gray-800/90 backdrop-blur-sm shadow-lg">
        {/* Timer - Only show for interview type */}
        {meetingType === "interview" && elapsedTime !== undefined && (
          <div className="flex items-center gap-2 px-4 text-white">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
          </div>
        )}

        {/* Video Control */}
        <Button
          isIconOnly
          variant="light"
          className={`w-12 h-12 rounded-full ${
            isVideoOff ? "bg-red-500 hover:bg-red-600" : "hover:bg-gray-700"
          }`}
          onPress={toggleVideo}
        >
          {isVideoOff ? (
            <VideoOff className="w-5 h-5 text-white" />
          ) : (
            <Video className="w-5 h-5 text-white" />
          )}
        </Button>

        {/* End Call */}
        <Button
          isIconOnly
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600"
          onPress={handleEndCall}
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Chat */}
        <Button
          isIconOnly
          variant="light"
          className={`w-12 h-12 rounded-full hover:bg-gray-700 ${
            isSidebarOpen && activeSidebarType === "conversation" ? "bg-gray-700" : ""
          }`}
          onPress={() => handleSidebarClick("conversation")}
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </Button>

        {/* Participants */}
        {meetingType === "interview" && (
          <Button
            isIconOnly
            variant="light"
            className={`w-12 h-12 rounded-full hover:bg-gray-700 ${
              isSidebarOpen && activeSidebarType === "info" ? "bg-gray-700" : ""
            }`}
            onPress={() => handleSidebarClick("info")}
          >
            <Users className="w-5 h-5 text-white" />
          </Button>
        )}

        {/* Toggle Sidebar */}
        <Button
          isIconOnly
          variant="light"
          className="w-12 h-12 rounded-full hover:bg-gray-700"
          onPress={toggleSidebar}
        >
          {isSidebarOpen ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MeetingControls;
