import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarType } from "@/types/interview";
import { Session } from "@/types/session.types";
import { Interview } from "@/types/interview";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";
import FeedbackDisplay from "../feedback/FeedbackDisplay";

interface ActionSidebarProps {
  messages: any[];
  type: SidebarType;
  onClose: () => void;
  session?: Session;
  interview?: Interview;
}

const ActionSidebar = ({ messages, type, onClose, session, interview }: ActionSidebarProps) => {
  const { feedback, isGeneratingFeedback, error } = useInterviewAgent();

  const renderContent = () => {
    if (type === "info" && session && interview) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Interview Details</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-400">Title</p>
                <p className="text-white">{interview.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="text-white">{session.version?.difficulty || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Focus Areas</p>
                <p className="text-white">{interview.focusAreas.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-white">{interview.duration} minutes</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Questions</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              {session.questions?.length > 0 ? (
                session.questions.map((question, index) => (
                  <div key={index} className="text-white">
                    <p className="text-sm">{question.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No questions available</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (type === "feedback") {
      if (isGeneratingFeedback) {
        return (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-400">Generating feedback...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex flex-col h-full items-center justify-center">
            <p className="text-red-400">{error}</p>
          </div>
        );
      }

      if (!feedback) {
        return (
          <div className="flex flex-col h-full items-center justify-center">
            <p className="text-gray-400">No feedback generated yet</p>
          </div>
        );
      }

      return <FeedbackDisplay feedback={feedback} />;
    }

    return (
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "assistant"
                  ? "bg-blue-600 text-white rounded-tl-none"
                  : "bg-gray-800 text-gray-200 rounded-tr-none"
              }`}
            >
              <div className="text-xs font-medium mb-1 opacity-70">
                {message.role === "assistant" ? "Interviewer" : "You"}
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          {type === "conversation" ? "Conversation" : type === "info" ? "Interview Information" : "Feedback"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          title="Close sidebar"
        >
          <XMarkIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default ActionSidebar; 