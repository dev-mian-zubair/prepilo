import React from 'react';
import { Session } from '@/types/session.types';
import { Button } from '@heroui/button';
import { Clock, Play, RefreshCw, X, Rocket } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Interview } from '@/types/interview';

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
  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400';
      case 'PAUSED':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400';
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
      case 'CANCELLED':
        return 'Cancelled';
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
          <Button
            onPress={onReattempt}
            className="flex items-center gap-2"
            color="success"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        );
      case 'CANCELLED':
        return (
          <Button
            onPress={onReattempt}
            className="flex items-center gap-2"
            color="danger"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
            Start New
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
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
                  hover:scale-[1.01] hover:shadow-lg"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                        Session {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
                      </span>
                      <span className="text-sm text-gray-400">
                        {session.version?.difficulty || 'Unknown'} Level
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </span>
                    {getActionButton(session)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionList; 