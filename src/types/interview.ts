export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Interview {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: number;
  focusAreas: string[];
  startedAt: Date;
  scores: {
    difficulty: DifficultyLevel;
    score: number | null;
  }[];
  participants?: {
    user: string;
    score: number;
    avatar: string;
  }[];
}
