import { useCallback, useMemo } from 'react';
import { Tracker } from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import { FeedbackType, Item, Question, GetAnswerResultsResponse } from '../types';

export interface TimeSpan {
  start: string;
  end: string;
}

export interface UseTrackingProps {
  cioClient?: { tracker: Tracker };
  itemId: string;
  itemName: string;
  variationId?: string;
  threadId?: string;
}

export interface UseTrackingReturn {
  trackViews: (questions: Question[], viewTimespans: TimeSpan[]) => void;
  trackView: (questions: Question[]) => void;
  trackOutOfView: () => void;
  trackFocus: () => void;
  trackQuestionClick: (question: string) => void;
  trackQuestionSubmit: (question: string) => void;
  trackAnswerView: (
    question: string,
    answerData: GetAnswerResultsResponse,
    items?: Item[] | null,
  ) => void;
  trackAnswerFeedback: (feedbackType: FeedbackType, qnaResultId?: string) => void;
  trackResultClick: (
    clickedItem: Item,
    position: number,
    question: string,
    qnaResultId?: string,
  ) => void;
}

export default function useTracking({
  cioClient,
  itemId,
  itemName,
  variationId,
  threadId,
}: UseTrackingProps): UseTrackingReturn {
  const tracker = cioClient?.tracker;

  const baseParams = useMemo(
    () => ({
      itemId,
      itemName,
      ...(variationId && { variationId }),
      ...(threadId && { threadId }),
    }),
    [itemId, itemName, variationId, threadId],
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
    (question: string, answerData: GetAnswerResultsResponse, items?: Item[] | null) => {
      tracker?.trackProductInsightsAgentAnswerView({
        ...baseParams,
        question,
        answerText: answerData.value,
        qnaResultId: answerData.qna_result_id,
        ...(items &&
          items.length > 0 && {
            items: items.map((item) => ({
              itemId: item.id,
              itemName: item.name,
            })),
          }),
        ...(answerData.follow_up_questions &&
          answerData.follow_up_questions.length > 0 && {
            followUpQuestions: answerData.follow_up_questions.map((q) => ({
              value: q.value,
            })),
          }),
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

  const trackResultClick = useCallback(
    (clickedItem: Item, position: number, question: string, qnaResultId?: string) => {
      tracker?.trackProductInsightsAgentResultClick({
        itemId: clickedItem.id,
        itemName: clickedItem.name,
        ...(clickedItem.variationId && { variationId: clickedItem.variationId }),
        question,
        seedItemId: itemId,
        seedItemName: itemName,
        ...(variationId && { seedVariationId: variationId }),
        ...(qnaResultId && { qnaResultId }),
        ...(threadId && { threadId }),
        position,
      });
    },
    [tracker, itemId, itemName, variationId, threadId],
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
      trackResultClick,
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
      trackResultClick,
    ],
  );
}
