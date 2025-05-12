"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import { fontSans } from "@/config/fonts";
import { Interview } from "@/types/interview";
import { createInterviewWithJD } from "@/actions/interview";

interface GenerateInterviewByJDProps {
  onClose: () => void;
  onGenerate: (interview: Interview) => void;
}

const GenerateInterviewByJD: React.FC<GenerateInterviewByJDProps> = ({
  onClose,
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

      if (result?.success) {
        onGenerate(result.interview as Interview);
      } else {
        console.error(result?.error);
      }
    } catch (error) {
      setError("Failed to generate interview. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card
      className={cn(
        "group border border-divider bg-transparent rounded-md transition-all duration-200 w-full max-w-3xl mx-auto mt-10 shadow-none hover:shadow-sm hover:scale-[1.01]",
        fontSans.variable,
      )}
    >
      <CardBody className="p-6 flex flex-col gap-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-center">
          Generate Interview from Job Description
        </h2>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Textarea */}
          <div>
            <label
              className="text-sm font-medium text-foreground/80 mb-2 block"
              htmlFor="jobDescription"
            >
              Job Description
            </label>
            <Textarea
              isClearable
              required
              errorMessage={error}
              id="jobDescription"
              isInvalid={!!error}
              minRows={10}
              placeholder="Paste or type the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onClear={() => setJobDescription("")}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              className="font-semibold"
              isDisabled={isGenerating}
              radius="lg"
              size="md"
              type="button"
              variant="bordered"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className="font-semibold"
              color="primary"
              endContent={<Rocket className="w-4 h-4" />}
              isDisabled={!jobDescription.trim()}
              isLoading={isGenerating}
              radius="lg"
              size="md"
              type="submit"
            >
              {isGenerating ? "Generating..." : "Generate Interview"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default GenerateInterviewByJD;
