import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@heroui/button";
import { SavedMessage } from "@/types/vapi.types";
import { SidebarType } from "@/types/interview";
import "@/styles/scrollbar.css";

interface ActionSidebarProps {
  interview?: any;
  messages: SavedMessage[];
  type: SidebarType;
  onClose: () => void;
}

const ActionSidebar = ({ interview, messages, type, onClose }: ActionSidebarProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      contentRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth"
      });
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-foreground">
          {type === "conversation" ? "Interview Chat" : "Interview Details"}
        </h2>
        <Button
          isIconOnly
          variant="light"
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="flex-1 min-h-0 p-4 scrollbar-stable"
      >
        {type === "conversation" ? (
          <div className="space-y-4 pr-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.role === "assistant" ? "items-start" : "items-end"
                }`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  message.role === "assistant"
                    ? "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
                    : "bg-primary text-white rounded-tr-none"
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <span className="text-xs text-foreground/60 mt-1 px-1">
                  {message.role === "assistant" ? "AI Assistant" : "You"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 pr-2">
            {interview && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Interview Topic
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {interview.title || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Duration
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {interview.duration || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Difficulty Level
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {interview.difficulty || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interview.topics?.map((topic: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/70"
                      >
                        {topic}
                      </span>
                    )) || "Not specified"}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionSidebar;
