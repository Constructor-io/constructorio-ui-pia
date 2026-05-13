import { renderHook } from '@testing-library/react';
import useTracking from '../../../src/hooks/useTracking';
import { FeedbackType } from '../../../src/types';

describe('Testing Hook: useTracking', () => {
  const mockTracker = {
    trackProductInsightsAgentViews: jest.fn(),
    trackProductInsightsAgentView: jest.fn(),
    trackProductInsightsAgentOutOfView: jest.fn(),
    trackProductInsightsAgentFocus: jest.fn(),
    trackProductInsightsAgentQuestionClick: jest.fn(),
    trackProductInsightsAgentQuestionSubmit: jest.fn(),
    trackProductInsightsAgentAnswerView: jest.fn(),
    trackProductInsightsAgentAnswerFeedback: jest.fn(),
  };

  const mockClient = { tracker: mockTracker };

  const baseProps = {
    cioClient: mockClient,
    itemId: 'test-item',
    itemName: 'Test Product',
  };

  const testQuestions = [{ value: 'Question 1' }, { value: 'Question 2' }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('baseParams', () => {
    it('includes itemId and itemName', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackFocus();

      expect(mockTracker.trackProductInsightsAgentFocus).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
      });
    });

    it('includes variationId when provided', () => {
      const { result } = renderHook(() =>
        useTracking({ ...baseProps, variationId: 'var-1' }),
      );

      result.current.trackFocus();

      expect(mockTracker.trackProductInsightsAgentFocus).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        variationId: 'var-1',
      });
    });

    it('omits variationId when undefined', () => {
      const { result } = renderHook(() =>
        useTracking({ ...baseProps, variationId: undefined }),
      );

      result.current.trackOutOfView();

      const call = mockTracker.trackProductInsightsAgentOutOfView.mock.calls[0][0];
      expect(call).not.toHaveProperty('variationId');
    });
  });

  describe('mapQuestions', () => {
    it('maps { value } to { question }', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackView(testQuestions);

      expect(mockTracker.trackProductInsightsAgentView).toHaveBeenCalledWith(
        expect.objectContaining({
          questions: [{ question: 'Question 1' }, { question: 'Question 2' }],
        }),
      );
    });

    it('handles empty questions array', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackView([]);

      expect(mockTracker.trackProductInsightsAgentView).toHaveBeenCalledWith(
        expect.objectContaining({ questions: [] }),
      );
    });
  });

  describe('trackViews', () => {
    it('sends questions and viewTimespans', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const timespans = [
        { start: '2026-01-01T00:00:00Z', end: '2026-01-01T00:01:00Z' },
        { start: '2026-01-01T00:05:00Z', end: '2026-01-01T00:06:00Z' },
      ];

      result.current.trackViews(testQuestions, timespans);

      expect(mockTracker.trackProductInsightsAgentViews).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        questions: [{ question: 'Question 1' }, { question: 'Question 2' }],
        viewTimespans: timespans,
      });
    });
  });

  describe('trackView', () => {
    it('sends questions with base params', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackView(testQuestions);

      expect(mockTracker.trackProductInsightsAgentView).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        questions: [{ question: 'Question 1' }, { question: 'Question 2' }],
      });
    });
  });

  describe('trackOutOfView', () => {
    it('sends only base params', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackOutOfView();

      expect(mockTracker.trackProductInsightsAgentOutOfView).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
      });
    });
  });

  describe('trackQuestionClick', () => {
    it('sends question string with base params', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackQuestionClick('What is this?');

      expect(mockTracker.trackProductInsightsAgentQuestionClick).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        question: 'What is this?',
      });
    });
  });

  describe('trackQuestionSubmit', () => {
    it('sends question string with base params', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackQuestionSubmit('What is this?');

      expect(mockTracker.trackProductInsightsAgentQuestionSubmit).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        question: 'What is this?',
      });
    });
  });

  describe('trackAnswerView', () => {
    it('sends question, answerText, and qnaResultId', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = {
        value: 'This is the answer',
        qna_result_id: 'result-123',
      };

      result.current.trackAnswerView('What is this?', answerData);

      expect(mockTracker.trackProductInsightsAgentAnswerView).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        question: 'What is this?',
        answerText: 'This is the answer',
        qnaResultId: 'result-123',
      });
    });
  });

  describe('trackAnswerFeedback', () => {
    it('maps FeedbackType.UP to thumbs_up', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackAnswerFeedback(FeedbackType.UP, 'result-123');

      expect(mockTracker.trackProductInsightsAgentAnswerFeedback).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        feedbackLabel: 'thumbs_up',
        qnaResultId: 'result-123',
      });
    });

    it('maps FeedbackType.DOWN to thumbs_down', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackAnswerFeedback(FeedbackType.DOWN, 'result-456');

      expect(mockTracker.trackProductInsightsAgentAnswerFeedback).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        feedbackLabel: 'thumbs_down',
        qnaResultId: 'result-456',
      });
    });

    it('handles undefined qnaResultId', () => {
      const { result } = renderHook(() => useTracking(baseProps));

      result.current.trackAnswerFeedback(FeedbackType.UP);

      expect(mockTracker.trackProductInsightsAgentAnswerFeedback).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        feedbackLabel: 'thumbs_up',
        qnaResultId: undefined,
      });
    });
  });

  describe('when cioClient is undefined', () => {
    it('does not throw on any tracking call', () => {
      const { result } = renderHook(() =>
        useTracking({ itemId: 'test-item', itemName: 'Test Product' }),
      );

      expect(() => result.current.trackView(testQuestions)).not.toThrow();
      expect(() => result.current.trackViews(testQuestions, [])).not.toThrow();
      expect(() => result.current.trackOutOfView()).not.toThrow();
      expect(() => result.current.trackFocus()).not.toThrow();
      expect(() => result.current.trackQuestionClick('q')).not.toThrow();
      expect(() => result.current.trackQuestionSubmit('q')).not.toThrow();
      expect(() => result.current.trackAnswerView('q', { value: 'a', qna_result_id: 'r' })).not.toThrow();
      expect(() => result.current.trackAnswerFeedback(FeedbackType.UP)).not.toThrow();
    });
  });
});
