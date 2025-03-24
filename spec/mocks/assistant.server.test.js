import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import { DEMO_API_KEY } from '../../src/constants';

describe('Testing Mocks: Assistant', () => {
    let client;

    beforeEach(() => {
        client = new MockConstructorIOClient({
            apiKey: DEMO_API_KEY,
            sessionId: 123,
            clientId: 'test-client-id',
        })
    })

    describe('getSuggestedQuestions', () => {
        it('Should fetch suggested questions given item_id', async () => {
            const itemId = '11016';
            const result = await client.assistant.getSuggestedQuestions(itemId);
            
            expect(result).toBeDefined();
            expect(result.request).toEqual({
              itemId,
              parameters: {},
            });
            expect(result.response).toBeDefined();
            expect(result.response).toHaveProperty('questions');
            expect(Array.isArray(result.response.questions)).toBe(true);
          });
    })
})
