import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './hooks/mocks/MockConstructorIOClient';
import React, { ReactNode } from 'react';

export interface AsaPdpContextValue {
  cioClient: Nullable<MockConstructorIOClient>;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
  itemId: string | undefined;
}

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface CioAsaPdpProviderProps {
  apiKey: string;
  cioClient?: Nullable<MockConstructorIOClient>;
  itemId?: string;
}

/**
 * Composes a type for a Component that accepts
 * - Props P,
 * - A children function, that takes RenderProps as its argument
 */
export type IncludeRenderProps<ComponentProps, ChildrenFunctionProps> = ComponentProps & {
  children?: ((props: ChildrenFunctionProps) => ReactNode) | React.ReactNode;
};
