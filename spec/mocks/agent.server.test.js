import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_QUESTION } from '../../src/constants';

describe('Testing Mocks: Agent', () => {
  let client;

  beforeEach(() => {
    client = new MockConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
      clientId: 'test-client-id',
    });
  });

  describe('getSuggestedQuestions', () => {
    it('fetches suggested questions given item_id', async () => {
      const result = await client.agent.getSuggestedQuestions(DEMO_ITEM_ID);

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

      await expect(clientWithoutUrl.agent.getSuggestedQuestions(DEMO_ITEM_ID)).rejects.toThrow(
        'Agent service URL is required',
      );
    });

    it('throws an error if no item id is provided', async () => {
      const clientWithoutUrl = new MockConstructorIOClient({
        apiKey: DEMO_API_KEY,
        sessionId: 123,
        clientId: 'test-client-id',
      });

      await expect(clientWithoutUrl.agent.getSuggestedQuestions(undefined)).rejects.toThrow(
        'Item ID is required',
      );
    });
  });

  describe('getAnswerResults', () => {
    it('fetches answer given item_id and questions', async () => {
      const result = await client.agent.getAnswerResults({
        itemId: DEMO_ITEM_ID,
        question: DEMO_QUESTION,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('value');
      expect(result.value).toBeDefined();
      expect(typeof result.value).toBe('string');
      expect(result.alternatives).toBeUndefined();
      expect(result.follow_up_questions).toBeDefined();
      expect(Array.isArray(result.follow_up_questions)).toBe(true);
      expect(result.follow_up_questions[0]).toHaveProperty('value');
      expect(typeof result.follow_up_questions[0].value).toBe('string');
    }, 15000); // Adding a timeout here as the answer API might take longer to respond

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
          question: undefined,
        }),
      ).rejects.toThrow('Question is required');
    });
  });
});
