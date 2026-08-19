import { CioClient } from '../../src/hooks/useCioPia';

export type MockPia = {
  getSuggestedQuestions: jest.MockedFunction<CioClient['agent']['pia']['getSuggestedQuestions']>;
  getAnswerResults: jest.MockedFunction<CioClient['agent']['pia']['getAnswerResults']>;
};

export type TestMockClient = {
  agent: { pia: MockPia };
  tracker: Record<string, jest.Mock>;
};

export function createMockCioClient(): TestMockClient {
  return {
    agent: {
      pia: {
        getSuggestedQuestions: jest.fn().mockResolvedValue({ questions: [] }),
        getAnswerResults: jest.fn().mockResolvedValue({ qna_result_id: 'mock-id', value: '' }),
      },
    },
    tracker: {
      trackProductInsightsAgentViews: jest.fn(),
      trackProductInsightsAgentView: jest.fn(),
      trackProductInsightsAgentOutOfView: jest.fn(),
      trackProductInsightsAgentFocus: jest.fn(),
      trackProductInsightsAgentQuestionClick: jest.fn(),
      trackProductInsightsAgentQuestionSubmit: jest.fn(),
      trackProductInsightsAgentAnswerView: jest.fn(),
      trackProductInsightsAgentAnswerFeedback: jest.fn(),
      trackProductInsightsAgentResultClick: jest.fn(),
    },
  } as unknown as TestMockClient;
}
