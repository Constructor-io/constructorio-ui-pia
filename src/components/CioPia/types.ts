import {
  IncludeComponentOverrides,
  IncludeRenderProps,
} from '@constructor-io/constructorio-ui-components';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  CioPiaDisplayConfigs,
  CioPiaTrackingConfigs,
  Translations,
  SuggestedQuestionsParameters,
  AnswerRequestParameters,
  RecsPodParameters,
  Formatters,
  ProductCardDisplayProps,
} from '../../types';
import type { CioClient } from '../../hooks/useCioPia';

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
  cioClient?: CioClient;
  /** Display configuration options (mode, type, showFeedback, etc.). */
  displayConfigs?: CioPiaDisplayConfigs;
  /** Tracking configuration options (viewThreshold, etc.). */
  trackingConfigs?: CioPiaTrackingConfigs;
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
  /** Parameters for the answer request. */
  answerParameters?: AnswerRequestParameters;
  /** Parameters for the recommendations request, used by `mode: 'recommendations'`. */
  recsPodParameters?: RecsPodParameters;
  /**
   * Extra query parameters appended to PIA API requests (e.g. `ef-*` test cell params).
   * Define outside the component or wrap with useMemo to avoid unnecessary re-renders.
   */
  parameters?: Record<string, string | number | boolean>;
}
