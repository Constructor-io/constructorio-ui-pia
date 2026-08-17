import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';
import MockAgent from '../../src/hooks/mocks/agent';

type MockedAgent = {
  [K in keyof MockAgent]: MockAgent[K] extends (...args: infer A) => infer R
    ? jest.MockedFunction<(...args: A) => R>
    : MockAgent[K];
};

export type TestMockClient = Omit<MockConstructorIOClient, 'agent'> & { agent: MockedAgent };

const TEST_API_KEY = 'test-api-key';

export function createMockCioClient(apiKey = TEST_API_KEY): TestMockClient {
  const client = new MockConstructorIOClient({
    apiKey,
    sendTrackingEvents: false,
    fetch: jest.fn(),
  });
  jest.spyOn(client.agent, 'getSuggestedQuestions').mockResolvedValue({ questions: [] });
  jest.spyOn(client.agent, 'getAnswerResults').mockResolvedValue({ qna_result_id: 'mock-id', value: '' });
  jest.spyOn(client.agent, 'getRecs').mockResolvedValue({
    title: '',
    items: null,
    refinement: null,
  });
  return { ...client, agent: client.agent as unknown as MockedAgent } as TestMockClient;
}
