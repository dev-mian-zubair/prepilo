import { SessionStatus, Difficulty } from "@prisma/client";

export interface Session {
  id: string;
  questions: {
    id: string;
    text: string;
    type: string;
    technology?: string;
  }[];
  startedAt: Date;
  status: SessionStatus;
  version?: {
    difficulty: Difficulty;
    interview?: {
      title: string;
      focusAreas: string[];
      duration: number;
    };
  };
}
