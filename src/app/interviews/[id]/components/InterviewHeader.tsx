import { Interview, Technology } from "@prisma/client";
import { Button } from "@heroui/button";
import { Clock, Users, Code } from "lucide-react";
import { formatDuration } from "@/helpers/time.helper";

interface InterviewHeaderProps {
  interview: Interview & {
    technologies: {
      technology: Technology;
    }[];
  };
}

export default function InterviewHeader({ interview }: InterviewHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">{interview.title}</h1>
          {interview.description && (
            <p className="text-gray-600">{interview.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(interview.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{interview.isPublic ? "Public" : "Private"}</span>
            </div>
          </div>

          {interview.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interview.technologies.map(({ technology }) => (
                <span
                  key={technology.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  <Code className="w-3 h-3" />
                  {technology.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="solid"
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              // This will be handled by the client component
              window.location.href = `/app/interviews/${interview.id}/start`;
            }}
          >
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
} 