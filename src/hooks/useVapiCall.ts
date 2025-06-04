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
  setMessages: (messages: SavedMessage[] | ((prev: SavedMessage[]) => SavedMessage[])) => void;
}

export const useVapiCall = (): UseVapiCallReturn => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.CONNECTING);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isInitialized = useRef(false);
  const isCleaningUp = useRef(false);
  const mounted = useRef(true);

  const cleanupMediaStreams = useCallback(async () => {
    if (isCleaningUp.current || !mounted.current) return;
    isCleaningUp.current = true;

    try {
      const elements = document.querySelectorAll('video, audio');
      elements.forEach((element: any) => {
        if (element.srcObject) {
          const stream = element.srcObject as MediaStream;
          stream.getTracks().forEach((track: any) => {
            track.stop();
            stream.removeTrack(track);
          });
          element.srcObject = null;
        }
      });
    } catch (error) {
      console.error('Error cleaning up media streams:', error);
    } finally {
      isCleaningUp.current = false;
    }
  }, []);

  const cleanupVapi = useCallback(async () => {
    if (isCleaningUp.current || !mounted.current) return;
    isCleaningUp.current = true;

    try {
      vapi.removeAllListeners();
      await vapi.stop();
      
      if (!isInitialized.current && mounted.current) {
        setIsVideoOff(true);
        setCallStatus(CallStatus.FINISHED);
      }
    } catch (error) {
      console.error('Error during VAPI cleanup:', error);
    } finally {
      isCleaningUp.current = false;
    }
  }, []);

  const startCall = useCallback(async (params: any) => {
    if (isCleaningUp.current || !mounted.current) return;

    try {
      isInitialized.current = true;
      if (mounted.current) {
        setCallStatus(CallStatus.CONNECTING);
        if (!params.variables?.previousTranscript) {
          setMessages([]);
        }
      }

      await Promise.all([cleanupVapi(), cleanupMediaStreams()]);
      await vapi.start(params.workflowId || params.interviewer, {
        variableValues: params.variables,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      if (mounted.current) {
        setCallStatus(CallStatus.FINISHED);
      }
      isInitialized.current = false;
      throw error;
    }
  }, [cleanupVapi, cleanupMediaStreams]);

  const handleLeaveCall = useCallback(async () => {
    isInitialized.current = false;
    await Promise.all([cleanupVapi(), cleanupMediaStreams()]);
  }, [cleanupVapi, cleanupMediaStreams]);

  const toggleVideo = useCallback(() => {
    if (mounted.current) {
      setIsVideoOff((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;

    const handlers = {
      'call-start': () => {
        if (mounted.current) {
          setCallStatus(CallStatus.ACTIVE);
        }
      },
      'call-end': () => {
        if (!isInitialized.current && mounted.current) {
          setCallStatus(CallStatus.FINISHED);
          Promise.all([cleanupVapi(), cleanupMediaStreams()]);
        }
      },
      'message': (message: Message) => {
        if (message.type === "transcript" && message.transcriptType === "final" && mounted.current) {
          setMessages((prev) => [...prev, { role: message.role, content: message.transcript }]);
        }
      },
      'speech-start': () => {
        if (mounted.current) {
          setIsSpeaking(true);
        }
      },
      'speech-end': () => {
        if (mounted.current) {
          setIsSpeaking(false);
        }
      },
      'error': (error: any) => {
        console.error('Error:', error.errorMsg);
        if (!isInitialized.current && mounted.current) {
          Promise.all([cleanupVapi(), cleanupMediaStreams()]);
        }
      },
    };

    // Register all event listeners
    Object.entries(handlers).forEach(([event, handler]) => {
      vapi.on(event as any, handler);
    });

    return () => {
      mounted.current = false;
      // Unregister all event listeners
      Object.entries(handlers).forEach(([event, handler]) => {
        vapi.off(event as any, handler);
      });

      if (!isInitialized.current) {
        Promise.all([cleanupVapi(), cleanupMediaStreams()]);
      }
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
    setMessages,
  };
};
