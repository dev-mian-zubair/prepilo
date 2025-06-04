import React, { useState } from 'react';
import { Session } from '@/types/session.types';
import { Button } from '@heroui/button';
import { Clock, Play, RefreshCw, X, Rocket, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Interview } from '@/types/interview';
import FeedbackModal from '../feedback/FeedbackModal';
import SessionStatusModal from './SessionStatusModal';

interface SessionListProps {
  sessions: Session[];
  onResume: (sessionId: string) => void;
  onReattempt: () => void;
  interviewId: string;
  interview: Interview;
  onClose: () => void;
}

const SessionList = ({ 
  sessions, 
  onResume, 
  onReattempt, 
  interviewId,
  interview,
  onClose 
}: SessionListProps) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400';
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: Session['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'PAUSED':
        return 'Paused';
      default:
        return status;
    }
  };

  const getActionButton = (session: Session) => {
    switch (session.status) {
      case 'IN_PROGRESS':
        return (
          <Button
            onPress={() => onResume(session.id)}
            className="flex items-center gap-2"
            color="primary"
            size="sm"
          >
            <Play className="w-4 h-4" />
            Resume
          </Button>
        );
      case 'PAUSED':
        return (
          <Button
            onPress={() => onResume(session.id)}
            className="flex items-center gap-2"
            color="warning"
            size="sm"
          >
            <Play className="w-4 h-4" />
            Continue
          </Button>
        );
      case 'COMPLETED':
        return (
          <div className="flex items-center gap-2">
            <Button
              onPress={() => setSelectedSession(session)}
              className="flex items-center gap-2"
              color="primary"
              size="sm"
            >
              <Eye className="w-4 h-4" />
              View Feedback
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">{interview.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{interview.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{interview.technologies.join(', ')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onPress={onReattempt}
                className="flex items-center gap-2"
                color="primary"
              >
                <RefreshCw className="w-4 h-4" />
                New Attempt
              </Button>
              <Button
                onPress={onClose}
                isIconOnly
                variant="light"
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Session List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Your Sessions</h2>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Your First Interview</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Begin your interview preparation journey. Practice with our AI interviewer and get real-time feedback to improve your skills.
              </p>
              <Button
                onPress={onReattempt}
                className="flex items-center gap-2"
                color="primary"
                size="lg"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </Button>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="group w-full text-left bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition-all duration-200 
                  hover:scale-[1.01] hover:shadow-lg cursor-pointer"
                onClick={() => {
                  if (session.status === 'COMPLETED') {
                    setSelectedSession(session);
                    setShowFeedbackModal(true);
                  } else {
                    setSelectedSession(session);
                    setShowStatusModal(true);
                  }
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                      session.status === 'COMPLETED' ? 'bg-green-500/5' :
                      session.status === 'PAUSED' ? 'bg-yellow-500/5' :
                      session.status === 'IN_PROGRESS' ? 'bg-blue-500/5' :
                      'bg-gray-500/5'
                    } ${
                      session.status === 'COMPLETED' ? 'group-hover:bg-green-500/10' :
                      session.status === 'PAUSED' ? 'group-hover:bg-yellow-500/10' :
                      session.status === 'IN_PROGRESS' ? 'group-hover:bg-blue-500/10' :
                      'group-hover:bg-gray-500/10'
                    }`}>
                      <Play className={`w-5 h-5 ${
                        getStatusColor(session.status).replace('/20', '').replace('bg-', 'text-')
                      }`}/>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                        Session {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
                      </span>
                      <span className="text-sm text-gray-400">
                        {session.version?.difficulty || 'Unknown'} Level
                      </span>
                      {session.feedback && (
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-blue-400">Tech:</span>
                            <span className="text-xs font-medium text-white">{session.feedback.technical}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-green-400">Comm:</span>
                            <span className="text-xs font-medium text-white">{session.feedback.communication}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-purple-400">Overall:</span>
                            <span className="text-xs font-medium text-white">
                              {session.overallScore?.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getActionButton(session)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSession && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedback={selectedSession.feedback ? JSON.stringify(selectedSession.feedback) : null}
          sessionDate={formatDistanceToNow(new Date(selectedSession.startedAt), { addSuffix: true })}
          session={{
            ...selectedSession,
            startedAt: selectedSession.startedAt.toISOString(),
            endedAt: selectedSession.endedAt?.toISOString(),
          }}
        />
      )}

      {/* Session Status Modal */}
      {showStatusModal && selectedSession && (
        <SessionStatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          session={selectedSession}
          onResumeSession={onResume}
        />
      )}
    </div>
  );
};

export default SessionList; 