import { SessionStatus } from "@prisma/client";
import { InterviewQuestion } from "./interview.types";

export interface Session {
  id: string;
  userId: string;
  versionId?: string;
  startedAt: Date;
  endedAt?: Date;
  status: SessionStatus;
  overallScore?: number;
  transcript?: string;
  createdAt: Date;
  updatedAt: Date;
  questions?: InterviewQuestion[];
}
