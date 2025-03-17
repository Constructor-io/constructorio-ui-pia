import { useMemo } from 'react';
import MockConstructorIOClient, {
  MockConstructorClientOptions,
  Nullable,
} from './mocks/mockConstructorIoClient';
import version from '../version';

/**
 * Uses MockConstructorIOClient for now, to be replaced with the actual Client JS object
 */
export type UseCioClientProps = {
  apiKey?: string;
  cioClient?: Nullable<MockConstructorIOClient>;
  options?: Omit<MockConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
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
        version: `cio-ui-asa-pdp-${version}`,
        ...options,
      });
    }

    return null;
  }, [apiKey, cioClient, options]);

  return memoizedCioClient!;
};

export default useCioClient;
