"use client";
import React, { useState } from "react";

import UserVideoArea from "../../call/UserVideoArea";
import ConversationBox from "../../call/ConversationBox";
import AgentCard from "../../call/AgentCard";
import CallAction from "../../call/CallAction";

interface GenerateInterviewByAgentProps {
  onClose: () => void;
}

const GenerateInterviewByAgent = ({
  onClose,
}: GenerateInterviewByAgentProps) => {
  const [messages, setMessages] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const handleLeaveCall = () => {
    setMessages([]);
    setIsCameraOn(true);
    onClose();
  };

  return (
    <>
      {/* Top Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative">
          <UserVideoArea
            isCameraOn={isCameraOn}
            setIsCameraOn={setIsCameraOn}
          />

          <AgentCard />
        </div>

        {/* Messages Sidebar */}
        <ConversationBox messages={messages} />
      </div>

      {/* Control Buttons */}
      <CallAction
        handleLeaveCall={handleLeaveCall}
        isCameraOn={isCameraOn}
        toggleCamera={toggleCamera}
      />
    </>
  );
};

export default GenerateInterviewByAgent;
