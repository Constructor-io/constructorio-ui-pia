import { ReactNode } from 'react';
import {
  Product,
  CarouselOverrides,
  ComponentOverrideProps,
} from '@constructor-io/constructorio-ui-components';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript';
import { Question } from './hooks/mocks/types';
import MockConstructorIOClient from './hooks/mocks/MockConstructorIOClient';

export enum FeedbackType {
  UP = 'up',
  DOWN = 'down',
}

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

export type CioPiaMode = 'default' | 'conversation' | 'recommendations';
export type CioPiaType = 'inline' | 'modal';

export type DisclaimerPosition = 'top' | 'bottom';

export type CioPiaDisplayConfigs = {
  learnMoreUrl?: string;
  showFeedback?: boolean;
  mode?: CioPiaMode;
  type?: CioPiaType;
  /**
   * Show product carousels on non-last conversation entries. Defaults to true.
   * The last entry always falls back to its own items when currentItems is not provided.
   */
  showPreviousItems?: boolean;
  /**
   * Position of the AI disclaimer message relative to the conversation content.
   * - `'top'` — renders the disclaimer above the conversation history or answer.
   * - `'bottom'` — renders the disclaimer below the conversation history or answer.
   *
   * @default 'bottom'
   */
  disclaimerPosition?: DisclaimerPosition;
};

/**
 * Translations type for internationalizing UI strings.
 * All keys are optional - any non-provided translation will fallback to English default.
 */
export type Translations = {
  'Any questions about this product?'?: string;
  'Ask anything'?: string;
  Send?: string;
  'AI-generated answers aim to help, but they may occasionally miss details or be inaccurate. Double-check important information before purchasing.'?: string;
  'Is this answer useful?'?: string;
  'Learn More.'?: string;
  'Ask about this product'?: string;
  'Add to Cart'?: string;
  /** Recommendations pod title shown while a request is in flight. */
  'Adapting recommendations to your preference'?: string;
  /** Recommendations pod title shown when a request fails or comes back degraded. */
  'Best selling products'?: string;
  /** Recommendations pod title, shown whenever the response carries no title of its own. */
  'Pairs well with'?: string;
  /** Shown under the recommendations pod input when the request was rejected as unsuitable. */
  'Unsupported request, try a different feature.'?: string;
  /** Introduces the recommendations pod refinement options when the API sends no prompt of its own. */
  "Not what you're looking for? Try:"?: string;
  /** Placeholder for the recommendations pod refinement input. */
  'Describe something else...'?: string;
};

export type QuestionSource = 'user' | 'suggestion';

export interface PiaCallbackContext {
  itemId: string;
  threadId: string;
}

export interface Callbacks {
  /** Called when a question is submitted (typed or suggested question clicked). */
  onQuestionSubmit?: (
    question: string,
    context: PiaCallbackContext,
    source: QuestionSource,
  ) => void;
  /** Called when a product card in the carousel is clicked. */
  onProductCardClick?: (item: Item) => void;
  /**
   * Called when the "Add to Cart" button on a product card is clicked.
   * Providing this callback is what renders the button.
   * Clicking the button does not fire `onProductCardClick`.
   */
  onAddToCart?: (item: Item, event: React.MouseEvent) => void;
  /** Called when the user submits positive or negative feedback on an answer. */
  onFeedback?: (type: FeedbackType) => void;
  /** Called when a new answer is received. Passes the full conversation history. */
  onAnswer?: (history: ConversationEntry[], context: PiaCallbackContext) => void;
  /** Called when the user focuses the input field. */
  onFocus?: (context: PiaCallbackContext) => void;
  /** Called when the widget enters the viewport. */
  onView?: (context: PiaCallbackContext) => void;
  /** Called when the widget leaves the viewport. */
  onOutOfView?: (context: PiaCallbackContext) => void;
}

/** Formatter functions for transforming data before display. */
export interface Formatters {
  /** Transforms image URLs before rendering (e.g., prepend a CDN base URL). */
  formatImageUrl?: (url: string) => string;
}

/** Props forwarded to the ProductCard rendered inside the carousel. */
export interface ProductCardDisplayProps {
  /**
   * Currency symbol to display next to product prices (e.g., "€", "£").
   * When omitted, the default ProductCard price rendering is used.
   */
  priceCurrency?: string;
}

/** Extends Product type to include PIA-specific fields */
export interface Item extends Product, Record<string, any> {
  url?: string;
  matchedTerms?: string[];
}

export interface ConversationEntry {
  id: number;
  question: string;
  answer: string;
  source: QuestionSource;
  items?: Item[] | null;
  threadId?: string;
  qnaResultId?: string;
}

/** Which kind of recommendations to fetch. */
export type RecsStrategy =
  | 'complementary_items'
  | 'alternative_items'
  | 'bestsellers'
  | 'bundles'
  | 'buy_it_again'
  | 'recently_viewed_items'
  | 'visually_similar_items';

/** A prompt line plus the short labels the shopper can pick from to narrow the results. */
export interface RecsRefinement {
  /** Introduces the options. Falls back to a translatable default when absent. */
  question?: string;
  options: string[];
}

/** One recommendations response, in the shape the pod renders. */
export interface RecsResult {
  title: string;
  items: Item[] | null;
  refinement: RecsRefinement | null;
  resultId?: string;
  threadId?: string;
  /** `'partial'` means the response is degraded, but any items it carries are still usable. */
  status?: 'complete' | 'partial';
}

export interface RecsPodParameters {
  /**
   * Which kind of recommendations to fetch.
   *
   * Only `complementary_items` and `alternative_items` are served today. The pod is backed by the
   * Q&A endpoint until the recommendations endpoint ships, and the rest have no question that asks
   * for them - those settle empty, so the pod renders nothing. Supply a `cioClient` with your own
   * `agent.getRecs` to serve them from your own data in the meantime.
   *
   * @default 'complementary_items'
   */
  strategy?: RecsStrategy;
  /**
   * The pod's title. Used whenever the response carries no title of its own, which is every
   * response today, so this is the title throughout - including after a refinement. Falls back to a
   * translatable default.
   */
  defaultTitle?: string;
  /**
   * Render the free-text refinement input next to the refinement options.
   *
   * @default true
   */
  showInput?: boolean;
  /**
   * The short labels the shopper can pick from to narrow the products, used whenever the response
   * carries none of its own - which is every response today. Pass `[]` for no options at all.
   *
   * Worth setting to categories from your own catalog: concrete nouns narrow the results far more
   * reliably than qualifiers. Price options are the weakest choice, because a refinement narrows
   * the products already on screen rather than searching the catalog, so a price the current
   * products miss leaves the pod empty.
   *
   * @default ['from a different brand', 'organic']
   */
  refinementOptions?: string[];
  /**
   * How many products to show.
   *
   * Does not reach the API today - the endpoint backing the pod decides how many products to
   * return. It sizes the loading skeleton, so it is still worth setting to the number you expect.
   */
  numResults?: number;
}

/** Arguments for one recommendations request. */
export interface GetRecsProps {
  itemId: string;
  variationId?: string;
  /** Thread ID for conversation context. Must be a valid UUID. */
  threadId?: string;
  /** @default 'complementary_items' */
  strategy?: RecsStrategy;
  /** Free text the shopper submitted to narrow the results. Absent on the first request. */
  shopperInput?: string;
  numResults?: number;
  /**
   * Applied while the raw results are converted to Items. It lives on the request rather than
   * in the component because the raw response shape is provisional, and keeping the conversion
   * behind this one call is what makes the endpoint swappable later - see
   * `hooks/mocks/recsFromItemQuestions.ts` for the conversion in place today.
   */
  formatImageUrl?: Formatters['formatImageUrl'];
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
  conversationHistory: ConversationEntry[];
}

export interface AnswerRenderProps {
  text: string;
}

export interface SuggestedQuestionsRenderProps {
  questions: Question[];
  onQuestionClick: (question: string) => void;
}

export interface DisclaimerRenderProps {
  learnMoreUrl?: string;
  translations?: Translations;
}

export interface FeedbackRenderProps {
  translations?: Translations;
  onFeedback?: (type: FeedbackType) => void;
}

export interface LoadingRenderProps {
  skeleton: ReactNode;
}

/**
 * Render props passed to a custom Input override.
 */
export interface InputRenderProps {
  disabled: boolean;
  placeholder: string;
  onSubmit: (value: string) => void;
  onFocus?: () => void;
  translations?: Translations;
  /** Validation message for the value that was just submitted, when there is one. */
  error?: string;
}

/**
 * Component overrides for CioPia.
 * Allows customization of sub-components via reactNode or render props functions.
 */
export interface CioPiaComponentOverrides extends ComponentOverrideProps<CioPiaRenderProps> {
  carousel?: CarouselOverrides<Item>;
  answer?: ComponentOverrideProps<AnswerRenderProps>;
  input?: ComponentOverrideProps<InputRenderProps>;
  suggestedQuestions?: ComponentOverrideProps<SuggestedQuestionsRenderProps>;
  disclaimer?: ComponentOverrideProps<DisclaimerRenderProps>;
  feedback?: ComponentOverrideProps<FeedbackRenderProps>;
  loading?: ComponentOverrideProps<LoadingRenderProps>;
}

export * from './hooks/mocks/types';
