import { useEffect, useState } from 'react';
import useCioClient from './useCioClient';
import { QuestionResponse } from './mocks/assistant';
import { DEMO_API_KEY } from '../constants';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
}

interface UseSuggestedQuestionsResponse {
  questions: Array<string>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetchSuggestedQuestions = async (client: MockConstructorIOClient, itemId: string) => {
  try {
    const response: QuestionResponse = await client.assistant.getSuggestedQuestions(itemId);
    return response.questions;
  } catch (error) {
    throw error;
  }
};

export default function useSuggestedQuestions(
  props: UseSuggestedQuestionsProps,
): UseSuggestedQuestionsResponse {
  const { itemId } = props;
  const client = useCioClient({ apiKey: DEMO_API_KEY });
  const [questions, setQuestions] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = () => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    fetchSuggestedQuestions(client, itemId)
      .then((fetchedQuestions) => {
        setQuestions(fetchedQuestions);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Error fetching suggested questions'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [client, itemId]);

  return {
    questions,
    isLoading,
    error,
    refetch: () => fetchData(),
  };
}
