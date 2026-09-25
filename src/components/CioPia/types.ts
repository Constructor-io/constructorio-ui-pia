import {
  IncludeComponentOverrides,
  IncludeRenderProps,
} from '@constructor-io/constructorio-ui-components';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  CioPiaAbTest,
  CioPiaDisplayConfigs,
  CioPiaTrackingConfigs,
  Translations,
  SuggestedQuestionsParameters,
  AnswerRequestParameters,
  RecsPodParameters,
  Formatters,
  ConversationEntry,
  ProductCardDisplayProps,
} from '../../types';
import type { CioClient } from '../../hooks/usePiaClient';

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
  /**
   * A conversation you manage, such as one saved from `onAnswer` in the browser or on your own
   * server. When provided, including as `[]`, these entries are the conversation shown before the
   * first question; pass `[]` rather than omitting it when nothing is saved.
   * Read once on mount, so render after it has loaded, and cleared when `itemId` changes. Pass the
   * `threadId` the entries came from, or the agent will not remember them. Used by
   * `mode: 'conversation'` and `type: 'modal'` only; the modal shows them once it opens.
   */
  initialConversationHistory?: ConversationEntry[];
  /** Optional variation ID for the product. */
  variationId?: string;
  /** Optional Constructor.io client instance. If not provided, one will be created internally. */
  cioClient?: CioClient;
  /** Display configuration options (mode, type, showFeedback, etc.). */
  displayConfigs?: CioPiaDisplayConfigs;
  /** Tracking configuration options (viewThreshold, etc.). */
  trackingConfigs?: CioPiaTrackingConfigs;
  /** A/B test configuration: test cells to attach to events, and the control-group flag. */
  abTest?: CioPiaAbTest;
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
   * @deprecated Use `answerParameters` and `suggestedQuestionsParameters` instead.
   *
   * Only the following keys are forwarded (snake_case or camelCase accepted):
   *
   * Suggested-questions endpoint:
   * - `num_results` / `numResults` → numResults
   * - `pre_filter_expression` / `preFilterExpression` → preFilterExpression (JSON-parsed if string)
   *
   * Answer endpoint:
   * - `guard` → guard
   * - `pre_filter_expression` / `preFilterExpression` → preFilterExpression (JSON-parsed if string)
   * - `fmt_options` / `fmtOptions` → fmtOptions (JSON-parsed if string)
   *
   * All other keys (e.g. `ef-*`) are silently dropped.
   * Typed parameters take precedence over values specified here.
   */
  parameters?: Record<string, string | number | boolean>;
}
