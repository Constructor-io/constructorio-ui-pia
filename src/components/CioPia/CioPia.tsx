import React from 'react';
import {
  IncludeComponentOverrides,
  IncludeRenderProps,
} from '@constructor-io/constructorio-ui-components';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import CioPiaQna from './CioPiaQna';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  CioPiaDisplayConfigs,
  Translations,
  SuggestedQuestionsParameters,
  Formatters,
  ProductCardDisplayProps,
} from '../../types';

export interface CioPiaProps
  extends
    IncludeRenderProps<CioPiaRenderProps>,
    IncludeComponentOverrides<CioPiaComponentOverrides> {
  /** Your Constructor.io API key. */
  apiKey: string;
  /** The product item ID to fetch insights for. */
  itemId: string;
  /** The product display name, sent with tracking events. */
  itemName: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000"). */
  threadId?: string;
  /** Optional variation ID for the product. */
  variationId?: string;
  /** Optional Constructor.io client instance. If not provided, one will be created internally. */
  cioClient?: MockConstructorIOClient;
  /** Display configuration options (mode, type, showFeedback, etc.). */
  displayConfigs?: CioPiaDisplayConfigs;
  /** Callback handlers for user interactions (onQuestionSubmit, onProductCardClick, onFeedback). */
  callbacks?: Callbacks;
  // Redeclared from IncludeComponentOverrides for Storybook autodocs.
  /** Custom component overrides via reactNode or render props functions. */
  componentOverrides?: CioPiaComponentOverrides;
  /** Formatter functions for transforming data before display. */
  formatters?: Formatters;
  /** Props forwarded to the ProductCard rendered inside the carousel. */
  productCardProps?: ProductCardDisplayProps;
  /** UI string translations for internationalization. */
  translations?: Translations;
  /** Parameters for the suggested questions request. */
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
}

/**
 * Entry point for the component.
 *
 * Deliberately calls no hooks of its own: `CioPiaQna` calls `useCioPia` unconditionally, so
 * anything that does not share that state machine has to be chosen here, before the first hook
 * runs. `props` is forwarded untouched so the defaults stay where they are read.
 */
export default function CioPia(props: CioPiaProps) {
  return <CioPiaQna {...props} />;
}
