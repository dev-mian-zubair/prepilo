'use client';

import { Card, CardBody, CardHeader } from "@heroui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { interviews } from "@/data/interviews";
import InterviewListCard from "./InterviewListCard";

export default function InterviewList() {
  return (
    <Card className="col-span-2 rounded-large shadow-none overflow-hidden transition-all duration-300 bg-transparent border-none">
      <CardBody>
        <div className="space-y-3">
          {interviews.length === 0 ? (
            <p className="text-center text-foreground/70">No interviews this week</p>
          ) : (
            interviews.map((interview) => (
              <InterviewListCard key={interview.id} interview={interview} />
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
} 