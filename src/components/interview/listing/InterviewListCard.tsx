import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Interview } from "@/types/interview";

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

  return (
    <div 
      className="group border border-border rounded-medium p-4 transition-all duration-300"
    >
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
            <div className="flex flex-wrap gap-1">
              <span className="text-tiny font-medium text-foreground/70">Technologies:</span>
              {interview.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="text-tiny px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="text-tiny font-medium text-foreground/70">Focus Areas:</span>
              {interview.focusAreas.map((area) => (
                <span 
                  key={area} 
                  className="text-tiny px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/70"
                >
                  {area.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className={`px-2 py-1 rounded-small bg-gradient-to-r ${getScoreColor(interview.overallScore)} text-white font-medium text-tiny transition-all duration-300`}>
            Score: {interview.overallScore}% - {getScoreText(interview.overallScore)}
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
  );
} 