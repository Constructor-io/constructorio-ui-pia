import { useCallback, useEffect, useState } from 'react';
import { Question, QuestionResponse, SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
  parameters?: SuggestedQuestionsParameters;
}

export interface UseSuggestedQuestionsReturn {
  data: Array<Question>;
  isLoading: boolean;
  error: Error | null;
  getSuggestedQuestions: () => void;
}

interface FetchSuggestedQuestionsParams {
  client: MockConstructorIOClient;
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
  const response: QuestionResponse = await client.agent.getSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    parameters,
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

  const { numResults } = parameters || {};

  const fetchResult = useCallback(() => {
    if (!cioClient) return;

    setIsLoading(true);
    setError(null);

    fetchSuggestedQuestions({
      client: cioClient,
      itemId,
      variationId,
      threadId,
      parameters: numResults !== undefined ? { numResults } : undefined,
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
  }, [cioClient, itemId, variationId, threadId, numResults]);

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
