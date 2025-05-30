import { Card, CardHeader, CardBody } from "@heroui/card";
import { BarChart3 } from "lucide-react";
import { getInterviewStats } from "@/lib/stats";

export default async function TotalInterviewsCard() {
  const { completed, inProgress, paused } = await getInterviewStats();

  return (
    <Card className="h-full bg-white dark:bg-content2 shadow-lg rounded-2xl p-6 transition hover:shadow-xl border-0">
      <CardHeader className="flex items-center justify-between mb-4 p-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Interview Sessions
          </span>
        </div>
        <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
          Summary
        </span>
      </CardHeader>

      <CardBody className="p-0">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          {completed}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
          Completed Interviews
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{inProgress}</span>
            <span className="text-gray-500 dark:text-gray-400">In Progress</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{paused}</span>
            <span className="text-gray-500 dark:text-gray-400">Paused</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
