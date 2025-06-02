import { getSessionsByDifficulty } from "@/actions/dashboard";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { BarChart3 } from "lucide-react";

export default async function SessionsByDifficultyCard() {
  const { beginner, intermediate, advanced, totalAvgScore } = await getSessionsByDifficulty();

  return (
    <Card className="h-full bg-white dark:bg-content1 shadow-lg rounded-2xl p-6 transition hover:shadow-xl border-0">
      <CardHeader className="flex items-center justify-between mb-4 p-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Sessions by Difficulty
          </span>
        </div>
        <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
          Overview
        </span>
      </CardHeader>

      <CardBody className="p-0 text-sm flex flex-col justify-end h-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {beginner.count}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Beginner</span>
            <span className="text-sm text-gray-400">Avg Score: {beginner.avgScore}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {intermediate.count}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Intermediate</span>
            <span className="text-sm text-gray-400">Avg Score: {intermediate.avgScore}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {advanced.count}
            </span>
            <span className="text-gray-500 dark:text-gray-400">Advanced</span>
            <span className="text-sm text-gray-400">Avg Score: {advanced.avgScore}</span>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 text-xs text-gray-500 dark:text-gray-400">
          Overall Avg Score: <span className="font-semibold text-gray-700 dark:text-gray-200">{totalAvgScore}</span>
        </div>
      </CardBody>
    </Card>
  );
}
