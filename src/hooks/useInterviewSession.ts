import { useState, useEffect } from 'react';
import { Session } from '@/types/session.types';
import { getInterviewSessions } from '@/actions/interview-session';

export const useInterviewSession = (interviewId: string) => {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const data = await getInterviewSessions(interviewId);
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setSessions(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (interviewId) {
      fetchSessions();
    }
  }, [interviewId]);

  return { sessions, isLoading, error };
}; 