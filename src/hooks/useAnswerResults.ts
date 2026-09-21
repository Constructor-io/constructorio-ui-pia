import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Nullable } from '@constructor-io/constructorio-client-javascript';
import { AnswerRequestParameters, Formatters, Item, GetAnswerResultsResponse } from '../types';
import { extractAndTransformItems } from '../utils/transformers';
import type { CioClient } from './usePiaClient';

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

  const serializedParameters = useMemo(() => JSON.stringify(parameters), [parameters]);

  const items = useMemo(
    () => extractAndTransformItems(answerResults, formatImageUrl),
    [answerResults, formatImageUrl],
  );

  // The client is how the question is asked, not part of the question: a host that
  // rebuilds it on render must not change the identity of getAnswer, which callers
  // are free to put in an effect's dependencies. Read at call time, never stale.
  const cioClientRef = useRef(cioClient);
  useEffect(() => {
    cioClientRef.current = cioClient;
  }, [cioClient]);

  const fetchResult = useCallback(
    (question: string) => {
      const client = cioClientRef.current;
      if (!client) return;

      setIsLoading(true);
      setError(null);
      setAnswerResults(null);

      client.agent.pia
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
    // parameters is serialized via serializedParameters to keep getAnswer stable across
    // identity-only changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemId, variationId, threadId, serializedParameters],
  );

  return {
    data: answerResults,
    items,
    isLoading,
    error,
    getAnswer: fetchResult,
  };
}
