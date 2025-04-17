import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Technology } from "@/types/dashboard";

const getProgressColor = (score: number) => {
  if (score >= 90) return 'from-emerald-500/90 to-emerald-400/90 dark:from-emerald-400 dark:to-emerald-300';
  if (score >= 80) return 'from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary';
  if (score >= 70) return 'from-amber-500/90 to-amber-400/90 dark:from-amber-400 dark:to-amber-300';
  return 'from-rose-500/90 to-rose-400/90 dark:from-rose-400 dark:to-rose-300';
};

const getTextColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 80) return 'text-primary dark:text-primary-400';
  if (score >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
};

export default function TechnologyBreakdown() {
  const technologies: Technology[] = [
    { id: "1", name: "React", score: 85, count: 10 },
    { id: "2", name: "Node.js", score: 75, count: 5 },
    { id: "3", name: "TypeScript", score: 92, count: 8 },
    { id: "4", name: "System Design", score: 78, count: 6 },
    { id: "5", name: "Python", score: 88, count: 7 },
    { id: "6", name: "AWS", score: 82, count: 4 },
    { id: "7", name: "Docker", score: 79, count: 5 },
    { id: "8", name: "GraphQL", score: 90, count: 3 },
  ];

  return (
    <Card className="bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-large font-bold text-foreground tracking-tight">Technology Breakdown</h2>
          <div className="flex items-center gap-2 px-2 py-1 rounded-small bg-default-100 dark:bg-default-50">
            <span className="text-tiny font-medium text-default-600">{technologies.length}</span>
            <span className="text-tiny text-default-500">Skills Tracked</span>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-default-100 scrollbar-thumb-default-300 hover:scrollbar-thumb-default-400">
          <div className="space-y-4">
            {technologies.map((tech) => (
              <div 
                key={tech.id} 
                className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-foreground">{tech.name}</p>
                  <p className="text-tiny text-foreground/70">{tech.count} sessions</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Progress 
                    value={tech.score} 
                    classNames={{
                      base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden flex-1",
                      indicator: `h-full bg-gradient-to-r ${getProgressColor(tech.score)} rounded-full transition-all duration-500 group-hover:opacity-90`
                    }}
                  />
                  <div className={`text-tiny font-medium ${getTextColor(tech.score)}`}>
                    {tech.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 