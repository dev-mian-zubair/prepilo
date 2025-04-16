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

export interface Session {
  id: string;
  title?: string;
  startedAt: Date;
  overallScore?: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
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

export interface DashboardData {
  stats: InterviewStats;
  recentFeedback: Feedback[];
  recentSessions: Session[];
  technologies: Technology[];
  strengths: UserStrength[];
  weaknesses: UserWeakness[];
  goals: Goal[];
} 