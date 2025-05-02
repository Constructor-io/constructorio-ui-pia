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
    assistant: {
      getSuggestedQuestions: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should fetch and return suggested questions', async () => {
    mockClient.assistant.getSuggestedQuestions.mockResolvedValueOnce({
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
    expect(mockClient.assistant.getSuggestedQuestions).toHaveBeenCalledWith(testItemId);
  });

  it('Should handle errors when fetching questions fails', async () => {
    const mockError = new Error('Mock error');
    mockClient.assistant.getSuggestedQuestions.mockRejectedValueOnce(mockError);

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
    expect(mockClient.assistant.getSuggestedQuestions).toHaveBeenCalledWith(testItemId);
  });

  it('Should refetch questions when getSuggestedQuestions function is called', async () => {
    mockClient.assistant.getSuggestedQuestions.mockResolvedValueOnce({
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

    mockClient.assistant.getSuggestedQuestions.mockClear();
    mockClient.assistant.getSuggestedQuestions.mockResolvedValueOnce({
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
    expect(mockClient.assistant.getSuggestedQuestions).toHaveBeenCalledTimes(1);
  });

  it('Should not fetch if no client provided', async () => {
    const { result } = renderHook(() =>
      useSuggestedQuestions({
        itemId: testItemId,
        cioClient: undefined,
      }),
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockClient.assistant.getSuggestedQuestions).not.toHaveBeenCalled();
  });

  it('Should refetch when itemId changes', async () => {
    mockClient.assistant.getSuggestedQuestions
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
    expect(mockClient.assistant.getSuggestedQuestions).toHaveBeenCalledWith(testItemId);
    expect(mockClient.assistant.getSuggestedQuestions).toHaveBeenCalledWith(newTestItemId);
  });
});
