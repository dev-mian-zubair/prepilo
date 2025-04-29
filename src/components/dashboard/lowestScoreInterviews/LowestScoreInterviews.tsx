// Server Component
import { Card, CardBody, CardHeader } from "@heroui/card";
import { LowestScoreInterviewsClient } from "./LowestScoreInterviewsClient";

export default function LowestScoreInterviews() {
  return (
    <Card className="col-span-2 border-none shadow-none bg-transparent overflow-hidden transition-all duration-300">
      <CardHeader>
        <h2 className="text-large font-bold text-foreground tracking-tight">
          Lowest Score Interviews
        </h2>
      </CardHeader>
      <CardBody>
        <LowestScoreInterviewsClient />
      </CardBody>
    </Card>
  );
} 