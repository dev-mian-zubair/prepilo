import { z } from "zod";

import { FocusArea } from "@/enums";
import { formSchema } from "@/schema/interview";

export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Interview {
  id: string;
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologies: string[];
  description?: string;
  difficulty?: DifficultyLevel;
}

export type FormValues = z.infer<typeof formSchema>;

export interface FocusAreaOption {
  key: FocusArea;
  label: string;
  emoji: string;
}

export type Duration = number;

export interface DurationOption {
  key: Duration;
  label: string;
  emoji: string;
}

export interface TechnologyOption {
  key: string;
  label: string;
  emoji: string;
}

export interface Template {
  name: string;
  values: Partial<FormValues>;
}

export interface CreateInterviewParams {
  title: string;
  duration: number;
  focusAreas: FocusArea[];
  technologyNames: string[];
}

export interface CreateInterviewResult {
  success: boolean;
  error?: string;
}

export interface DifficultyOption {
  key: DifficultyLevel;
  label: string;
  emoji: string;
}

export type MeetingType = "generate" | "interview";

export type SidebarType = "conversation" | "info" | "feedback" | null;

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface InterviewFilters {
  technologyName?: string;
  minDuration?: number;
  maxDuration?: number;
}

export type InterviewListType = {
  id: string;
  title: string;
  technologies: string[];
  focusAreas: string[];
  createdAt: Date;
  duration: number;
  versions: {
    BEGINNER: number;
    INTERMEDIATE: number;
    ADVANCED: number;
  };
};
