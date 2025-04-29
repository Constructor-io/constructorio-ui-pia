import { useCallback, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import { DEMO_API_KEY } from '../constants';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { AnswerResponse } from './mocks/types';
import useCioClient from './useCioClient';

export interface UseAnswerResultsProps {
  itemId: string;
  parameters?: Record<string, any>;
}

export interface UseAnswerResultsResponse {
  data: Nullable<AnswerResponse>;
  isLoading: boolean;
  error: Error | null;
  fetchResult: (question: string) => void;
}

const fetchAnswerResults = async (
  client: MockConstructorIOClient,
  itemId: string,
  question: string,
) => {
  const response: AnswerResponse = await client.assistant.getAnswerResults({
    itemId,
    question,
  });
  return response;
};

export default function useAnswerResults({
  itemId,
}: UseAnswerResultsProps): UseAnswerResultsResponse {
  const client = useCioClient({ apiKey: DEMO_API_KEY });
  const [answerResults, setAnswerResults] = useState<AnswerResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResult = useCallback(
    (question: string) => {
      if (!client) return;

      setIsLoading(true);
      setError(null);

      fetchAnswerResults(client, itemId, question)
        .then((fetchedAnswerResults) => {
          setAnswerResults(fetchedAnswerResults);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Error fetching answer results'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [client, itemId],
  );

  return {
    data: answerResults,
    isLoading,
    error,
    fetchResult,
  };
}
