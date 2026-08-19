import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import { MOCK_QUESTIONS } from '../../src/constants';
import { testGetAnswersApiResponse } from '../localExamples';

// agent.url.test.ts covers which URL is requested and how failures surface, but it
// never looks at what the methods resolve to. These cover the other half: that the
// response body is parsed and handed back untouched.
describe('MockAgent: response payloads', () => {
  const originalFetch = globalThis.fetch;

  function stubFetchWith(payload: unknown) {
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => payload }) as Response);
  }

  function createClient() {
    return new MockConstructorIOClient({
      apiKey: 'test-key',
      clientId: 'test-client-id',
      sessionId: 5,
      sendTrackingEvents: false,
    });
  }

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('getSuggestedQuestions resolves to the parsed response body', async () => {
    const payload = { questions: MOCK_QUESTIONS };
    stubFetchWith(payload);

    const result = await createClient().agent.getSuggestedQuestions({ itemId: 'item-123' });

    expect(result).toEqual(payload);
  });

  it('getAnswerResults resolves to the parsed response body', async () => {
    stubFetchWith(testGetAnswersApiResponse);

    const result = await createClient().agent.getAnswerResults({
      itemId: 'item-123',
      question: 'What alternative products are available for this item?',
    });

    expect(result).toEqual(testGetAnswersApiResponse);
  });
});
