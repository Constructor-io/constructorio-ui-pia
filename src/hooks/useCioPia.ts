import { SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import useCioClient from './useCioClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
}

export interface UseCioPiaReturn {
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
  } = props;

  const defaultClient = useCioClient({ apiKey });
  const client = providedClient || defaultClient;

  const suggestedQuestions = useSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    cioClient: client as MockConstructorIOClient,
    parameters: suggestedQuestionsParameters,
  });

  const answers = useAnswerResults({
    itemId,
    variationId,
    threadId,
    cioClient: client as MockConstructorIOClient,
  });

  return {
    suggestedQuestions,
    answers,
  };
}
