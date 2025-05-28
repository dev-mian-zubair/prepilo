import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

import AgentLayout from "./AgentLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { interviewer, resumingInterviewer } from "@/helpers/agent.helper";
import "@/styles/scrollbar.css";
import { Interview } from "@/types/interview";

interface InterviewAgentProps {
  interview: Interview;
}

const InterviewAgent = ({ interview }: InterviewAgentProps) => {
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const [hasHandledError, setHasHandledError] = useState(false);
  const initializedRef = useRef(false);
  const {
    elapsedTime,
    error,
    isProcessing,
    messages,
    callStatus,
    isVideoOff,
    isAgentSpeaking,
    isPaused,
    toggleVideo,
    handleUserLeave,
    handleFinalClose,
    startCall,
    setElapsedTime,
    setError,
    session,
    pauseSession,
    resumeSession,
  } = useInterviewAgent();
  const timerRef = useRef<NodeJS.Timeout>();

  // Handle errors by pausing the interview
  useEffect(() => {
    if (error && !isPaused && !hasHandledError) {
      setHasHandledError(true);
      pauseSession();
    } else if (!error) {
      setHasHandledError(false);
    }
  }, [error, isPaused, pauseSession, hasHandledError]);

  const initializeCall = useCallback(async () => {
    if (initializedRef.current) return;
    
    try {
      setError(null);
      setHasHandledError(false);
      const formattedQuestions = session.questions
        .map((question: { text: string }) => `- ${question.text}`)
        .join("\n");

      if (session.transcript) {
        // Start new call with previous transcript and questions
        await startCall({
          interviewer: resumingInterviewer,
          variables: {
            questions: formattedQuestions,
            previousTranscript: session.transcript,
          },
        });
      } else {
        await startCall({
          interviewer,
          variables: {
          questions: formattedQuestions,
          },
        });
      }
      initializedRef.current = true;
    } catch (err) {
      console.error("Failed to start call:", err);
      setError("Failed to start the call. Please try again.");
      setHasHandledError(true);
      pauseSession();
    }
  }, [session, startCall, setError, pauseSession]);

  useEffect(() => {
    initializeCall();

    return () => {
      if (webcamRef.current) {
        const webcam = webcamRef.current;
        const stream = webcam.stream;
        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
        }
      }

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => {
            track.stop();
            stream.removeTrack(track);
          });
        })
        .catch(() => {
          // Ignore errors as we're just cleaning up
        });
    };
  }, [initializeCall]);

  // Timer effect
  useEffect(() => {
    if (callStatus === 'ACTIVE' && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev: number) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (callStatus === 'FINISHED') {
        setElapsedTime(0);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedTime(0); // Reset time on unmount
    };
  }, [callStatus, setElapsedTime, isPaused]);

  return (
    <AgentLayout
      webcamRef={webcamRef}
      isVideoOff={isVideoOff}
      isAgentSpeaking={isAgentSpeaking}
      callStatus={callStatus}
      messages={messages}
      error={error}
      isProcessing={isProcessing}
      meetingType="interview"
      userInitial={user?.user_metadata?.name?.[0] || "U"}
      elapsedTime={elapsedTime}
      session={session}
      interview={interview}
      onClose={handleFinalClose}
      onEndCall={handleUserLeave}
      onToggleVideo={toggleVideo}
      isPaused={isPaused}
      onPause={pauseSession}
      onResume={resumeSession}
    />
  );
};

export default InterviewAgent; 