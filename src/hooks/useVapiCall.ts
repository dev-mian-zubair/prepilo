import { useEffect, useState, useRef, useCallback } from "react";

import { vapi } from "@/lib/vapi.sdk";
import { Message, SavedMessage } from "@/types/vapi.types";
import { CallStatus } from "@/enums";

interface UseVapiCallReturn {
  callStatus: CallStatus;
  messages: SavedMessage[];
  isVideoOff: boolean;
  isSpeaking: boolean;
  toggleVideo: () => void;
  handleLeaveCall: () => void;
  startCall: (params: any) => Promise<void>;
}

export const useVapiCall = (): UseVapiCallReturn => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.CONNECTING);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isInitialized = useRef(false);
  const isCleaningUp = useRef(false);

  const cleanupMediaStreams = useCallback(async () => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    try {
      // Stop all media tracks from all video elements
      document.querySelectorAll('video').forEach(video => {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
          video.srcObject = null;
        }
      });

      // Stop all media tracks from all audio elements
      document.querySelectorAll('audio').forEach(audio => {
        if (audio.srcObject) {
          const stream = audio.srcObject as MediaStream;
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
          audio.srcObject = null;
        }
      });
    } catch (error) {
      console.error('Error cleaning up media streams:', error);
    } finally {
      isCleaningUp.current = false;
    }
  }, []);

  const cleanupVapi = useCallback(async () => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    try {
      // Remove all event listeners
      vapi.removeAllListeners();
      
      // Stop VAPI
      await vapi.stop();
      
      // Reset state except messages
      setIsVideoOff(true);
      setCallStatus(CallStatus.FINISHED);
      
      isInitialized.current = false;
    } catch (error) {
      console.error('Error during VAPI cleanup:', error);
    } finally {
      isCleaningUp.current = false;
    }
  }, []);

  const startCall = useCallback(async (params: any) => {
    if (isCleaningUp.current) return;

    try {
      // Clean up any existing call first
      await cleanupVapi();
      await cleanupMediaStreams();

      setCallStatus(CallStatus.CONNECTING);
      setMessages([]);
      isInitialized.current = true;

      await vapi.start(params.workflowId || params.interviewer, {
        variableValues: params.variables,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus(CallStatus.FINISHED);
      throw error;
    }
  }, [cleanupVapi, cleanupMediaStreams]);

  const handleLeaveCall = useCallback(async () => {
    await cleanupVapi();
    await cleanupMediaStreams();
  }, [cleanupVapi, cleanupMediaStreams]);

  const toggleVideo = useCallback(() => {
    setIsVideoOff((prev) => !prev);
  }, []);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      cleanupVapi();
      cleanupMediaStreams();
    };
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: any) => {
      console.log("Error:", error.errorMsg);
      cleanupVapi();
      cleanupMediaStreams();
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
      cleanupVapi();
      cleanupMediaStreams();
    };
  }, [cleanupVapi, cleanupMediaStreams]);

  return {
    callStatus,
    messages,
    isVideoOff,
    isSpeaking,
    toggleVideo,
    handleLeaveCall,
    startCall,
  };
};
