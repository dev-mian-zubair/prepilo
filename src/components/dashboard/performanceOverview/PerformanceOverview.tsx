// Server Component
import { Card, CardBody, CardHeader } from "@heroui/card";
import { PerformanceOverviewClient } from "./PerformanceOverviewClient";

export default function PerformanceOverview() {
  return (
    <Card className="col-span-2 border-none shadow-none bg-transparent overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Performance Overview
        </h2>
      </CardHeader>
      <CardBody>
        <PerformanceOverviewClient />
      </CardBody>
    </Card>
  );
}
