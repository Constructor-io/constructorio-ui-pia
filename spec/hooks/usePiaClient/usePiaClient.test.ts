import { renderHook } from '@testing-library/react';
import usePiaClient from '../../../src/hooks/usePiaClient';
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
    delete (window as unknown as { cnstrc?: unknown }).cnstrc;
  });

  it('builds a client from the API key when the caller supplies none', () => {
    const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

    expect(result.current.cioClient.options.apiKey).toBe(testApiKey);
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

  it('forwards test cells to the client it builds', () => {
    const { result } = renderHook(() =>
      usePiaClient({
        apiKey: testApiKey,
        testCells: { constructorio: 'variant_a', your_other_test: 'control' },
      }),
    );

    expect(result.current.cioClient.options.testCells).toEqual({
      constructorio: 'variant_a',
      your_other_test: 'control',
    });
  });

  it('keeps the same client when test cells are rebuilt with equal contents', () => {
    const { result, rerender } = renderHook((props) => usePiaClient(props), {
      initialProps: { apiKey: testApiKey, testCells: { constructorio: 'variant_a' } },
    });
    const first = result.current.cioClient;

    rerender({ apiKey: testApiKey, testCells: { constructorio: 'variant_a' } });

    expect(result.current.cioClient).toBe(first);
  });

  it('builds a new client when a test cell value actually changes', () => {
    const { result, rerender } = renderHook((props) => usePiaClient(props), {
      initialProps: { apiKey: testApiKey, testCells: { constructorio: 'variant_a' } },
    });
    const first = result.current.cioClient;

    rerender({ apiKey: testApiKey, testCells: { constructorio: 'variant_b' } });

    expect(result.current.cioClient).not.toBe(first);
    expect(result.current.cioClient.options.testCells).toEqual({ constructorio: 'variant_b' });
  });

  it('returns a caller-supplied client as-is rather than replacing it', () => {
    const provided = createMockCioClient();

    const { result } = renderHook(() =>
      usePiaClient({
        apiKey: testApiKey,
        cioClient: provided,
        testCells: { constructorio: 'variant_a' },
      }),
    );

    expect(result.current.cioClient).toBe(provided);
  });

  it('warns rather than silently dropping test cells passed alongside a client', () => {
    const provided = createMockCioClient();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    renderHook(() =>
      usePiaClient({
        apiKey: testApiKey,
        cioClient: provided,
        testCells: { constructorio: 'variant_a' },
      }),
    );

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('abTest.testCells is ignored'));

    warn.mockRestore();
  });

  it('says nothing when a caller supplies a client and no test cells', () => {
    const provided = createMockCioClient();
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    renderHook(() => usePiaClient({ apiKey: testApiKey, cioClient: provided }));

    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('falls back to the window test cells when none are passed', () => {
    (window as unknown as { cnstrc: unknown }).cnstrc = {
      testCells: { constructorio: 'from_window' },
    };

    const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

    expect(result.current.cioClient.options.testCells).toEqual({ constructorio: 'from_window' });
  });

  it('prefers the test cells it was passed over the window ones', () => {
    (window as unknown as { cnstrc: unknown }).cnstrc = {
      testCells: { constructorio: 'from_window' },
    };

    const { result } = renderHook(() =>
      usePiaClient({ apiKey: testApiKey, testCells: { constructorio: 'from_prop' } }),
    );

    expect(result.current.cioClient.options.testCells).toEqual({ constructorio: 'from_prop' });
  });
});
