import { renderHook, act } from '@testing-library/react';
import useSuggestedQuestions from '../../../src/hooks/useSuggestedQuestions';

const testItemId = 'test-item-id';
const newTestItemId = 'new-test-item-id';
const testQuestions = [
  { value: 'Mock question 1' },
  { value: 'Mock question 2' },
  { value: 'Mock question 3' },
];
const newTestQuestions = [
  { value: 'New mock question 1' },
  { value: 'New mock question 2' },
  { value: 'New mock question 3' },
];

describe('Testing Hook: useSuggestedQuestions', () => {
  const mockClient = {
    agent: {
      getSuggestedQuestions: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and returns suggested questions', async () => {
    mockClient.agent.getSuggestedQuestions.mockResolvedValueOnce({
      questions: testQuestions,
    });

    const { result } = renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        cioClient: mockClient,
      }),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(testQuestions);
    expect(result.current.data.length).toBe(testQuestions.length);
    expect(result.current.error).toBeNull();
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      parameters: undefined,
    });
  });

  it('handles errors when fetching questions fails', async () => {
    const mockError = new Error('Mock error');
    mockClient.agent.getSuggestedQuestions.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        cioClient: mockClient,
      }),
    );

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Mock error');
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      parameters: undefined,
    });
  });

  it('refetch questions when getSuggestedQuestions function is called', async () => {
    mockClient.agent.getSuggestedQuestions.mockResolvedValueOnce({
      questions: testQuestions,
    });

    const { result } = renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        cioClient: mockClient,
      }),
    );

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClient.agent.getSuggestedQuestions.mockClear();
    mockClient.agent.getSuggestedQuestions.mockResolvedValueOnce({
      questions: newTestQuestions,
    });

    // Call the getSuggestedQuestions function
    await act(async () => {
      result.current.getSuggestedQuestions();
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    // Check state after refetch
    expect(result.current.data).toEqual(newTestQuestions);
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledTimes(1);
  });

  it('does not fetch if no client provided', async () => {
    const { result } = renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        cioClient: undefined,
      }),
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockClient.agent.getSuggestedQuestions).not.toHaveBeenCalled();
  });

  it('refetch when itemId changes', async () => {
    mockClient.agent.getSuggestedQuestions
      .mockResolvedValueOnce({ questions: testQuestions })
      .mockResolvedValueOnce({ questions: newTestQuestions });

    const { result, rerender } = renderHook((props) => useSuggestedQuestions(props), {
      initialProps: {
        itemId: testItemId,
        cioClient: mockClient,
      },
    });

    // Initial render
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.data).toEqual(testQuestions);

    // Rerender with a different itemId
    rerender({
      itemId: newTestItemId,
      cioClient: mockClient,
    });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.data).toEqual(newTestQuestions);
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      parameters: undefined,
    });
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledWith({
      itemId: newTestItemId,
      variationId: undefined,
      threadId: undefined,
      parameters: undefined,
    });
  });

  it('passes threadId and variationId to getSuggestedQuestions', async () => {
    mockClient.agent.getSuggestedQuestions.mockResolvedValueOnce({
      questions: testQuestions,
    });

    const { result } = renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        threadId: 'test-thread-id',
        variationId: 'test-variation-id',
        cioClient: mockClient,
      }),
    );

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledWith({
      itemId: testItemId,
      variationId: 'test-variation-id',
      threadId: 'test-thread-id',
      parameters: undefined,
    });
    expect(result.current.data).toEqual(testQuestions);
  });

  it('passes parameters to getSuggestedQuestions', async () => {
    mockClient.agent.getSuggestedQuestions.mockResolvedValueOnce({
      questions: testQuestions,
    });
    const parameters = { numResults: 2 };

    renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        cioClient: mockClient,
        parameters,
      }),
    );

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      parameters,
    });
  });

  it('refetches when parameters change', async () => {
    mockClient.agent.getSuggestedQuestions
      .mockResolvedValueOnce({ questions: testQuestions })
      .mockResolvedValueOnce({ questions: newTestQuestions });
    const initialParameters = { numResults: 3 };
    const updatedParameters = { numResults: 1 };

    const { result, rerender } = renderHook((props) => useSuggestedQuestions(props), {
      initialProps: {
        itemId: testItemId,
        cioClient: mockClient,
        parameters: initialParameters,
      },
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.data).toEqual(testQuestions);

    rerender({
      itemId: testItemId,
      cioClient: mockClient,
      parameters: updatedParameters,
    });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(newTestQuestions);
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledTimes(2);
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenLastCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      parameters: updatedParameters,
    });
  });

  it('refetches when parameters are removed', async () => {
    mockClient.agent.getSuggestedQuestions
      .mockResolvedValueOnce({ questions: testQuestions })
      .mockResolvedValueOnce({ questions: newTestQuestions });
    const initialParameters = { numResults: 3 };

    const { result, rerender } = renderHook((props) => useSuggestedQuestions(props), {
      initialProps: {
        itemId: testItemId,
        cioClient: mockClient,
        parameters: initialParameters,
      },
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.data).toEqual(testQuestions);

    rerender({
      itemId: testItemId,
      cioClient: mockClient,
      parameters: undefined,
    });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(newTestQuestions);
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenCalledTimes(2);
    expect(mockClient.agent.getSuggestedQuestions).toHaveBeenLastCalledWith({
      itemId: testItemId,
      variationId: undefined,
      threadId: undefined,
      parameters: undefined,
    });
  });
});
