import { renderHook, act } from '@testing-library/react';
import useAnswerResults from '../../../src/hooks/useAnswerResults';
import useCioClient from '../../../src/hooks/useCioClient';

// Mock useCioClient and its methods to test useAnswerResults in isolation
jest.mock('../../../src/hooks/useCioClient');
const testAssistantQuery = {
  itemId: 'test-item-id',
  question: 'What is this product?',
};

describe('Testing Hook: useAnswerResults', () => {
  const mockClient = {
    assistant: {
      getAnswerResults: jest.fn(),
    },
  };

  const mockResponse = {
    value: 'This is a mock answer',
    alternative: null,
    follow_up_questions: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCioClient.mockReturnValue(mockClient);
    mockClient.assistant.getAnswerResults.mockResolvedValue(mockResponse);
  });

  it('Should fetch and return answer results', async () => {
    const { result } = renderHook(() => useAnswerResults(testAssistantQuery));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.assistant.getAnswerResults).toHaveBeenCalledWith(testAssistantQuery);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it('Should handle errors when fetching answer results', async () => {
    const errorMessage = 'Failed to fetch';
    mockClient.assistant.getAnswerResults.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAnswerResults(testAssistantQuery));

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

  it('Should refetch data when refetch is called', async () => {
    const { result } = renderHook(() => useAnswerResults(testAssistantQuery));

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClient.assistant.getAnswerResults.mockClear();

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    expect(mockClient.assistant.getAnswerResults).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('Should update when parameters change', async () => {
    const { rerender } = renderHook((props) => useAnswerResults(props), {
      initialProps: testAssistantQuery,
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClient.assistant.getAnswerResults.mockClear();

    // Change props
    const newTestAssistantQuery = {
      itemId: 'new-test-item-id',
      question: 'How do I use this?',
    };
    rerender(newTestAssistantQuery);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.assistant.getAnswerResults).toHaveBeenCalledWith(newTestAssistantQuery);
  });

  it('Should not fetch if client is not available', async () => {
    useCioClient.mockReturnValue(null);

    renderHook(() => useAnswerResults(testAssistantQuery));

    expect(mockClient.assistant.getAnswerResults).not.toHaveBeenCalled();
  });
});
