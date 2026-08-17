import { useCallback, useEffect, useRef, useState } from 'react';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import {
  Formatters,
  Item,
  QuestionSource,
  RecsPodParameters,
  RecsRefinement,
  RecsResult,
  Translations,
} from '../types';
import { AgentRequestError } from '../errors';
import { UseTrackingReturn } from './useTracking';
import { translate } from '../utils/translate';
import { RECS_FALLBACK_TITLE, RECS_LOADING_TITLE, RECS_UNSUPPORTED_REQUEST } from '../constants';

export interface UseRecsPodProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
  parameters?: RecsPodParameters;
  formatImageUrl?: Formatters['formatImageUrl'];
  translations?: Translations;
  tracking?: UseTrackingReturn;
}

export interface UseRecsPodReturn {
  /** The title to show right now, already resolved for the current state. */
  title: string;
  items: Array<Item> | null;
  refinement: RecsRefinement | null;
  /** True while a request is in flight. */
  isLoading: boolean;
  /** True until the first request settles, when there is nothing to hold on screen yet. */
  isFirstLoad: boolean;
  /** The failure behind the fallback title, for callers rendering their own error handling. */
  error: Error | null;
  /** Message to show under the input when the text the shopper sent was rejected. */
  inputError: string | null;
  /** The text behind what is currently on screen. Empty when nothing has been refined. */
  lastShopperInput: string;
  resultId?: string;
  /** Fetches again, narrowed by `text`. Used by both the options and the free-text input. */
  refine: (text: string, source?: QuestionSource) => void;
}

const DEFAULT_STRATEGY = 'complementary_items';

/**
 * Builds the payload the answer-view tracking event expects out of a recommendations result.
 * The event is shared with Q&A, so the pod title stands in for the answer text and the
 * refinement options stand in for the follow-up questions.
 */
function toTrackedAnswer(result: RecsResult) {
  return {
    qna_result_id: result.resultId || '',
    value: result.title,
    ...(result.refinement &&
      result.refinement.options.length > 0 && {
        follow_up_questions: result.refinement.options.map((value) => ({ value })),
      }),
  };
}

/**
 * Owns everything a recommendations pod shows: one request on mount, one on every refinement,
 * and the title that belongs to whichever of those is happening right now.
 *
 * The previous response is deliberately kept while a new one is in flight, so a refinement
 * swaps the products without blanking the title above them.
 */
export default function useRecsPod({
  itemId,
  variationId,
  threadId,
  cioClient,
  parameters,
  formatImageUrl,
  translations,
  tracking,
}: UseRecsPodProps): UseRecsPodReturn {
  const [result, setResult] = useState<RecsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsupportedInput, setHasUnsupportedInput] = useState<boolean>(false);
  const [lastShopperInput, setLastShopperInput] = useState<string>('');

  // Counts requests so a slow response cannot overwrite a newer one. There is no
  // AbortController in this library, so the older request still completes; its result is
  // simply dropped.
  const requestIdRef = useRef(0);

  // Mirrored into refs so they never become fetch dependencies. Both are commonly written
  // inline by the caller, which would give them a new identity on every render and refetch
  // forever.
  const formatImageUrlRef = useRef(formatImageUrl);
  const trackingRef = useRef(tracking);

  useEffect(() => {
    formatImageUrlRef.current = formatImageUrl;
    trackingRef.current = tracking;
  }, [formatImageUrl, tracking]);

  const strategy = parameters?.strategy || DEFAULT_STRATEGY;
  const { numResults } = parameters || {};

  const fetchResult = useCallback(
    (shopperInput?: string) => {
      if (!cioClient) return;

      requestIdRef.current += 1;
      const requestId = requestIdRef.current;
      const isCurrent = () => requestId === requestIdRef.current;

      setIsLoading(true);
      setError(null);
      setHasUnsupportedInput(false);

      cioClient.agent
        .getRecs({
          itemId,
          variationId,
          threadId,
          strategy,
          shopperInput,
          numResults,
          formatImageUrl: formatImageUrlRef.current,
        })
        .then((fetchedResult) => {
          if (!isCurrent()) return;

          setResult(fetchedResult);
          setLastShopperInput(shopperInput || '');
          trackingRef.current?.trackAnswerView(
            shopperInput || '',
            toTrackedAnswer(fetchedResult),
            fetchedResult.items,
          );
        })
        .catch((err) => {
          if (!isCurrent()) return;

          const failure = err instanceof Error ? err : new Error('Error fetching recommendations');
          const status = failure instanceof AgentRequestError ? failure.status : undefined;

          if (status === 400) {
            // A 400 means the request we built was malformed, which is our bug, not the
            // shopper's. Make it loud so it is caught in development.
            console.error('Constructor PIA: the recommendations request was rejected.', failure);
          }

          // A rejected input changes nothing but the input, so the response on screen stays.
          if (status === 422) {
            setHasUnsupportedInput(true);
            return;
          }

          setError(failure);
        })
        .finally(() => {
          if (!isCurrent()) return;

          setIsLoading(false);
          setIsFirstLoad(false);
        });
    },
    // Every dependency is a primitive. `formatImageUrl` and `tracking` are read through refs
    // instead, so a caller writing them inline cannot restart the request on every render.
    [cioClient, itemId, variationId, threadId, strategy, numResults],
  );

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const refine = useCallback(
    (text: string, source: QuestionSource = 'user') => {
      const refinementText = text.trim();
      if (!refinementText) return;

      if (source === 'suggestion') {
        trackingRef.current?.trackQuestionClick(refinementText);
      } else {
        trackingRef.current?.trackQuestionSubmit(refinementText);
      }

      fetchResult(refinementText);
    },
    [fetchResult],
  );

  // The title of whatever is on screen, which is the last response we kept.
  const settledTitle = result?.title || parameters?.defaultTitle || '';

  let title = settledTitle;
  if (isLoading) {
    title = settledTitle || translate(RECS_LOADING_TITLE, translations);
  } else if (!hasUnsupportedInput && (error || result?.status === 'partial')) {
    // Either the request failed or it came back degraded, so the personalized title cannot be
    // trusted. Any products it did carry are still worth showing under a generic title.
    title = translate(RECS_FALLBACK_TITLE, translations);
  }

  return {
    title,
    items: result?.items || null,
    refinement: result?.refinement || null,
    isLoading,
    isFirstLoad,
    error,
    inputError: hasUnsupportedInput ? translate(RECS_UNSUPPORTED_REQUEST, translations) : null,
    lastShopperInput,
    resultId: result?.resultId,
    refine,
  };
}
