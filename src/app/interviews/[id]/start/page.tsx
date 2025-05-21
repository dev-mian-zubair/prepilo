import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/helpers/common.helper";
import prisma from "@/lib/prisma";
import { createSession } from "@/actions/interview-session";
import { Difficulty } from "@prisma/client";

interface StartPageProps {
  params: {
    id: string;
  };
}

export default async function StartPage({ params }: StartPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
    include: {
      versions: {
        include: {
          questions: true
        }
      }
    },
  });

  if (!interview) {
    notFound();
  }

  // Get the latest version for each difficulty
  const versions = interview.versions.reduce((acc, version) => {
    if (!acc[version.difficulty]) {
      acc[version.difficulty] = version;
    }
    return acc;
  }, {} as Record<Difficulty, typeof interview.versions[0]>);

  async function startSession(formData: FormData) {
    "use server";
    const difficulty = formData.get("difficulty") as Difficulty;
    const result = await createSession(interview.id, difficulty);
    if (result.success && result.session) {
      redirect(`/app/interviews/${interview.id}/session/${result.session.id}`);
    }
    // If we get here, something went wrong
    redirect(`/app/interviews/${interview.id}/start?error=true`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Start New Session
        </h1>

        <div className="space-y-4">
          {Object.entries(versions).map(([difficulty, version]) => (
            <form key={difficulty} action={startSession}>
              <input type="hidden" name="difficulty" value={difficulty} />
              <button
                type="submit"
                className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()} Level
                    </h2>
                    <p className="text-sm text-gray-500">
                      {interview.duration} minutes • {version.questions.length} questions
                    </p>
                  </div>
                  <span className="text-blue-600 font-medium">Start →</span>
                </div>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
} 