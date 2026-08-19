import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import {
  DEMO_API_KEY,
  DEMO_ITEM_ID,
  DEMO_QUESTION,
  DEMO_QUESTION_ALTERNATIVE_PRODUCTS,
  MOCK_QUESTIONS,
} from '../../src/constants';
import { testGetAnswersApiResponse } from '../localExamples';

describe('Testing Mocks: Agent', () => {
  let client;
  const originalFetch = globalThis.fetch;

  // The happy paths used to hit the live Answer API, which made them slow and tied them to
  // demo-index data that changes outside this repo. Stubbing fetch keeps the assertions and
  // drops the coupling. Safe to assign after the client is built: src/hooks/mocks/agent.ts
  // calls the global `fetch` directly, so it resolves at call time.
  const stubFetchWith = (payload: unknown) => {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => payload }) as Response);
  };

  beforeEach(() => {
    client = new MockConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('getSuggestedQuestions', () => {
    it('fetches suggested questions given item_id', async () => {
      stubFetchWith({ questions: MOCK_QUESTIONS });

      const result = await client.agent.getSuggestedQuestions({ itemId: DEMO_ITEM_ID });

      expect(result).toBeDefined();
      expect(result.questions).toBeDefined();
      expect(Array.isArray(result.questions)).toBe(true);
      expect(result.questions[0]).toHaveProperty('value');
      expect(typeof result.questions[0].value).toBe('string');
    });

    it('throws an error if no agentServiceUrl is provided', async () => {
      const clientWithoutUrl = new MockConstructorIOClient({
        apiKey: DEMO_API_KEY,
        sessionId: 123,
        clientId: 'test-client-id',
        agentServiceUrl: undefined, // Simulating no URL provided
      });

      await expect(
        clientWithoutUrl.agent.getSuggestedQuestions({ itemId: DEMO_ITEM_ID }),
      ).rejects.toThrow('Agent service URL is required');
    });

    it('throws an error if no item id is provided', async () => {
      const clientWithoutUrl = new MockConstructorIOClient({
        apiKey: DEMO_API_KEY,
        sessionId: 123,
        clientId: 'test-client-id',
      });

      await expect(
        // @ts-expect-error testing missing required field
        clientWithoutUrl.agent.getSuggestedQuestions({ itemId: undefined }),
      ).rejects.toThrow('Item ID is required');
    });
  });

  describe('getAnswerResults', () => {
    it('fetches answer given item_id and questions', async () => {
      stubFetchWith(testGetAnswersApiResponse);

      // Verify structure of item_results and follow_up_questions for alternative products
      const result = await client.agent.getAnswerResults({
        itemId: DEMO_ITEM_ID,
        question: DEMO_QUESTION_ALTERNATIVE_PRODUCTS,
      });

      expect(result).toBeDefined();

      expect(result.qna_result_id).toBeDefined();
      expect(typeof result.qna_result_id).toBe('string');

      expect(result.value).toBeDefined();
      expect(typeof result.value).toBe('string');

      expect(result.item_results).toBeDefined();
      expect(result.item_results.request).toBeDefined();
      expect(result.item_results.response).toBeDefined();
      expect(result.item_results.response.results).toBeDefined();
      expect(Array.isArray(result.item_results.response.results)).toBe(true);
      expect(result.item_results.response.results[0]).toHaveProperty('value');
      expect(typeof result.item_results.response.results[0].value).toBe('string');

      expect(result.follow_up_questions).toBeDefined();
      expect(Array.isArray(result.follow_up_questions)).toBe(true);
      expect(result.follow_up_questions[0]).toHaveProperty('value');
      expect(typeof result.follow_up_questions[0].value).toBe('string');
    });

    it('throws an error if no agentServiceUrl is provided', async () => {
      const clientWithoutUrl = new MockConstructorIOClient({
        apiKey: DEMO_API_KEY,
        sessionId: 123,
        clientId: 'test-client-id',
        agentServiceUrl: undefined, // Simulating no URL provided
      });

      await expect(
        clientWithoutUrl.agent.getAnswerResults({
          itemId: DEMO_ITEM_ID,
          question: DEMO_QUESTION,
        }),
      ).rejects.toThrow('Agent service URL is required');
    });

    it('throws an error if no item id is provided', async () => {
      const clientWithoutUrl = new MockConstructorIOClient({
        apiKey: DEMO_API_KEY,
        sessionId: 123,
        clientId: 'test-client-id',
      });

      await expect(
        clientWithoutUrl.agent.getAnswerResults({
          // @ts-expect-error testing missing required field
          itemId: undefined,
          question: DEMO_QUESTION,
        }),
      ).rejects.toThrow('Item ID is required');
    });

    it('throws an error if no question is provided', async () => {
      const clientWithoutUrl = new MockConstructorIOClient({
        apiKey: DEMO_API_KEY,
        sessionId: 123,
        clientId: 'test-client-id',
      });

      await expect(
        clientWithoutUrl.agent.getAnswerResults({
          itemId: DEMO_ITEM_ID,
          // @ts-expect-error testing missing required field
          question: undefined,
        }),
      ).rejects.toThrow('Question is required');
    });
  });
});
