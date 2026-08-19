import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_QUESTION } from '../../src/constants';

describe('Testing PIA Module', () => {
  let client;

  beforeEach(() => {
    client = new ConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
      clientId: 'test-client-id',
    });
  });

  describe('getSuggestedQuestions', () => {
    it('throws an error if no item id is provided', async () => {
      await expect(client.agent.pia.getSuggestedQuestions(undefined)).rejects.toThrow(
        'itemId is a required parameter of type string',
      );
    });
  });

  describe('getAnswerResults', () => {
    it('throws an error if no item id is provided', async () => {
      await expect(client.agent.pia.getAnswerResults(undefined, DEMO_QUESTION)).rejects.toThrow(
        'itemId is a required parameter of type string',
      );
    });

    it('throws an error if no question is provided', async () => {
      await expect(client.agent.pia.getAnswerResults(DEMO_ITEM_ID, undefined)).rejects.toThrow(
        'question is a required parameter of type string',
      );
    });
  });
});
