import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../src/constants';

describe('Testing PIA Tracking', () => {
  let client: InstanceType<typeof ConstructorIOClient>;

  beforeEach(() => {
    client = new ConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
      clientId: 'test-client-id',
    });
  });

  const baseParams = {
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
  };

  describe('trackProductInsightsAgentViews', () => {
    it('sends views event with questions and timespans', () => {
      const result = client.tracker.trackProductInsightsAgentViews({
        ...baseParams,
        questions: [{ question: 'What is this product?' }],
        viewTimespans: [
          { start: '2025-01-01T00:00:00.000Z', end: '2025-01-01T00:01:00.000Z' },
        ],
      });

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentView', () => {
    it('sends view event with questions', () => {
      const result = client.tracker.trackProductInsightsAgentView({
        ...baseParams,
        questions: [{ question: 'What is this product?' }],
      });

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentOutOfView', () => {
    it('sends out_of_view event', () => {
      const result = client.tracker.trackProductInsightsAgentOutOfView(baseParams);

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentFocus', () => {
    it('sends focus event', () => {
      const result = client.tracker.trackProductInsightsAgentFocus(baseParams);

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentQuestionClick', () => {
    it('sends question_click event', () => {
      const result = client.tracker.trackProductInsightsAgentQuestionClick({
        ...baseParams,
        question: 'What is this product?',
      });

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentQuestionSubmit', () => {
    it('sends question_submit event', () => {
      const result = client.tracker.trackProductInsightsAgentQuestionSubmit({
        ...baseParams,
        question: 'What is this product?',
      });

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentAnswerView', () => {
    it('sends answer_view event with all fields', () => {
      const result = client.tracker.trackProductInsightsAgentAnswerView({
        ...baseParams,
        question: 'What is this product?',
        answerText: 'This is a nutritional shake.',
        qnaResultId: 'test-qna-result-id',
        items: [{ itemId: DEMO_ITEM_ID, itemName: DEMO_ITEM_NAME }],
        followUpQuestions: [{ value: 'What flavors are available?' }],
      });

      expect(result).toBe(true);
    });

    it('sends answer_view event without optional fields', () => {
      const result = client.tracker.trackProductInsightsAgentAnswerView({
        ...baseParams,
        question: 'What is this product?',
        answerText: 'This is a nutritional shake.',
        qnaResultId: 'test-qna-result-id',
      });

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentAnswerFeedback', () => {
    it('sends answer_feedback event with thumbs_up', () => {
      const result = client.tracker.trackProductInsightsAgentAnswerFeedback({
        ...baseParams,
        feedbackLabel: 'thumbs_up',
        qnaResultId: 'test-qna-result-id',
      });

      expect(result).toBe(true);
    });

    it('sends answer_feedback event with thumbs_down', () => {
      const result = client.tracker.trackProductInsightsAgentAnswerFeedback({
        ...baseParams,
        feedbackLabel: 'thumbs_down',
        qnaResultId: 'test-qna-result-id',
      });

      expect(result).toBe(true);
    });
  });

  describe('trackProductInsightsAgentResultClick', () => {
    it('sends result_click event with seed item fields', () => {
      const result = client.tracker.trackProductInsightsAgentResultClick({
        itemId: 'clicked-item-id',
        itemName: 'Clicked Product',
        question: 'What are alternatives?',
        seedItemId: DEMO_ITEM_ID,
        seedItemName: DEMO_ITEM_NAME,
        position: 1,
      });

      expect(result).toBe(true);
    });

    it('sends result_click event with optional fields', () => {
      const result = client.tracker.trackProductInsightsAgentResultClick({
        itemId: 'clicked-item-id',
        itemName: 'Clicked Product',
        question: 'What are alternatives?',
        seedItemId: DEMO_ITEM_ID,
        seedItemName: DEMO_ITEM_NAME,
        seedVariationId: 'seed-var-1',
        variationId: 'clicked-var-1',
        qnaResultId: 'test-qna-result-id',
        threadId: '550e8400-e29b-41d4-a716-446655440000',
        position: 2,
      });

      expect(result).toBe(true);
    });
  });
});
