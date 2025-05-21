import { QuestionType } from "@prisma/client";

export interface InterviewQuestion {
  id: string;
  text: string;
  type: QuestionType;
  technologyId?: string | null;
}

export interface Interview {
  id: string;
  title: string;
  description?: string;
  duration: number;
  focusAreas: string[];
  technologies: string[];
  questions?: InterviewQuestion[];
} 