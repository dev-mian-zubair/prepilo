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
    <div className="controls-container transition-all duration-300 pr-[360px]">
      <div className="meeting-info flex items-center">
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
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </Button>
        <Button
          isIconOnly
          className={`rounded-full ${isVideoOff ? "bg-meet-control-hover" : "bg-meet-control-bg hover:bg-meet-control-hover"}`}
          variant={isVideoOff ? "solid" : "flat"}
          onPress={toggleVideo}
        >
          {isVideoOff ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </Button>
        <Button
          isIconOnly
          className="rounded-full"
          color="danger"
          onPress={handleEndCall}
        >
          <PhoneOff className="w-5 h-5" />
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
            <Info className="w-5 h-5" />
          </Button>
        )}
        <Button
          isIconOnly
          className="rounded-full bg-meet-control-bg hover:bg-meet-control-hover"
          variant="flat"
          onPress={() => handleSidebarAction("conversation")}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MeetingControls;
