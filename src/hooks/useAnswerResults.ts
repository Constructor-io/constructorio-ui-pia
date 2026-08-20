import { useCallback, useMemo, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import { AnswerRequestParameters, Formatters, Item, GetAnswerResultsResponse } from '../types';
import { extractAndTransformItems } from '../utils/transformers';
import type { CioClient } from './useCioPia';

export interface UseAnswerResultsProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient: CioClient;
  parameters?: AnswerRequestParameters;
  formatImageUrl?: Formatters['formatImageUrl'];
}

export interface UseAnswerResultsReturn {
  data: Nullable<GetAnswerResultsResponse>;
  items: Array<Item> | null;
  isLoading: boolean;
  error: Error | null;
  getAnswer: (question: string) => void;
}

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

      cioClient.agent.pia
        .getAnswerResults(itemId, question, { threadId, variationId, ...parameters })
        .then((response) => {
          setAnswerResults(response as GetAnswerResultsResponse);
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
