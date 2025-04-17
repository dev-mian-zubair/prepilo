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
    {
      type: "Technical Score",
      target: 90,
      current: 85,
      period: "MONTHLY",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      type: "Interview Success Rate",
      target: 80,
      current: 75,
      period: "MONTHLY",
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'from-emerald-500/90 to-emerald-400/90 dark:from-emerald-400 dark:to-emerald-300';
    if (progress >= 75) return 'from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary';
    if (progress >= 50) return 'from-amber-500/90 to-amber-400/90 dark:from-amber-400 dark:to-amber-300';
    return 'from-rose-500/90 to-rose-400/90 dark:from-rose-400 dark:to-rose-300';
  };

  const getTextColor = (progress: number) => {
    if (progress >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (progress >= 75) return 'text-primary dark:text-primary-400';
    if (progress >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <Card className="bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">Goal Progress</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = goal.endDate ? differenceInDays(new Date(goal.endDate), new Date()) : 0;

            return (
              <div 
                key={index} 
                className="group border border-border rounded-medium p-4 hover:bg-hover/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium text-foreground mb-0.5">{goal.type}</p>
                    <p className="text-tiny text-foreground/70">
                      {goal.current}/{goal.target} {goal.period.toLowerCase()}
                    </p>
                  </div>
                  {daysRemaining > 0 && (
                    <div className="text-right">
                      <p className="text-tiny text-foreground/70">Time Remaining</p>
                      <p className="text-tiny font-medium text-foreground">{daysRemaining} days</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={progress}
                    classNames={{
                      base: "h-2 rounded-medium bg-default-200/50 dark:bg-default-500/20 overflow-hidden",
                      indicator: `h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full transition-all duration-500 group-hover:opacity-90`
                    }}
                  />
                  <div className="flex justify-between">
                    <p className={`text-tiny font-medium ${getTextColor(progress)}`}>
                      {progress.toFixed(1)}% complete
                    </p>
                    <p className="text-tiny text-foreground/70">
                      {goal.target - goal.current} more to reach goal
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
} 