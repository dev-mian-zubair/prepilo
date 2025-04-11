import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface GenerateInterviewManuallyProps {
  onClose: () => void;
}

const formSchema = z.object({
  jobTitle: z
    .string()
    .min(1, "Job Title or Interview Title is required")
    .max(100, "Job Title must be 100 characters or less"),
  jobDescription: z
    .string()
    .min(10, "Job Description must be at least 10 characters")
    .max(1000, "Job Description must be 1000 characters or less"),
  technologies: z
    .string()
    .min(1, "Technologies are required")
    .refine((val) => val.split(",").every((tech) => tech.trim().length > 0), {
      message: "Each technology must be non-empty",
    }),
  interviewDuration: z
    .number({ invalid_type_error: "Interview Duration must be a number" })
    .min(5, "Interview Duration must be at least 5 minutes")
    .max(180, "Interview Duration must not exceed 180 minutes"),
});

const GenerateInterviewManually = ({
  onClose,
}: GenerateInterviewManuallyProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
      technologies: "",
      interviewDuration: 30,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...data,
      technologies: data.technologies.split(",").map((tech) => tech.trim()),
    };

    console.log("Form Submitted:", formattedData);
    reset();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 bg-content1 border-divider shadow-md rounded-medium">
      <CardHeader className="p-6 border-b border-divider flex justify-center">
        <h2 className="text-xl font-semibold text-foreground">
          Manual Interview Setup
        </h2>
      </CardHeader>
      <CardBody className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              className="w-full"
              errorMessage={errors.jobTitle?.message}
              isInvalid={!!errors.jobTitle}
              label="Job Title or Interview Title"
              placeholder="e.g., Software Engineer Interview"
              variant="bordered"
              {...register("jobTitle")}
            />
          </div>

          <div>
            <Textarea
              className="w-full"
              errorMessage={errors.jobDescription?.message}
              isInvalid={!!errors.jobDescription}
              label="Job Description"
              minRows={4}
              placeholder="Describe the job role and responsibilities..."
              variant="bordered"
              {...register("jobDescription")}
            />
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

          <div>
            <Input
              className="w-full"
              errorMessage={errors.interviewDuration?.message}
              isInvalid={!!errors.interviewDuration}
              label="Interview Duration (minutes)"
              max="180"
              min="5"
              step="5"
              type="number"
              variant="bordered"
              {...register("interviewDuration", { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              className="px-6"
              color="primary"
              radius="full"
              size="md"
              type="submit"
              variant="bordered"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              className="px-6"
              color="primary"
              radius="full"
              size="md"
              type="submit"
              variant="solid"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default GenerateInterviewManually;
