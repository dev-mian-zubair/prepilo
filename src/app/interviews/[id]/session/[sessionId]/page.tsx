import { notFound } from "next/navigation";
import { getCurrentUser } from "@/actions/helpers/common.helper";
import prisma from "@/lib/prisma";
import Agent from "@/components/interview/Agent";
import { Session } from "@/types/session.types";

interface SessionPageProps {
  params: {
    id: string;
    sessionId: string;
  };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const session = await prisma.session.findUnique({
    where: {
      id: params.sessionId,
      userId: user.id,
    },
    include: {
      version: {
        include: {
          interview: true,
          questions: true,
        },
      },
    },
  });

  if (!session || !session.version) {
    notFound();
  }

  // Transform the session to match the expected type
  const transformedSession: Session = {
    id: session.id,
    userId: session.userId,
    versionId: session.versionId || undefined,
    startedAt: session.startedAt,
    endedAt: session.endedAt || undefined,
    status: session.status,
    overallScore: session.overallScore || undefined,
    transcript: session.transcript || undefined,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    questions: session.version.questions,
  };

  return (
    <div className="fixed inset-0 bg-gray-900">
      <Agent
        session={transformedSession}
        meetingType="interview"
        onClose={() => {
          window.location.href = `/app/interviews/${params.id}`;
        }}
      />
    </div>
  );
} 