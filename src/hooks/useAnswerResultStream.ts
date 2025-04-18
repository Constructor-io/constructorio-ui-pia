import { useCallback, useEffect, useState } from 'react';
import { DEMO_API_KEY } from '../constants';
import useCioClient from './useCioClient';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

export interface StreamStartEvent {
  qna_result_id: string;
}

export interface StreamMessageEvent {
  qna_result_id: string;
  text: string;
}

export interface StreamEndEvent {
  qna_result_id: string;
}

export interface UseAnswerResultsStreamResponse {
  isStreaming: boolean;
  error: Error | null;
  startStream: () => void;
}

export interface UseAnswerResultsStreamProps {
  itemId: string;
  question: string;
  parameters?: Record<string, any>;
  onStart: (data: StreamStartEvent) => void;
  onMessage: (data: StreamMessageEvent) => void;
  onEnd: (data: StreamEndEvent) => void;
}

const streamAnswerResults = async (
  client: MockConstructorIOClient,
  props: UseAnswerResultsStreamProps,
) => {
  const { itemId, question, parameters, onStart, onMessage, onEnd } = props;

  await client.assistant.getAnswerResultsStream({
    itemId,
    question,
    parameters,
    onStart,
    onMessage,
    onEnd,
  });
};

export default function useAnswerResultStream({
  itemId,
  question,
  parameters = {},
  onStart,
  onMessage,
  onEnd,
}: UseAnswerResultsStreamProps): UseAnswerResultsStreamResponse {
  const client = useCioClient({ apiKey: DEMO_API_KEY });
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const startStream = useCallback(() => {
    if (!client) return;

    setIsStreaming(true);
    setError(null);

    const customOnStart = (data: StreamStartEvent) => {
      if (onStart) onStart(data);
    };

    const customOnMessage = (data: StreamMessageEvent) => {
      if (onMessage) onMessage(data);
    };

    const customOnEnd = (data: StreamEndEvent) => {
      setIsStreaming(false);
      if (onEnd) onEnd(data);
    };

    streamAnswerResults(client, {
      itemId,
      question,
      parameters,
      onStart: customOnStart,
      onMessage: customOnMessage,
      onEnd: customOnEnd,
    }).catch((err) => {
      setError(err instanceof Error ? err : new Error('Error streaming answer results'));
      setIsStreaming(false);
    });
  }, [client, itemId, question, parameters, onStart, onMessage, onEnd]);

  useEffect(() => {
    startStream();
  }, [startStream]);

  return {
    isStreaming,
    error,
    startStream,
  };
}
