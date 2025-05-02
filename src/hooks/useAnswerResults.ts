import { useCallback, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { AnswerResponse } from './mocks/types';

export interface UseAnswerResultsProps {
  itemId: string;
  cioClient: MockConstructorIOClient;
  parameters?: Record<string, any>;
}

export interface UseAnswerResultsReturn {
  data: Nullable<AnswerResponse>;
  isLoading: boolean;
  error: Error | null;
  getAnswer: (question: string) => void;
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
  cioClient,
}: UseAnswerResultsProps): UseAnswerResultsReturn {
  const [answerResults, setAnswerResults] = useState<AnswerResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResult = useCallback(
    (question: string) => {
      if (!cioClient) return;

      setIsLoading(true);
      setError(null);

      fetchAnswerResults(cioClient, itemId, question)
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
    [cioClient, itemId],
  );

  return {
    data: answerResults,
    isLoading,
    error,
    getAnswer: fetchResult,
  };
}
