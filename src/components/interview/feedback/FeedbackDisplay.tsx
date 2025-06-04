import React from 'react';
import { Star } from 'lucide-react';

interface FeedbackData {
  technical: number;
  communication: number;
  overallScore: number;
  summary: string;
  questionAnalysis: Array<{
    question: string;
    analysis: string;
    strengths: string[];
    improvements: string[];
  }>;
}

interface FeedbackDisplayProps {
  feedback: string | null;
  className?: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, className = '' }) => {
  if (!feedback) return null;

  try {
    const feedbackData: FeedbackData = JSON.parse(feedback);

    return (
      <div className={`space-y-6 ${className}`}>
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
            {feedbackData.questionAnalysis.map((analysis, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-white mb-2">{analysis.question}</h5>
                <p className="text-sm text-gray-400 mb-3">{analysis.analysis}</p>
                
                {analysis.strengths.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-xs font-medium text-green-400 mb-1">Strengths</h6>
                    <ul className="list-disc list-inside text-sm text-gray-400">
                      {analysis.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {analysis.improvements.length > 0 && (
                  <div>
                    <h6 className="text-xs font-medium text-yellow-400 mb-1">Areas for Improvement</h6>
                    <ul className="list-disc list-inside text-sm text-gray-400">
                      {analysis.improvements.map((improvement, i) => (
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

export default FeedbackDisplay; 