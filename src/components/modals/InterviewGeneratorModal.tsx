"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { RadioGroup } from "@heroui/react";

import GenerateInterviewByAgent from "../interview/generate/GenerateInterviewByAgent";
import GenerateInterviewManually from "../interview/generate/GenerateInterviewManually";
import LaunchInterview from "../interview/launch/LaunchInterview";
import { CustomRadio } from "../CustomRadio";

import { InterviewType } from "@/enums";
import { cn } from "@/lib/utils";

// Define Interview type (reused from GenerateInterviewManually and LaunchInterview)
enum FocusArea {
  TECHNICAL = "TECHNICAL",
  SYSTEM_DESIGN = "SYSTEM_DESIGN",
  BEHAVIORAL = "BEHAVIORAL",
  COMMUNICATION = "COMMUNICATION",
  PROBLEM_SOLVING = "PROBLEM_SOLVING",
}

interface Interview {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologies: string[];
  description?: string;
}

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

  return (
    <Modal isOpen={isOpen} shadow="none" size="full" onClose={handleClose}>
      <ModalContent className="bg-background rounded-none shadow-none overflow-y-auto">
        <ModalHeader className="hidden" />
        <ModalBody className="p-0 m-0">
          <div className="h-screen flex items-center justify-center bg-background">
            {step === "select" && (
              <div
                className={cn(
                  "bg-card border border-divider rounded-xl p-8 w-full max-w-3xl transition-all duration-300 ease-in-out",
                  isFadingOut ? "opacity-0 translate-y-6" : "opacity-100",
                )}
              >
                <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                  Choose Interview Creation Method 📝✨
                </h2>
                <RadioGroup
                  aria-label="Interview Type Selection"
                  className="w-full"
                  orientation="horizontal"
                  onValueChange={handleTypeChange}
                >
                  <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <CustomRadio
                      className="bg-background border border-divider rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] data-[selected=true]:border-primary"
                      description="Fill out a form to customize questions and settings for your interview."
                      value={InterviewType.manually}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl transition-colors">📝</span>
                        <span className="text-lg font-semibold">
                          Create Manually
                        </span>
                      </div>
                    </CustomRadio>
                    <CustomRadio
                      className="bg-background border border-divider rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] data-[selected=true]:border-primary"
                      description="Answer questions from our AI agent to generate a tailored interview."
                      value={InterviewType.agent}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl transition-colors">✨</span>
                        <span className="text-lg font-semibold">
                          Create with AI Agent
                        </span>
                      </div>
                    </CustomRadio>
                  </div>
                </RadioGroup>
              </div>
            )}
            {step === "generate" && (
              <div className="animate-fade-in transition-opacity duration-300 ease-out w-full">
                {type === InterviewType.agent ? (
                  <GenerateInterviewByAgent
                    onClose={handleClose}
                    onGenerate={handleGenerate}
                  />
                ) : (
                  <GenerateInterviewManually
                    onClose={handleClose}
                    onGenerate={handleGenerate}
                  />
                )}
              </div>
            )}
            {step === "launch" && interview && (
              <div className="animate-fade-in transition-opacity duration-300 ease-out w-full">
                <LaunchInterview interview={interview} onClose={handleClose} />
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InterviewGeneratorModal;
