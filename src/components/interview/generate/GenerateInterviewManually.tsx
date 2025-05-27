"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { Duration, FormValues, Interview, Template } from "@/types/interview";
import { formSchema } from "@/schema/interview";
import { FocusArea } from "@/enums";
import {
  durationOptions,
  focusAreaOptions,
  predefinedTechnologies,
  technologyOptions,
  templates,
} from "@/helpers/interview.helper";
import { createInterview } from "@/actions/interview";

interface GenerateInterviewManuallyProps {
  onClose: () => void;
  onBack: () => void;
  onGenerate: (interview: Interview) => void;
}

const GenerateInterviewManually: React.FC<GenerateInterviewManuallyProps> = ({
  onClose,
  onBack,
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

  const updateTitle = () => {
    const focusAreaLabel =
      focusAreaOptions.find((opt) => opt.key === currentFocusAreas[0])?.label ||
      "Technical";
    const techLabel = currentTechnologies[0] || "Coding";
    const duration = customDuration || currentDuration;
    const title = `${focusAreaLabel} ${techLabel} ${duration} Min`;

    setValue("title", title, { shouldValidate: true });
  };

  // Auto-populate title
  useEffect(() => {
    updateTitle();
  }, [currentFocusAreas, currentTechnologies, currentDuration, customDuration]);

  const handleFocusAreaToggle = (area: FocusArea): void => {
    const updatedAreas = currentFocusAreas.includes(area)
      ? currentFocusAreas.filter((a) => a !== area)
      : [...currentFocusAreas, area];

    setValue("focusAreas", updatedAreas, { shouldValidate: true });
    updateTitle();
  };

  const handleDurationSelect = (duration: Duration): void => {
    setValue("duration", duration, { shouldValidate: true });
    setCustomDuration(""); // Clear custom duration when selecting predefined
    updateTitle();
  };

  const handleTechnologyToggle = (tech: string): void => {
    const updatedTechs = currentTechnologies.includes(tech)
      ? currentTechnologies.filter((t) => t !== tech)
      : [...currentTechnologies, tech];

    setValue("technologies", updatedTechs, { shouldValidate: true });
    updateTitle();
  };

  const handleAddCustomTech = (): void => {
    if (customTech.trim()) {
      const updatedTechs = [...currentTechnologies, customTech.trim()];

      setValue("technologies", updatedTechs, { shouldValidate: true });
      setCustomTech("");
      updateTitle();
    }
  };

  const handleCustomTechKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTech();
    }
  };

  const handleCustomDuration = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>): void => {
    // Handle both change and keydown events
    const value = 'value' in e.target ? e.target.value : customDuration;
    
    // If it's a keydown event and not Enter, ignore it
    if ('key' in e && e.key !== 'Enter') {
      return;
    }

    // Allow empty input for better UX
    if (value === '') {
      setCustomDuration('');
      return;
    }

    // Strictly only allow positive integers
    // Remove any non-digit characters immediately
    const cleanValue = value.replace(/[^\d]/g, '');
    
    // Only proceed if we have a clean number
    if (cleanValue) {
      const num = parseInt(cleanValue, 10);
      if (num > 0) {
        // Set custom duration and clear predefined duration
        setValue("duration", num, { shouldValidate: true });
        setCustomDuration(cleanValue);
        updateTitle();
      }
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
      const result = await createInterview({
        title: data.title,
        duration: data.duration,
        focusAreas: data.focusAreas,
        technologyNames: data.technologies,
      });

      console.log(result);

      if (result.success && 'interview' in result) {
        onGenerate(result.interview);
      } else if (!result.success && 'error' in result) {
        console.error(result.error);
      } else {
        console.error('Failed to create interview');
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-screen flex flex-col px-4">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl flex flex-col flex-1">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/100 p-8 pb-4 rounded-t-xl border-b border-divider">
          <div className="flex items-center justify-between">
            <Button
              className="rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-800"
              size="sm"
              variant="light"
              onClick={onBack}
              startContent={<ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />}
            >
              Change Creation Method
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-6">Create Interview Manually</h2>
          <p className="text-foreground/60">Customize your interview settings</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pt-4 space-y-8">
            {/* Templates */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Templates</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] ${
                      selectedTemplate === template.name
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit(handleFormSubmit)}>
              {/* Interview Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Interview Title</label>
                <Input
                  className="rounded-xl"
                  errorMessage={errors.title?.message}
                  isInvalid={!!errors.title}
                  placeholder="e.g., Technical JavaScript 60 Min"
                  variant="bordered"
                  {...register("title")}
                />
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Duration</p>
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map(({ key, label, emoji }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleDurationSelect(key)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 ${
                        currentDuration === key && !customDuration
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{emoji}</span>
                      {label}
                    </button>
                  ))}
                  <Input
                    className={`w-32 rounded-xl ${customDuration ? 'text-white' : ''}`}
                    placeholder="Custom (min)"
                    size="sm"
                    value={customDuration}
                    variant="bordered"
                    onChange={handleCustomDuration}
                    onKeyDown={handleCustomDuration}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text');
                      const cleanValue = pastedText.replace(/[^\d]/g, '');
                      if (cleanValue) {
                        setCustomDuration(cleanValue);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Focus Areas */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {focusAreaOptions.map(({ key, label, emoji }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleFocusAreaToggle(key)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 ${
                        currentFocusAreas.includes(key)
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
                {errors.focusAreas && (
                  <p className="text-danger text-sm">{errors.focusAreas.message}</p>
                )}
              </div>

              {/* Technologies */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {technologyOptions.map(({ key, label, emoji }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTechnologyToggle(key)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 ${
                        currentTechnologies.includes(key)
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{emoji}</span>
                      {label}
                    </button>
                  ))}
                  {currentTechnologies
                    .filter(
                      (tech) =>
                        !predefinedTechnologies.includes(
                          tech as (typeof predefinedTechnologies)[number],
                        ),
                    )
                    .map((tech, index) => (
                      <button
                        key={`${tech}-${index}`}
                        type="button"
                        onClick={() => handleTechnologyToggle(tech)}
                        className="px-4 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] bg-primary text-white"
                      >
                        {tech}
                      </button>
                    ))}
                  <Input
                    className="w-32 rounded-xl"
                    placeholder="Custom tech"
                    size="sm"
                    value={customTech}
                    variant="bordered"
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyDown={handleCustomTechKeyDown}
                  />
                </div>
                {errors.technologies && (
                  <p className="text-danger text-sm">{errors.technologies.message}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-divider">
                <Button
                  className="font-medium min-w-[100px]"
                  isDisabled={isSubmitting}
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
                  isLoading={isSubmitting}
                  radius="lg"
                  size="lg"
                  type="submit"
                  variant="solid"
                >
                  {isSubmitting ? "Generating..." : "Generate Interview"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateInterviewManually;
