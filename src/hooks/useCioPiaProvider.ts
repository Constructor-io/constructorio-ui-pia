import { useMemo, useState } from 'react';
import { PiaContextValue, CioPiaProviderProps } from '../types';
import useCioClient from './useCioClient';

export default function useCioPiaProvider(props: CioPiaProviderProps) {
  const { apiKey, cioClient: customCioClient, itemId, variationId, threadId } = props;

  const [cioClientOptions, setCioClientOptions] = useState({});
  const cioClient = useCioClient({ apiKey, cioClient: customCioClient, options: cioClientOptions });

  const contextValue = useMemo(
    (): PiaContextValue => ({
      cioClient,
      cioClientOptions,
      setCioClientOptions,
      itemId,
      variationId,
      threadId,
    }),
    [cioClient, cioClientOptions, itemId, variationId, threadId],
  );

  return contextValue;
}
