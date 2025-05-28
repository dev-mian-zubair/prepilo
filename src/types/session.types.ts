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
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  version?: {
    difficulty: string;
  };
  feedback?: {
    technical: number;
    communication: number;
    summary: string;
    questionAnalysis: Array<{
      question: string;
      analysis: string;
      strengths: string[];
      improvements: string[];
    }>;
  };
}
