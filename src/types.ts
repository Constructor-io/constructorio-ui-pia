import React, { ReactNode } from 'react';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import MockConstructorIOClient from './hooks/mocks/MockConstructorIOClient';

export interface PiaContextValue {
  cioClient: Nullable<MockConstructorIOClient>;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
  itemId: string;
  variationId?: string;
  threadId?: string;
}

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface CioPiaProviderProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  threadId?: string;
  cioClient?: Nullable<MockConstructorIOClient>;
}

export type CioPiaDisplayConfigs = {
  learnMoreUrl?: string;
  showFeedback?: boolean;
};

/**
 * Composes a type for a Component that accepts
 * - Props P,
 * - A children function, that takes RenderProps as its argument
 */
export type IncludeRenderProps<ComponentProps, ChildrenFunctionProps> = ComponentProps & {
  children?: ((props: ChildrenFunctionProps) => ReactNode) | React.ReactNode;
};
