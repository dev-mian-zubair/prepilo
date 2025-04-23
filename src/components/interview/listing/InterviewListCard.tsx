import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Interview } from "@/types/interview";
import { Chip } from "@heroui/chip";

// Technology options with emojis
const technologyOptions = [
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

// Focus area options with emojis
const focusAreaOptions = [
  { key: "TECHNICAL", label: "Technical Skills", emoji: "💻" },
  { key: "SYSTEM_DESIGN", label: "System Design", emoji: "🏗️" },
  { key: "BEHAVIORAL", label: "Behavioral Skills", emoji: "🤝" },
  { key: "COMMUNICATION", label: "Communication Skills", emoji: "💬" },
  { key: "PROBLEM_SOLVING", label: "Problem Solving", emoji: "🧩" },
];

interface InterviewListCardProps {
  interview: Interview;
}

export default function InterviewListCard({ interview }: InterviewListCardProps) {
  const getDifficultyColor = (difficulty: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-success bg-success/10";
      case "LEFT_IN_MID":
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

  const getScoreText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  const getScoreColorForCircle = (score: number | null) => {
    if (score === null) return "stroke-default-200/50";
    if (score >= 90) return "stroke-success";
    if (score >= 75) return "stroke-warning";
    if (score >= 60) return "stroke-primary";
    return "stroke-danger";
  };

  const getTechEmoji = (tech: string) => {
    const option = technologyOptions.find((opt) => opt.key === tech);
    return option ? option.emoji : "🌟";
  };

  const getFocusAreaLabel = (area: string) => {
    const option = focusAreaOptions.find((opt) => opt.key === area);
    return option
      ? { label: option.label, emoji: option.emoji }
      : { label: area.replace("_", " "), emoji: "🌟" };
  };

  return (
    <div className="group border border-divider bg-transparent rounded-md transition-all duration-200 shadow-none hover:shadow-sm hover:scale-[1.01] p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{interview.title}</h3>
            <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(interview.difficulty)}`}>
              {interview.difficulty.charAt(0) + interview.difficulty.slice(1).toLowerCase()}
            </span>
            <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${getStatusColor(interview.status)}`}>
              {interview.status === "COMPLETED" ? "Completed" : "Left in Mid"}
            </span>
          </div>
          <p className="text-sm text-foreground/70 line-clamp-1">{interview.description}</p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-tiny font-medium text-foreground/70">Technologies:</span>
              {interview.technologies.map((tech) => (
                <Chip
                  key={tech}
                  className="hover:scale-105 transition-all duration-200"
                  radius="md"
                  size="sm"
                  startContent={
                    <span aria-hidden="true">{getTechEmoji(tech)}</span>
                  }
                  variant="bordered"
                >
                  {tech}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-tiny font-medium text-foreground/70">Focus Areas:</span>
              {interview.focusAreas.map((area) => {
                const { label, emoji } = getFocusAreaLabel(area);
                return (
                  <Chip
                    key={area}
                    className="hover:scale-105 transition-all duration-200"
                    radius="md"
                    size="sm"
                    startContent={<span aria-hidden="true">{emoji}</span>}
                    variant="bordered"
                  >
                    {label}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-right space-y-2">
          {/* Circular progress indicators */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex justify-end gap-2">
              {interview.scores
                .sort((a, b) => {
                  const order = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };
                  return order[a.difficulty] - order[b.difficulty];
                })
                .map(({ difficulty, score }) => (
                <div key={difficulty} className="flex flex-col items-center">
                  <div className="w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      {/* Background circle */}
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-default-200/50 dark:stroke-default-500/20"
                        strokeWidth="3"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className={`${getScoreColorForCircle(score)} transition-all duration-500`}
                        strokeWidth="3"
                        strokeDasharray={`${score ? (score / 100) * 100 : 0} 100`}
                        transform="rotate(-90 18 18)"
                      />
                      {/* Score text */}
                      <text
                        x="18"
                        y="18"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[8px] font-bold fill-foreground"
                      >
                        {score ? `${score}%` : '-'}
                      </text>
                    </svg>
                  </div>
                  <span className="text-tiny text-foreground/70 mt-1">
                    {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end gap-1 text-tiny text-foreground/70">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{interview.duration} minutes</span>
              </div>
              <span>
                {format(interview.startedAt, "MMM d, yyyy h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 