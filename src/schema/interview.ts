import { z } from "zod";

import { FocusArea } from "@/enums";

export const formSchema = z.object({
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
