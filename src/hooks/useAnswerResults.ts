import { useCallback, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { GetAnswerResultsResponse } from './mocks/types';
import { Item } from '../types';
import { transformResultItem } from '../utils/transformers';

export interface UseAnswerResultsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient: MockConstructorIOClient;
  parameters?: Record<string, any>;
}

export interface UseAnswerResultsReturn {
  data: Nullable<GetAnswerResultsResponse>;
  items: Array<Item> | null;
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

const extractAndTransformItems = (data: Nullable<GetAnswerResultsResponse>): Array<Item> | null => {
  if (!data?.item_results?.response?.results) {
    return null;
  }

  const { results } = data.item_results.response;
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  return results.map(transformResultItem).filter((item): item is Item => item !== null);
};

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
  const [items, setItems] = useState<Array<Item> | null>(null);
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
          setItems(extractAndTransformItems(fetchedAnswerResults));
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
    items,
    isLoading,
    error,
    getAnswer: fetchResult,
  };
}
