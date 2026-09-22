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

  it('fills a caller-supplied client that has no test cells of its own', () => {
    const provided = createMockCioClient();

    renderHook(() =>
      usePiaClient({
        apiKey: testApiKey,
        cioClient: provided,
        testCells: { constructorio: 'variant_a' },
      }),
    );

    expect(provided.setClientOptions).toHaveBeenCalledWith({
      testCells: { constructorio: 'variant_a' },
    });
  });

  it('stays quiet when the cells on the client are the ones it put there', () => {
    const provided = createMockCioClient();
    provided.setClientOptions.mockImplementation(({ testCells }) => {
      provided.options.testCells = testCells;
    });
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const props = {
      apiKey: testApiKey,
      cioClient: provided,
      testCells: { constructorio: 'variant_a' },
    };

    // Two mounts against one long-lived client, as a host navigating between PDPs would do.
    renderHook(() => usePiaClient(props)).unmount();
    renderHook(() => usePiaClient(props));

    expect(provided.setClientOptions).toHaveBeenCalledTimes(1);
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('updates cells it applied itself when they change', () => {
    const provided = createMockCioClient();
    provided.setClientOptions.mockImplementation(({ testCells }) => {
      provided.options.testCells = testCells;
    });
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { rerender } = renderHook((props) => usePiaClient(props), {
      initialProps: {
        apiKey: testApiKey,
        cioClient: provided,
        testCells: { constructorio: 'variant_a' },
      },
    });

    rerender({
      apiKey: testApiKey,
      cioClient: provided,
      testCells: { constructorio: 'variant_b' },
    });

    expect(provided.setClientOptions).toHaveBeenLastCalledWith({
      testCells: { constructorio: 'variant_b' },
    });
    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it('does not overwrite test cells the caller already set on their own client', () => {
    const provided = createMockCioClient();
    provided.options.testCells = { constructorio: 'their_own_cell' };
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    renderHook(() =>
      usePiaClient({
        apiKey: testApiKey,
        cioClient: provided,
        testCells: { constructorio: 'variant_a' },
      }),
    );

    expect(provided.setClientOptions).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });
});
