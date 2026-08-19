import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  DEMO_API_KEY,
  DEMO_ITEM_ID,
  DEMO_QUESTION,
  DEMO_QUESTION_ALTERNATIVE_PRODUCTS,
  MOCK_QUESTIONS,
} from '../../src/constants';
import { QuestionResponse, GetAnswerResultsResponse } from '../../src/hooks/mocks/types';
import { testGetAnswersApiResponse } from '../localExamples';

describe('Testing PIA Module', () => {
  let client;

  const createClientWithResponse = (payload: QuestionResponse | GetAnswerResultsResponse) =>
    new ConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
      clientId: 'test-client-id',
      fetch: jest.fn(async () => ({ ok: true, json: async () => payload })),
    });

  beforeEach(() => {
    client = new ConstructorIOClient({
      apiKey: DEMO_API_KEY,
      sessionId: 123,
      clientId: 'test-client-id',
    });
  });

  describe('getSuggestedQuestions', () => {
    it('fetches suggested questions given item_id', async () => {
      const result = await createClientWithResponse({
        questions: MOCK_QUESTIONS,
      }).agent.pia.getSuggestedQuestions(DEMO_ITEM_ID);

      expect(result).toBeDefined();
      expect(result.questions).toBeDefined();
      expect(Array.isArray(result.questions)).toBe(true);
      expect(result.questions[0]).toHaveProperty('value');
      expect(typeof result.questions[0].value).toBe('string');
    });

    it('throws an error if no item id is provided', async () => {
      await expect(client.agent.pia.getSuggestedQuestions(undefined)).rejects.toThrow(
        'itemId is a required parameter of type string',
      );
    });
  });

  describe('getAnswerResults', () => {
    it('fetches answer given item_id and questions', async () => {
      const result = await createClientWithResponse(
        testGetAnswersApiResponse,
      ).agent.pia.getAnswerResults(DEMO_ITEM_ID, DEMO_QUESTION_ALTERNATIVE_PRODUCTS);

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
