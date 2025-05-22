import { useState, useEffect } from 'react';
import { Interview } from '@/types/interview';
import { getInterviewWithDetails } from '@/actions/interview';

export const useInterview = (interviewId: string) => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state
        const data = await getInterviewWithDetails(interviewId);

        // Transform the Prisma response to match our Interview type
        const transformedInterview: Interview = {
          id: data.id,
          title: data.title,
          duration: data.duration,
          focusAreas: data.focusAreas as unknown as Interview['focusAreas'],
          technologies: data.technologies.map(t => t.technology.name),
          description: data.description || undefined
        };

        setInterview(transformedInterview);
      } catch (err) {
        console.error('Failed to fetch interview:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setInterview(null); // Ensure interview is null when there's an error
      } finally {
        setIsLoading(false);
      }
    };

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId]);

  return { interview, isLoading, error };
}; 