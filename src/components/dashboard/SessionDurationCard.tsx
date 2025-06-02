import { getSessionDurationSummary } from "@/actions/dashboard";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Clock } from "lucide-react";

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours > 0) return `${hours}h ${remaining}m`;
  return `${minutes} minutes`;
}

export default async function SessionDurationCard() {
  const { totalMinutes } = await getSessionDurationSummary();

  return (
    <Card className="h-full bg-white dark:bg-content1 shadow-lg rounded-2xl p-6 transition hover:shadow-xl border-0">
      <CardHeader className="flex items-center justify-between mb-4 p-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Session Duration
          </span>
        </div>
        <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
          Summary
        </span>
      </CardHeader>

      <CardBody className="p-0 flex flex-col justify-end h-full">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatDuration(totalMinutes)}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total time spent in interviews
        </p>
      </CardBody>
    </Card>
  );
}
