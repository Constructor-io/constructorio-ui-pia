import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  // The client is how the question is asked, not part of the question: a host that
  // rebuilds it on render must not make the widget ask the same thing again.
  const cioClientRef = useRef(cioClient);
  useEffect(() => {
    cioClientRef.current = cioClient;
  }, [cioClient]);
  // A client arriving where there was none is the one client change worth a fetch.
  const hasClient = !!cioClient;

  const fetchResult = useCallback(() => {
    const client = cioClientRef.current;
    if (!client) return;

    setIsLoading(true);
    setError(null);

    client.agent.pia
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
    // parameters is serialized via serializedParameters to prevent refetch on identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasClient, itemId, variationId, threadId, serializedParameters]);

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
