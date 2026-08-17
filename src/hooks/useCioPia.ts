import { Tracker } from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import { Formatters, SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import usePiaClient from './usePiaClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
  /**
   * Extra query parameters appended to PIA API requests (e.g. `ef-*` test cell params).
   * Define outside the component or wrap with useMemo to avoid unnecessary re-renders.
   */
  parameters?: Record<string, string | number | boolean>;
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
    parameters,
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
    requestParameters: parameters,
  });

  const answers = useAnswerResults({
    itemId,
    variationId,
    threadId,
    cioClient: client,
    parameters,
    formatImageUrl,
  });

  return {
    cioClient: client,
    threadId,
    suggestedQuestions,
    answers,
  };
}
