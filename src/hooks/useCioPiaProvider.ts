import { useMemo, useState } from 'react';
import { PiaContextValue, CioPiaProviderProps, IncludeRenderProps } from '../types';
import useCioClient from './useCioClient';

export default function useCioPiaProvider(
  props: IncludeRenderProps<CioPiaProviderProps, PiaContextValue>,
) {
  const { apiKey, cioClient: customCioClient, itemId } = props;

  const [cioClientOptions, setCioClientOptions] = useState({});
  const cioClient = useCioClient({ apiKey, cioClient: customCioClient, options: cioClientOptions });

  const contextValue = useMemo(
    (): PiaContextValue => ({
      cioClient,
      cioClientOptions,
      setCioClientOptions,
      itemId,
    }),
    [cioClient, cioClientOptions, itemId],
  );

  return contextValue;
}
