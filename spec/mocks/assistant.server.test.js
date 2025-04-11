import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_QUESTION } from '../../src/constants';

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
            const result = await client.assistant.getSuggestedQuestions(DEMO_ITEM_ID);

            expect(result).toBeDefined();
            expect(result.questions).toBeDefined();
            expect(Array.isArray(result.questions)).toBe(true);
            expect(result.questions[0]).toHaveProperty('value');
            expect(typeof result.questions[0].value).toBe('string');
        });
    })
})
