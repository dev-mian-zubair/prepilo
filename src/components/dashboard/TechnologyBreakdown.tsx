import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Technology } from "@/types/dashboard";

const getProgressColor = (score: number) => {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  return 'bg-danger';
};

const getTextColor = (score: number) => {
  if (score >= 80) return 'text-success/90';
  if (score >= 60) return 'text-warning/90';
  return 'text-danger/90';
};

export default function TechnologyBreakdown() {
  const technologies: Technology[] = [
    { id: "1", name: "React", score: 85, count: 10 },
    { id: "2", name: "Node.js", score: 75, count: 5 },
  ];

  return (
    <Card className="bg-content1 shadow-lg">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Technology Breakdown</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="space-y-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium text-foreground">{tech.name}</p>
                <p className="text-sm text-foreground/70">{tech.count} sessions</p>
              </div>
              <div className="flex items-center space-x-4">
                <Progress 
                  value={tech.score} 
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover flex-1",
                    indicator: `h-full ${getProgressColor(tech.score)} rounded-full`
                  }}
                />
                <p className={`text-sm font-medium ${getTextColor(tech.score)}`}>
                  {tech.score}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 