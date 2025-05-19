import React from "react";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";

interface InterviewFormLayoutProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}

const InterviewFormLayout: React.FC<InterviewFormLayoutProps> = ({
  title,
  subtitle,
  onBack,
  children,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col px-4">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl flex flex-col flex-1">
        {/* Sticky Header */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 pb-4 rounded-t-xl border-b border-divider">
          <div className="flex items-center justify-between">
            <Button
              className="rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-800"
              size="sm"
              variant="light"
              onClick={onBack}
              startContent={<ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />}
            >
              Change Creation Method
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-6">{title}</h2>
          <p className="text-foreground/60">{subtitle}</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pt-4 space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFormLayout; 