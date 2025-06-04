import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Clock, CheckCircle2, PauseCircle, AlertCircle, X, Calendar, Target, Timer } from "lucide-react";
import { Button } from "@heroui/button";
import FeedbackDisplay from "./FeedbackDisplay";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: string | null;
  sessionDate: string;
  session: {
    status: string;
    version?: {
      difficulty?: string;
    };
    startedAt: string;
    endedAt?: string;
    duration?: number;
  };
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  feedback,
  sessionDate,
  session
}) => {
  const getStatusIcon = () => {
    switch (session.status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-12 h-12 text-green-400" />;
      case 'PAUSED':
        return <PauseCircle className="w-12 h-12 text-yellow-400" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-12 h-12 text-blue-400" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'COMPLETED':
        return 'from-green-500/20 to-green-400/20';
      case 'PAUSED':
        return 'from-yellow-500/20 to-yellow-400/20';
      case 'IN_PROGRESS':
        return 'from-blue-500/20 to-blue-400/20';
      default:
        return 'from-gray-500/20 to-gray-400/20';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      isOpen={isOpen}
      isDismissable={false}
      classNames={{
        base: "bg-background/80 backdrop-blur-md",
        wrapper: "backdrop-blur-sm",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }
        }
      }}
      onClose={onClose}
    >
      <ModalContent className="max-w-4xl border border-white/10 shadow-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-2 sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/10">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`absolute inset-0 ${getStatusColor().split(' ')[0]} rounded-full blur-xl`}></div>
                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                  {getStatusIcon()}
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Session Feedback
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{sessionDate}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{session.status.toLowerCase()}</span>
                  {session.version?.difficulty && (
                    <>
                      <span>•</span>
                      <span>{session.version.difficulty} Level</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              onPress={onClose}
              isIconOnly
              variant="light"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Started</p>
                <p className="text-sm font-medium text-white">{formatDate(session.startedAt)}</p>
              </div>
            </div>
            {session.endedAt && (
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-sm font-medium text-white">{formatDate(session.endedAt)}</p>
                </div>
              </div>
            )}
            {session.duration && (
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-white">{session.duration} minutes</p>
                </div>
              </div>
            )}
          </div>
        </ModalHeader>
        <ModalBody className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="space-y-6">
            {feedback ? (
              <FeedbackDisplay feedback={feedback} />
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-400">No feedback available for this session</p>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal; 