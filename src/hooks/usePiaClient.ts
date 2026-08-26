import { useMemo, useState } from 'react';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
import version from '../version';

export interface UsePiaClientProps {
  apiKey: string;
  /** Thread ID for conversation context. Must be a valid UUID. One is generated when absent. */
  threadId?: string;
  cioClient?: MockConstructorIOClient;
}

export interface UsePiaClientReturn {
  cioClient: MockConstructorIOClient;
  threadId: string;
}

/**
 * Resolves the client and thread ID every mode needs: the caller's client when they supplied
 * one, otherwise a client built from the API key, plus a generated thread ID that stays stable
 * for the life of the component.
 */
export default function usePiaClient({
  apiKey,
  threadId: providedThreadId,
  cioClient: providedClient,
}: UsePiaClientProps): UsePiaClientReturn {
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

  return { cioClient: client, threadId };
}
