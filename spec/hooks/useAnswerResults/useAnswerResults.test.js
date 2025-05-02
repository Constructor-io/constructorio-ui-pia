import { renderHook, act } from '@testing-library/react';
import useAnswerResults from '../../../src/hooks/useAnswerResults';
import { DEMO_QUESTION } from '../../../src/constants';

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

  const testProps = {
    itemId: 'test-item-id',
    cioClient: mockClient,
  };

  const testQuestion = DEMO_QUESTION;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.assistant.getAnswerResults.mockResolvedValue(mockResponse);
  });

  it('Should initialize with default state', () => {
    const { result } = renderHook(() => useAnswerResults(testProps));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockClient.assistant.getAnswerResults).not.toHaveBeenCalled();
  });

  it('Should fetch and return answer results when fetch is called', async () => {
    const { result } = renderHook(() => useAnswerResults(testProps));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(mockClient.assistant.getAnswerResults).toHaveBeenCalledWith({
      itemId: testProps.itemId,
      question: testQuestion,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it('Should handle errors when fetching answer results', async () => {
    const errorMessage = 'Failed to fetch';
    mockClient.assistant.getAnswerResults.mockRejectedValue(new Error(errorMessage));

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

  it('Should refetch data when getAnswer is called again', async () => {
    const { result } = renderHook(() => useAnswerResults(testProps));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    mockClient.assistant.getAnswerResults.mockClear();

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

    expect(mockClient.assistant.getAnswerResults).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('Should update dependency when itemId changes', async () => {
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

    mockClient.assistant.getAnswerResults.mockClear();

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

    expect(mockClient.assistant.getAnswerResults).toHaveBeenCalledWith({
      itemId: newProps.itemId,
      question: newQuestion,
    });
  });

  it('Should not fetch if cioClient is not provided', () => {
    const { result } = renderHook(() => useAnswerResults({ ...testProps, cioClient: undefined }));

    act(() => {
      result.current.getAnswer(testQuestion);
    });

    expect(mockClient.assistant.getAnswerResults).not.toHaveBeenCalled();
  });
});
