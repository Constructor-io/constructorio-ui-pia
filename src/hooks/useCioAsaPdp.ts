import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import useCioClient from './useCioClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';

export interface UseCioAsaPdpProps {
  apiKey: string;
  itemId: string;
  cioClient?: MockConstructorIOClient;
}

export interface UseCioAsaPdpReturn {
  suggestedQuestions: UseSuggestedQuestionsReturn;
  answers: UseAnswerResultsReturn;
}

export default function useCioAsaPdp(props: UseCioAsaPdpProps): UseCioAsaPdpReturn {
  const { apiKey, itemId, cioClient: providedClient } = props;

  const defaultClient = useCioClient({ apiKey });
  const client = providedClient || defaultClient;

  const suggestedQuestions = useSuggestedQuestions({
    itemId,
    cioClient: client as MockConstructorIOClient,
  });

  const answers = useAnswerResults({
    itemId,
    cioClient: client as MockConstructorIOClient,
  });

  return {
    suggestedQuestions,
    answers,
  };
}
