import { useMemo, useState } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import version from '../version';

export type CioClient = InstanceType<typeof ConstructorIOClient>;

export interface UsePiaClientProps {
  apiKey: string;
  threadId?: string;
  cioClient?: CioClient;
}

export interface UsePiaClientReturn {
  cioClient: CioClient;
  threadId: string;
}

export default function usePiaClient({
  apiKey,
  threadId: providedThreadId,
  cioClient: providedClient,
}: UsePiaClientProps): UsePiaClientReturn {
  const [generatedThreadId] = useState(() => crypto.randomUUID());
  const threadId = providedThreadId || generatedThreadId;

  const client = useMemo(() => {
    if (providedClient) return providedClient;
    return new ConstructorIOClient({
      apiKey,
      sendTrackingEvents: true,
      version: `cio-ui-pia-${version}`,
    });
  }, [apiKey, providedClient]);

  return { cioClient: client, threadId };
}
