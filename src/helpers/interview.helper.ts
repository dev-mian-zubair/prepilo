import { FocusArea } from "@/enums";
import {
  DifficultyOption,
  DurationOption,
  FocusAreaOption,
  TechnologyOption,
  Template,
} from "@/types/interview";

export const predefinedTechnologies = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Java",
  "TypeScript",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
] as const;

export const focusAreaOptions: FocusAreaOption[] = [
  { key: FocusArea.TECHNICAL, label: "Technical Skills", emoji: "💻" },
  { key: FocusArea.SYSTEM_DESIGN, label: "System Design", emoji: "🏗️" },
  { key: FocusArea.BEHAVIORAL, label: "Behavioral Skills", emoji: "🤝" },
  { key: FocusArea.COMMUNICATION, label: "Communication Skills", emoji: "💬" },
  { key: FocusArea.PROBLEM_SOLVING, label: "Problem Solving", emoji: "🧩" },
];

export const durationOptions: DurationOption[] = [
  { key: 10, label: "10 Min", emoji: "🏃‍♂️" },
  { key: 30, label: "30 Min", emoji: "⚡" },
  { key: 45, label: "45 Min", emoji: "🚀" },
  { key: 60, label: "60 Min", emoji: "⏰" },
  { key: 90, label: "90 Min", emoji: "🌊" },
  { key: 120, label: "120 Min", emoji: "🗻" },
];

export const technologyOptions: TechnologyOption[] = [
  { key: "JavaScript", label: "JavaScript", emoji: "🌐" },
  { key: "Python", label: "Python", emoji: "🐍" },
  { key: "React", label: "React", emoji: "⚛️" },
  { key: "Node.js", label: "Node.js", emoji: "🖥️" },
  { key: "Java", label: "Java", emoji: "☕" },
  { key: "TypeScript", label: "TypeScript", emoji: "📜" },
  { key: "SQL", label: "SQL", emoji: "🗃️" },
  { key: "AWS", label: "AWS", emoji: "☁️" },
  { key: "Docker", label: "Docker", emoji: "🐳" },
  { key: "Kubernetes", label: "Kubernetes", emoji: "☸️" },
];

export const difficultyOptions: DifficultyOption[] = [
  { key: "Beginner", label: "Beginner", emoji: "🌱" },
  { key: "Intermediate", label: "Intermediate", emoji: "🚀" },
  { key: "Advanced", label: "Advanced", emoji: "🧠" },
];

export const templates: Template[] = [
  {
    name: "Frontend",
    values: {
      duration: 60,
      focusAreas: [FocusArea.TECHNICAL, FocusArea.COMMUNICATION],
      technologies: ["JavaScript", "React", "TypeScript"],
    },
  },
  {
    name: "Backend",
    values: {
      duration: 90,
      focusAreas: [FocusArea.SYSTEM_DESIGN, FocusArea.TECHNICAL],
      technologies: ["Node.js", "SQL", "Docker"],
    },
  },
  {
    name: "Full-Stack",
    values: {
      duration: 120,
      focusAreas: [
        FocusArea.TECHNICAL,
        FocusArea.SYSTEM_DESIGN,
        FocusArea.PROBLEM_SOLVING,
      ],
      technologies: ["JavaScript", "React", "Node.js", "AWS"],
    },
  },
];
