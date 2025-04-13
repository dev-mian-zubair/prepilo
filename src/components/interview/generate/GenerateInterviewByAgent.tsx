"use client";
import React, { useEffect, useState } from "react";

import UserVideoArea from "../../call/UserVideoArea";
import ConversationBox from "../../call/ConversationBox";
import AgentCard from "../../call/AgentCard";
import CallAction from "../../call/CallAction";

import { vapi } from "@/lib/vapi.sdk";
import { Message, SavedMessage } from "@/types/vapi.types";

export enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface GenerateInterviewByAgentProps {
  onClose: () => void;
}

const GenerateInterviewByAgent = ({
  onClose,
}: GenerateInterviewByAgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(
    CallStatus.CONNECTING,
  );
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const initializeCall = async () => {
    try {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: "Mian Zubair",
          userid: 1234,
        },
      });
    } catch (error) {
      console.error("Error starting the call:", error);
    }
  };

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.log("Error:", error.errorMsg);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    initializeCall();
  }, []);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  const handleLeaveCall = () => {
    setMessages([]);
    setIsCameraOn(true);
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
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

          <AgentCard isSpeaking={isSpeaking} status={callStatus} />
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
