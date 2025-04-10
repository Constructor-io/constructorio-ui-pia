import { useCallback, useEffect, useState } from 'react';
import useCioClient from './useCioClient';
import { Question, QuestionResponse } from './mocks/types';
import { DEMO_API_KEY } from '../constants';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  paramter?: Record<string, any>;
}

interface UseSuggestedQuestionsResponse {
  questions: Array<Question>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const fetchSuggestedQuestions = async (client: MockConstructorIOClient, itemId: string) => {
  const response: QuestionResponse = await client.assistant.getSuggestedQuestions(itemId);
  return response.questions;
};

export default function useSuggestedQuestions({
  itemId,
}: UseSuggestedQuestionsProps): UseSuggestedQuestionsResponse {
  const client = useCioClient({ apiKey: DEMO_API_KEY });
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    fetchSuggestedQuestions(client, itemId)
      .then((fetchedQuestions) => {
        setQuestions(fetchedQuestions);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error fetching suggested questions');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [client, itemId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    questions,
    isLoading,
    error,
    refetch: fetchData,
  };
}
