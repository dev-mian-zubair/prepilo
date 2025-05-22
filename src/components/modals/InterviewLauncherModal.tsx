import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import LaunchInterview from "../interview/launch/LaunchInterview";

interface InterviewLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview?: { id: string };
}

const InterviewLauncherModal = ({
  isOpen,
  onClose,
  interview,
}: InterviewLauncherModalProps) => {
  if (!interview?.id) {
    return null;
  }

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      shadow="none"
      size="full"
      isDismissable={false}
      onClose={onClose}
    >
      <ModalContent className="bg-background rounded-none shadow-none overflow-hidden">
        <ModalHeader className="hidden" />
        <ModalBody className="p-0 m-0">
          <div className="animate-fade-in transition-opacity duration-300 ease-out w-full h-screen flex items-center justify-center bg-background">
            <LaunchInterview interviewId={interview.id} onClose={onClose} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InterviewLauncherModal;
