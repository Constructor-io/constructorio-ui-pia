import { renderHook, act } from '@testing-library/react';
import useAnswerResultsStream from '../../../src/hooks/useAnswerResultsStream';
import useCioClient from '../../../src/hooks/useCioClient';

jest.mock('../../../src/hooks/useCioClient');

const testItemId = 'test-item-id';
const testQuestion = 'What is this product?';
const testStartEvent = { type: 'start', id: '123' };
const testMessageEvent = { type: 'message', content: 'Test content', id: '123' };
const testEndEvent = { type: 'end', id: '123' };

describe('Testing Hook: useAnswerResultsStream', () => {
  const mockClient = {
    assistant: {
      getAnswerResultsStream: jest.fn(),
    },
  };

  const mockGetAnswerResultsStream = mockClient.assistant.getAnswerResultsStream;

  // Mock event handlers
  const mockOnStart = jest.fn();
  const mockOnMessage = jest.fn();
  const mockOnEnd = jest.fn();

  // Test data
  const testProps = {
    itemId: testItemId,
    question: testQuestion,
    onStart: mockOnStart,
    onMessage: mockOnMessage,
    onEnd: mockOnEnd,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCioClient.mockReturnValue(mockClient);

    mockGetAnswerResultsStream.mockImplementation(({ onStart, onMessage, onEnd, signal }) => {
      if (signal.aborted) {
        return Promise.reject(new Error('Aborted'));
      }

      onStart(testStartEvent);
      onMessage(testMessageEvent);
      onEnd(testEndEvent);

      return Promise.resolve();
    });
  });

  it('Should initialize with correct default values', () => {
    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.startStream).toBe('function');
    expect(typeof result.current.stopStream).toBe('function');
  });

  it('Should start streaming when startStream is called', async () => {
    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    await act(async () => {
      result.current.startStream();
    });

    expect(mockGetAnswerResultsStream).toHaveBeenCalledTimes(1);
    expect(mockGetAnswerResultsStream).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: testProps.itemId,
        question: testProps.question,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('Should call event callbacks during streaming', async () => {
    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    await act(async () => {
      result.current.startStream();
    });

    expect(mockOnStart).toHaveBeenCalledWith(testStartEvent);
    expect(mockOnMessage).toHaveBeenCalledWith(testMessageEvent);
    expect(mockOnEnd).toHaveBeenCalledWith(testEndEvent);
    expect(result.current.isStreaming).toBe(false);
  });

  it('Should handle errors correctly', async () => {
    mockGetAnswerResultsStream.mockRejectedValueOnce(new Error('Test error'));

    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    await act(async () => {
      result.current.startStream();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Test error');
    expect(result.current.isStreaming).toBe(false);
  });

  it('Should stop streaming when stopStream is called', async () => {
    // Mock implementation such that the function doesn't resolve
    mockGetAnswerResultsStream.mockImplementationOnce(() => new Promise(() => {}));

    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    await act(async () => {
      result.current.startStream();
    });

    expect(result.current.isStreaming).toBe(true);

    await act(async () => {
      result.current.stopStream();
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it('Should not start streaming if already streaming', async () => {
    mockGetAnswerResultsStream.mockImplementationOnce(() => new Promise(() => {}));

    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    await act(async () => {
      result.current.startStream();
    });

    expect(mockGetAnswerResultsStream).toHaveBeenCalledTimes(1);
    mockGetAnswerResultsStream.mockClear();

    await act(async () => {
      result.current.startStream(); // Should not start a second stream
    });

    expect(mockGetAnswerResultsStream).not.toHaveBeenCalled();
  });

  it('Should handle missing client', async () => {
    useCioClient.mockReturnValue(null);

    const { result } = renderHook(() => useAnswerResultsStream(testProps));

    await act(async () => {
      result.current.startStream();
    });

    expect(mockGetAnswerResultsStream).not.toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(false);
  });

  it('Should clean up and abort stream on unmount', async () => {
    mockGetAnswerResultsStream.mockImplementationOnce(() => new Promise(() => {}));

    const mockAbortController = {
      abort: jest.fn(),
      signal: {
        aborted: false,
      },
    };
    global.AbortController = jest.fn().mockImplementation(() => mockAbortController);

    const { result, unmount } = renderHook(() => useAnswerResultsStream(testProps));
    await act(async () => {
      result.current.startStream();
    });

    expect(result.current.isStreaming).toBe(true);
    expect(global.AbortController).toHaveBeenCalled();

    unmount();

    expect(mockAbortController.abort).toHaveBeenCalled();
  });
});
