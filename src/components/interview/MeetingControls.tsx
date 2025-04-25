import { Button } from "@heroui/button";
import {
  Info,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import React from "react";

import { MeetingType, SidebarType } from "@/types/interview";

interface MeetingControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  handleEndCall: () => void;
  handleSidebarAction: (type: SidebarType) => void;
  meetingType?: MeetingType;
}

const MeetingControls = ({
  isMuted,
  isVideoOff,
  toggleMute,
  toggleVideo,
  handleEndCall,
  handleSidebarAction,
  meetingType,
}: MeetingControlsProps) => {
  const meetingInfo = {
    time: "3:01 PM",
    title: "RCS daily scrum",
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
      <div className="meeting-info flex items-center text-xs sm:text-sm">
        <span>{meetingInfo.time}</span>
        <span className="mx-2">|</span>
        <span>{meetingInfo.title}</span>
      </div>

      <div className="controls flex items-center gap-2">
        <Button
          isIconOnly
          className={`rounded-full ${isMuted ? "bg-meet-control-hover" : "bg-meet-control-bg hover:bg-meet-control-hover"}`}
          variant={isMuted ? "solid" : "flat"}
          onPress={toggleMute}
        >
          {isMuted ? (
            <Mic className="w-4 h-4" />
          ) : (
            <MicOff className="w-4 h-4" />
          )}
        </Button>
        <Button
          isIconOnly
          className={`rounded-full ${isVideoOff ? "bg-meet-control-hover" : "bg-meet-control-bg hover:bg-meet-control-hover"}`}
          variant={isVideoOff ? "solid" : "flat"}
          onPress={toggleVideo}
        >
          {isVideoOff ? (
            <Video className="w-4 h-4" />
          ) : (
            <VideoOff className="w-4 h-4" />
          )}
        </Button>
        <Button
          isIconOnly
          className="rounded-full"
          color="danger"
          onPress={handleEndCall}
        >
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>

      <div className="right-controls flex items-center gap-2">
        {meetingType === "interview" && (
          <Button
            isIconOnly
            className="rounded-full bg-meet-control-bg hover:bg-meet-control-hover"
            variant="flat"
            onPress={() => handleSidebarAction("info")}
          >
            <Info className="w-4 h-4" />
          </Button>
        )}
        <Button
          isIconOnly
          className="rounded-full bg-meet-control-bg hover:bg-meet-control-hover"
          variant="flat"
          onPress={() => handleSidebarAction("conversation")}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MeetingControls;
