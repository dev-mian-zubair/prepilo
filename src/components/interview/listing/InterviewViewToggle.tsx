"use client";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import { GridIcon, ListIcon } from "lucide-react";
import InterviewGrid from "./InterviewGrid";
import InterviewList from "./InterviewList";

export default function InterviewViewToggle() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 bg-content1 p-1 rounded-lg">
          <Button
            aria-label="Grid view"
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-transparent text-foreground/70 hover:bg-foreground/5"
            }`}
            isIconOnly
            onClick={() => setViewMode("grid")}
            size="sm"
            variant="light"
          >
            <GridIcon className="w-4 h-4" />
          </Button>
          <Button
            aria-label="List view"
            className={`px-3 py-1 rounded-md transition-all ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-transparent text-foreground/70 hover:bg-foreground/5"
            }`}
            isIconOnly
            onClick={() => setViewMode("list")}
            size="sm"
            variant="light"
          >
            <ListIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? <InterviewGrid /> : <InterviewList />}
    </div>
  );
} 