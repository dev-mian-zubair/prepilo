import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Clock, Calendar, Target, Timer, X, AlertCircle, CircleDashed } from "lucide-react";
import { Button } from "@heroui/button";
import FeedbackDisplay from "../feedback/FeedbackDisplay";

const EndCallModal = () => {
  const { 
    isProcessing,
    showEndCallModal,
    endCallError,
    feedback,
    handleFinalClose,
    session
  } = useInterviewAgent();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHeaderContent = () => {
    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <CircleDashed className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mt-3">
            Processing Session
          </h2>
        </div>
      );
    } else if (endCallError) {
      return (
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <XCircleIcon className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-400 via-red-500 to-pink-500 bg-clip-text text-transparent mt-3">
            Error Ending Session
          </h2>
        </div>
      );
    } else { // Completed state
      return (
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <CheckCircleIcon className="w-12 h-12 text-green-400" />
            </div>
          </div>
           <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent mt-3">
            Session Complete
          </h2>
        </div>
      );
    }
  };

  const getBodyContent = () => {
    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md"></div>
          </div>
          <p className="mt-4 text-sm text-gray-400 font-medium">Processing your request...</p>
        </div>
      );
    } else if (endCallError) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <p className="mt-4 text-red-400 text-center font-medium">{endCallError}</p>
        </div>
      );
    } else { // Completed state
      return (
        <div className="space-y-6 py-4">
          {session && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Started</p>
                  <p className="text-sm font-medium text-white">{formatDate(session.startedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-sm font-medium text-white">{formatDate(new Date())}</p>
                </div>
              </div>
              {session.duration && (
                <div className="flex items-center gap-3">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="text-sm font-medium text-white">
                      {Math.round((new Date().getTime() - session.startedAt.getTime()) / (1000 * 60))} minutes
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {feedback ? (
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-gray-200">Interview Feedback</h3>
              </div>
              <FeedbackDisplay feedback={feedback} />
            </div>
          ) : (
             !isProcessing && !endCallError && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-gray-400">Session completed. Feedback is being generated...</p>
              </div>
             )
          )}

          {!isProcessing && !endCallError && (
            <div className="flex justify-end gap-3">
              <Button
                onPress={handleFinalClose}
                color="primary"
                className="flex items-center gap-2"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Modal 
      isOpen={showEndCallModal}
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
      onClose={handleFinalClose}
    >
      <ModalContent className="max-w-4xl border border-white/10 shadow-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-2 sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/10">
          <div className="flex justify-between items-start w-full">
            {getHeaderContent()}
            <Button
              onPress={handleFinalClose}
              isIconOnly
              variant="light"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </ModalHeader>
        <ModalBody className="max-h-[calc(100vh-300px)] overflow-y-auto">
          {getBodyContent()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EndCallModal;
