import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import { PauseCircleIcon, PlayCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PauseIcon } from "@heroicons/react/24/outline";

const PauseModal = () => {
  const { 
    isProcessing,
    pauseError,
    isPaused,
    resumeSession,
  } = useInterviewAgent();

  return (
    <Modal 
      isOpen={isPaused}
      isDismissable={false}
      hideCloseButton
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
    >
      <ModalContent className="max-w-2xl border border-white/10 shadow-2xl">
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <PauseIcon className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Session Paused
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-yellow-500/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-500 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-md"></div>
                </div>
                <p className="mt-4 text-sm text-gray-400 font-medium">Processing your request...</p>
              </div>
            ) : pauseError ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <XCircleIcon className="w-12 h-12 text-red-400" />
                  </div>
                </div>
                <p className="mt-4 text-red-400 text-center font-medium">{pauseError}</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 mb-6 text-lg font-medium">
                  Your interview session is currently paused. You can resume when you're ready.
                </p>
                <div className="flex justify-center gap-4 w-full">
                  <Button
                    color="primary"
                    onPress={resumeSession}
                    isDisabled={isProcessing}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                  >
                    Resume Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PauseModal; 
