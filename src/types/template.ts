export interface Template {
  id: string;
  title: string;
  description?: string;
  technologies: string[];
  duration: number;
  focusAreas: string[];
  versions: { difficulty: string }[];
  participants?: { user: string; score: number; avatar: string }[];
} 