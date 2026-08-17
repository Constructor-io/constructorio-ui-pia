import MockConstructorIOClient from '../hooks/mocks/MockConstructorIOClient';
import { RecsResult } from '../types';

export const prependCdnBase = (url: string) =>
  url.startsWith('/') ? `https://example.com${url}` : url;

/**
 * What a stubbed recommendations request should do.
 *
 * `'pending'` returns a promise that never settles, which is how a story holds the pod in its
 * loading appearance for as long as somebody wants to look at it.
 */
export type RecsStubStep = RecsResult | Error | 'pending';

/**
 * A stand-in client for recommendations stories, so a story can show any appearance of the pod
 * without waiting on the API to support it.
 *
 * Give it one step per request in order: the first step answers the request the pod makes when it
 * mounts, the second answers the first refinement, and so on. The last step repeats, so a
 * single-step list answers every request the same way.
 *
 * It carries no tracker on purpose. Every tracking call in `useTracking` is optional, so events
 * are simply skipped and a story never sends anything to a real dashboard.
 */
export const createRecsPodStubClient = (steps: RecsStubStep[]): MockConstructorIOClient => {
  let requestCount = 0;

  const getRecs = (): Promise<RecsResult> => {
    const step = steps[Math.min(requestCount, steps.length - 1)];
    requestCount += 1;

    if (step === 'pending') return new Promise<RecsResult>(() => {});
    if (step instanceof Error) return Promise.reject(step);

    return Promise.resolve(step);
  };

  return { agent: { getRecs } } as unknown as MockConstructorIOClient;
};
