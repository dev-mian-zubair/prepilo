import React, { useCallback, useEffect } from "react";

import MeetingControls from "./MeetingControls";
import ActionSidebar from "./ActionSidebar";

import UserVideoArea from "@/components/call/UserVideoArea";
import AgentCard from "@/components/call/AgentCard";
import { useVapiCall } from "@/hooks/useVapiCall";
import { MeetingType, SidebarType } from "@/types/interview";
import { Session } from "@/types/session.types";
import { useAuth } from "@/providers/AuthProvider";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/helpers/agent.helper";

interface AgentProps {
  onClose: () => void;
  interview?: any;
  session?: Session;
  meetingType?: MeetingType;
}

const Agent = ({ onClose, interview, session, meetingType }: AgentProps) => {
  const { user } = useAuth();
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

  const initializeTheVoiceAgent = useCallback(async () => {
    try {
      if (meetingType === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: user.user_metadata.name,
            userid: user.id,
          },
        });
      } else if (meetingType === "interview") {
        let formattedQuestions = "";

        if (session) {
          formattedQuestions = session.questions
            .map((question) => `- ${question.text}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [meetingType, session, user]);

  useEffect(() => {
    initializeTheVoiceAgent();
  }, [initializeTheVoiceAgent]);

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
