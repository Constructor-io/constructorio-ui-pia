import MockConstructorIOClient from '../../src/hooks/mocks/MockConstructorIOClient';

interface MockAgentMethods {
  getSuggestedQuestions: jest.Mock;
  getAnswerResults: jest.Mock;
}

type TestMockClient = MockConstructorIOClient & { agent: MockAgentMethods };

export function createMockCioClient(): TestMockClient {
  return {
    options: {},
    search: {},
    browse: {},
    recommendations: {},
    tracker: {},
    quizzes: {},
    agent: {
      getSuggestedQuestions: jest.fn(),
      getAnswerResults: jest.fn(),
    },
  } as unknown as TestMockClient;
}
