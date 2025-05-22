import React, { useState } from "react";
import { Interview } from "@/types/interview.types";
import { Session } from "@/types/session.types";
import { Difficulty } from "@prisma/client";

interface InterviewDetailsProps {
  interview: Interview;
  onCreateSession: (difficulty: Difficulty) => Promise<Session>;
  onStartInterview: (session: Session) => void;
  onClose: () => void;
}

const difficultyOptions = [
  {
    value: 'BEGINNER' as Difficulty,
    label: 'Beginner',
    description: 'Basic concepts and fundamental questions'
  },
  {
    value: 'INTERMEDIATE' as Difficulty,
    label: 'Intermediate',
    description: 'More complex scenarios and problem-solving'
  },
  {
    value: 'ADVANCED' as Difficulty,
    label: 'Advanced',
    description: 'Expert-level questions and system design'
  }
];

const InterviewDetails = ({ interview, onCreateSession, onStartInterview, onClose }: InterviewDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdSession, setCreatedSession] = useState<Session | null>(null);

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    try {
      setIsLoading(true);
      setSelectedDifficulty(difficulty);
      const session = await onCreateSession(difficulty);
      setCreatedSession(session);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = () => {
    if (createdSession) {
      onStartInterview(createdSession);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedDifficulty(null);
    setCreatedSession(null);
  };

  if (showConfirmation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Session Created Successfully!</h2>
          <p className="text-gray-400 mb-8">
            Your interview session has been created with {selectedDifficulty?.toLowerCase()} difficulty level.
            Click the button below to start your interview.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartInterview}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{interview.title}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{interview.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>{interview.technologies.join(', ')}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-400">{interview.description}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interview.focusAreas.map((area, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-400">{area}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select Difficulty Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDifficultySelect(option.value)}
                disabled={isLoading}
                className={`text-left p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors relative
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading && selectedDifficulty === option.value && (
                  <div className="absolute inset-0 bg-gray-800/50 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                )}
                <h3 className="font-semibold text-white mb-1">{option.label}</h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails; 