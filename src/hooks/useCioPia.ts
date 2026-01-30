import { Item } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import useCioClient from './useCioClient';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';
import { transformResultItem } from '../utils/transformers';

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
}

export interface UseCioPiaReturn {
  suggestedQuestions: UseSuggestedQuestionsReturn;
  answers: UseAnswerResultsReturn;
  items?: Array<Item>;
}

export default function useCioPia(props: UseCioPiaProps): UseCioPiaReturn {
  const { apiKey, itemId, variationId, threadId, cioClient: providedClient } = props;

  const defaultClient = useCioClient({ apiKey });
  const client = providedClient || defaultClient;

  const suggestedQuestions = useSuggestedQuestions({
    itemId,
    variationId,
    threadId,
    cioClient: client as MockConstructorIOClient,
  });

  const answers = useAnswerResults({
    itemId,
    variationId,
    threadId,
    cioClient: client as MockConstructorIOClient,
  });

  // Transforming the answer so that it can be used in the Carousel component
  const items = answers.data?.item_results?.response.results
    .map(transformResultItem)
    .filter((item): item is Item => item !== null);

  return {
    suggestedQuestions,
    answers,
    items,
  };
}
