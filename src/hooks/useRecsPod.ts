import { useCallback, useEffect, useRef, useState } from 'react';
import type { CioClient } from './usePiaClient';
import {
  Formatters,
  GetRecsProps,
  Item,
  RecsPodParameters,
  RecsRefinement,
  RecsResult,
  RecsStrategy,
  Translations,
} from '../types';
import { AgentRequestError } from '../errors';
import { translate } from '../utils/translate';
import { RECS_FALLBACK_TITLE, RECS_LOADING_TITLE, RECS_UNSUPPORTED_REQUEST } from '../constants';

/**
 * What the shopper did to ask for this refinement.
 *
 * Worth distinguishing because a rejected request is only the shopper's business when the text
 * came from them. An option is a label the API itself suggested, so a rejection there is ours to
 * answer for, not something to flag under their input.
 */
export type RefinementSource = 'option' | 'input';

export interface UseRecsPodProps {
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: CioClient;
  parameters?: RecsPodParameters;
  formatImageUrl?: Formatters['formatImageUrl'];
  translations?: Translations;
}

export interface UseRecsPodReturn {
  /** The title to show right now, already resolved for the current state. */
  title: string;
  /** The products to render, or `null` when there are none. Never an empty array. */
  items: Array<Item> | null;
  refinement: RecsRefinement | null;
  /** True while a request is in flight. */
  isLoading: boolean;
  /**
   * The failure behind the fallback title, for callers rendering their own error handling.
   * Only set for an outright failure: a degraded response (`status: 'partial'`) shows the fallback
   * title with `error` still null, because that response arrived and its products are usable.
   */
  error: Error | null;
  /** Message to show under the input when the text the shopper sent was rejected. */
  inputError: string | null;
  /** The text behind what is currently on screen. Empty when nothing has been refined. */
  lastShopperInput: string;
  /**
   * Fetches again, narrowed by `text`. Used by both the options and the free-text input, and
   * `source` is how a rejected request finds the right place to be reported.
   */
  refine: (text: string, source: RefinementSource) => void;
}

const DEFAULT_STRATEGY: RecsStrategy = 'complementary_items';

/**
 * Owns everything a recommendations pod shows: one request on mount, one on every refinement,
 * and the title that belongs to whichever of those is happening right now.
 *
 * The previous items are deliberately kept while a new request is in flight, so a refinement
 * swaps the products without collapsing the row they sit in. The title is the one thing that does
 * change, so the shopper can see the pod reacting to what they asked for.
 */
export default function useRecsPod({
  itemId,
  variationId,
  threadId,
  cioClient,
  parameters,
  formatImageUrl,
  translations,
}: UseRecsPodProps): UseRecsPodReturn {
  const [result, setResult] = useState<RecsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsupportedInput, setHasUnsupportedInput] = useState<boolean>(false);
  const [lastShopperInput, setLastShopperInput] = useState<string>('');

  // Counts requests so a slow response cannot overwrite a newer one. There is no
  // AbortController in this library, so the older request still completes; its result is
  // simply dropped.
  const requestIdRef = useRef(0);

  // Mirrored into a ref so it never becomes a fetch dependency. It is commonly written inline by
  // the caller, which would give it a new identity on every render and refetch forever.
  const formatImageUrlRef = useRef(formatImageUrl);

  useEffect(() => {
    formatImageUrlRef.current = formatImageUrl;
  }, [formatImageUrl]);

  const strategy = parameters?.strategy || DEFAULT_STRATEGY;
  const { numResults, defaultTitle } = parameters || {};

  const fetchResult = useCallback(
    (shopperInput?: string, source?: RefinementSource) => {
      // TODO: once getRecs is added to the JS client SDK, replace this guard+cast
      // with a direct call: cioClient.agent.getRecs({...})
      const getRecs = (cioClient?.agent as any)?.getRecs as
        | ((props: GetRecsProps) => Promise<RecsResult>)
        | undefined;

      if (!cioClient || !getRecs) {
        if (cioClient && !getRecs) {
          console.info('[CioPia] getRecs is not available on the client SDK yet.');
        }
        setIsLoading(false);
        return;
      }

      requestIdRef.current += 1;
      const requestId = requestIdRef.current;
      const isCurrent = () => requestId === requestIdRef.current;

      setIsLoading(true);
      setError(null);
      setHasUnsupportedInput(false);

      getRecs
        .call(cioClient.agent, {
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
          // Only text the shopper wrote can be rejected this way: an option is a label the API
          // suggested, so blaming their input for it would point at the wrong thing entirely.
          if (status === 422 && source === 'input') {
            setHasUnsupportedInput(true);
            return;
          }

          setError(failure);
        })
        .finally(() => {
          if (!isCurrent()) return;

          setIsLoading(false);
        });
    },
    // Every dependency is a primitive. `formatImageUrl` is read through a ref instead, so a
    // caller writing it inline cannot restart the request on every render.
    [cioClient, itemId, variationId, threadId, strategy, numResults],
  );

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const refine = useCallback(
    (text: string, source: RefinementSource) => {
      const refinementText = text.trim();
      if (!refinementText) return;

      fetchResult(refinementText, source);
    },
    [fetchResult],
  );

  // The title belonging to the last response we kept. `defaultTitle` is the caller's last resort
  // for a response that carried items but no title of its own.
  const settledTitle = result?.title || defaultTitle || '';

  let title = settledTitle;
  if (isLoading) {
    // The loading copy wins whether or not a title is held, so a refinement announces itself
    // rather than leaving the previous personalization above products that no longer match it.
    title = translate(RECS_LOADING_TITLE, translations);
  } else if (!hasUnsupportedInput && (error || result?.status === 'partial')) {
    // Either the request failed or it came back degraded, so the personalized title cannot be
    // trusted. Any products it did carry are still worth showing under a generic title.
    title = translate(RECS_FALLBACK_TITLE, translations);
  }

  return {
    title,
    // Normalized so every caller can treat "nothing to render" as a single case. Our own adapter
    // never returns an empty array, but `cioClient` is a public prop and a consumer-supplied client
    // can. Note `[]` is truthy, so `|| null` would not catch it.
    items: result?.items?.length ? result.items : null,
    refinement: result?.refinement || null,
    isLoading,
    error,
    inputError: hasUnsupportedInput ? translate(RECS_UNSUPPORTED_REQUEST, translations) : null,
    lastShopperInput,
    refine,
  };
}
