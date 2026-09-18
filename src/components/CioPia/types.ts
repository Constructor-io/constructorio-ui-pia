import { ReactNode } from 'react';
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
import type { CioClient } from '../../hooks/usePiaClient';

/**
 * A single checkout entry point rendered inside the PIA `default` mode.
 * The merchant owns the checkout flow itself (typically the `@constructor-io/constructorio-ui-checkout`
 * `CheckoutFlowProvider`); PIA only surfaces the button(s) that start it.
 */
export interface CheckoutTrigger {
  /** Stable identifier for the trigger — used as React key and forwarded to onTrigger. */
  id: string;
  /** Button label. Defaults to "Checkout". */
  label?: string;
  /** Disables the button. Ignored when `renderButton` is provided. */
  disabled?: boolean;
  /**
   * Predicate deciding whether this trigger should render. Called with the same
   * render-props snapshot the `children`/`componentOverrides.reactNode` render callback
   * receives, so consumers can gate on conversation state (e.g. "at least one answer",
   * "user asked ≥2 questions"). Defaults to always visible.
   */
  triggerWhen?: (state: CioPiaRenderProps) => boolean;
  /** Custom button renderer. When provided, `label` / `disabled` are passed through but styling is your call. */
  renderButton?: (props: {
    onClick: () => void;
    label: string;
    disabled?: boolean;
    id: string;
  }) => ReactNode;
  /**
   * Fires when the button is clicked. The merchant wires this to their checkout entry
   * (e.g. `flow.start()` from `useCheckoutFlow`). Receives the render-props snapshot so
   * the handler can seed the checkout with the current answer/items/conversation.
   */
  onTrigger: (state: CioPiaRenderProps) => void;
}

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
  /**
   * One or more checkout entry points to render inside the `default` mode. Ignored in
   * `recommendations` and `conversation` modes and in the modal.
   */
  checkoutTriggers?: CheckoutTrigger[];
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
