import { useCallback, useEffect, useState } from 'react';
import { Question, QuestionResponse } from './mocks/types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  cioClient?: MockConstructorIOClient;
  parameter?: Record<string, any>;
}

export interface UseSuggestedQuestionsReturn {
  data: Array<Question>;
  isLoading: boolean;
  error: Error | null;
  getSuggestedQuestions: () => void;
}

const fetchSuggestedQuestions = async (client: MockConstructorIOClient, itemId: string) => {
  const response: QuestionResponse = await client.assistant.getSuggestedQuestions(itemId);
  return response.questions;
};

export default function useSuggestedQuestions({
  itemId,
  cioClient,
}: UseSuggestedQuestionsProps): UseSuggestedQuestionsReturn {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  return {
    data: questions,
    isLoading,
    error,
    getSuggestedQuestions: fetchData,
  };
}
