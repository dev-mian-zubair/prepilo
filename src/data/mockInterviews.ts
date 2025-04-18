import { Interview } from "@/types/interview";

export const mockInterviews: Interview[] = [
  {
    id: "1",
    title: "React Advanced Interview",
    description: "Advanced React concepts and performance optimization",
    technologies: ["React", "TypeScript", "Redux", "Next.js", "GraphQL", "Webpack", "Jest", "React Testing Library", "CSS-in-JS"],
    duration: 45,
    focusAreas: ["TECHNICAL", "PROBLEM_SOLVING", "CODE_QUALITY", "PERFORMANCE", "TESTING", "ARCHITECTURE"],
    difficulty: "ADVANCED",
    startedAt: new Date("2024-03-15T10:00:00"),
    status: "COMPLETED",
    overallScore: 85
  },
  {
    id: "2",
    title: "System Design Practice",
    description: "Design scalable systems and architecture patterns",
    technologies: ["System Design", "Microservices", "Cloud Architecture", "Kubernetes", "Docker", "AWS", "Azure", "GCP", "Terraform", "CI/CD"],
    duration: 60,
    focusAreas: ["SYSTEM_DESIGN", "TECHNICAL", "SCALABILITY", "RELIABILITY", "SECURITY", "COST_OPTIMIZATION"],
    difficulty: "INTERMEDIATE",
    startedAt: new Date("2024-03-14T14:30:00"),
    status: "LEFT_IN_MID",
    overallScore: 45
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    description: "Core computer science concepts and problem-solving",
    technologies: ["Algorithms", "Data Structures", "Problem Solving", "Python", "Java", "C++", "JavaScript", "SQL", "NoSQL", "Graph Theory", "Dynamic Programming"],
    duration: 50,
    focusAreas: ["TECHNICAL", "PROBLEM_SOLVING", "OPTIMIZATION", "COMPLEXITY_ANALYSIS", "ALGORITHM_DESIGN", "DATA_STRUCTURES"],
    difficulty: "ADVANCED",
    startedAt: new Date("2024-03-13T09:15:00"),
    status: "COMPLETED",
    overallScore: 92
  },
  {
    id: "4",
    title: "Backend Architecture",
    description: "Server-side development and API design",
    technologies: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "Elasticsearch", "RabbitMQ", "gRPC", "REST", "GraphQL", "Authentication", "Authorization"],
    duration: 45,
    focusAreas: ["TECHNICAL", "SYSTEM_DESIGN", "API_DESIGN", "DATABASE_OPTIMIZATION", "SECURITY", "SCALABILITY", "PERFORMANCE"],
    difficulty: "INTERMEDIATE",
    startedAt: new Date("2024-03-12T13:00:00"),
    status: "LEFT_IN_MID",
    overallScore: 35
  },
  {
    id: "5",
    title: "Frontend Performance",
    description: "Web performance optimization and best practices",
    technologies: ["React", "Web Vitals", "Performance", "Lighthouse", "Chrome DevTools", "Webpack", "Code Splitting", "Lazy Loading", "Service Workers", "PWA", "CSS Optimization"],
    duration: 40,
    focusAreas: ["TECHNICAL", "PROBLEM_SOLVING", "PERFORMANCE", "USER_EXPERIENCE", "ACCESSIBILITY", "SEO", "MOBILE_OPTIMIZATION"],
    difficulty: "BEGINNER",
    startedAt: new Date("2024-03-11T11:30:00"),
    status: "COMPLETED",
    overallScore: 78
  }
]; 