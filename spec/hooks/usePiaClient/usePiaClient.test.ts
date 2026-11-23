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

  it('sets userId on the client it builds, and clears it for a guest', () => {
    const { result, rerender } = renderHook(
      ({ userId }: { userId: string | null }) => usePiaClient({ apiKey: testApiKey, userId }),
      { initialProps: { userId: 'shopper-1' } as { userId: string | null } },
    );
    expect(result.current.cioClient.options.userId).toBe('shopper-1');

    rerender({ userId: null });
    expect(result.current.cioClient.options.userId).toBeUndefined();
  });

  it("leaves a caller's client alone", () => {
    const provided = createMockCioClient() as unknown as { setClientOptions: jest.Mock };
    provided.setClientOptions = jest.fn();

    renderHook(() =>
      usePiaClient({ apiKey: testApiKey, cioClient: provided as never, userId: 'shopper-1' }),
    );

    expect(provided.setClientOptions).not.toHaveBeenCalled();
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

  describe("matching the site beacon's session", () => {
    const expire = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
    };
    const setBeaconSession = (sessionId: number, minutesAgo: number) => {
      document.cookie = `ConstructorioID_session=${JSON.stringify({
        sessionId,
        lastTime: Date.now() - minutesAgo * 60 * 1000,
      })}; path=/`;
    };

    beforeEach(() => {
      document.cookie = 'ConstructorioID_client_id=beacon-client; path=/';
    });

    afterEach(() => {
      [
        'ConstructorioID_session',
        'ConstructorioID_session_id',
        'ConstructorioID_client_id',
      ].forEach(expire);
      localStorage.clear();
    });

    it('leaves the client as it was when there is no beacon cookie', () => {
      expire('ConstructorioID_client_id');
      localStorage.setItem(
        '_constructorio_search_session',
        JSON.stringify({ sessionId: 3, lastTime: Date.now() }),
      );

      const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

      expect(result.current.cioClient.options.sessionId).toBe(3);
    });

    it("uses the beacon's session number and client id for a fresh session", () => {
      setBeaconSession(4, 5);

      const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

      expect(result.current.cioClient.options.sessionId).toBe(4);
      expect(result.current.cioClient.options.clientId).toBe('beacon-client');
    });

    it('moves to the next session number when the beacon session is over 30 minutes old', () => {
      setBeaconSession(4, 31);

      const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

      expect(result.current.cioClient.options.sessionId).toBe(5);
    });

    it('leaves the client as it was when the cookie is malformed', () => {
      document.cookie = 'ConstructorioID_session=4; path=/';
      localStorage.setItem(
        '_constructorio_search_session',
        JSON.stringify({ sessionId: 2, lastTime: Date.now() }),
      );

      const { result } = renderHook(() => usePiaClient({ apiKey: testApiKey }));

      expect(result.current.cioClient.options.sessionId).toBe(2);
    });

    it('writes no cookie and no session storage of its own', () => {
      setBeaconSession(4, 5);
      const before = document.cookie;

      renderHook(() => usePiaClient({ apiKey: testApiKey }));

      expect(document.cookie).toBe(before);
      expect(localStorage.getItem('_constructorio_search_session')).toBeNull();
    });

    it("leaves the caller's idOptions alone", () => {
      setBeaconSession(4, 5);
      localStorage.setItem(
        '_constructorio_search_session',
        JSON.stringify({ sessionId: 9, lastTime: Date.now() }),
      );

      const { result } = renderHook(() =>
        usePiaClient({
          apiKey: testApiKey,
          cioClientOptions: { idOptions: { session_id_storage_location: 'local' } },
        }),
      );

      expect(result.current.cioClient.options.sessionId).toBe(9);
    });

    it("leaves a caller's own client alone", () => {
      setBeaconSession(4, 5);
      const provided = createMockCioClient();

      const { result } = renderHook(() =>
        usePiaClient({ apiKey: testApiKey, cioClient: provided }),
      );

      expect(result.current.cioClient).toBe(provided);
    });
  });

  describe('cioClientOptions', () => {
    it('applies them last, so they win', () => {
      const { result } = renderHook(() =>
        usePiaClient({
          apiKey: testApiKey,
          testCells: { constructorio: 'variant_a' },
          cioClientOptions: { testCells: { constructorio: 'variant_b' }, segments: ['vip'] },
        }),
      );

      expect(result.current.cioClient.options.testCells).toEqual({ constructorio: 'variant_b' });
      expect(result.current.cioClient.options.segments).toEqual(['vip']);
    });

    it('keeps the same client when the options are rebuilt with equal contents', () => {
      const { result, rerender } = renderHook((props) => usePiaClient(props), {
        initialProps: { apiKey: testApiKey, cioClientOptions: { segments: ['vip'] } },
      });
      const first = result.current.cioClient;

      rerender({ apiKey: testApiKey, cioClientOptions: { segments: ['vip'] } });
      expect(result.current.cioClient).toBe(first);

      rerender({ apiKey: testApiKey, cioClientOptions: { segments: ['new'] } });
      expect(result.current.cioClient).not.toBe(first);
    });
  });
});
