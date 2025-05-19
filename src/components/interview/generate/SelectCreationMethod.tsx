import React from "react";
import { ArrowRight } from "lucide-react";

interface InterviewMethodCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
}

const InterviewMethodCard = ({ icon, title, subtitle, description, onClick }: InterviewMethodCardProps) => (
  <button
    onClick={onClick}
    className="group w-full text-left bg-background hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl p-6 transition-all duration-200 
    hover:scale-[1.01] hover:shadow-lg dark:hover:shadow-gray-800/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
  >
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</span>
          <span className="text-sm text-foreground/60">{subtitle}</span>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-primary group-hover:transform group-hover:translate-x-1 transition-all" />
    </div>
    <p className="mt-3 text-sm text-foreground/60 pl-16">
      {description}
    </p>
  </button>
);

const InterviewMethodSelector = ({ onSelect }: { onSelect: (type: string) => void }) => {
  const methods = [
    {
      icon: "📝",
      title: "Create Manually",
      subtitle: "Customize your own interview",
      description: "Fill out a form to customize questions and settings for your interview. Perfect for specific requirements.",
      value: "manually"
    },
    {
      icon: "✨",
      title: "Create with AI Agent",
      subtitle: "AI-powered interview generation",
      description: "Let our AI agent guide you through creating a personalized interview based on your needs.",
      value: "agent"
    },
    {
      icon: "📄",
      title: "Create from Job Description",
      subtitle: "Auto-generate from JD",
      description: "Upload a job description and let AI generate relevant interview questions based on the requirements.",
      value: "byJd"
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      {methods.map((method) => (
        <InterviewMethodCard
          key={method.value}
          icon={method.icon}
          title={method.title}
          subtitle={method.subtitle}
          description={method.description}
          onClick={() => onSelect(method.value)}
        />
      ))}
    </div>
  );
};

export default InterviewMethodSelector;
