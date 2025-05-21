import { notFound } from "next/navigation";
import { getCurrentUser } from "@/actions/helpers/common.helper";
import prisma from "@/lib/prisma";
import InterviewHeader from "./components/InterviewHeader";
import SessionHistory from "./components/SessionHistory";
import { Difficulty } from "@prisma/client";

interface InterviewPageProps {
  params: {
    id: string;
  };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
    include: {
      versions: {
        include: {
          sessions: {
            where: {
              userId: user.id,
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              feedback: true,
            },
          },
        },
      },
      technologies: {
        include: {
          technology: true,
        },
      },
    },
  });

  if (!interview) {
    notFound();
  }

  // Group sessions by difficulty
  const sessionsByDifficulty = interview.versions.reduce((acc, version) => {
    acc[version.difficulty] = version.sessions;
    return acc;
  }, {} as Record<Difficulty, typeof interview.versions[0]["sessions"]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <InterviewHeader interview={interview} />
      
      <div className="mt-8 space-y-8">
        {Object.entries(sessionsByDifficulty).map(([difficulty, sessions]) => (
          <SessionHistory
            key={difficulty}
            difficulty={difficulty as Difficulty}
            sessions={sessions}
            interviewId={interview.id}
          />
        ))}
      </div>
    </div>
  );
} 