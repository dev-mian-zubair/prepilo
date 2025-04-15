import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Technology } from "@/types/dashboard";

interface TechnologyBreakdownProps {
  technologies: Technology[];
}

const getColorForScore = (score: number) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export default function TechnologyBreakdown({ technologies }: TechnologyBreakdownProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-purple-50">
        <h2 className="text-xl font-semibold text-purple-800">Technology Breakdown</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800">{tech.name}</p>
                <p className="text-sm text-gray-600">{tech.count} sessions</p>
              </div>
              <div className="flex items-center space-x-4">
                <Progress value={tech.score} className={`flex-1 ${getColorForScore(tech.score)}`} />
                <p className={`text-sm font-medium ${
                  tech.score >= 80 ? 'text-green-600' :
                  tech.score >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{tech.score}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
} 