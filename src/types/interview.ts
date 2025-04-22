export interface Interview {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: number;
  focusAreas: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  startedAt: Date;
  status: "COMPLETED" | "LEFT_IN_MID";
  overallScore: number;
  participants?: { user: string; score: number; avatar: string }[];
}
