import { useEffect, useMemo, useState } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import version from '../version';

export type CioClient = InstanceType<typeof ConstructorIOClient>;

export interface UsePiaClientProps {
  apiKey: string;
  threadId?: string;
  cioClient?: CioClient;
  testCells?: Record<string, string>;
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

  // A caller's client owns its own options: fill in test cells only where it has none.
  useEffect(() => {
    if (!providedClient || !testCells || Object.keys(testCells).length === 0) return;

    const client = providedClient as unknown as {
      options?: { testCells?: Record<string, string> };
      setClientOptions?: (options: { testCells: Record<string, string> }) => void;
    };
    const existing = client.options?.testCells;

    if (existing && Object.keys(existing).length > 0) {
      console.warn(
        '[CioPia] cioClient already has testCells, so abTest.testCells was not applied. Set them in one place.',
      );
      return;
    }

    client.setClientOptions?.({ testCells });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providedClient, serializedTestCells]);

  return { cioClient: client, threadId };
}
