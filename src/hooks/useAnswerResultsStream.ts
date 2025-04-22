import { useCallback, useEffect, useRef, useState } from 'react';
import useCioClient from './useCioClient';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import { StreamEndEvent, StreamMessageEvent, StreamStartEvent } from './mocks/types';
import { DEMO_API_KEY } from '../constants';

export interface UseAnswerResultsStreamResponse {
  isStreaming: boolean;
  error: Error | null;
  startStream: () => void;
  stopStream: () => void;
}

export interface UseAnswerResultsStreamProps {
  itemId: string;
  question: string;
  parameters?: Record<string, any>;
  onStart?: (data: StreamStartEvent) => void;
  onMessage?: (data: StreamMessageEvent) => void;
  onEnd?: (data: StreamEndEvent) => void;
}

interface StreamAnswerResultsProps extends UseAnswerResultsStreamProps {
  signal: AbortSignal;
}

const streamAnswerResults = async (
  client: MockConstructorIOClient,
  props: StreamAnswerResultsProps,
) => {
  const { itemId, question, parameters, onStart, onMessage, onEnd, signal } = props;

  await client.assistant.getAnswerResultsStream({
    itemId,
    question,
    parameters,
    onStart,
    onMessage,
    onEnd,
    signal,
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const startStream = useCallback(() => {
    if (!client || isStreaming) return;

    stopStream();

    setIsStreaming(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const customOnStart = (data: StreamStartEvent) => {
      if (onStart) onStart(data);
    };

    const customOnMessage = (data: StreamMessageEvent) => {
      if (onMessage) onMessage(data);
    };

    const customOnEnd = (data: StreamEndEvent) => {
      setIsStreaming(false);
      abortControllerRef.current = null;
      if (onEnd) onEnd(data);
    };

    streamAnswerResults(client, {
      itemId,
      question,
      parameters,
      onStart: customOnStart,
      onMessage: customOnMessage,
      onEnd: customOnEnd,
      signal: controller.signal,
    }).catch((err) => {
      if (!controller.signal.aborted) {
        stopStream();
        setError(err instanceof Error ? err : new Error('Error streaming answer results'));
      }
    });
  }, [client, isStreaming, itemId, question, parameters, onStart, onMessage, onEnd, stopStream]);

  return {
    isStreaming,
    error,
    startStream,
    stopStream,
  };
}
