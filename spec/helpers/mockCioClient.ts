import CioClient from '../../src/hooks/mocks/CioClient';
import PiaAgent from '../../src/hooks/mocks/agent';

type MockedAgent = {
  [K in keyof PiaAgent]: PiaAgent[K] extends (...args: infer A) => infer R
    ? jest.MockedFunction<(...args: A) => R>
    : PiaAgent[K];
};

export type TestMockClient = Omit<CioClient, 'agent'> & { agent: MockedAgent };

const TEST_API_KEY = 'test-api-key';

export function createMockCioClient(apiKey = TEST_API_KEY): TestMockClient {
  const client = new CioClient({
    apiKey,
    sendTrackingEvents: false,
    fetch: jest.fn(),
  });
  jest.spyOn(client.agent, 'getSuggestedQuestions').mockResolvedValue({ questions: [] });
  jest.spyOn(client.agent, 'getAnswerResults').mockResolvedValue({ qna_result_id: 'mock-id', value: '' });
  return { ...client, agent: client.agent as unknown as MockedAgent } as TestMockClient;
}
