import { renderHook } from '@testing-library/react';
import usePiaClient from '../../../src/hooks/usePiaClient';
import version from '../../../src/version';
import { createMockCioClient } from '../../helpers/mockCioClient';

const testApiKey = 'test-api-key';

describe('Testing Hook: usePiaClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // jsdom has no global fetch, and the client this hook builds reads it in its constructor.
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('builds a client from the API key when the caller supplies none', () => {
    const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

    expect(result.current.cioClient.options.apiKey).toBe(testApiKey);
    expect(result.current.cioClient.options.version).toBe(`cio-ui-pia-${version}`);
  });

  it('uses the client the caller supplied', () => {
    const provided = createMockCioClient();

    const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey, cioClient: provided }));

    expect(result.current.cioClient).toBe(provided);
  });

  it('keeps the same client across renders', () => {
    const { result, rerender } = renderHook(() => usePiaClient({ apiKey: testApiKey }));
    const first = result.current.cioClient;

    rerender();

    expect(result.current.cioClient).toBe(first);
  });

  it('builds a new client when the API key changes', () => {
    const { result, rerender } = renderHook((props) => usePiaClient(props), {
      initialProps: { apiKey: testApiKey },
    });
    const first = result.current.cioClient;

    rerender({ apiKey: 'another-api-key' });

    expect(result.current.cioClient).not.toBe(first);
    expect(result.current.cioClient.options.apiKey).toBe('another-api-key');
  });

  it('generates a thread ID and keeps it for the life of the component', () => {
    const { result, rerender } = renderHook(() => usePiaClient({ apiKey: testApiKey }));
    const { threadId } = result.current;

    expect(threadId).toEqual(expect.any(String));
    expect(threadId.length).toBeGreaterThan(0);

    rerender();

    expect(result.current.threadId).toBe(threadId);
  });

  it('prefers the thread ID the caller supplied', () => {
    const { result } = renderHook(() =>
      usePiaClient({ apiKey: testApiKey, threadId: 'provided-thread-id' }),
    );

    expect(result.current.threadId).toBe('provided-thread-id');
  });
});
