import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import LaunchInterview from "../interview/launch/LaunchInterview";

interface InterviewLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InterviewLauncherModal = ({
  isOpen,
  onClose,
}: InterviewLauncherModalProps) => {
  const interview = {
    title: "Technical Skills JavaScript 60 Min",
    duration: 60,
    focusAreas: ["TECHNICAL", "COMMUNICATION"],
    technologies: ["JavaScript", "React", "TypeScript"],
  };

  return (
    <Modal isOpen={isOpen} shadow="none" size="full" onClose={onClose}>
      <ModalContent className="bg-background rounded-none shadow-none overflow-hidden">
        <ModalHeader className="hidden" />
        <ModalBody className="p-0 m-0">
          <div className="animate-fade-in transition-opacity duration-300 ease-out w-full h-screen flex items-center justify-center bg-background">
            <LaunchInterview interview={interview as any} onClose={onClose} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InterviewLauncherModal;
