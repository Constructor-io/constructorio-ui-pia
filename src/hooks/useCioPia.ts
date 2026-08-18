import { useMemo, useState } from 'react';
import { Tracker } from '@constructor-io/constructorio-client-javascript/lib/types/constructorio';
import { Formatters, SuggestedQuestionsParameters } from '../types';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import useAnswerResults, { UseAnswerResultsReturn } from './useAnswerResults';
import useSuggestedQuestions, { UseSuggestedQuestionsReturn } from './useSuggestedQuestions';
import version from '../version';

export interface UseCioPiaProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: MockConstructorIOClient;
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
  /** Extra query parameters appended to answer API requests (e.g. `ef-*` test cell params). */
  parameters?: Record<string, any>;
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

  const [generatedThreadId] = useState(() => crypto.randomUUID());
  const threadId = providedThreadId || generatedThreadId;

  const client = useMemo(() => {
    if (providedClient) return providedClient;
    return new MockConstructorIOClient({
      apiKey,
      sendTrackingEvents: true,
      version: `cio-ui-pia-${version}`,
    });
  }, [apiKey, providedClient]);

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
