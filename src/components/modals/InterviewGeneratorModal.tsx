"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { RadioGroup } from "@heroui/react";

import GenerateInterviewByAgent from "../interview/generate/GenerateInterviewByAgent";
import GenerateInterviewManually from "../interview/generate/GenerateInterviewManually";
import { CustomRadio } from "../CustomRadio";

import { InterviewType } from "@/enums";
import { cn } from "@/lib/utils";

interface InterviewGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InterviewGeneratorModal = ({
  isOpen,
  onClose,
}: InterviewGeneratorModalProps) => {
  const [type, setType] = useState<InterviewType | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showNextScreen, setShowNextScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(null);
      setShowNextScreen(false);
      setIsFadingOut(false);
    }
  }, [isOpen]);

  const handleTypeChange = (selectedType: string) => {
    setIsFadingOut(true);

    setTimeout(() => {
      setType(selectedType as InterviewType);
      setShowNextScreen(true);
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} shadow="none" size="full" onClose={onClose}>
      <ModalContent className="bg-background rounded-none shadow-none overflow-y-auto">
        <ModalHeader className="hidden" />
        <ModalBody className={cn(type === InterviewType.agent && "p-0")}>
          <div className="h-screen flex flex-col bg-background">
            {!showNextScreen ? (
              <div
                className={`flex flex-col items-center justify-center h-full transition-all duration-300 ease-in-out transform ${
                  isFadingOut
                    ? "opacity-0 translate-y-10"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Choose Interview Creation Method 📝✨
                </h2>
                <RadioGroup
                  aria-label="Interview Type Selection"
                  className="w-full px-4"
                  orientation="horizontal"
                  onValueChange={handleTypeChange}
                >
                  <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                    <CustomRadio
                      className="rounded-lg shadow-lg p-8 transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 data-[selected=true]:border-primary"
                      description="Fill out a form to customize questions and settings for your interview."
                      value={InterviewType.manually}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="text-xl group-hover:text-primary transition-colors duration-200"
                        >
                          📝
                        </span>
                        <span className="text-xl font-semibold">
                          Create Manually
                        </span>
                      </div>
                    </CustomRadio>
                    <CustomRadio
                      className="rounded-lg shadow-lg p-8 max-w-[400px] transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 data-[selected=true]:border-primary"
                      description="Answer questions from our AI agent to generate a tailored interview."
                      value={InterviewType.agent}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="text-xl group-hover:text-primary transition-colors duration-200"
                        >
                          ✨
                        </span>
                        <span className="text-xl font-semibold">
                          Create with AI Agent
                        </span>
                      </div>
                    </CustomRadio>
                  </div>
                </RadioGroup>
              </div>
            ) : (
              <div className="animate-fade-in transition-opacity duration-300 ease-out">
                {type === InterviewType.agent ? (
                  <GenerateInterviewByAgent onClose={onClose} />
                ) : (
                  <GenerateInterviewManually onClose={onClose} />
                )}
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InterviewGeneratorModal;
