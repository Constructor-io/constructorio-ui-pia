import { useCallback, useEffect, useState } from 'react';
import { Question, QuestionResponse, SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
  parameters?: SuggestedQuestionsParameters;
  requestParameters?: Record<string, string | number | boolean>;
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
  requestParameters?: Record<string, string | number | boolean>;
}

const fetchSuggestedQuestions = async ({
  client,
  itemId,
  variationId,
  threadId,
  parameters,
  requestParameters,
}: FetchSuggestedQuestionsParams) => {
  const response: QuestionResponse = await client.agent.getSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    parameters,
    requestParameters,
  });

  return response.questions;
};

export default function useSuggestedQuestions({
  itemId,
  variationId,
  threadId,
  cioClient,
  parameters,
  requestParameters,
}: UseSuggestedQuestionsProps): UseSuggestedQuestionsReturn {
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Serialize to a primitive so an object-literal prop doesn't retrigger the auto-fetch effect each render.
  const requestParametersKey = JSON.stringify(requestParameters);

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
      requestParameters,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- primitive deps prevent refetch loop
  }, [cioClient, itemId, variationId, threadId, parameters?.numResults, requestParametersKey]);

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
