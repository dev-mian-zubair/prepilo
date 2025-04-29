// Server Component
import { Card, CardBody, CardHeader } from "@heroui/card";
import { InterviewMetricsClient } from "./InterviewMetricsClient";

export default function InterviewMetrics() {
  return (
    <Card className="col-span-2 border-none shadow-none bg-transparent overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Interview Metrics
        </h2>
      </CardHeader>
      <CardBody>
        <InterviewMetricsClient />
      </CardBody>
    </Card>
  );
} 