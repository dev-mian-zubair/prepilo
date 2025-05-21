import { Session, Difficulty, Feedback } from "@prisma/client";
import { Button } from "@heroui/button";
import { formatDistanceToNow } from "date-fns";
import { Play, RotateCcw, Clock, Award } from "lucide-react";

interface SessionHistoryProps {
  difficulty: Difficulty;
  sessions: (Session & {
    feedback: Feedback | null;
  })[];
  interviewId: string;
}

export default function SessionHistory({ difficulty, sessions, interviewId }: SessionHistoryProps) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()} Level Sessions
      </h2>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : session.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : session.status === "PAUSED"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {session.status}
                </span>
              </div>

              {session.feedback && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>Score: {session.feedback.technical?.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {session.endedAt
                        ? `${Math.round(
                            (session.endedAt.getTime() - session.startedAt.getTime()) / 1000 / 60
                          )} min`
                        : "In progress"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {session.status === "PAUSED" ? (
                <Button
                  variant="solid"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    window.location.href = `/app/interviews/${interviewId}/resume/${session.id}`;
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    window.location.href = `/app/interviews/${interviewId}/restart/${session.id}`;
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 