import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Goal } from "@/types/dashboard";
import { format, differenceInDays } from "date-fns";

export default function GoalProgress() {
  const goals: Goal[] = [
    {
      type: "Weekly Practice",
      target: 5,
      current: 3,
      period: "WEEKLY",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <Card className="bg-content1 shadow-lg">
      <CardHeader className="bg-default-100 border-b border-default-200">
        <h2 className="text-xl font-semibold text-foreground">Goal Progress</h2>
      </CardHeader>
      <CardBody className="text-foreground">
        <div className="space-y-6">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = goal.endDate ? differenceInDays(new Date(goal.endDate), new Date()) : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-foreground">{goal.type}</p>
                  <p className="text-sm text-foreground/70">
                    {goal.current}/{goal.target} {goal.period.toLowerCase()}
                  </p>
                </div>
                <Progress 
                  value={progress}
                  classNames={{
                    base: "overflow-hidden rounded-full bg-hover",
                    indicator: "h-full bg-primary rounded-full"
                  }}
                />
                <div className="flex justify-between text-sm">
                  <p className="text-foreground/70">{progress.toFixed(1)}% complete</p>
                  {daysRemaining > 0 && (
                    <p className="text-foreground/70">{daysRemaining} days remaining</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
} 