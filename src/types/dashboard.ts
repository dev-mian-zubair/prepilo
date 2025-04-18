export interface InterviewStats {
  totalSessions: number;
  completedSessions: number;
  weeklySessions: number;
  highScoreSessions: number;
  avgTechnicalScore?: number;
  avgCommunicationScore?: number;
  avgProblemSolvingScore?: number;
}

export interface Feedback {
  technical?: number;
  communication?: number;
  problemSolving?: number;
  clarity?: number;
  confidence?: number;
}

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Session {
  id: string;
  title: string;
  startedAt: Date;
  endedAt?: Date;
  overallScore?: number;
  status: 'COMPLETED' | 'LEFT_IN_MID';
  difficulty: Difficulty;
}

export interface Technology {
  id: string;
  name: string;
  score: number;
  count: number;
}

export interface UserStrength {
  category: string;
  description: string;
  sessionIds: string[];
}

export interface UserWeakness {
  category: string;
  description: string;
  improvementTips: string[];
}

export interface Goal {
  type: string;
  target: number;
  current: number;
  period: 'WEEKLY' | 'MONTHLY';
  endDate?: Date;
}
