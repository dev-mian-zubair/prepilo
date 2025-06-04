"use client";
import { Card, CardBody } from "@heroui/card";

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
        <CardBody>
          <InterviewGrid interviews={interviews} />
        </CardBody>
      </Card>
    </div>
  );
}
