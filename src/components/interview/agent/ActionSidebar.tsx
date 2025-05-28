import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Star } from "lucide-react";
import { SidebarType } from "@/types/interview";
import { Session } from "@/types/session.types";
import { Interview } from "@/types/interview";
import { useInterviewAgent } from "@/contexts/InterviewAgentContext";

interface ActionSidebarProps {
  messages: any[];
  type: SidebarType;
  onClose: () => void;
  session?: Session;
  interview?: Interview;
}

const ActionSidebar = ({ messages, type, onClose, session, interview }: ActionSidebarProps) => {
  const { feedback, isGeneratingFeedback, error } = useInterviewAgent();

  const renderFeedback = () => {
    if (!feedback) return null;
    
    try {
      const feedbackData = JSON.parse(feedback);
      
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Technical: {feedbackData.technical}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Communication: {feedbackData.communication}/100</span>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Summary</h4>
            <p className="text-sm text-gray-400">{feedbackData.summary}</p>
          </div>
          
          {feedbackData.questionAnalysis && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Question Analysis</h4>
              {feedbackData.questionAnalysis.map((analysis: any, index: number) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-white mb-2">{analysis.question}</h5>
                  <p className="text-sm text-gray-400 mb-3">{analysis.analysis}</p>
                  
                  {analysis.strengths.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-xs font-medium text-green-400 mb-1">Strengths</h6>
                      <ul className="list-disc list-inside text-sm text-gray-400">
                        {analysis.strengths.map((strength: string, i: number) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysis.improvements.length > 0 && (
                    <div>
                      <h6 className="text-xs font-medium text-yellow-400 mb-1">Areas for Improvement</h6>
                      <ul className="list-disc list-inside text-sm text-gray-400">
                        {analysis.improvements.map((improvement: string, i: number) => (
                          <li key={i}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } catch (e) {
      return (
        <div className="flex flex-col h-full items-center justify-center">
          <p className="text-red-400">Failed to parse feedback data</p>
        </div>
      );
    }
  };

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

      return renderFeedback();
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