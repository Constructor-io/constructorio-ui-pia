import { useCallback, useMemo, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { Formatters, Item, GetAnswerResultsResponse } from '../types';
import { transformResultItem } from '../utils/transformers';

export interface UseAnswerResultsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient: MockConstructorIOClient;
  parameters?: Record<string, string | number | boolean>;
  formatImageUrl?: Formatters['formatImageUrl'];
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
  parameters?: Record<string, string | number | boolean>;
}

const extractAndTransformItems = (
  data: Nullable<GetAnswerResultsResponse>,
  formatImageUrl?: Formatters['formatImageUrl'],
): Array<Item> | null => {
  if (!data?.item_results?.response?.results) {
    return null;
  }

  const { results } = data.item_results.response;
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const transformedItems = results
    .map((item) => transformResultItem(item, formatImageUrl))
    .filter((item): item is Item => item !== null);

  return transformedItems.length > 0 ? transformedItems : null;
};

const fetchAnswerResults = async ({
  client,
  itemId,
  question,
  variationId,
  threadId,
  parameters,
}: FetchAnswerResultsParams) => {
  const response: GetAnswerResultsResponse = await client.agent.getAnswerResults({
    itemId,
    variationId,
    threadId,
    question,
    parameters,
  });
  return response;
};

export default function useAnswerResults({
  itemId,
  variationId,
  threadId,
  cioClient,
  parameters,
  formatImageUrl,
}: UseAnswerResultsProps): UseAnswerResultsReturn {
  const [answerResults, setAnswerResults] = useState<GetAnswerResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const items = useMemo(
    () => extractAndTransformItems(answerResults, formatImageUrl),
    [answerResults, formatImageUrl],
  );

  const fetchResult = useCallback(
    (question: string) => {
      if (!cioClient) return;

      setIsLoading(true);
      setError(null);
      setAnswerResults(null);

      fetchAnswerResults({ client: cioClient, itemId, question, variationId, threadId, parameters })
        .then((fetchedAnswerResults) => {
          setAnswerResults(fetchedAnswerResults);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Error fetching answer'));
          setAnswerResults(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [cioClient, itemId, variationId, threadId, parameters],
  );

  return {
    data: answerResults,
    items,
    isLoading,
    error,
    getAnswer: fetchResult,
  };
}
