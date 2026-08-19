import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_QUESTION } from '../../src/constants';

describe('Testing Mocks: Agent', () => {
  let client;

  beforeEach(() => {
    client = new MockConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
    });
  });

  describe('getSuggestedQuestions', () => {
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
