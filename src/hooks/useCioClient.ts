import { useMemo } from 'react';
import ConstructorIOClient, {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import version from '../version';

export type UseCioClientProps = {
  apiKey?: string;
  cioClient?: Nullable<ConstructorIOClient>;
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
};

type UseCioClient = (props: UseCioClientProps) => Nullable<ConstructorIOClient> | never;

const useCioClient: UseCioClient = ({ apiKey, cioClient, options } = {}) => {
  if (!apiKey && !cioClient) {
    throw new Error('Api Key or Constructor Client required');
  }

  const memoizedCioClient = useMemo(() => {
    if (cioClient) return cioClient;

    if (apiKey) {
      return new ConstructorIOClient({
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
