"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import InterviewViewToggle from "./InterviewViewToggle";
import InterviewGrid from "./InterviewGrid";
import InterviewList from "./InterviewList";

export default function InterviewLayout() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      <Card className="shadow-none bg-transparent border-none">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-large font-bold text-foreground tracking-tight">Interviews</h2>
          <InterviewViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </CardHeader>
        <CardBody>
          {viewMode === "grid" ? <InterviewGrid /> : <InterviewList />}
        </CardBody>
      </Card>
    </div>
  );
} 