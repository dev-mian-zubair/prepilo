import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Goal } from "@/types/dashboard";
import { format, differenceInDays } from "date-fns";

interface GoalProgressProps {
  goals: Goal[];
}

export default function GoalProgress({ goals }: GoalProgressProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-blue-50">
        <h2 className="text-xl font-semibold text-blue-800">Goal Progress</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = goal.endDate ? differenceInDays(new Date(goal.endDate), new Date()) : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-blue-900">{goal.type}</p>
                  <p className="text-sm text-blue-600">
                    {goal.current}/{goal.target} {goal.period.toLowerCase()}
                  </p>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-blue-600">{progress.toFixed(1)}% complete</p>
                  {daysRemaining > 0 && <p className="text-blue-600">{daysRemaining} days remaining</p>}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
} 