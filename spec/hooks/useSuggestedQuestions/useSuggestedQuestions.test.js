import { renderHook, waitFor, act } from '@testing-library/react';
import useCioClient from '../../../src/hooks/useCioClient';
import useSuggestedQuestions from '../../../src/hooks/useSuggestedQuestions';

// Mock useCioClient and its methods to test useSuggestedQuestions in isolation
jest.mock('../../../src/hooks/useCioClient');

const mockQuestions = ['Mock question 1', 'Mock question 2', 'Mock question 3'];

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

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: 'test-item-id' }));

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for the render to finish
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check the returned data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.error).toBeNull();
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith('test-item-id');
  });

  it('Should handle errors when fetching questions fails', async () => {
    const mockError = new Error('Mock error');
    mockClientInstance.assistant.getSuggestedQuestions.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: 'test-item-id' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Expect error state with empty question array
    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Mock error');
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith('test-item-id');
  });

  it('Should refetch questions when refetch function is called', async () => {
    mockClientInstance.assistant.getSuggestedQuestions.mockResolvedValueOnce({
      questions: mockQuestions,
    });

    // Call the hook once and clear the mock
    const { result } = renderHook(() => useSuggestedQuestions({ itemId: 'test-item-id' }));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockClientInstance.assistant.getSuggestedQuestions.mockClear();
    mockClientInstance.assistant.getSuggestedQuestions.mockResolvedValueOnce({
      questions: ['New mock question 1', 'New mock question 2'],
    });

    // Call the refetch function
    act(() => {
      result.current.refetch();
    });

    // Check state after refetch
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.questions).toEqual(['New mock question 1', 'New mock question 2']);
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledTimes(1);
  });

  it('Should not fetch if no client', async () => {
    useCioClient.mockReturnValue(null);

    const { result } = renderHook(() => useSuggestedQuestions({ itemId: 'test-item-id' }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.questions).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledTimes(0);
  });

  it('Should refetch when itemId changes', async () => {
    const newMockQuestions = ['New mock question 1', 'New mock question 2'];
    mockClientInstance.assistant.getSuggestedQuestions
      .mockResolvedValueOnce({ questions: mockQuestions })
      .mockResolvedValueOnce({ questions: newMockQuestions });

    const { result, rerender } = renderHook((props) => useSuggestedQuestions(props), {
      initialProps: { itemId: 'test-item-id' },
    });

    // Initial render
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.questions).toEqual(mockQuestions);

    // Verify initial render results
    expect(result.current.questions).toEqual(mockQuestions);

    // Rerender with a different itemId
    rerender({ itemId: 'new-test-item-id' });

    // Verify re-render results
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.questions).toEqual(newMockQuestions);

    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith('test-item-id');
    expect(mockClientInstance.assistant.getSuggestedQuestions).toHaveBeenCalledWith(
      'new-test-item-id',
    );
  });
});
