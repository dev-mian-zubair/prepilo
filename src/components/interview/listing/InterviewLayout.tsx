"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";

import InterviewGrid from "./InterviewGrid";

import { InterviewListType } from "@/types/interview";

export default function InterviewLayout({
  interviews,
}: {
  interviews: InterviewListType[];
}) {
  return (
    <div className="min-h-screen">
      <Card className="shadow-none bg-transparent border-none">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-large font-bold text-foreground tracking-tight">
              Interview Attempts
            </h2>
            <span className="text-foreground/70">
              ({interviews.length} total)
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <InterviewGrid interviews={interviews} />
        </CardBody>
      </Card>
    </div>
  );
}
