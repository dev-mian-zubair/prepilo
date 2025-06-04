import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const EndCallModal = () => {
  const { 
    isProcessing,
    showEndCallModal,
    error,
    feedback,
    handleFinalClose,
  } = useInterviewAgent();

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
      <ModalContent className="max-w-2xl border border-white/10 shadow-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <XCircleIcon className="w-12 h-12 text-red-400" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            End Interview Session
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-red-500/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-red-500 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute inset-0 bg-red-500/10 rounded-full blur-md"></div>
                </div>
                <p className="mt-4 text-sm text-gray-400 font-medium">Processing your request...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <XCircleIcon className="w-12 h-12 text-red-400" />
                  </div>
                </div>
                <p className="mt-4 text-red-400 text-center font-medium">{error}</p>
              </div>
            ) : (
              <div className="text-center py-4">
                {feedback && (
                  <div className="mb-8 p-6 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-gray-200">Interview Feedback</h3>
                    </div>
                    <div className="text-left text-gray-300 whitespace-pre-wrap">
                      {feedback}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EndCallModal;
