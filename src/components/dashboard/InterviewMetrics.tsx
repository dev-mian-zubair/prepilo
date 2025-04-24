import { Card, CardBody, CardHeader } from "@heroui/card";
import { Difficulty } from "@/types/dashboard";

interface InterviewMetric {
  difficulty: Difficulty;
  count: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  technologies: {
    name: string;
    sessions: number;
  }[];
}

export default function InterviewMetrics() {
  const metrics: InterviewMetric[] = [
    {
      difficulty: "BEGINNER",
      count: 8,
      averageScore: 75,
      totalTimeSpent: 245,
      technologies: [
        { name: "JavaScript", sessions: 3 },
        { name: "HTML/CSS", sessions: 2 },
        { name: "React Basics", sessions: 3 },
        { name: "Python", sessions: 4 },
        { name: "SQL", sessions: 2 },
        { name: "Git", sessions: 3 },
      ],
    },
    {
      difficulty: "INTERMEDIATE",
      count: 12,
      averageScore: 65,
      totalTimeSpent: 721,
      technologies: [
        { name: "React", sessions: 4 },
        { name: "Node.js", sessions: 3 },
        { name: "TypeScript", sessions: 5 },
        { name: "Express.js", sessions: 3 },
        { name: "MongoDB", sessions: 2 },
        { name: "Redux", sessions: 4 },
        { name: "GraphQL", sessions: 2 },
        { name: "Docker", sessions: 3 },
        { name: "Jest", sessions: 2 },
        { name: "Webpack", sessions: 1 },
        { name: "Next.js", sessions: 3 },
        { name: "SASS/SCSS", sessions: 2 },
      ],
    },
    {
      difficulty: "ADVANCED",
      count: 5,
      averageScore: 55,
      totalTimeSpent: 209,
      technologies: [
        { name: "System Design", sessions: 2 },
        { name: "Data Structures", sessions: 3 },
        { name: "Algorithms", sessions: 4 },
        { name: "Microservices", sessions: 2 },
        { name: "Kubernetes", sessions: 1 },
        { name: "AWS", sessions: 3 },
        { name: "CI/CD", sessions: 2 },
        { name: "Redis", sessions: 1 },
        { name: "WebSockets", sessions: 2 },
        { name: "WebRTC", sessions: 1 },
        { name: "Machine Learning", sessions: 2 },
        { name: "Blockchain", sessions: 1 },
        { name: "Distributed Systems", sessions: 2 },
        { name: "Big Data", sessions: 1 },
        { name: "Cloud Architecture", sessions: 3 },
        { name: "Security", sessions: 2 },
        { name: "Performance Optimization", sessions: 2 },
        { name: "Scalability", sessions: 3 },
        { name: "DevOps", sessions: 2 },
        { name: "Infrastructure as Code", sessions: 1 },
        { name: "Service Mesh", sessions: 1 },
        { name: "Event-Driven Architecture", sessions: 2 },
        { name: "Database Sharding", sessions: 1 },
        { name: "Load Balancing", sessions: 2 },
        { name: "Caching Strategies", sessions: 2 },
      ],
    },
  ];

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "BEGINNER":
        return "text-success bg-success/10";
      case "INTERMEDIATE":
        return "text-warning bg-warning/10";
      case "ADVANCED":
        return "text-danger bg-danger/10";
      default:
        return "text-secondary bg-secondary/10";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-success to-success/80";
    if (score >= 75) return "from-warning to-warning/80";
    if (score >= 60) return "from-primary to-primary/80";
    return "from-danger to-danger/80";
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="col-span-2 bg-background rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Interview Metrics
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div
              key={metric.difficulty}
              className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(
                      metric.difficulty
                    )}`}
                  >
                    {metric.difficulty.charAt(0) +
                      metric.difficulty.slice(1).toLowerCase()}
                  </span>
                  <span className="text-tiny text-foreground/70">
                    {metric.count} interviews
                  </span>
                  <span className="text-tiny text-foreground/70">
                    • {formatTime(metric.totalTimeSpent)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-tiny text-foreground/70">
                    Avg Score:
                  </span>
                  <div
                    className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(
                      metric.averageScore
                    )} text-white font-medium text-tiny`}
                  >
                    {metric.averageScore}%
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {metric.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-2 bg-default-100 dark:bg-default-50/50 px-3 py-1.5 rounded-full"
                  >
                    <span className="text-tiny font-medium text-foreground">
                      {tech.name}
                    </span>
                    <span className="text-tiny text-foreground/70">
                      ({tech.sessions})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 