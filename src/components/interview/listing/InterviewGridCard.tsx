import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { ExternalLinkIcon, Clock, ChevronDown, ChevronUp, Laptop, ListChecks, Award } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";

import { DifficultyLevel, InterviewListType } from "@/types/interview";

const technologyOptions = [
  { key: "JavaScript", label: "JavaScript", emoji: "🌐" },
  { key: "Python", label: "Python", emoji: "🐍" },
  { key: "React", label: "React", emoji: "⚛️" },
  { key: "Node.js", label: "Node.js", emoji: "🖥️" },
  { key: "Java", label: "Java", emoji: "☕" },
  { key: "TypeScript", label: "TypeScript", emoji: "📜" },
  { key: "SQL", label: "SQL", emoji: "🗃️" },
  { key: "AWS", label: "AWS", emoji: "☁️" },
  { key: "Docker", label: "Docker", emoji: "🐳" },
  { key: "Kubernetes", label: "Kubernetes", emoji: "☸️" },
  { key: "Angular", label: "Angular", emoji: "🅰️" },
  { key: "Vue.js", label: "Vue.js", emoji: "💚" },
  { key: "Spring", label: "Spring", emoji: "🍃" },
  { key: "Django", label: "Django", emoji: "🎵" },
  { key: "Ruby on Rails", label: "Ruby on Rails", emoji: "💎" },
  { key: "Swift", label: "Swift", emoji: "🐦" },
  { key: "Kotlin", label: "Kotlin", emoji: "💡" },
  { key: "Go", label: "Go", emoji: "🐿️" },
  { key: "Rust", label: "Rust", emoji: "⚙️" },
  { key: "C#", label: "C#", emoji: "#️⃣" },
  { key: "C++", label: "C++", emoji: "🧱" },
  { key: "PHP", label: "PHP", emoji: "🐘" },
  { key: "HTML", label: "HTML", emoji: "📄" },
  { key: "CSS", label: "CSS", emoji: "🎨" },
  { key: "GraphQL", label: "GraphQL", emoji: "⚛️" },
  { key: "REST APIs", label: "REST APIs", emoji: "➡️" },
  { key: "Microservices", label: "Microservices", emoji: "⚙️" },
  { key: "System Design", label: "System Design", emoji: "🏗️" },
  { key: "Behavioral", label: "Behavioral", emoji: "🤝" },
  { key: "Problem Solving", label: "Problem Solving", emoji: "🧩" },
];

const focusAreaOptions = [
  { key: "TECHNICAL", label: "Technical Skills", emoji: "💻" },
  { key: "SYSTEM_DESIGN", label: "System Design", emoji: "🏗️" },
  { key: "BEHAVIORAL", label: "Behavioral Skills", emoji: "🤝" },
  { key: "COMMUNICATION", label: "Communication Skills", emoji: "💬" },
  { key: "PROBLEM_SOLVING", label: "Problem Solving", emoji: "🧩" },
];

interface InterviewGridCardProps {
  interview: InterviewListType;
}

export default function InterviewGridCard({
  interview,
}: InterviewGridCardProps) {
  console.log(interview);
  const [showAllTechnologies, setShowAllTechnologies] = useState(false);
  const [showAllFocusAreas, setShowAllFocusAreas] = useState(false);

  const getTechEmoji = (tech: string) => {
    const option = technologyOptions.find((opt) => opt.key === tech);
    return option ? option.emoji : "🌟";
  };

   const getFocusAreaLabel = (area: string) => {
    const option = focusAreaOptions.find((opt) => opt.key === area);
     return option
      ? { label: option.label, emoji: option.emoji }
      : { label: area.replace("_", " "), emoji: "🌟" };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "text-green-400 bg-green-400/10";
      case "INTERMEDIATE":
        return "text-yellow-400 bg-yellow-400/10";
      case "ADVANCED":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-blue-400";
    return "text-red-400";
  };

  const displayedTechnologies = showAllTechnologies
    ? interview.technologies
    : interview.technologies.slice(0, 4); // Display up to 4 techs

  const displayedFocusAreas = showAllFocusAreas
    ? interview.focusAreas
    : interview.focusAreas.slice(0, 2); // Display up to 2 areas

  return (
    <Card className="group border border-gray-700 bg-gray-800 min-h-[300px] shadow-none hover:shadow-xl hover:border-primary-400 transition-all duration-200">
      <CardBody className="p-6 flex flex-col gap-4">
        {/* Title */}
        <h2 className="text-xl font-bold line-clamp-2 text-white mr-4">{interview.title}</h2>

         {/* Technologies */}
        <div>
           <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
              <Laptop size={16} />
              <span>Technologies</span>
            </div>
          <div className="flex flex-wrap items-center gap-2">
            {displayedTechnologies.map((tech) => (
              <Chip
                key={tech}
                size="sm"
                 variant="bordered"
                 className="text-xs border-gray-600 text-gray-300"
                 startContent={<span aria-hidden="true">{getTechEmoji(tech)}</span>}
              >
                {tech}
              </Chip>
            ))}
            {interview.technologies.length > 4 && (
              <Button
                aria-label={showAllTechnologies ? "Show less technologies" : "Show more technologies"}
                className="text-xs text-primary-400 hover:text-primary-300 p-0 min-w-0 h-auto"
                endContent={showAllTechnologies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                size="sm"
                variant="light"
                onClick={() => setShowAllTechnologies(!showAllTechnologies)}
              >
                {showAllTechnologies ? "Show Less" : `+${interview.technologies.length - 4} More`}
              </Button>
            )}
          </div>
        </div>

        {/* Focus Areas */}
        <div>
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
              <ListChecks size={16} />
              <span>Focus Areas</span>
            </div>
          <div className="flex flex-wrap items-center gap-2">
            {displayedFocusAreas.map((area) => {
              const { label, emoji } = getFocusAreaLabel(area);
               return (
                <Chip
                  key={area}
                  size="sm"
                  variant="bordered"
                  className="text-xs border-gray-600 text-gray-300"
                  startContent={<span aria-hidden="true">{emoji}</span>}
                >
                  {label}
                </Chip>
              );
            })}
            {interview.focusAreas.length > 2 && (
              <Button
                aria-label={showAllFocusAreas ? "Show less focus areas" : "Show more focus areas"}
                className="text-xs text-primary-400 hover:text-primary-300 p-0 min-w-0 h-auto"
                endContent={showAllFocusAreas ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                size="sm"
                variant="light"
                onClick={() => setShowAllFocusAreas(!showAllFocusAreas)}
              >
                {showAllFocusAreas ? "Show Less" : `+${interview.focusAreas.length - 2} More`}
              </Button>
            )}
          </div>
        </div>

        {/* Scores */}
         <div>
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
              <Award size={16} />
              <span>Average Scores</span>
            </div>
           <div className="flex items-center gap-4">
             {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => {
               const score = interview.versions[level as DifficultyLevel];
               const hasScore = score !== null && score !== undefined;
               return (
                 <div key={level} className="flex items-center gap-1">
                   <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                     {hasScore ? Math.round(score) : '--'}
                   </span>
                   <span className="text-xs text-gray-400">{level.charAt(0) + level.slice(1).toLowerCase()}</span>
                 </div>
               );
             })}
           </div>
         </div>

        {/* Footer: Duration and Date */}
        <div className="flex items-center gap-2 text-tiny text-gray-400 mt-auto pt-4 border-t border-gray-700/50">
          <Clock size={12} />
          <span>{interview.duration} minutes</span>
          <span>•</span>
          <span>Created on {format(interview.createdAt, "MMM d, yyyy")}{/* h:mm a*/}</span>
        </div>
      </CardBody>
    </Card>
  );
}
