"use client";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Rocket } from "lucide-react";

import InterviewFormLayout from "../shared/InterviewFormLayout";
import { Interview } from "@/types/interview";
import { createInterviewWithJD } from "@/actions/interview";

interface GenerateInterviewByJDProps {
  onClose: () => void;
  onBack: () => void;
  onGenerate: (interview: Interview) => void;
}

const GenerateInterviewByJD: React.FC<GenerateInterviewByJDProps> = ({
  onClose,
  onBack,
  onGenerate,
}) => {
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const result = await createInterviewWithJD(jobDescription);

      if (result.success && 'interview' in result) {
        onGenerate(result.interview);
      } else if (!result.success && 'error' in result) {
        setError(result.error);
      } else {
        setError('Failed to generate interview');
      }
    } catch (error) {
      setError("Failed to generate interview. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <InterviewFormLayout
      title="Generate from Job Description"
      subtitle="Let AI analyze the job description and create relevant interview questions"
      onBack={onBack}
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Job Description Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description</label>
          <Textarea
            isClearable
            required
            errorMessage={error}
            isInvalid={!!error}
            minRows={10}
            placeholder="Paste or type the job description here..."
            value={jobDescription}
            variant="bordered"
            className="rounded-xl"
            onChange={(e) => setJobDescription(e.target.value)}
            onClear={() => setJobDescription("")}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-divider">
          <Button
            className="font-medium min-w-[100px]"
            isDisabled={isGenerating}
            radius="lg"
            size="lg"
            variant="bordered"
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            className="font-medium min-w-[140px]"
            color="primary"
            endContent={<Rocket className="w-4 h-4" />}
            isDisabled={!jobDescription.trim()}
            isLoading={isGenerating}
            radius="lg"
            size="lg"
            type="submit"
          >
            {isGenerating ? "Generating..." : "Generate Interview"}
          </Button>
        </div>
      </form>
    </InterviewFormLayout>
  );
};

export default GenerateInterviewByJD;
