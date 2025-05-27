"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";
import { X } from "lucide-react";

import GenerateInterviewByAgent from "../interview/generate/GenerateInterviewByAgent";
import GenerateInterviewManually from "../interview/generate/GenerateInterviewManually";
import LaunchInterview from "../interview/launch/LaunchInterview";
import InterviewMethodSelector from "../interview/generate/SelectCreationMethod";
import GenerateInterviewByJD from "../interview/generate/GenerateInterviewByJD";

import { InterviewType } from "@/enums";
import { cn } from "@/lib/utils";
import { Interview } from "@/types/interview";

interface InterviewGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InterviewGeneratorModal = ({
  isOpen,
  onClose,
}: InterviewGeneratorModalProps) => {
  const [step, setStep] = useState<
    "select" | "difficulty" | "generate" | "launch"
  >("select");
  const [type, setType] = useState<InterviewType | null>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setType(null);
      setInterview(null);
      setIsFadingOut(false);
    }
  }, [isOpen]);

  const handleTypeChange = (selectedType: string) => {
    setIsFadingOut(true);
    setTimeout(() => {
      setType(selectedType as InterviewType);
      setStep("generate");
      setIsFadingOut(false);
    }, 300);
  };

  const handleGenerate = (generatedInterview: Interview) => {
    setInterview(generatedInterview);
    setIsFadingOut(true);
    setTimeout(() => {
      setStep("launch");
      setIsFadingOut(false);
    }, 300);
  };

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setStep("select");
      setType(null);
      setInterview(null);
      setIsFadingOut(false);
      onClose();
    }, 300);
  };

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setStep("select");
      setType(null);
      setIsFadingOut(false);
    }, 300);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      shadow="none" 
      size="full" 
      isDismissable={false}
      hideCloseButton
      onClose={handleClose}
    >
      <ModalContent className="bg-background rounded-none shadow-none overflow-y-auto">
        <ModalHeader className="hidden" />
        <ModalBody className="p-0 m-0">
          <div className="h-screen flex items-center justify-center bg-background">
            {step === "select" && (
              <div
                className={cn(
                  "bg-background p-8 w-full max-w-2xl transition-all duration-300 ease-in-out",
                  isFadingOut ? "opacity-0 translate-y-6" : "opacity-100",
                )}
              >
                {/* Close Button */}
                <Button
                  isIconOnly
                  className="absolute right-8 top-8 rounded-full"
                  size="sm"
                  variant="light"
                  onPress={handleClose}
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      Create New Interview
                    </h2>
                    <p className="text-foreground/60">
                      Choose a method to create your interview questions
                    </p>
                  </div>

                  <InterviewMethodSelector onSelect={handleTypeChange} />
                </div>
              </div>
            )}
            {step === "generate" && (
              <div className="animate-fade-in transition-opacity duration-300 ease-out w-full">
                {type === InterviewType.agent && (
                  <GenerateInterviewByAgent onClose={handleClose} />
                )}
                {type === InterviewType.manually && (
                  <GenerateInterviewManually
                    onClose={handleClose}
                    onBack={handleBack}
                    onGenerate={handleGenerate}
                  />
                )}
                {type === InterviewType.byJd && (
                  <GenerateInterviewByJD
                    onClose={handleClose}
                    onBack={handleBack}
                    onGenerate={handleGenerate}
                  />
                )}
              </div>
            )}
            {step === "launch" && interview && (
              <div className="animate-fade-in transition-opacity duration-300 ease-out w-full">
                <LaunchInterview interviewId={interview.id} onClose={handleClose} />
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InterviewGeneratorModal;
