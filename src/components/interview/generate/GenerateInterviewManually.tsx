"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define types for focus areas
enum FocusArea {
  TECHNICAL = "TECHNICAL",
  SYSTEM_DESIGN = "SYSTEM_DESIGN",
  BEHAVIORAL = "BEHAVIORAL",
  COMMUNICATION = "COMMUNICATION",
  PROBLEM_SOLVING = "PROBLEM_SOLVING",
}

// Define duration options
const predefinedDurations = [10, 30, 45, 60, 90, 120] as const;

type Duration = number;

// Define technology options
const predefinedTechnologies = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Java",
  "TypeScript",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
] as const;

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, "Interview Title is required").max(100),
  duration: z.number().int().positive("Duration must be a positive integer"),
  focusAreas: z
    .array(
      z.enum([
        FocusArea.TECHNICAL,
        FocusArea.SYSTEM_DESIGN,
        FocusArea.BEHAVIORAL,
        FocusArea.COMMUNICATION,
        FocusArea.PROBLEM_SOLVING,
      ]),
    )
    .min(1, "At least one focus area is required"),
  technologies: z
    .array(z.string().min(1, "Technology name cannot be empty"))
    .min(1, "At least one technology is required"),
});

// Extract form values type
type FormValues = z.infer<typeof formSchema>;

// Define option interfaces
interface FocusAreaOption {
  key: FocusArea;
  label: string;
  emoji: string;
}

interface DurationOption {
  key: Duration;
  label: string;
  emoji: string;
}

interface TechnologyOption {
  key: string;
  label: string;
  emoji: string;
}

// Define template interface
interface Template {
  name: string;
  values: Partial<FormValues>;
}

// Define createInterview action type
interface CreateInterviewParams {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologyNames: string[];
}

interface CreateInterviewResult {
  success: boolean;
  error?: string;
}

// Mock createInterview action (replace with actual import)
const createInterview = async (
  params: CreateInterviewParams,
): Promise<CreateInterviewResult> => {
  console.log("Creating interview:", params);

  return { success: true };
};

// Define options
const focusAreaOptions: FocusAreaOption[] = [
  { key: FocusArea.TECHNICAL, label: "Technical Skills", emoji: "💻" },
  { key: FocusArea.SYSTEM_DESIGN, label: "System Design", emoji: "🏗️" },
  { key: FocusArea.BEHAVIORAL, label: "Behavioral Skills", emoji: "🤝" },
  { key: FocusArea.COMMUNICATION, label: "Communication Skills", emoji: "💬" },
  { key: FocusArea.PROBLEM_SOLVING, label: "Problem Solving", emoji: "🧩" },
];

const durationOptions: DurationOption[] = [
  { key: 10, label: "Fast 10-Min Blitz", emoji: "🏃‍♂️" },
  { key: 30, label: "Quick 30-Min Sprint", emoji: "⚡" },
  { key: 45, label: "Swift 45-Min Dash", emoji: "🚀" },
  { key: 60, label: "Solid 60-Min Grind", emoji: "⏰" },
  { key: 90, label: "Deep 90-Min Dive", emoji: "🌊" },
  { key: 120, label: "Epic 120-Min Quest", emoji: "🗻" },
];

const technologyOptions: TechnologyOption[] = [
  { key: "JavaScript", label: "JavaScript", emoji: "🌐" },
  { key: "Python", label: "Python", emoji: "🐍" },
  { key: "React", label: "React", emoji: "⚛️" },
  { key: "Node.js", label: "Node.js", emoji: "🖥️" },
  { key: "Java", label: "Java", emoji: "☕" },
  { key: "TypeScript", label: "TypeScript", emoji: "📜" },
  { key: "SQL", label: "SQL", emoji: "🗃️" },
  { key: "AWS", label: "AWS", emoji: "☁️" },
  { key: "Docker", label: "Docker", emoji: "🐳" },
  { key: "Kubernetes", label: "Kubernetes", emoji: "☸️" },
];

const templates: Template[] = [
  {
    name: "Frontend Developer",
    values: {
      duration: 60,
      focusAreas: [FocusArea.TECHNICAL, FocusArea.COMMUNICATION],
      technologies: ["JavaScript", "React", "TypeScript"],
    },
  },
  {
    name: "Backend Developer",
    values: {
      duration: 90,
      focusAreas: [FocusArea.SYSTEM_DESIGN, FocusArea.TECHNICAL],
      technologies: ["Node.js", "SQL", "Docker"],
    },
  },
  {
    name: "Full-Stack Developer",
    values: {
      duration: 120,
      focusAreas: [
        FocusArea.TECHNICAL,
        FocusArea.SYSTEM_DESIGN,
        FocusArea.PROBLEM_SOLVING,
      ],
      technologies: ["JavaScript", "React", "Node.js", "AWS"],
    },
  },
];

interface GenerateInterviewManuallyProps {
  onClose: () => void;
}

const GenerateInterviewManually: React.FC<GenerateInterviewManuallyProps> = ({
  onClose,
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
      duration: 30,
      focusAreas: [FocusArea.TECHNICAL],
      technologies: [],
    },
  });

  const currentFocusAreas = watch("focusAreas");
  const currentDuration = watch("duration");
  const currentTechnologies = watch("technologies");
  const currentTitle = watch("title");
  const [customTech, setCustomTech] = useState("");
  const [customDuration, setCustomDuration] = useState("");

  // Auto-populate title
  useEffect(() => {
    const focusAreaLabel =
      focusAreaOptions.find((opt) => opt.key === currentFocusAreas[0])?.label ||
      "Technical";
    const techLabel = currentTechnologies[0] || "Coding";
    const title = `${focusAreaLabel} ${techLabel} ${currentDuration}-Min Interview`;

    setValue("title", title, { shouldValidate: true });
  }, [currentFocusAreas, currentTechnologies, currentDuration, setValue]);

  // Generate title suggestions
  const titleSuggestions = [
    `${focusAreaOptions.find((opt) => opt.key === currentFocusAreas[0])?.label || "Technical"} ${
      currentTechnologies[0] || "Coding"
    } ${currentDuration}-Min Challenge`,
    `${currentTechnologies[0] || "Developer"} ${currentDuration}-Min Assessment`,
    `${focusAreaOptions.find((opt) => opt.key === currentFocusAreas[0])?.label || "Technical"} ${
      currentTechnologies[1] || "Tech"
    } Interview`,
  ].filter(
    (title) =>
      title !== currentTitle &&
      title.includes(currentTechnologies[0] || "Coding"),
  );

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
      title: "", // Let useEffect generate title
    });
  };

  const applyTitleSuggestion = (title: string): void => {
    setValue("title", title, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: FormValues): Promise<void> => {
    try {
      const result = await createInterview({
        title: data.title,
        duration: data.duration,
        focusAreas: data.focusAreas,
        technologyNames: data.technologies,
      });

      if (result.success) {
        onClose();
        // Optional: Show success notification
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10 rounded-2xl shadow-none border border-default bg-background mb-20">
      <CardHeader className="rounded-t-2xl p-6 ">
        <h2 className="text-2xl font-semibold text-center">
          🎉 Create Interview
        </h2>
      </CardHeader>
      <CardBody className="p-6 flex flex-col gap-6">
        <div>
          <p className="font-medium text-sm mb-2 text-default-600">
            Use a Template
          </p>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <Button
                key={template.name}
                className="rounded-full border border-default-200 hover:bg-primary"
                size="sm"
                variant="light"
                onPress={() => applyTemplate(template)}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="space-y-2">
            <Input
              className="rounded-xl"
              errorMessage={errors.title?.message}
              isInvalid={!!errors.title}
              label="Interview Title ✨"
              placeholder="e.g., Technical Skills JavaScript 60-Min Interview"
              variant="faded"
              {...register("title")}
            />
            {titleSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {titleSuggestions.map((suggestion, idx) => (
                  <Chip
                    key={idx}
                    className="bg-default-200 text-sm cursor-pointer px-4 py-2 rounded-full"
                    onClick={() => applyTitleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-medium text-sm mb-2 text-default-600">
              Duration ⏰
            </p>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map(({ key, label, emoji }) => (
                <Chip
                  key={key}
                  className={`cursor-pointer px-4 py-2 rounded-full ${
                    currentDuration === key
                      ? "bg-primary text-white"
                      : "bg-default-100"
                  }`}
                  onClick={() => handleDurationSelect(key)}
                >
                  {emoji} {label}
                </Chip>
              ))}
              <Input
                className="w-24 rounded-md"
                placeholder="Custom (min)"
                size="sm"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                onKeyDown={handleCustomDurationKeyDown}
              />
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2 text-default-600">
              Focus Areas 🌈
            </p>
            <div className="flex flex-wrap gap-2">
              {focusAreaOptions.map(({ key, label, emoji }) => (
                <Chip
                  key={key}
                  className={`cursor-pointer px-4 py-2 rounded-full ${
                    currentFocusAreas.includes(key)
                      ? "bg-secondary text-white"
                      : "bg-default-100"
                  }`}
                  onClick={() => handleFocusAreaToggle(key)}
                >
                  {emoji} {label}
                </Chip>
              ))}
            </div>
            {errors.focusAreas && (
              <p className="text-red-500 text-sm mt-1">
                {errors.focusAreas.message}
              </p>
            )}
          </div>

          <div>
            <p className="font-medium text-sm mb-2 text-default-600">
              Technologies ⚙️
            </p>
            <div className="flex flex-wrap gap-2">
              {technologyOptions.map(({ key, label, emoji }) => (
                <Chip
                  key={key}
                  className={`cursor-pointer px-4 py-2 rounded-full ${
                    currentTechnologies.includes(key)
                      ? "bg-success text-white"
                      : "bg-default-100"
                  }`}
                  onClick={() => handleTechnologyToggle(key)}
                >
                  {emoji} {label}
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
                    className="text-sm cursor-pointer px-4 py-2 rounded-full bg-success text-white"
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
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={handleCustomTechKeyDown}
              />
            </div>
            {errors.technologies && (
              <p className="text-red-500 text-sm mt-1">
                {errors.technologies.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              className="rounded-full px-6"
              isDisabled={isSubmitting}
              radius="md"
              size="lg"
              variant="bordered"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full px-6"
              color="primary"
              isLoading={isSubmitting}
              size="lg"
              type="submit"
            >
              {isSubmitting ? "Generating..." : "Generate Interview 🚀"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default GenerateInterviewManually;
