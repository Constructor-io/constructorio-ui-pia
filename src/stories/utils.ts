import MockConstructorIOClient from '../hooks/mocks/MockConstructorIOClient';
import { GetRecsProps, RecsResult } from '../types';
import { AgentRequestError } from '../errors';
import { RECS_GROUPS } from './recsFixtures';

export const prependCdnBase = (url: string) =>
  url.startsWith('/') ? `https://example.com${url}` : url;

export interface RecsStubOptions {
  /** The responses to cycle through, one per request. Defaults to {@link RECS_GROUPS}. */
  groups?: RecsResult[];
  /** Answers the request the pod makes on mount. Defaults to the first of `groups`. */
  firstResult?: RecsResult;
  /** When set, every request after the first is rejected with it. */
  failAfterFirst?: Error;
  /**
   * What to do with text the shopper typed rather than clicked. `'reject422'` is how a story shows a
   * rejected input while its options keep working.
   */
  freeText?: 'rotate' | 'reject422';
  /** How long each request takes. */
  delayMs?: number;
}

/**
 * A stand-in client for the recommendations stories, so a story can show any appearance of the pod
 * without waiting on the API to support it. Every refinement moves on to the next group, so the
 * title, products and options all change. No tracker: the pod sends no analytics in this version.
 */
export const createRecsPodStubClient = (options: RecsStubOptions = {}): MockConstructorIOClient => {
  const {
    groups = RECS_GROUPS,
    firstResult,
    failAfterFirst,
    freeText = 'rotate',
    delayMs = 800,
  } = options;

  let requestCount = 0;
  // What the pod is showing, which is what tells a clicked option from typed text.
  let onScreen: RecsResult | null = null;

  const after = (outcome: RecsResult | Error): Promise<RecsResult> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (outcome instanceof Error) reject(outcome);
        else resolve(outcome);
      }, delayMs);
    });

  const getRecs = ({ shopperInput }: GetRecsProps): Promise<RecsResult> => {
    const requestIndex = requestCount;
    requestCount += 1;

    if (requestIndex === 0) {
      onScreen = firstResult ?? groups[0];
      return after(onScreen);
    }

    if (failAfterFirst) return after(failAfterFirst);

    const isOption = !!shopperInput && (onScreen?.refinement?.options || []).includes(shopperInput);
    if (!isOption && freeText === 'reject422') return after(new AgentRequestError(422));

    onScreen = groups[requestIndex % groups.length];
    return after(onScreen);
  };

  return { agent: { getRecs } } as unknown as MockConstructorIOClient;
};
