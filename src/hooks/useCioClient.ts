import { useMemo } from 'react';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import version from '../version';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';

/**
 * Uses MockConstructorIOClient for now, to be replaced with the actual Client JS object
 */
export type UseCioClientProps = {
  apiKey?: string;
  cioClient?: Nullable<MockConstructorIOClient>;
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
};

type UseCioClient = (props: UseCioClientProps) => Nullable<MockConstructorIOClient> | never;

const useCioClient: UseCioClient = ({ apiKey, cioClient, options } = {}) => {
  if (!apiKey && !cioClient) {
    throw new Error('Api Key or Constructor Client required');
  }

  const memoizedCioClient = useMemo(() => {
    if (cioClient) return cioClient;

    if (apiKey) {
      return new MockConstructorIOClient({
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
