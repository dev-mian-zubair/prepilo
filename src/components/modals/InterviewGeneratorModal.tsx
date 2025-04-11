"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import { InterviewType } from "../header/NewInterviewButton";
import GenerateInterviewByAgent from "../interview/generate/GenerateInterviewByAgent";
import GenerateInterviewManually from "../interview/generate/GenerateInterviewManually";

interface InterviewGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: InterviewType;
}

const InterviewGeneratorModal = ({
  isOpen,
  onClose,
  type,
}: InterviewGeneratorModalProps) => {
  return (
    <Modal isOpen={isOpen} shadow="none" size="full" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="hidden" />
        <ModalBody className="pb-0 px-0">
          <div className="h-screen flex flex-col bg-background">
            {type === InterviewType.agent ? (
              <GenerateInterviewByAgent onClose={onClose} />
            ) : (
              <GenerateInterviewManually onClose={onClose} />
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InterviewGeneratorModal;
