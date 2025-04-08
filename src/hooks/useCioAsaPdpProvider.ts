import { useMemo, useState } from 'react';
import { AsaPdpContextValue, CioAsaPdpProviderProps, IncludeRenderProps } from '../types';
import useCioClient from './useCioClient';

export default function useCioAsaPdpProvider(
  props: IncludeRenderProps<CioAsaPdpProviderProps, AsaPdpContextValue>,
) {
  const { apiKey, cioClient: customCioClient, itemId } = props;

  const [cioClientOptions, setCioClientOptions] = useState({});
  const cioClient = useCioClient({ apiKey, cioClient: customCioClient, options: cioClientOptions });

  const contextValue = useMemo(
    (): AsaPdpContextValue => ({
      cioClient,
      cioClientOptions,
      setCioClientOptions,
      itemId,
    }),
    [cioClient, cioClientOptions, itemId],
  );

  return contextValue;
}
