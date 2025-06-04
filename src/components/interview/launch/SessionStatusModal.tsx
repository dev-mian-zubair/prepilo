import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { AlertCircle, PauseCircle, CheckCircle2, Loader2 } from "lucide-react";
import FeedbackDisplay from "../feedback/FeedbackDisplay";
import { Session } from "@/types/session.types";
import { generateFeedback } from "@/actions/interview-session";
import { Clock, Calendar, Target, Timer } from "lucide-react";

interface SessionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onResumeSession: (sessionId: string) => void;
}

const SessionStatusModal: React.FC<SessionStatusModalProps> = ({
  isOpen,
  onClose,
  session,
  onResumeSession
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedFeedback, setGeneratedFeedback] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const sessionStatus = session?.status;

  const getStatusInfo = () => {
    if (isLoading || isEnding) {
       return {
          icon: <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />,
          title: isLoading ? 'Processing...' : 'Ending Session...',
          message: '',
          color: 'from-blue-500/20 to-blue-400/20'
        };
    }
    switch (sessionStatus) {
      case 'IN_PROGRESS':
        return {
          icon: <AlertCircle className="w-12 h-12 text-blue-400" />,
          title: 'Session In Progress',
          message: 'This session is currently ongoing.',
          color: 'from-blue-500/20 to-blue-400/20'
        };
      case 'PAUSED':
        return {
          icon: <PauseCircle className="w-12 h-12 text-yellow-400" />,
          title: 'Session Paused',
          message: 'This session is paused.',
          color: 'from-yellow-500/20 to-yellow-400/20'
        };
      case 'COMPLETED':
         return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-400" />,
          title: 'Session Complete',
          message: '',
          color: 'from-green-500/20 to-emerald-500/20'
        };
      default:
        return {
          icon: <AlertCircle className="w-12 h-12 text-gray-400" />,
          title: 'Unknown Session State',
          message: 'The state of this session is unknown.',
           color: 'from-gray-500/20 to-gray-400/20'
        };
    }
  };

  const handleEndSession = async () => {
    if (!session?.id) return;
    setIsEnding(true);
    setError(null);
    setGeneratedFeedback(null);
    try {
      // Call the generateFeedback server action
      const result = await generateFeedback(session.id, session.transcript || '');
      if (result.success) {
        setGeneratedFeedback(result.feedback || null);
        // Note: The parent component (SessionList) should ideally refetch sessions
        // to update the status to COMPLETED after feedback is generated.
      } else {
        setError(result.error || 'Failed to generate feedback.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsEnding(false);
       // Modal remains open to show feedback or error
    }
  };

   const handleResumeSessionClick = () => {
     if (session?.id) {
       onResumeSession(session.id);
       onClose(); // Close modal when resume is initiated
     }
   };

   const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { icon, title, message, color } = getStatusInfo();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={!isLoading && !isEnding}
      classNames={{
        base: "bg-background/80 backdrop-blur-md",
        wrapper: "backdrop-blur-sm",
      }}
    >
      <ModalContent className="max-w-md border border-white/10 shadow-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-4 sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/10 items-center text-center">
            <div className="relative mb-2">
              <div className={`absolute inset-0 ${color.split(' ')[0]} rounded-full blur-xl`}></div>
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                {icon}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
             {!isLoading && !isEnding && !generatedFeedback && !error && (
                <p className="text-sm text-gray-400">{message}</p>
             )}
        </ModalHeader>
        <ModalBody className="py-4">
          {(isLoading || isEnding) && (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="mt-2 text-sm text-gray-400">{isLoading ? 'Loading...' : 'Ending session and generating feedback...'}</p>
            </div>
          )}

          {error && (
             <div className="flex flex-col items-center justify-center text-center text-red-400">
               <AlertCircle className="w-8 h-8 mb-2" />
               <p>{error}</p>
             </div>
           )}

          {generatedFeedback && session && (
            <div className="space-y-4">
               {/* Session Info Grid */}
             <div className="grid grid-cols-1 gap-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Started</p>
                  <p className="text-sm font-medium text-white">{formatDate(session.startedAt)}</p>
                </div>
              </div>
              {/* Display completed time if available after ending session */}
              {session.endedAt && (
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-sm font-medium text-white">{formatDate(new Date(session.endedAt))}</p>
                  </div>
                </div>
              )}
              {/* Display duration if available */}
              {session.duration !== undefined && (
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-sm font-medium text-white">{session.duration} minutes</p>
                  </div>
                </div>
              )}
            </div>
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-200">Interview Feedback</h3>
                </div>
                <FeedbackDisplay feedback={generatedFeedback} />
              </div>
            </div>
          )}

           {!isLoading && !isEnding && !generatedFeedback && !error && (sessionStatus === 'IN_PROGRESS' || sessionStatus === 'PAUSED') && (
             <p className="text-sm text-gray-400 text-center">Click below to take action or close.</p>
           )}

        </ModalBody>
        <ModalFooter className="flex justify-center gap-3">
          {/* Show Continue button for PAUSED sessions when not loading/ending/feedback/error */}
          {!isLoading && !isEnding && !generatedFeedback && !error && sessionStatus === 'PAUSED' && (
            <Button onPress={handleResumeSessionClick} color="warning">
              Continue Session
            </Button>
          )}
          {/* Show End Session button for IN_PROGRESS sessions when not loading/ending/feedback/error */}
          {!isLoading && !isEnding && !generatedFeedback && !error && sessionStatus === 'IN_PROGRESS' && (
             <Button onPress={handleEndSession} color="danger">
              End Session & Get Feedback
            </Button>
          )}
           {/* Show Close button when feedback or error is displayed, OR when actions are shown for IN_PROGRESS/PAUSED */}
           {(!isLoading && !isEnding && (error || generatedFeedback || sessionStatus === 'COMPLETED')) ||
            (!isLoading && !isEnding && !error && !generatedFeedback && (sessionStatus === 'IN_PROGRESS' || sessionStatus === 'PAUSED'))
            && (
              <Button onPress={onClose} color="primary">
                Close
              </Button>
           )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SessionStatusModal; 