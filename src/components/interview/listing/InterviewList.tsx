'use client';

import { Card, CardBody, CardHeader } from "@heroui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { interviews } from "@/data/interviews";
import InterviewListCard from "./InterviewListCard";

export default function InterviewList() {
  return (
    <Card className="col-span-2 bg-content1 rounded-large shadow-none overflow-hidden transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-large font-bold text-foreground tracking-tight">This Week's Interviews</h2>
            <div className="flex items-center gap-1 px-2 py-1 rounded-small bg-foreground/5 text-foreground/80 dark:text-foreground/70">
              <span className="text-tiny font-medium">{interviews.length}</span>
            </div>
          </div>
          <Link 
            href="/interviews" 
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-small bg-foreground/5 text-foreground/80 dark:text-foreground/70 font-medium text-tiny transition-colors hover:bg-foreground/10"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </CardHeader>
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