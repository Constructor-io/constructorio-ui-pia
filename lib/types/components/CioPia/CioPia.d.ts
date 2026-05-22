import React from 'react';
import { IncludeComponentOverrides, IncludeRenderProps } from '@constructor-io/constructorio-ui-components';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import { CioPiaRenderProps, CioPiaComponentOverrides, Callbacks, CioPiaDisplayConfigs, Translations, SuggestedQuestionsParameters, Formatters } from '../../types';
export interface CioPiaProps extends IncludeRenderProps<CioPiaRenderProps>, IncludeComponentOverrides<CioPiaComponentOverrides> {
    /** Your Constructor.io API key. */
    apiKey: string;
    /** The product item ID to fetch insights for. */
    itemId: string;
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
    /** Custom component overrides via reactNode or render props functions. */
    componentOverrides?: CioPiaComponentOverrides;
    /** Formatter functions for transforming data before display. */
    formatters?: Formatters;
    /** UI string translations for internationalization. */
    translations?: Translations;
    /** Parameters for the suggested questions request. */
    suggestedQuestionsParameters?: SuggestedQuestionsParameters;
}
export default function CioPia(props: CioPiaProps): React.JSX.Element;
