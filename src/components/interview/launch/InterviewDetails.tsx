import React, { useState } from 'react';
import { Interview } from '@/types/interview';
import { Button } from '@heroui/button';
import { Clock, Code, Target, X, Loader2 } from 'lucide-react';
import { Difficulty } from '@prisma/client';
import { Session } from '@/types/session.types';

interface InterviewDetailsProps {
  interview: Interview;
  onCreateSession: (difficulty: Difficulty) => Promise<Session>;
  onStartInterview: (session: Session) => void;
  onClose: () => void;
}

const difficultyOptions = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    description: 'Basic concepts and fundamental questions'
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    description: 'More complex scenarios and problem-solving'
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    description: 'Expert-level questions and system design'
  }
] as const;

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
            <Target className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Session Created Successfully!</h2>
          <p className="text-gray-400 mb-8">
            Your interview session has been created with {selectedDifficulty?.toLowerCase()} difficulty level.
            Click the button below to start your interview.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleCancel}
              variant="light"
              color="danger"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartInterview}
              color="success"
            >
              Start Interview
            </Button>
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
              <Clock className="w-4 h-4" />
              <span>{interview.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>{interview.technologies.join(', ')}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={onClose}
          isIconOnly
          variant="light"
          className="text-gray-400 hover:text-white"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </Button>
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
                <Target className="w-5 h-5 text-primary mt-0.5" />
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
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
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