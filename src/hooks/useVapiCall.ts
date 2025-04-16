import { useEffect, useState } from "react";

import { vapi } from "@/lib/vapi.sdk";
import { Message, SavedMessage } from "@/types/vapi.types";
import { CallStatus } from "@/enums";

interface UseVapiCallProps {
  onClose: () => void;
}

interface UseVapiCallReturn {
  callStatus: CallStatus;
  messages: SavedMessage[];
  isCameraOn: boolean;
  isSpeaking: boolean;
  toggleCamera: () => void;
  handleLeaveCall: () => void;
}

export const useVapiCall = ({
  onClose,
}: UseVapiCallProps): UseVapiCallReturn => {
  const [callStatus, setCallStatus] = useState<CallStatus>(
    CallStatus.CONNECTING,
  );
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
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
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: any) => console.log("Error:", error.errorMsg);

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

  return {
    callStatus,
    messages,
    isCameraOn,
    isSpeaking,
    toggleCamera,
    handleLeaveCall,
  };
};
