"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { Duration, FormValues, Template } from "@/types/interview";
import { formSchema } from "@/schema/interview";
import { FocusArea } from "@/enums";
import {
  durationOptions,
  focusAreaOptions,
  predefinedTechnologies,
  technologyOptions,
  templates,
} from "@/helpers/interview.helper";

interface GenerateInterviewManuallyProps {
  onClose: () => void;
  onGenerate: (interview: FormValues) => void;
}

const GenerateInterviewManually: React.FC<GenerateInterviewManuallyProps> = ({
  onClose,
  onGenerate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: 60,
      focusAreas: [FocusArea.TECHNICAL, FocusArea.COMMUNICATION],
      technologies: ["JavaScript", "React", "TypeScript"],
    },
  });

  const currentFocusAreas = watch("focusAreas");
  const currentDuration = watch("duration");
  const currentTechnologies = watch("technologies");
  const [customTech, setCustomTech] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Frontend");

  // Auto-populate title
  useEffect(() => {
    const focusAreaLabel =
      focusAreaOptions.find((opt) => opt.key === currentFocusAreas[0])?.label ||
      "Technical";
    const techLabel = currentTechnologies[0] || "Coding";
    const title = `${focusAreaLabel} ${techLabel} ${currentDuration} Min`;

    setValue("title", title, { shouldValidate: true });
  }, [currentFocusAreas, currentTechnologies, currentDuration, setValue]);

  const handleFocusAreaToggle = (area: FocusArea): void => {
    const updatedAreas = currentFocusAreas.includes(area)
      ? currentFocusAreas.filter((a) => a !== area)
      : [...currentFocusAreas, area];

    setValue("focusAreas", updatedAreas, { shouldValidate: true });
  };

  const handleDurationSelect = (duration: Duration): void => {
    setValue("duration", duration, { shouldValidate: true });
  };

  const handleTechnologyToggle = (tech: string): void => {
    const updatedTechs = currentTechnologies.includes(tech)
      ? currentTechnologies.filter((t) => t !== tech)
      : [...currentTechnologies, tech];

    setValue("technologies", updatedTechs, { shouldValidate: true });
  };

  const handleAddCustomTech = (): void => {
    if (customTech.trim()) {
      const updatedTechs = [...currentTechnologies, customTech.trim()];

      setValue("technologies", updatedTechs, { shouldValidate: true });
      setCustomTech("");
    }
  };

  const handleCustomTechKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTech();
    }
  };

  const handleAddCustomDuration = (): void => {
    const durationNum = parseInt(customDuration, 10);

    if (!isNaN(durationNum) && durationNum > 0) {
      setValue("duration", durationNum, { shouldValidate: true });
      setCustomDuration("");
    }
  };

  const handleCustomDurationKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomDuration();
    }
  };

  const applyTemplate = (template: Template): void => {
    reset({
      ...template.values,
      title: "",
    });
    setSelectedTemplate(template.name);
  };

  const handleFormSubmit = async (data: FormValues): Promise<void> => {
    try {
      onGenerate(data);
      console.log("Form submitted:", data);
      // const result = await createInterview({
      //   title: data.title,
      //   duration: data.duration,
      //   focusAreas: data.focusAreas,
      //   technologyNames: data.technologies,
      // });

      // if (result.success) {
      //   onClose();
      // } else {
      //   console.error(result.error);
      // }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <Card className="group border border-divider bg-transparent rounded-md transition-all duration-200 w-full max-w-3xl mx-auto mt-10 shadow-none hover:shadow-sm hover:scale-[1.01]">
      <CardBody className="p-4 flex flex-col gap-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-center">Create Interview</h2>

        {/* Templates */}
        <div>
          <p className="text-tiny text-foreground/70 mb-2">Use a Template</p>
          <div className="flex flex-wrap gap-3">
            {templates.map((template) => (
              <Chip
                key={template.name}
                className="hover:scale-105 transition-all duration-200 cursor-pointer"
                color={
                  selectedTemplate === template.name ? "primary" : "default"
                }
                radius="md"
                size="sm"
                variant={
                  selectedTemplate === template.name ? "solid" : "bordered"
                }
                onClick={() => applyTemplate(template)}
              >
                {template.name}
              </Chip>
            ))}
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {/* Interview Title */}
          <div className="space-y-2">
            <Input
              className="rounded-md"
              errorMessage={errors.title?.message}
              isInvalid={!!errors.title}
              label="Interview Title"
              placeholder="e.g., Technical JavaScript 60 Min"
              variant="bordered"
              {...register("title")}
            />
          </div>

          {/* Duration */}
          <div>
            <p className="text-tiny text-foreground/70 mb-2">Duration</p>
            <div className="flex flex-wrap gap-3">
              {durationOptions.map(({ key, label, emoji }) => (
                <Chip
                  key={key}
                  className="hover:scale-105 transition-all duration-200 cursor-pointer"
                  color={currentDuration === key ? "primary" : "default"}
                  radius="md"
                  size="sm"
                  startContent={<span aria-hidden="true">{emoji}</span>}
                  variant={currentDuration === key ? "solid" : "bordered"}
                  onClick={() => handleDurationSelect(key)}
                >
                  {label}
                </Chip>
              ))}
              <Input
                className="w-32 rounded-md"
                placeholder="Custom (min)"
                size="sm"
                value={customDuration}
                variant="bordered"
                onChange={(e) => setCustomDuration(e.target.value)}
                onKeyDown={handleCustomDurationKeyDown}
              />
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <p className="text-tiny text-foreground/70 mb-2">Focus Areas</p>
            <div className="flex flex-wrap gap-3">
              {focusAreaOptions.map(({ key, label, emoji }) => (
                <Chip
                  key={key}
                  className="hover:scale-105 transition-all duration-200 cursor-pointer"
                  color={
                    currentFocusAreas.includes(key) ? "primary" : "default"
                  }
                  radius="md"
                  size="sm"
                  startContent={<span aria-hidden="true">{emoji}</span>}
                  variant={
                    currentFocusAreas.includes(key) ? "solid" : "bordered"
                  }
                  onClick={() => handleFocusAreaToggle(key)}
                >
                  {label}
                </Chip>
              ))}
            </div>
            {errors.focusAreas && (
              <p className="text-danger text-tiny mt-1">
                {errors.focusAreas.message}
              </p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <p className="text-tiny text-foreground/70 mb-2">Technologies</p>
            <div className="flex flex-wrap gap-3">
              {technologyOptions.map(({ key, label, emoji }) => (
                <Chip
                  key={key}
                  className="hover:scale-105 transition-all duration-200 cursor-pointer"
                  color={
                    currentTechnologies.includes(key) ? "primary" : "default"
                  }
                  radius="md"
                  size="sm"
                  startContent={<span aria-hidden="true">{emoji}</span>}
                  variant={
                    currentTechnologies.includes(key) ? "solid" : "bordered"
                  }
                  onClick={() => handleTechnologyToggle(key)}
                >
                  {label}
                </Chip>
              ))}
              {currentTechnologies
                .filter(
                  (tech) =>
                    !predefinedTechnologies.includes(
                      tech as (typeof predefinedTechnologies)[number],
                    ),
                )
                .map((tech, index) => (
                  <Chip
                    key={`${tech}-${index}`}
                    className="hover:scale-105 transition-all duration-200 cursor-pointer"
                    color="primary"
                    radius="md"
                    size="sm"
                    variant="solid"
                    onClick={() => handleTechnologyToggle(tech)}
                  >
                    {tech}
                  </Chip>
                ))}
              <Input
                className="w-32 rounded-md"
                placeholder="Custom tech"
                size="sm"
                value={customTech}
                variant="bordered"
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={handleCustomTechKeyDown}
              />
            </div>
            {errors.technologies && (
              <p className="text-danger text-tiny mt-1">
                {errors.technologies.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              className="rounded-md border-divider hover:bg-default-100"
              isDisabled={isSubmitting}
              radius="md"
              size="sm"
              startContent={<X className="w-4 h-4" />}
              variant="bordered"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className="rounded-md"
              color="primary"
              isLoading={isSubmitting}
              radius="md"
              size="sm"
              type="submit"
            >
              {isSubmitting ? "Generating..." : "Generate Interview"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default GenerateInterviewManually;
