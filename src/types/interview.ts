export interface Interview {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: number;
  focusAreas: string[];
  startedAt: Date;
  scores: {
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    score: number | null;
  }[];
  participants?: {
    user: string;
    score: number;
    avatar: string;
  }[];
}
