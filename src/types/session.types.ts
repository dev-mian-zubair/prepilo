import { SessionStatus } from "@prisma/client";

export interface Session {
  id: string;
  questions: {
    id: string;
    text: string;
    type: string;
    technology?: string;
  }[];
  startedAt: Date;
  status: SessionStatus;
}
