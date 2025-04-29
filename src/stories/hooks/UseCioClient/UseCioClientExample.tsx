import React, { useEffect, useState } from 'react';
import useCioClient, { UseCioClientProps } from '../../../hooks/useCioClient';
import { DEMO_API_KEY } from '../../../constants';
import DisplayHookExample from '../DisplayHookExample';

function useCioClientExample(props: UseCioClientProps) {
  const [client, setClient] = useState<ReturnType<typeof useCioClient> | null>(null);

  const cioClient = useCioClient({
    apiKey: DEMO_API_KEY,
    ...props,
  });

  useEffect(() => {
    if (cioClient) {
      setClient(cioClient);
    }
  }, [cioClient]);

  return <DisplayHookExample content={JSON.stringify(client, null, 2)} />;
}

export default useCioClientExample;
