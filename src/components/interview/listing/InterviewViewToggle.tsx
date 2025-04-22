"use client";
import React from "react";
import { Button } from "@heroui/button";
import { GridIcon, ListIcon } from "lucide-react";

interface InterviewViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function InterviewViewToggle({ viewMode, onViewModeChange }: InterviewViewToggleProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2 p-1">
        <Button
          aria-label="Grid view"
          className={`px-3 py-1 rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-primary text-white"
              : "bg-transparent text-foreground/70 hover:bg-foreground/5"
          }`}
          isIconOnly
          onClick={() => onViewModeChange("grid")}
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
          onClick={() => onViewModeChange("list")}
          size="sm"
          variant="light"
        >
          <ListIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 