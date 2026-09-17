import { renderHook, act } from '@testing-library/react';
import useCioPia from '../../../src/hooks/useCioPia';
import { createMockCioClient } from '../../helpers/mockCioClient';

jest.mock('../../../src/hooks/usePiaClient', () => ({
  __esModule: true,
  default: ({ cioClient, threadId }: any) => ({
    cioClient,
    threadId: threadId || 'generated-thread-id',
  }),
}));

describe('Testing Hook: useCioPia', () => {
  const mockClient = createMockCioClient();

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.agent.pia.getSuggestedQuestions.mockResolvedValue({ questions: [] });
    mockClient.agent.pia.getAnswerResults.mockResolvedValue({ qna_result_id: 'id', value: '' });
  });

  describe('deprecated parameters merge', () => {
    it('maps snake_case deprecated parameters to camelCase for suggestedQuestions', async () => {
      renderHook(() =>
        useCioPia({
          apiKey: 'test-key',
          itemId: 'item-1',
          cioClient: mockClient as any,
          parameters: { pre_filter_expression: '{"brand":"Nike"}' },
        }),
      );

      await act(async () => {
        await new Promise((resolve) => { setTimeout(resolve, 0); });
      });

      expect(mockClient.agent.pia.getSuggestedQuestions).toHaveBeenCalledWith(
        'item-1',
        expect.objectContaining({
          preFilterExpression: { brand: 'Nike' },
        }),
      );
    });

    it('maps snake_case deprecated parameters to camelCase for answerResults', async () => {
      const { result } = renderHook(() =>
        useCioPia({
          apiKey: 'test-key',
          itemId: 'item-1',
          cioClient: mockClient as any,
          parameters: { guard: true, pre_filter_expression: '{"brand":"Nike"}' },
        }),
      );

      act(() => {
        result.current.answers.getAnswer('What is this?');
      });

      await act(async () => {
        await new Promise((resolve) => { setTimeout(resolve, 0); });
      });

      expect(mockClient.agent.pia.getAnswerResults).toHaveBeenCalledWith(
        'item-1',
        'What is this?',
        expect.objectContaining({
          guard: true,
          preFilterExpression: { brand: 'Nike' },
        }),
      );
    });

    it('typed parameters take precedence over deprecated parameters', async () => {
      renderHook(() =>
        useCioPia({
          apiKey: 'test-key',
          itemId: 'item-1',
          cioClient: mockClient as any,
          parameters: { pre_filter_expression: '{"brand":"Old"}' },
          suggestedQuestionsParameters: { preFilterExpression: { brand: 'New' } },
        }),
      );

      await act(async () => {
        await new Promise((resolve) => { setTimeout(resolve, 0); });
      });

      expect(mockClient.agent.pia.getSuggestedQuestions).toHaveBeenCalledWith(
        'item-1',
        expect.objectContaining({
          preFilterExpression: { brand: 'New' },
        }),
      );
    });

    it('drops unsupported deprecated parameters', async () => {
      renderHook(() =>
        useCioPia({
          apiKey: 'test-key',
          itemId: 'item-1',
          cioClient: mockClient as any,
          parameters: { ef_test_cell: 'variant_a', num_results: 5 },
        }),
      );

      await act(async () => {
        await new Promise((resolve) => { setTimeout(resolve, 0); });
      });

      const callArgs = mockClient.agent.pia.getSuggestedQuestions.mock.calls[0][1];
      expect(callArgs.ef_test_cell).toBeUndefined();
      expect(callArgs.numResults).toBe(5);
    });

    it('does not pass parameters when neither deprecated nor typed params are provided', async () => {
      renderHook(() =>
        useCioPia({
          apiKey: 'test-key',
          itemId: 'item-1',
          cioClient: mockClient as any,
        }),
      );

      await act(async () => {
        await new Promise((resolve) => { setTimeout(resolve, 0); });
      });

      expect(mockClient.agent.pia.getSuggestedQuestions).toHaveBeenCalledWith(
        'item-1',
        expect.objectContaining({ threadId: 'generated-thread-id' }),
      );
      const callArgs = mockClient.agent.pia.getSuggestedQuestions.mock.calls[0][1];
      expect(callArgs.numResults).toBeUndefined();
      expect(callArgs.preFilterExpression).toBeUndefined();
    });
  });
});
