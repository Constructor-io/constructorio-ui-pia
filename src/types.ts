import React from 'react';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import {
  Product,
  CarouselOverrides,
  ComponentOverrideProps,
} from '@constructor-io/constructorio-ui-components';
import MockConstructorIOClient from './hooks/mocks/MockConstructorIOClient';
import { Question } from './hooks/mocks/types';

export interface PiaContextValue {
  cioClient: Nullable<MockConstructorIOClient>;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
}

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface CioPiaProviderProps {
  apiKey: string;
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  cioClient?: Nullable<MockConstructorIOClient>;
}

export type CioPiaDisplayConfigs = {
  learnMoreUrl?: string;
  showFeedback?: boolean;
};

export interface Callbacks {
  onProductCardClick?: (item: Item) => void;
}

/** Extends Product type to include PIA-specific fields */
export interface Item extends Product, Record<string, any> {
  url?: string;
  matchedTerms?: string[];
}

/**
 * Render props passed to CioPia children function
 */
export interface CioPiaRenderProps {
  items: Item[] | null;
  isLoading: boolean;
  error?: Error | null;
  currentAnswer: string;
  currentQuestion: string;
  displayedQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
}

/**
 * Component overrides for CioPia
 * Allows customization of carousel component
 */
export interface CioPiaComponentOverrides extends ComponentOverrideProps<CioPiaRenderProps> {
  carousel?: CarouselOverrides<Item>;
}

export * from './hooks/mocks/types';
