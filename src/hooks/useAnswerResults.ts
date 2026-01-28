import { useCallback, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { GetAnswerResultsResponse } from './mocks/types';

export interface UseAnswerResultsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient: MockConstructorIOClient;
  parameters?: Record<string, any>;
}

export interface UseAnswerResultsReturn {
  data: Nullable<GetAnswerResultsResponse>;
  isLoading: boolean;
  error: Error | null;
  getAnswer: (question: string) => void;
}

interface FetchAnswerResultsParams {
  client: MockConstructorIOClient;
  itemId: string;
  question: string;
  variationId?: string;
  threadId?: string;
}

const fetchAnswerResults = async ({
  client,
  itemId,
  question,
  variationId,
  threadId,
}: FetchAnswerResultsParams) => {
  const response: GetAnswerResultsResponse = await client.agent.getAnswerResults({
    itemId,
    variationId,
    threadId,
    question,
  });
  return response;
};

export default function useAnswerResults({
  itemId,
  variationId,
  threadId,
  cioClient,
}: UseAnswerResultsProps): UseAnswerResultsReturn {
  const [answerResults, setAnswerResults] = useState<GetAnswerResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResult = useCallback(
    (question: string) => {
      if (!cioClient) return;

      setIsLoading(true);
      setError(null);

      fetchAnswerResults({ client: cioClient, itemId, question, variationId, threadId })
        .then((fetchedAnswerResults) => {
          setAnswerResults(fetchedAnswerResults);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Error fetching answer'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [cioClient, itemId, variationId, threadId],
  );

  return {
    data: answerResults,
    isLoading,
    error,
    getAnswer: fetchResult,
  };
}
