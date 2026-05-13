import { useCallback, useMemo } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { FeedbackType, Question, GetAnswerResultsResponse } from '../types';

export interface TimeSpan {
  start: string;
  end: string;
}

export interface UseTrackingProps {
  cioClient?: ConstructorIOClient;
  itemId: string;
  itemName: string;
  variationId?: string;
}

export interface UseTrackingReturn {
  trackViews: (questions: Question[], viewTimespans: TimeSpan[]) => void;
  trackView: (questions: Question[]) => void;
  trackOutOfView: () => void;
  trackFocus: () => void;
  trackQuestionClick: (question: string) => void;
  trackQuestionSubmit: (question: string) => void;
  trackAnswerView: (question: string, answerData: GetAnswerResultsResponse) => void;
  trackAnswerFeedback: (feedbackType: FeedbackType, qnaResultId?: string) => void;
}

export default function useTracking({
  cioClient,
  itemId,
  itemName,
  variationId,
}: UseTrackingProps): UseTrackingReturn {
  const tracker = cioClient?.tracker;

  const baseParams = useMemo(
    () => ({
      itemId,
      itemName,
      ...(variationId && { variationId }),
    }),
    [itemId, itemName, variationId],
  );

  const mapQuestions = useCallback(
    (questions: Question[]) => questions.map((q) => ({ question: q.value })),
    [],
  );

  const trackViews = useCallback(
    (questions: Question[], viewTimespans: TimeSpan[]) => {
      tracker?.trackProductInsightsAgentViews({
        ...baseParams,
        questions: mapQuestions(questions),
        viewTimespans,
      });
    },
    [tracker, baseParams, mapQuestions],
  );

  const trackView = useCallback(
    (questions: Question[]) => {
      tracker?.trackProductInsightsAgentView({
        ...baseParams,
        questions: mapQuestions(questions),
      });
    },
    [tracker, baseParams, mapQuestions],
  );

  const trackOutOfView = useCallback(() => {
    tracker?.trackProductInsightsAgentOutOfView(baseParams);
  }, [tracker, baseParams]);

  const trackFocus = useCallback(() => {
    tracker?.trackProductInsightsAgentFocus(baseParams);
  }, [tracker, baseParams]);

  const trackQuestionClick = useCallback(
    (question: string) => {
      tracker?.trackProductInsightsAgentQuestionClick({
        ...baseParams,
        question,
      });
    },
    [tracker, baseParams],
  );

  const trackQuestionSubmit = useCallback(
    (question: string) => {
      tracker?.trackProductInsightsAgentQuestionSubmit({
        ...baseParams,
        question,
      });
    },
    [tracker, baseParams],
  );

  const trackAnswerView = useCallback(
    (question: string, answerData: GetAnswerResultsResponse) => {
      tracker?.trackProductInsightsAgentAnswerView({
        ...baseParams,
        question,
        answerText: answerData.value,
        qnaResultId: answerData.qna_result_id,
      });
    },
    [tracker, baseParams],
  );

  const trackAnswerFeedback = useCallback(
    (feedbackType: FeedbackType, qnaResultId?: string) => {
      const feedbackLabel = feedbackType === FeedbackType.UP ? 'thumbs_up' : 'thumbs_down';
      tracker?.trackProductInsightsAgentAnswerFeedback({
        ...baseParams,
        feedbackLabel,
        qnaResultId,
      });
    },
    [tracker, baseParams],
  );

  return useMemo(
    () => ({
      trackViews,
      trackView,
      trackOutOfView,
      trackFocus,
      trackQuestionClick,
      trackQuestionSubmit,
      trackAnswerView,
      trackAnswerFeedback,
    }),
    [
      trackViews,
      trackView,
      trackOutOfView,
      trackFocus,
      trackQuestionClick,
      trackQuestionSubmit,
      trackAnswerView,
      trackAnswerFeedback,
    ],
  );
}
