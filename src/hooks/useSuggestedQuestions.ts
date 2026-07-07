import { useCallback, useEffect, useState } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { Question, SuggestedQuestionsParameters } from '../types';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: ConstructorIOClient;
  parameters?: SuggestedQuestionsParameters;
}

export interface UseSuggestedQuestionsReturn {
  data: Array<Question>;
  isLoading: boolean;
  error: Error | null;
  getSuggestedQuestions: () => void;
}

interface FetchSuggestedQuestionsParams {
  client: ConstructorIOClient;
  itemId: string;
  variationId?: string;
  threadId?: string;
  parameters?: SuggestedQuestionsParameters;
}

const fetchSuggestedQuestions = async ({
  client,
  itemId,
  variationId,
  threadId,
  parameters,
}: FetchSuggestedQuestionsParams) => {
  const response = await client.agent.pia.getSuggestedQuestions(itemId, {
    threadId,
    variationId,
    numResults: parameters?.numResults,
  });

  return response.questions;
};

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

  const fetchResult = useCallback(() => {
    if (!cioClient) return;

    setIsLoading(true);
    setError(null);

    fetchSuggestedQuestions({
      client: cioClient,
      itemId,
      variationId,
      threadId,
      parameters,
    })
      .then((fetchedQuestions) => {
        setQuestions(fetchedQuestions);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Error fetching questions'));
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- primitive dep prevents refetch on object reference change
  }, [cioClient, itemId, variationId, threadId, parameters?.numResults]);

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
