import { useCallback, useEffect, useRef, useState } from 'react';
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
  signal?: AbortSignal;
}

const extractAndTransformItems = (data: Nullable<GetAnswerResultsResponse>): Array<Item> | null => {
  if (!data?.item_results?.response?.results) {
    return null;
  }

  const { results } = data.item_results.response;
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const transformedItems = results
    .map(transformResultItem)
    .filter((item): item is Item => item !== null);

  return transformedItems.length > 0 ? transformedItems : null;
};

const fetchAnswerResults = async ({
  client,
  itemId,
  question,
  variationId,
  threadId,
  signal,
}: FetchAnswerResultsParams) => {
  const response: GetAnswerResultsResponse = await client.agent.getAnswerResults({
    itemId,
    variationId,
    threadId,
    question,
    signal,
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchResult = useCallback(
    (question: string) => {
      if (!cioClient) return;

      // Abort any in-flight request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      fetchAnswerResults({
        client: cioClient,
        itemId,
        question,
        variationId,
        threadId,
        signal: controller.signal,
      })
        .then((fetchedAnswerResults) => {
          if (controller.signal.aborted) return;
          setAnswerResults(fetchedAnswerResults);
          setItems(extractAndTransformItems(fetchedAnswerResults));
          setError(null);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setError(err instanceof Error ? err : new Error('Error fetching answer'));
          setAnswerResults(null);
          setItems(null);
        })
        .finally(() => {
          if (controller.signal.aborted) return;
          setIsLoading(false);
        });
    },
    [cioClient, itemId, variationId, threadId],
  );

  // Abort in-flight request on unmount
  useEffect(
    () => () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    },
    [],
  );

  return {
    data: answerResults,
    items,
    isLoading,
    error,
    getAnswer: fetchResult,
  };
}
