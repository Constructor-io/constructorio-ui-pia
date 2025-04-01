import { QuestionResponse } from './mocks/assistant';
import useCioClient from './useCioClient';
import { DEMO_API_KEY } from '../constants';
import { useEffect, useState } from 'react';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface UseSuggestedQuestionsProps {
  itemId: string;
}

interface UseSuggestedQuestionsResponse {
  questions: Array<string>;
}

const fetchSuggestedQuestions = async (client: MockConstructorIOClient, itemId: string) => {
  try {
    const response: QuestionResponse = await client.assistant.getSuggestedQuestions(itemId);
    return response.questions;
  } catch (error) {
    console.error('Failed to fetch suggested questions:', error);
    throw error;
  }
};

export default function useSuggestedQuestions(
  props: UseSuggestedQuestionsProps,
): UseSuggestedQuestionsResponse {
  const { itemId } = props;
  const client = useCioClient({ apiKey: DEMO_API_KEY });
  const [questions, setQuestions] = useState<Array<string>>([]);

  useEffect(() => {
    if (!client) return;

    fetchSuggestedQuestions(client, itemId).then((fetchedQuestions) => {
      setQuestions(fetchedQuestions);
    });
  }, [client, itemId]);

  return { questions };
}
