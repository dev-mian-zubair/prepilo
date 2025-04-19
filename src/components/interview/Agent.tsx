import React from "react";

import UserVideoArea from "@/components/call/UserVideoArea";
import ConversationBox from "@/components/call/ConversationBox";
import AgentCard from "@/components/call/AgentCard";
import CallAction from "@/components/call/CallAction";
import { useVapiCall } from "@/hooks/useVapiCall";

interface AgentProps {
  onClose: () => void;
}

const Agent = ({ onClose }: AgentProps) => {
  const {
    callStatus,
    messages,
    isCameraOn,
    isSpeaking,
    toggleCamera,
    handleLeaveCall,
  } = useVapiCall({ onClose });

  return (
    <>
      {/* Top Section */}
      <div className="flex flex-1 p-0 m-0 overflow-hidden min-h-screen bg-background">
        {/* Video Area */}
        <div className="flex-1 relative">
          <UserVideoArea isCameraOn={isCameraOn} />

          <AgentCard isSpeaking={isSpeaking} status={callStatus} />

          {/* Control Buttons */}
          <CallAction
            handleLeaveCall={handleLeaveCall}
            isCameraOn={isCameraOn}
            toggleCamera={toggleCamera}
          />
        </div>

        {/* Messages Sidebar */}
        <ConversationBox messages={messages} />
      </div>
    </>
  );
};

export default Agent;
