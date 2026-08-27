import { useCallback, useEffect, useMemo, useState } from 'react';
import { Question, SuggestedQuestionsParameters } from '../types';
import type { CioClient } from './usePiaClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: CioClient;
  parameters?: SuggestedQuestionsParameters;
}

export interface UseSuggestedQuestionsReturn {
  data: Array<Question>;
  isLoading: boolean;
  error: Error | null;
  getSuggestedQuestions: () => void;
}

export default function useSuggestedQuestions({
  itemId,
  variationId,
  threadId,
  cioClient,
  parameters,
}: UseSuggestedQuestionsProps): UseSuggestedQuestionsReturn {
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const serializedParameters = useMemo(() => JSON.stringify(parameters), [parameters]);

  const fetchResult = useCallback(() => {
    if (!cioClient) return;

    setIsLoading(true);
    setError(null);

    cioClient.agent.pia
      .getSuggestedQuestions(itemId, {
        threadId,
        variationId,
        ...parameters,
      })
      .then((response) => {
        setQuestions(response.questions);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Error fetching questions'));
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cioClient, itemId, variationId, threadId, serializedParameters]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  return {
    data: questions,
    isLoading,
    error,
    getSuggestedQuestions: fetchResult,
  };
}
