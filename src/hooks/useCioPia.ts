import { Tracker } from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import { AnswerRequestParameters, Formatters, SuggestedQuestionsParameters } from '../types';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import usePiaClient, { CioClient } from './usePiaClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';

export type { CioClient };

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: CioClient;
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
  answerParameters?: AnswerRequestParameters;
  /** Define outside the component or wrap with useCallback to avoid unnecessary re-renders. */
  formatImageUrl?: Formatters['formatImageUrl'];
}

export interface UseCioPiaReturn {
  cioClient: { tracker: Tracker };
  threadId: string;
  suggestedQuestions: UseSuggestedQuestionsReturn;
  answers: UseAnswerResultsReturn;
}

export default function useCioPia(props: UseCioPiaProps): UseCioPiaReturn {
  const {
    apiKey,
    itemId,
    variationId,
    threadId: providedThreadId,
    cioClient: providedClient,
    suggestedQuestionsParameters,
    answerParameters,
    formatImageUrl,
  } = props;

  const { cioClient: client, threadId } = usePiaClient({
    apiKey,
    threadId: providedThreadId,
    cioClient: providedClient,
  });

  const suggestedQuestions = useSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    cioClient: client,
    parameters: suggestedQuestionsParameters,
  });

  const answers = useAnswerResults({
    itemId,
    variationId,
    threadId,
    cioClient: client,
    parameters: answerParameters,
    formatImageUrl,
  });

  return {
    cioClient: client,
    threadId,
    suggestedQuestions,
    answers,
  };
}
