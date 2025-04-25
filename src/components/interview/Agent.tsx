import React from "react";

import MeetingControls from "./MeetingControls";
import ActionSidebar from "./ActionSidebar";

import UserVideoArea from "@/components/call/UserVideoArea";
import AgentCard from "@/components/call/AgentCard";
import { useVapiCall } from "@/hooks/useVapiCall";
import { MeetingType, SidebarType } from "@/types/interview";

interface AgentProps {
  onClose: () => void;
  interview?: any;
  meetingType?: MeetingType;
}

const Agent = ({ onClose, interview, meetingType }: AgentProps) => {
  const {
    callStatus,
    messages,
    isVideoOff,
    isSpeaking,
    toggleVideo,
    handleLeaveCall,
  } = useVapiCall({ onClose });
  const [isMuted, setIsMuted] = React.useState(false);
  const [sidebarType, setSidebarType] =
    React.useState<SidebarType>("conversation");

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <>
      <div className="video-container flex-grow transition-all duration-300 pr-[360px]">
        <UserVideoArea isMicOn={!isMuted} isVideoOff={isVideoOff} />

        <AgentCard isSpeaking={isSpeaking} status={callStatus} />

        <ActionSidebar
          interview={interview}
          messages={messages}
          type={sidebarType}
        />

        <MeetingControls
          handleEndCall={handleLeaveCall}
          handleSidebarAction={setSidebarType}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          meetingType={meetingType}
          toggleMute={toggleMute}
          toggleVideo={toggleVideo}
        />
      </div>
    </>
  );
};

export default Agent;
