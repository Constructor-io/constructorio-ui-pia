import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import useAnswerResults, { UseAnswerResultsResponse } from './useAnswerResults';
import useCioClient from './useCioClient';
import useSuggestedQuestions, { UseSuggestedQuestionsResponse } from './useSuggestedQuestions';

export interface UseCioAsaPdpProps {
  apiKey: string;
  itemId: string;
  cioClient?: MockConstructorIOClient;
}

export interface UseCioAsaPdpResponse {
  questions: UseSuggestedQuestionsResponse;
  answers: UseAnswerResultsResponse;
}

export default function useCioAsaPdp(props: UseCioAsaPdpProps) {
  const { apiKey, itemId, cioClient: providedClient } = props;

  const defaultClient = useCioClient({ apiKey });
  const client = providedClient || defaultClient;

  const questions = useSuggestedQuestions({
    itemId,
    cioClient: client as MockConstructorIOClient,
  });

  const answers = useAnswerResults({
    itemId,
    cioClient: client as MockConstructorIOClient,
  });

  return {
    questions,
    answers,
  };
}
