import React from "react";
import { MeetingType, SidebarType } from "@/types/interview";
import { CallStatus } from "@/enums";
import { VideoCameraIcon, VideoCameraSlashIcon, ChatBubbleLeftRightIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

interface MeetingControlsProps {
  handleEndCall: () => void;
  handleSidebarAction: (type: SidebarType) => void;
  isVideoOff: boolean;
  meetingType: MeetingType;
  toggleVideo: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  elapsedTime?: number;
  sidebarType: SidebarType;
}

const MeetingControls = ({
  handleEndCall,
  handleSidebarAction,
  isVideoOff,
  meetingType,
  toggleVideo,
  toggleSidebar,
  isSidebarOpen,
  elapsedTime = 0,
  sidebarType,
}: MeetingControlsProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center gap-4">
      {meetingType === "interview" && (
        <div className="text-white text-lg font-medium">
          {formatTime(elapsedTime)}
        </div>
      )}

      <button
        onClick={toggleVideo}
        className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        title={isVideoOff ? "Turn on camera" : "Turn off camera"}
      >
        {isVideoOff ? (
          <VideoCameraSlashIcon className="w-6 h-6 text-gray-400" />
        ) : (
          <VideoCameraIcon className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {meetingType === "interview" && (
        <button
          onClick={() => handleSidebarAction("info")}
          className={`p-3 rounded-full transition-colors ${
            isSidebarOpen && sidebarType === "info" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
          }`}
          title="Show interview information"
        >
          <InformationCircleIcon className="w-6 h-6 text-white" />
        </button>
      )}

      <button
        onClick={() => handleSidebarAction("conversation")}
        className={`p-3 rounded-full transition-colors ${
          isSidebarOpen && sidebarType === "conversation" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
        }`}
        title="Toggle conversation"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={handleEndCall}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
        title="End call"
      >
        <XMarkIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default MeetingControls; 