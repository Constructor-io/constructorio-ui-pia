import { renderHook, act } from '@testing-library/react';
import useCioClient from '../../../src/hooks/useCioClient';
import useSuggestedQuestions from '../../../src/hooks/useSuggestedQuestions';

// Mock useCioClient and its methods to test useSuggestedQuestions in isolation
jest.mock('../../../src/hooks/useCioClient');

const testItemId = 'test-item-id';
const newTestItemId = 'new-test-item-id';
const mockQuestions = [
  { value: 'Mock question 1' },
  { value: 'Mock question 2' },
  { value: 'Mock question 3' },
];
const newMockQuestions = [
  { value: 'New mock question 1' },
  { value: 'New mock question 2' },
  { value: 'New mock question 3' },
];

describe('Testing Hook: useSuggestedQuestions', () => {
  const mockClientInstance = {
    assistant: {
      getSuggestedQuestions: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCioClient.mockReturnValue(mockClientInstance);
  });

  it('Should fetch and return suggested questions', async () => {
    mockClientInstance.assistant.getSuggestedQuestions.mockResolvedValueOnce({
      questions: mockQuestions,
    });

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: testItemId }));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.questions.length).toBe(mockQuestions.length);
    expect(result.current.error).toBeNull();
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith(testItemId);
  });

  it('Should handle errors when fetching questions fails', async () => {
    const mockError = new Error('Mock error');
    mockClientInstance.assistant.getSuggestedQuestions.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: testItemId }));

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Mock error');
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith(testItemId);
  });

  it('Should refetch questions when refetch function is called', async () => {
    mockClientInstance.assistant.getSuggestedQuestions.mockResolvedValueOnce({
      questions: mockQuestions,
    });

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: testItemId }));

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClientInstance.assistant.getSuggestedQuestions.mockClear();
    mockClientInstance.assistant.getSuggestedQuestions.mockResolvedValueOnce({
      questions: newMockQuestions,
    });

    // Call the refetch function
    await act(async () => {
      result.current.refetch();
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    // Check state after refetch
    expect(result.current.questions).toEqual(newMockQuestions);
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledTimes(1);
  });

  it('Should not fetch if no client', async () => {
    useCioClient.mockReturnValue(null);

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: testItemId }));

    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledTimes(0);
  });

  it('Should refetch when itemId changes', async () => {
    mockClientInstance.assistant.getSuggestedQuestions
      .mockResolvedValueOnce({ questions: mockQuestions })
      .mockResolvedValueOnce({ questions: newMockQuestions });

    const { result, rerender } = renderHook((props) => useSuggestedQuestions(props), {
      initialProps: { itemId: testItemId },
    });

    // Initial render
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    await act(async () => {});
    expect(result.current.questions).toEqual(mockQuestions);

    // Rerender with a different itemId
    rerender({ itemId: newTestItemId });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    await act(async () => {});

    expect(result.current.questions).toEqual(newMockQuestions);
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith(testItemId);
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith(newTestItemId);
  });
});
