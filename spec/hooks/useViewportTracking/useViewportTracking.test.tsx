import React from 'react';
import { render, act } from '@testing-library/react';
import useViewportTracking, {
  UseViewportTrackingProps,
} from '../../../src/hooks/useViewportTracking';
import createMockTracking from '../../__mocks__/createMockTracking';

describe('Testing Hook: useViewportTracking', () => {
  let observerCallback: ((entries: IntersectionObserverEntry[]) => void) | null;
  let observerInstance: { observe: jest.Mock; disconnect: jest.Mock } | null;

  let mockTracking: ReturnType<typeof createMockTracking>;
  const testQuestions = [{ value: 'Question 1' }, { value: 'Question 2' }];

  function TestComponent({ tracking, questions, viewThreshold }: UseViewportTrackingProps) {
    const { containerRef } = useViewportTracking({ tracking, questions, viewThreshold });
    return <div ref={containerRef} data-testid='viewport-target' />;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockTracking = createMockTracking();

    observerCallback = null;
    observerInstance = null;

    global.IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      observerInstance = {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
      return observerInstance;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function simulateEntry(isIntersecting) {
    act(() => {
      observerCallback([{ isIntersecting }]);
    });
  }

  it('creates IntersectionObserver with default threshold 0.5', () => {
    render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

    expect(global.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.5,
    });
    expect(observerInstance.observe).toHaveBeenCalled();
  });

  it('creates IntersectionObserver with a custom viewThreshold when provided', () => {
    render(
      <TestComponent tracking={mockTracking} questions={testQuestions} viewThreshold={0.01} />,
    );

    expect(global.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.01,
    });
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(
      <TestComponent tracking={mockTracking} questions={testQuestions} />,
    );

    unmount();
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  describe('viewport entry', () => {
    it('fires trackView on viewport entry when questions exist', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);
      expect(mockTracking.trackView).toHaveBeenCalledWith(testQuestions);
      expect(mockTracking.trackView).toHaveBeenCalledTimes(1);
    });

    it('does not fire trackView when questions are empty', () => {
      render(<TestComponent tracking={mockTracking} questions={[]} />);

      simulateEntry(true);
      expect(mockTracking.trackView).not.toHaveBeenCalled();
    });

    it('fires trackView on each viewport entry', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);
      simulateEntry(false);
      simulateEntry(true);

      expect(mockTracking.trackView).toHaveBeenCalledTimes(2);
    });
  });

  describe('viewport exit', () => {
    it('fires trackOutOfView on viewport exit after entry', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);
      simulateEntry(false);

      expect(mockTracking.trackOutOfView).toHaveBeenCalledTimes(1);
    });

    it('does not fire trackOutOfView without prior entry', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(false);
      expect(mockTracking.trackOutOfView).not.toHaveBeenCalled();
    });
  });

  describe('timespan accumulation and flush', () => {
    it('flushes accumulated timespans on unmount', () => {
      const { unmount } = render(
        <TestComponent tracking={mockTracking} questions={testQuestions} />,
      );

      simulateEntry(true);
      simulateEntry(false);
      simulateEntry(true);
      simulateEntry(false);

      unmount();

      expect(mockTracking.trackViews).toHaveBeenCalledWith(
        testQuestions,
        expect.arrayContaining([
          expect.objectContaining({ start: expect.any(String), end: expect.any(String) }),
          expect.objectContaining({ start: expect.any(String), end: expect.any(String) }),
        ]),
      );
    });

    it('flushes in-progress timespan (currently in viewport) on unmount', () => {
      const { unmount } = render(
        <TestComponent tracking={mockTracking} questions={testQuestions} />,
      );

      simulateEntry(true);
      // Don't exit — still in viewport

      unmount();

      expect(mockTracking.trackViews).toHaveBeenCalledWith(
        testQuestions,
        [expect.objectContaining({ start: expect.any(String), end: expect.any(String) })],
      );
    });

    it('flushes timespans on 5-minute interval', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);
      simulateEntry(false);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledWith(
        testQuestions,
        [expect.objectContaining({ start: expect.any(String), end: expect.any(String) })],
      );
    });

    it('flushes in-progress timespan on interval when currently in viewport', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledWith(
        testQuestions,
        [expect.objectContaining({ start: expect.any(String), end: expect.any(String) })],
      );
    });

    it('flushes on visibilitychange to hidden', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);
      simulateEntry(false);

      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
        configurable: true,
      });

      act(() => {
        document.dispatchEvent(new Event('visibilitychange'));
      });

      expect(mockTracking.trackViews).toHaveBeenCalledWith(
        testQuestions,
        [expect.objectContaining({ start: expect.any(String), end: expect.any(String) })],
      );

      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        writable: true,
        configurable: true,
      });
    });

    it('does not flush when there are no accumulated timespans', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).not.toHaveBeenCalled();
    });

    it('does not flush when questions are empty', () => {
      render(<TestComponent tracking={mockTracking} questions={[]} />);

      simulateEntry(true);
      simulateEntry(false);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).not.toHaveBeenCalled();
    });

    it('resets accumulated timespans after flush', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      simulateEntry(true);
      simulateEntry(false);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledTimes(1);

      // No new entries — next interval should not flush
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledTimes(1);
    });

    it('accumulates new timespans after a flush and flushes again', () => {
      render(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      // First cycle
      simulateEntry(true);
      simulateEntry(false);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledTimes(1);

      // Second cycle
      simulateEntry(true);
      simulateEntry(false);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledTimes(2);
    });
  });

  describe('questions ref update', () => {
    it('uses latest questions when flushing', () => {
      const updatedQuestions = [{ value: 'Updated question' }];

      const { rerender } = render(
        <TestComponent tracking={mockTracking} questions={testQuestions} />,
      );

      simulateEntry(true);
      simulateEntry(false);

      // Update questions
      rerender(<TestComponent tracking={mockTracking} questions={updatedQuestions} />);

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockTracking.trackViews).toHaveBeenCalledWith(
        updatedQuestions,
        expect.any(Array),
      );
    });

    it('fires trackView when questions arrive while already in viewport', () => {
      const { rerender } = render(
        <TestComponent tracking={mockTracking} questions={[]} />,
      );

      // Enter viewport with no questions — trackView should not fire
      simulateEntry(true);
      expect(mockTracking.trackView).not.toHaveBeenCalled();

      // Questions arrive while still in viewport
      rerender(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      expect(mockTracking.trackView).toHaveBeenCalledWith(testQuestions);
      expect(mockTracking.trackView).toHaveBeenCalledTimes(1);
    });

    it('does not re-fire trackView when questions update but were already non-empty', () => {
      const updatedQuestions = [{ value: 'Updated question' }];

      const { rerender } = render(
        <TestComponent tracking={mockTracking} questions={testQuestions} />,
      );

      simulateEntry(true);
      expect(mockTracking.trackView).toHaveBeenCalledTimes(1);

      // Update questions while in viewport — should NOT fire again
      rerender(<TestComponent tracking={mockTracking} questions={updatedQuestions} />);

      expect(mockTracking.trackView).toHaveBeenCalledTimes(1);
    });

    it('does not fire trackView when questions arrive but not in viewport', () => {
      const { rerender } = render(
        <TestComponent tracking={mockTracking} questions={[]} />,
      );

      // Never entered viewport — questions arrive
      rerender(<TestComponent tracking={mockTracking} questions={testQuestions} />);

      expect(mockTracking.trackView).not.toHaveBeenCalled();
    });

    it('uses latest questions for trackView on entry', () => {
      const updatedQuestions = [{ value: 'Updated question' }];

      const { rerender } = render(
        <TestComponent tracking={mockTracking} questions={testQuestions} />,
      );

      // First entry with original questions
      simulateEntry(true);
      expect(mockTracking.trackView).toHaveBeenCalledWith(testQuestions);

      simulateEntry(false);

      // Update questions
      rerender(<TestComponent tracking={mockTracking} questions={updatedQuestions} />);

      // Second entry with updated questions
      simulateEntry(true);
      expect(mockTracking.trackView).toHaveBeenCalledWith(updatedQuestions);
    });
  });
});
