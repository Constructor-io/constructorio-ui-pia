import { useCallback, useRef, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { Item, GetAnswerResultsResponse } from '../types';
import { transformResultItem } from '../utils/transformers';

export interface UseAnswerResultsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient: MockConstructorIOClient;
  parameters?: Record<string, any>;
  formatImageUrl?: (url: string) => string;
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

const extractAndTransformItems = (
  data: Nullable<GetAnswerResultsResponse>,
  formatImageUrl?: (url: string) => string,
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
  formatImageUrl,
}: UseAnswerResultsProps): UseAnswerResultsReturn {
  const [answerResults, setAnswerResults] = useState<GetAnswerResultsResponse | null>(null);
  const [items, setItems] = useState<Array<Item> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const formatImageUrlRef = useRef(formatImageUrl);
  formatImageUrlRef.current = formatImageUrl;

  const fetchResult = useCallback(
    (question: string) => {
      if (!cioClient) return;

      setIsLoading(true);
      setError(null);

      fetchAnswerResults({ client: cioClient, itemId, question, variationId, threadId })
        .then((fetchedAnswerResults) => {
          setAnswerResults(fetchedAnswerResults);
          setItems(extractAndTransformItems(fetchedAnswerResults, formatImageUrlRef.current));
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Error fetching answer'));
          setAnswerResults(null);
          setItems(null);
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
