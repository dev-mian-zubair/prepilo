import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createInterview } from "@/actions/interview";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Interview Title is required").max(100),
  description: z.string().min(1, "Job description is required").max(1000),
  duration: z.number().min(5).max(180),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  focusAreas: z
    .array(
      z.enum([
        "TECHNICAL",
        "SYSTEM_DESIGN",
        "BEHAVIORAL",
        "COMMUNICATION",
        "PROBLEM_SOLVING",
      ]),
    )
    .min(1),
  technologies: z
    .string()
    .min(1)
    .refine((val) => val.split(",").every((tech) => tech.trim().length > 0), {
      message: "Each technology must be non-empty",
    }),
  isPublic: z.boolean(),
});

// Extract the inferred type
type FormValues = z.infer<typeof formSchema>;

interface GenerateInterviewManuallyProps {
  onClose: () => void;
}

const focusAreaOptions = [
  { key: "TECHNICAL", label: "Technical" },
  { key: "SYSTEM_DESIGN", label: "System Design" },
  { key: "BEHAVIORAL", label: "Behavioral" },
  { key: "COMMUNICATION", label: "Communication" },
  { key: "PROBLEM_SOLVING", label: "Problem Solving" },
];

const difficultyOptions = [
  { key: "BEGINNER", label: "Beginner" },
  { key: "INTERMEDIATE", label: "Intermediate" },
  { key: "ADVANCED", label: "Advanced" },
];

const GenerateInterviewManually = ({
  onClose,
}: GenerateInterviewManuallyProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
      difficulty: "INTERMEDIATE",
      focusAreas: ["TECHNICAL"],
      technologies: "",
      isPublic: false,
    },
  });

  const currentFocusAreas = watch("focusAreas");
  const currentDifficulty = watch("difficulty");

  const handleFormSubmit = async (data: FormValues) => {
    try {
      const result = await createInterview({
        title: data.title,
        description: data.description,
        duration: data.duration,
        difficulty: data.difficulty,
        focusAreas: data.focusAreas,
        technologyNames: data.technologies.split(",").map((t) => t.trim()),
        isPublic: data.isPublic,
      });

      if (result.success) {
        onClose();
        // Optional: Show success notification
      } else {
        // Handle error (show toast, etc.)
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      // Handle unexpected errors
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 bg-content1 border-divider shadow-md rounded-medium">
      <CardHeader className="p-6 border-b border-divider flex justify-center">
        <h2 className="text-xl font-semibold text-foreground">
          Create Interview
        </h2>
      </CardHeader>
      <CardBody className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <Input
              className="w-full"
              errorMessage={errors.title?.message}
              isInvalid={!!errors.title}
              label="Interview Title"
              placeholder="e.g., Senior React Developer Interview"
              variant="bordered"
              {...register("title")}
            />
          </div>

          <div>
            <Textarea
              className="w-full"
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
              label="Job Description"
              minRows={3}
              placeholder="Paste the job description you're preparing for..."
              variant="bordered"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                className="w-full"
                errorMessage={errors.difficulty?.message}
                isInvalid={!!errors.difficulty}
                label="Difficulty Level"
                selectedKeys={[currentDifficulty]}
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as
                    | "BEGINNER"
                    | "INTERMEDIATE"
                    | "ADVANCED";

                  setValue("difficulty", selected);
                }}
              >
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Input
                className="w-full"
                errorMessage={errors.duration?.message}
                isInvalid={!!errors.duration}
                label="Duration (minutes)"
                max="180"
                min="5"
                step="5"
                type="number"
                variant="bordered"
                {...register("duration", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Select
              className="w-full"
              errorMessage={errors.focusAreas?.message}
              isInvalid={!!errors.focusAreas}
              label="Focus Areas"
              selectedKeys={currentFocusAreas}
              selectionMode="multiple"
              variant="bordered"
              onSelectionChange={(keys) => {
                setValue(
                  "focusAreas",
                  Array.from(keys) as FormValues["focusAreas"],
                );
              }}
            >
              {focusAreaOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <Input
              className="w-full"
              description="Enter technologies separated by commas"
              errorMessage={errors.technologies?.message}
              isInvalid={!!errors.technologies}
              label="Technologies"
              placeholder="e.g., JavaScript, React, Node.js"
              variant="bordered"
              {...register("technologies")}
            />
          </div>

          <div className="flex items-center">
            <input
              className="h-4 w-4 text-primary focus:ring-primary border-divider rounded"
              id="isPublic"
              type="checkbox"
              {...register("isPublic")}
            />
            <label className="ml-2 text-sm text-foreground" htmlFor="isPublic">
              Make this interview public
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              className="px-6"
              color="primary"
              isDisabled={isSubmitting}
              radius="full"
              size="md"
              variant="bordered"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className="px-6"
              color="primary"
              isLoading={isSubmitting}
              radius="full"
              size="md"
              type="submit"
              variant="solid"
            >
              {isSubmitting ? "Creating..." : "Create Interview"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default GenerateInterviewManually;
