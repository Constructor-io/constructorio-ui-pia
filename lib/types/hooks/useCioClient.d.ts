import { ConstructorClientOptions, Nullable } from '@constructor-io/constructorio-client-javascript';
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
declare const useCioClient: UseCioClient;
export default useCioClient;
