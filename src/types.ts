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

export type CioPiaMode = 'default' | 'conversation';
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
  /** Accessible name for the thumbs-up feedback button. */
  'thumbs up'?: string;
  /** Accessible name for the thumbs-down feedback button. */
  'thumbs down'?: string;
  /** Accessible name for the modal close button. */
  Close?: string;
  /** Visible label and accessible name for the error retry button. */
  Retry?: string;
  /** Accessible name for the conversation history region. */
  'Conversation history'?: string;
  /** Accessible name for the suggested questions group. */
  'Suggested questions'?: string;
  /** Announced while suggested questions are loading. */
  'Loading suggestions'?: string;
  /** Announced while an answer is loading. */
  'Loading answer'?: string;
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
 * Component overrides for CioPia.
 * Allows customization of sub-components via reactNode or render props functions.
 */
export interface CioPiaComponentOverrides extends ComponentOverrideProps<CioPiaRenderProps> {
  carousel?: CarouselOverrides<Item>;
  answer?: ComponentOverrideProps<AnswerRenderProps>;
  suggestedQuestions?: ComponentOverrideProps<SuggestedQuestionsRenderProps>;
  disclaimer?: ComponentOverrideProps<DisclaimerRenderProps>;
  feedback?: ComponentOverrideProps<FeedbackRenderProps>;
  loading?: ComponentOverrideProps<LoadingRenderProps>;
}

export * from './hooks/mocks/types';
