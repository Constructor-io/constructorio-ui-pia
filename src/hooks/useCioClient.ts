import { useMemo } from 'react';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import version from '../version';
import CioClient from './mocks/CioClient';

export type UseCioClientProps = {
  apiKey?: string;
  cioClient?: Nullable<CioClient>;
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
};

type UseCioClient = (props: UseCioClientProps) => Nullable<CioClient> | never;

const useCioClient: UseCioClient = ({ apiKey, cioClient, options } = {}) => {
  if (!apiKey && !cioClient) {
    throw new Error('Api Key or Constructor Client required');
  }

  const memoizedCioClient = useMemo(() => {
    if (cioClient) return cioClient;

    if (apiKey) {
      return new CioClient({
        apiKey,
        sendTrackingEvents: true,
        version: `cio-ui-pia-${version}`,
        ...options,
      });
    }

    return null;
  }, [apiKey, cioClient, options]);

  return memoizedCioClient!;
};

export default useCioClient;
