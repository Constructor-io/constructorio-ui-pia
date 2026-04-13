import { renderHook, act } from '@testing-library/react';
import useAnswerResults from '../../../src/hooks/useAnswerResults';
import { DEMO_QUESTION } from '../../../src/constants';
import { testGetAnswersApiResponse, testTransformedItems } from '../../localExamples';

describe('Testing Hook: useAnswerResults', () => {
  const mockClient = {
    agent: {
      getAnswerResults: jest.fn(),
    },
  };

  // Use mock response without item_results by default
  const mockResponse = {
    ...testGetAnswersApiResponse,
    item_results: undefined,
  };

  // Mock response with item_results
  const mockResponseWithItemResults = testGetAnswersApiResponse;

  const testProps = {
    itemId: 'test-item-id',
    cioClient: mockClient,
  };

  const testQuestion = DEMO_QUESTION;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.agent.getAnswerResults.mockResolvedValue(mockResponse);
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAnswerResults(testProps));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.items).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockClient.agent.getAnswerResults).not.toHaveBeenCalled();
  });

  it('fetches and returns answer results when getAnswer is called', async () => {
    const { result } = renderHook(() => useAnswerResults(testProps));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.items).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.agent.getAnswerResults).toHaveBeenCalledWith({
      itemId: testProps.itemId,
      threadId: undefined,
      variationId: undefined,
      question: testQuestion,
      signal: expect.any(AbortSignal),
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
    expect(result.current.data.item_results).toBeUndefined();
  });

  it('fetches and transforms answer results with item_results when available', async () => {
    mockClient.agent.getAnswerResults.mockResolvedValue(mockResponseWithItemResults);

    const { result } = renderHook(() => useAnswerResults(testProps));
    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.items).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponseWithItemResults);
    expect(result.current.error).toBe(null);
    expect(result.current.items).toEqual(testTransformedItems);
  });

  it('handles errors when fetching answer results', async () => {
    const errorMessage = 'Failed to fetch';
    mockClient.agent.getAnswerResults.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAnswerResults(testProps));
    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe(errorMessage);
  });

  it('refetch data when getAnswer is called again', async () => {
    const { result } = renderHook(() => useAnswerResults(testProps));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClient.agent.getAnswerResults.mockClear();

    // Call getAnswer again
    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.agent.getAnswerResults).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('updates dependency when itemId changes', async () => {
    const { result, rerender } = renderHook((props) => useAnswerResults(props), {
      initialProps: testProps,
    });

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClient.agent.getAnswerResults.mockClear();

    const newProps = {
      ...testProps,
      itemId: 'new-test-item-id',
    };

    rerender(newProps);

    const newQuestion = 'How do I use this?';
    act(() => {
      result.current.getAnswer(newQuestion);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.agent.getAnswerResults).toHaveBeenCalledWith({
      itemId: newProps.itemId,
      threadId: undefined,
      variationId: undefined,
      question: newQuestion,
      signal: expect.any(AbortSignal),
    });
  });

  it('passes threadId and variationId to getAnswerResults', async () => {
    const propsWithIds = {
      itemId: 'test-item-id',
      threadId: 'test-thread-id',
      variationId: 'test-variation-id',
      cioClient: mockClient,
    };

    const { result } = renderHook(() => useAnswerResults(propsWithIds));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.agent.getAnswerResults).toHaveBeenCalledWith({
      itemId: propsWithIds.itemId,
      threadId: 'test-thread-id',
      variationId: 'test-variation-id',
      question: testQuestion,
      signal: expect.any(AbortSignal),
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('does not fetch if cioClient is not provided', () => {
    const { result } = renderHook(() => useAnswerResults({ ...testProps, cioClient: undefined }));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(mockClient.agent.getAnswerResults).not.toHaveBeenCalled();
  });
});
