import { useMemo } from 'react';
import version from '../version';
import MockConstructorIOClient from './mocks/MockConstructorIOClient';
const useCioClient = ({ apiKey, cioClient, options } = {}) => {
    if (!apiKey && !cioClient) {
        throw new Error('Api Key or Constructor Client required');
    }
    const memoizedCioClient = useMemo(() => {
        if (cioClient)
            return cioClient;
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
    return memoizedCioClient;
};
export default useCioClient;
