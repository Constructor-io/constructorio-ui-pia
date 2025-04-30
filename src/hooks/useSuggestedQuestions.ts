import { useCallback, useEffect, useState } from 'react';
import useCioClient from './useCioClient';
import { Question, QuestionResponse } from './mocks/types';
import { DEMO_API_KEY } from '../constants';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  cioClient?: MockConstructorIOClient;
  parameter?: Record<string, any>;
}

export interface UseSuggestedQuestionsResponse {
  data: Array<Question>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetchSuggestedQuestions = async (client: MockConstructorIOClient, itemId: string) => {
  const response: QuestionResponse = await client.assistant.getSuggestedQuestions(itemId);
  return response.questions;
};

export default function useSuggestedQuestions({
  itemId,
  cioClient,
}: UseSuggestedQuestionsProps): UseSuggestedQuestionsResponse {
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(() => {
    if (!cioClient) return;

    setIsLoading(true);
    setError(null);

    fetchSuggestedQuestions(cioClient, itemId)
      .then((fetchedQuestions) => {
        setQuestions(fetchedQuestions);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Error fetching suggested questions'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [cioClient, itemId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: questions,
    isLoading,
    error,
    refetch: fetchData,
  };
}
