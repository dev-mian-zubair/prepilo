import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Goal } from "@/types/dashboard";
import { format, differenceInDays } from "date-fns";

interface GoalProgressProps {
  goals: Goal[];
}

export default function GoalProgress({ goals }: GoalProgressProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Goal Progress</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = goal.endDate ? differenceInDays(new Date(goal.endDate), new Date()) : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{goal.type}</p>
                  <p className="text-sm text-gray-500">
                    {goal.current}/{goal.target} {goal.period.toLowerCase()}
                  </p>
                </div>
                <Progress value={progress} />
                <div className="flex justify-between text-sm text-gray-500">
                  <p>{progress.toFixed(1)}% complete</p>
                  {daysRemaining > 0 && <p>{daysRemaining} days remaining</p>}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
} 