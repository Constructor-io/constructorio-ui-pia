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
    trackProductInsightsAgentResultClick: jest.fn(),
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

    it('includes threadId when provided', () => {
      const { result } = renderHook(() =>
        useTracking({ ...baseProps, threadId: 'thread-abc' }),
      );

      result.current.trackFocus();

      expect(mockTracker.trackProductInsightsAgentFocus).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        threadId: 'thread-abc',
      });
    });

    it('omits threadId when undefined', () => {
      const { result } = renderHook(() =>
        useTracking({ ...baseProps, threadId: undefined }),
      );

      result.current.trackOutOfView();

      const call = mockTracker.trackProductInsightsAgentOutOfView.mock.calls[0][0];
      expect(call).not.toHaveProperty('threadId');
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

    it('includes items when provided', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = { value: 'Answer', qna_result_id: 'r-1' };
      const items = [
        { id: 'prod-1', name: 'Product 1' },
        { id: 'prod-2', name: 'Product 2' },
      ];

      result.current.trackAnswerView('Question?', answerData, items);

      expect(mockTracker.trackProductInsightsAgentAnswerView).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        question: 'Question?',
        answerText: 'Answer',
        qnaResultId: 'r-1',
        items: [
          { itemId: 'prod-1', itemName: 'Product 1' },
          { itemId: 'prod-2', itemName: 'Product 2' },
        ],
      });
    });

    it('omits items when null', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = { value: 'Answer', qna_result_id: 'r-1' };

      result.current.trackAnswerView('Question?', answerData, null);

      const call = mockTracker.trackProductInsightsAgentAnswerView.mock.calls[0][0];
      expect(call).not.toHaveProperty('items');
    });

    it('omits items when empty array', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = { value: 'Answer', qna_result_id: 'r-1' };

      result.current.trackAnswerView('Question?', answerData, []);

      const call = mockTracker.trackProductInsightsAgentAnswerView.mock.calls[0][0];
      expect(call).not.toHaveProperty('items');
    });

    it('includes followUpQuestions when present in answerData', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = {
        value: 'Answer',
        qna_result_id: 'r-1',
        follow_up_questions: [{ value: 'Follow up 1' }, { value: 'Follow up 2' }],
      };

      result.current.trackAnswerView('Question?', answerData);

      expect(mockTracker.trackProductInsightsAgentAnswerView).toHaveBeenCalledWith({
        itemId: 'test-item',
        itemName: 'Test Product',
        question: 'Question?',
        answerText: 'Answer',
        qnaResultId: 'r-1',
        followUpQuestions: [{ value: 'Follow up 1' }, { value: 'Follow up 2' }],
      });
    });

    it('omits followUpQuestions when not present in answerData', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = { value: 'Answer', qna_result_id: 'r-1' };

      result.current.trackAnswerView('Question?', answerData);

      const call = mockTracker.trackProductInsightsAgentAnswerView.mock.calls[0][0];
      expect(call).not.toHaveProperty('followUpQuestions');
    });

    it('omits followUpQuestions when empty array', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const answerData = { value: 'Answer', qna_result_id: 'r-1', follow_up_questions: [] };

      result.current.trackAnswerView('Question?', answerData);

      const call = mockTracker.trackProductInsightsAgentAnswerView.mock.calls[0][0];
      expect(call).not.toHaveProperty('followUpQuestions');
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

      const call = mockTracker.trackProductInsightsAgentAnswerFeedback.mock.calls[0][0];
      expect(call).not.toHaveProperty('qnaResultId');
      expect(call).toEqual({
        itemId: 'test-item',
        itemName: 'Test Product',
        feedbackLabel: 'thumbs_up',
      });
    });
  });

  describe('trackResultClick', () => {
    it('sends clicked item details, position, question, and seed item fields', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const clickedItem = { id: 'rec-1', name: 'Recommended Product', variationId: 'v-1' };

      result.current.trackResultClick(clickedItem, 2, 'What color is it?');

      expect(mockTracker.trackProductInsightsAgentResultClick).toHaveBeenCalledWith({
        itemId: 'rec-1',
        itemName: 'Recommended Product',
        variationId: 'v-1',
        question: 'What color is it?',
        seedItemId: 'test-item',
        seedItemName: 'Test Product',
        position: 2,
      });
    });

    it('omits variationId when not present on item', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const clickedItem = { id: 'rec-2', name: 'Another Product' };

      result.current.trackResultClick(clickedItem, 0, 'Any alternatives?');

      const call = mockTracker.trackProductInsightsAgentResultClick.mock.calls[0][0];
      expect(call).not.toHaveProperty('variationId');
      expect(call).toEqual({
        itemId: 'rec-2',
        itemName: 'Another Product',
        question: 'Any alternatives?',
        seedItemId: 'test-item',
        seedItemName: 'Test Product',
        position: 0,
      });
    });

    it('includes threadId when provided', () => {
      const { result } = renderHook(() =>
        useTracking({ ...baseProps, threadId: 'thread-xyz' }),
      );
      const clickedItem = { id: 'rec-1', name: 'Product' };

      result.current.trackResultClick(clickedItem, 1, 'Is it good?');

      expect(mockTracker.trackProductInsightsAgentResultClick).toHaveBeenCalledWith({
        itemId: 'rec-1',
        itemName: 'Product',
        question: 'Is it good?',
        seedItemId: 'test-item',
        seedItemName: 'Test Product',
        threadId: 'thread-xyz',
        position: 1,
      });
    });

    it('includes qnaResultId when provided', () => {
      const { result } = renderHook(() => useTracking(baseProps));
      const clickedItem = { id: 'rec-1', name: 'Product' };

      result.current.trackResultClick(clickedItem, 0, 'Question?', 'result-abc');

      expect(mockTracker.trackProductInsightsAgentResultClick).toHaveBeenCalledWith({
        itemId: 'rec-1',
        itemName: 'Product',
        question: 'Question?',
        seedItemId: 'test-item',
        seedItemName: 'Test Product',
        qnaResultId: 'result-abc',
        position: 0,
      });
    });

    it('includes seedVariationId when variationId prop is provided', () => {
      const { result } = renderHook(() =>
        useTracking({ ...baseProps, variationId: 'seed-var-1' }),
      );
      const clickedItem = { id: 'rec-1', name: 'Product' };

      result.current.trackResultClick(clickedItem, 0, 'Question?');

      expect(mockTracker.trackProductInsightsAgentResultClick).toHaveBeenCalledWith({
        itemId: 'rec-1',
        itemName: 'Product',
        question: 'Question?',
        seedItemId: 'test-item',
        seedItemName: 'Test Product',
        seedVariationId: 'seed-var-1',
        position: 0,
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
      expect(() => result.current.trackResultClick({ id: 'x', name: 'y' }, 0, 'q')).not.toThrow();
    });
  });
});
