import { useEffect, useMemo, useState } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import type { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript/lib/types';
import version from '../version';

export type CioClient = InstanceType<typeof ConstructorIOClient>;

export interface UsePiaClientProps {
  apiKey: string;
  threadId?: string;
  cioClient?: CioClient;
  testCells?: Record<string, string>;
  /** Set on the client the hook creates; `null` or empty for a guest. Left alone when omitted. */
  userId?: string | null;
}

export interface UsePiaClientReturn {
  cioClient: CioClient;
  threadId: string;
}

export default function usePiaClient({
  apiKey,
  threadId: providedThreadId,
  cioClient: providedClient,
  testCells,
  userId,
}: UsePiaClientProps): UsePiaClientReturn {
  const [generatedThreadId] = useState(() => crypto.randomUUID());
  const threadId = providedThreadId || generatedThreadId;

  const serializedTestCells = useMemo(() => JSON.stringify(testCells ?? null), [testCells]);

  const client = useMemo(() => {
    if (providedClient) return providedClient;
    return new ConstructorIOClient({
      apiKey,
      sendTrackingEvents: true,
      version: `cio-ui-pia-${version}`,
      ...(testCells && { testCells }),
    });
    // testCells is compared by serializedTestCells so an inline object does not rebuild the client
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, providedClient, serializedTestCells]);

  // Set rather than passed to the constructor, so a login does not rebuild the client.
  useEffect(() => {
    if (providedClient || userId === undefined) return;
    // The typings require `apiKey`; the client merges a partial update.
    client.setClientOptions({ userId: userId || undefined } as ConstructorClientOptions);
  }, [client, providedClient, userId]);

  // A caller's client owns its own options, so say so rather than dropping these silently.
  useEffect(() => {
    if (!providedClient || !testCells || Object.keys(testCells).length === 0) return;

    console.warn(
      '[CioPia] abTest.testCells is ignored when you supply your own cioClient. Set testCells on that client instead.',
    );
    // serializedTestCells stands in for testCells here too
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providedClient, serializedTestCells]);

  return { cioClient: client, threadId };
}
