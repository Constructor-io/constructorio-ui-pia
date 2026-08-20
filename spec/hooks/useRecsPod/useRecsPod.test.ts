import { renderHook, act } from '@testing-library/react';
import useRecsPod from '../../../src/hooks/useRecsPod';
import { AgentRequestError } from '../../../src/errors';
import {
  RECS_FALLBACK_TITLE,
  RECS_LOADING_TITLE,
  RECS_UNSUPPORTED_REQUEST,
} from '../../../src/constants';
import { RecsResult } from '../../../src/types';
import { createMockCioClient } from '../../helpers/mockCioClient';
import { testRecsPodNoHistory, testRecsPodResult } from '../../localExamples';

const testItemId = 'test-item-id';
const newTestItemId = 'new-test-item-id';

const firstResult: RecsResult = testRecsPodResult;
const secondResult: RecsResult = testRecsPodNoHistory;

/**
 * A request whose settling the test controls. Hand the first call `a.promise` and the second
 * `b.promise`, resolve `b` first, then `a`, and the out-of-order guard can be asserted.
 */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

/** Lets every pending promise and state update settle, the way the other hook specs do. */
async function settle() {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });
}

describe('Testing Hook: useRecsPod', () => {
  const mockClient = createMockCioClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the loading title with no products while the first request is in flight', () => {
    mockClient.agent.getRecs.mockReturnValueOnce(new Promise<RecsResult>(() => {}));

    const { result } = renderHook(() => useRecsPod({ itemId: testItemId, cioClient: mockClient }));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.title).toBe(RECS_LOADING_TITLE);
    expect(result.current.items).toBeNull();
    expect(result.current.refinement).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.inputError).toBeNull();
  });

  it('returns the title, products and refinement from the response', async () => {
    mockClient.agent.getRecs.mockResolvedValueOnce(firstResult);

    const { result } = renderHook(() => useRecsPod({ itemId: testItemId, cioClient: mockClient }));

    await settle();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.title).toBe(firstResult.title);
    expect(result.current.items).toEqual(firstResult.items);
    expect(result.current.refinement).toEqual(firstResult.refinement);
    expect(result.current.lastShopperInput).toBe('');
  });

  it('fetches once on mount with the default strategy and no shopper input', async () => {
    mockClient.agent.getRecs.mockResolvedValueOnce(firstResult);

    renderHook(() => useRecsPod({ itemId: testItemId, cioClient: mockClient }));

    await settle();

    expect(mockClient.agent.getRecs).toHaveBeenCalledTimes(1);
    expect(mockClient.agent.getRecs).toHaveBeenCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      strategy: 'complementary_items',
      shopperInput: undefined,
      numResults: undefined,
      formatImageUrl: undefined,
    });
  });

  it('forwards variationId, threadId, strategy and numResults', async () => {
    mockClient.agent.getRecs.mockResolvedValueOnce(firstResult);

    renderHook(() =>
      useRecsPod({
        itemId: testItemId,
        variationId: 'test-variation-id',
        threadId: 'test-thread-id',
        cioClient: mockClient,
        parameters: { strategy: 'bestsellers', numResults: 6 },
      }),
    );

    await settle();

    expect(mockClient.agent.getRecs).toHaveBeenCalledWith(
      expect.objectContaining({
        variationId: 'test-variation-id',
        threadId: 'test-thread-id',
        strategy: 'bestsellers',
        numResults: 6,
      }),
    );
  });

  it('does not fetch when no client is provided', async () => {
    const { result } = renderHook(() => useRecsPod({ itemId: testItemId, cioClient: undefined }));

    // Asserted before anything settles: with nothing to ask there is nothing to wait for, so the
    // caller must not be handed a skeleton on the first render either.
    expect(result.current.isLoading).toBe(false);

    await settle();

    expect(mockClient.agent.getRecs).not.toHaveBeenCalled();
    expect(result.current.items).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  // Our own adapter never returns an empty array, but `cioClient` is a public prop and a
  // consumer-supplied client can, so callers get one shape for "no products" rather than two.
  it('normalizes an empty product list to null', async () => {
    mockClient.agent.getRecs.mockResolvedValueOnce({
      title: 'Nothing to show',
      items: [],
      refinement: null,
    });

    const { result } = renderHook(() => useRecsPod({ itemId: testItemId, cioClient: mockClient }));

    await settle();

    expect(result.current.items).toBeNull();
  });

  it('fetches again when itemId changes', async () => {
    mockClient.agent.getRecs.mockResolvedValueOnce(firstResult).mockResolvedValueOnce(secondResult);

    const { result, rerender } = renderHook((props) => useRecsPod(props), {
      initialProps: { itemId: testItemId, cioClient: mockClient },
    });

    await settle();
    expect(result.current.items).toEqual(firstResult.items);

    rerender({ itemId: newTestItemId, cioClient: mockClient });
    await settle();

    expect(mockClient.agent.getRecs).toHaveBeenCalledTimes(2);
    expect(mockClient.agent.getRecs).toHaveBeenLastCalledWith(
      expect.objectContaining({ itemId: newTestItemId }),
    );
    expect(result.current.items).toEqual(secondResult.items);
  });

  it('fetches again when the strategy changes', async () => {
    mockClient.agent.getRecs.mockResolvedValueOnce(firstResult).mockResolvedValueOnce(secondResult);

    const { rerender } = renderHook(
      (props: Parameters<typeof useRecsPod>[0]) => useRecsPod(props),
      {
        initialProps: {
          itemId: testItemId,
          cioClient: mockClient,
          parameters: { strategy: 'complementary_items' as const },
        },
      },
    );

    await settle();

    rerender({
      itemId: testItemId,
      cioClient: mockClient,
      parameters: { strategy: 'alternative_items' as const },
    });
    await settle();

    expect(mockClient.agent.getRecs).toHaveBeenCalledTimes(2);
    expect(mockClient.agent.getRecs).toHaveBeenLastCalledWith(
      expect.objectContaining({ strategy: 'alternative_items' }),
    );
  });

  it('does not refetch when formatImageUrl is written inline on every render', async () => {
    mockClient.agent.getRecs.mockResolvedValue(firstResult);

    const { rerender } = renderHook(() =>
      useRecsPod({
        itemId: testItemId,
        cioClient: mockClient,
        formatImageUrl: (url: string) => `https://cdn.example.com${url}`,
      }),
    );

    await settle();
    rerender();
    await settle();

    expect(mockClient.agent.getRecs).toHaveBeenCalledTimes(1);
  });

  describe('refining', () => {
    it('switches to the loading title but holds the products while the refinement is in flight', async () => {
      const pending = deferred<RecsResult>();
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockReturnValueOnce(pending.promise);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      act(() => {
        result.current.refine('Slim fit', 'option');
      });

      expect(result.current.isLoading).toBe(true);
      // The title announces the refinement rather than describing products that are on their way
      // out, while the products and options underneath stay put so the row heights hold.
      expect(result.current.title).toBe(RECS_LOADING_TITLE);
      expect(result.current.items).toEqual(firstResult.items);
      expect(result.current.refinement).toEqual(firstResult.refinement);

      await act(async () => {
        pending.resolve(secondResult);
      });

      expect(result.current.title).toBe(secondResult.title);
      expect(result.current.items).toEqual(secondResult.items);
    });

    it('sends the refinement text as shopperInput and records it', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockResolvedValueOnce(secondResult);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      await act(async () => {
        result.current.refine('  Slim fit  ', 'input');
      });
      await settle();

      expect(mockClient.agent.getRecs).toHaveBeenLastCalledWith(
        expect.objectContaining({ shopperInput: 'Slim fit' }),
      );
      expect(result.current.lastShopperInput).toBe('Slim fit');
    });

    it('ignores blank refinements', async () => {
      mockClient.agent.getRecs.mockResolvedValueOnce(firstResult);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      await act(async () => {
        result.current.refine('   ', 'input');
      });

      expect(mockClient.agent.getRecs).toHaveBeenCalledTimes(1);
    });

    it('drops a stale response that lands after a newer one', async () => {
      const slow = deferred<RecsResult>();
      const fast = deferred<RecsResult>();
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockReturnValueOnce(slow.promise)
        .mockReturnValueOnce(fast.promise);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      act(() => {
        result.current.refine('Slim fit', 'option');
      });
      act(() => {
        result.current.refine('Oxford', 'option');
      });

      await act(async () => {
        fast.resolve(secondResult);
      });

      expect(result.current.items).toEqual(secondResult.items);
      expect(result.current.lastShopperInput).toBe('Oxford');
      expect(result.current.isLoading).toBe(false);

      // The abandoned request still completes, because there is no AbortController here.
      await act(async () => {
        slow.resolve(firstResult);
      });

      expect(result.current.items).toEqual(secondResult.items);
      expect(result.current.lastShopperInput).toBe('Oxford');
    });
  });

  describe('unsupported requests', () => {
    it('keeps the title, products and options and only adds an input message', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(422));

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      await act(async () => {
        result.current.refine('paint my house', 'input');
      });
      await settle();

      expect(result.current.inputError).toBe(RECS_UNSUPPORTED_REQUEST);
      expect(result.current.title).toBe(firstResult.title);
      expect(result.current.items).toEqual(firstResult.items);
      expect(result.current.refinement).toEqual(firstResult.refinement);
      expect(result.current.error).toBeNull();
    });

    // A rejected option is a rejection of a label the API itself suggested, so pointing at the
    // input would blame the shopper for something they did not type.
    it('reports a rejected option as an ordinary failure instead of an input message', async () => {
      const failure = new AgentRequestError(422);
      mockClient.agent.getRecs.mockResolvedValueOnce(firstResult).mockRejectedValueOnce(failure);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      await act(async () => {
        result.current.refine('Warmer', 'option');
      });
      await settle();

      expect(result.current.inputError).toBeNull();
      expect(result.current.error).toBe(failure);
      expect(result.current.title).toBe(RECS_FALLBACK_TITLE);
      expect(result.current.items).toEqual(firstResult.items);
      expect(result.current.refinement).toEqual(firstResult.refinement);
    });

    it('clears the input message on the next refinement', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(422))
        .mockResolvedValueOnce(secondResult);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();
      await act(async () => {
        result.current.refine('paint my house', 'input');
      });
      await settle();
      expect(result.current.inputError).toBe(RECS_UNSUPPORTED_REQUEST);

      await act(async () => {
        result.current.refine('Slim fit', 'option');
      });
      await settle();

      expect(result.current.inputError).toBeNull();
      expect(result.current.title).toBe(secondResult.title);
    });
  });

  describe('failures', () => {
    it('falls back to the generic title on a server error', async () => {
      const failure = new AgentRequestError(500);
      mockClient.agent.getRecs.mockRejectedValueOnce(failure);

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      expect(result.current.title).toBe(RECS_FALLBACK_TITLE);
      expect(result.current.items).toBeNull();
      expect(result.current.error).toBe(failure);
      expect(result.current.inputError).toBeNull();
    });

    it('keeps the products already on screen when a refinement fails', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(503));

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();
      await act(async () => {
        result.current.refine('Oxford', 'option');
      });
      await settle();

      expect(result.current.title).toBe(RECS_FALLBACK_TITLE);
      expect(result.current.items).toEqual(firstResult.items);
    });

    it('logs a malformed request, because that is a library bug rather than a shopper mistake', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockClient.agent.getRecs.mockRejectedValueOnce(new AgentRequestError(400));

      renderHook(() => useRecsPod({ itemId: testItemId, cioClient: mockClient }));

      await settle();

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('recommendations request was rejected'),
        expect.any(AgentRequestError),
      );

      consoleError.mockRestore();
    });

    it('wraps a rejection that is not an Error', async () => {
      mockClient.agent.getRecs.mockRejectedValueOnce('offline');

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.title).toBe(RECS_FALLBACK_TITLE);
    });

    it('falls back to the generic title for a degraded response that still carries products', async () => {
      mockClient.agent.getRecs.mockResolvedValueOnce({ ...firstResult, status: 'partial' });

      const { result } = renderHook(() =>
        useRecsPod({ itemId: testItemId, cioClient: mockClient }),
      );

      await settle();

      expect(result.current.title).toBe(RECS_FALLBACK_TITLE);
      expect(result.current.items).toEqual(firstResult.items);
      expect(result.current.error).toBeNull();
    });
  });

  describe('titles', () => {
    it('uses defaultTitle when the response carries products but no title', async () => {
      mockClient.agent.getRecs.mockResolvedValueOnce({ ...firstResult, title: '' });

      const { result } = renderHook(() =>
        useRecsPod({
          itemId: testItemId,
          cioClient: mockClient,
          parameters: { defaultTitle: 'You may also like' },
        }),
      );

      await settle();

      expect(result.current.title).toBe('You may also like');
    });

    it('shows the loading copy rather than defaultTitle while a request is in flight', () => {
      mockClient.agent.getRecs.mockReturnValueOnce(new Promise<RecsResult>(() => {}));

      const { result } = renderHook(() =>
        useRecsPod({
          itemId: testItemId,
          cioClient: mockClient,
          parameters: { defaultTitle: 'You may also like' },
        }),
      );

      // `defaultTitle` is the last resort for a settled response that carried no title of its
      // own, not something to show over placeholders.
      expect(result.current.title).toBe(RECS_LOADING_TITLE);
    });

    it('translates the loading title', () => {
      mockClient.agent.getRecs.mockReturnValueOnce(new Promise<RecsResult>(() => {}));

      const { result } = renderHook(() =>
        useRecsPod({
          itemId: testItemId,
          cioClient: mockClient,
          translations: { [RECS_LOADING_TITLE]: 'Tuning your picks' },
        }),
      );

      expect(result.current.title).toBe('Tuning your picks');
    });

    it('translates the fallback title', async () => {
      mockClient.agent.getRecs.mockRejectedValueOnce(new AgentRequestError(500));

      const { result } = renderHook(() =>
        useRecsPod({
          itemId: testItemId,
          cioClient: mockClient,
          translations: { [RECS_FALLBACK_TITLE]: 'Our top picks' },
        }),
      );

      await settle();

      expect(result.current.title).toBe('Our top picks');
    });

    it('translates the unsupported request message', async () => {
      mockClient.agent.getRecs
        .mockResolvedValueOnce(firstResult)
        .mockRejectedValueOnce(new AgentRequestError(422));

      const { result } = renderHook(() =>
        useRecsPod({
          itemId: testItemId,
          cioClient: mockClient,
          translations: { [RECS_UNSUPPORTED_REQUEST]: 'We cannot do that one' },
        }),
      );

      await settle();
      await act(async () => {
        result.current.refine('paint my house', 'input');
      });
      await settle();

      expect(result.current.inputError).toBe('We cannot do that one');
    });
  });
});
