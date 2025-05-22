import { Difficulty } from "@prisma/client";
import { FocusArea } from "@/enums";

export interface Interview {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  focusAreas: FocusArea[];
  duration: number;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
} 