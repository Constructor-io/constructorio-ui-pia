import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { Formatters, SuggestedQuestionsParameters } from '../types';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import useCioClient from './useCioClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: ConstructorIOClient;
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
  /** Define outside the component or wrap with useCallback to avoid unnecessary re-renders. */
  formatImageUrl?: Formatters['formatImageUrl'];
}

export interface UseCioPiaReturn {
  cioClient: ConstructorIOClient;
  suggestedQuestions: UseSuggestedQuestionsReturn;
  answers: UseAnswerResultsReturn;
}

export default function useCioPia(props: UseCioPiaProps): UseCioPiaReturn {
  const {
    apiKey,
    itemId,
    variationId,
    threadId,
    cioClient: providedClient,
    suggestedQuestionsParameters,
    formatImageUrl,
  } = props;

  const defaultClient = useCioClient({ apiKey });
  const client = (providedClient || defaultClient) as ConstructorIOClient;

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
    formatImageUrl,
  });

  return {
    cioClient: client,
    suggestedQuestions,
    answers,
  };
}
