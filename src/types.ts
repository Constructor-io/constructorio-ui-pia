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

export type CioPiaMode = 'default' | 'conversation';
export type CioPiaType = 'inline' | 'modal';

export type CioPiaDisplayConfigs = {
  learnMoreUrl?: string;
  showFeedback?: boolean;
  mode?: CioPiaMode;
  type?: CioPiaType;
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
};

export interface Callbacks {
  onProductCardClick?: (item: Item) => void;
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
}

/**
 * Component overrides for CioPia
 * Allows customization of sub-components via reactNode or render props functions
 */
export interface CioPiaComponentOverrides extends ComponentOverrideProps<CioPiaRenderProps> {
  carousel?: CarouselOverrides<Item>;
  answer?: ComponentOverrideProps<AnswerRenderProps>;
  suggestedQuestions?: ComponentOverrideProps<SuggestedQuestionsRenderProps>;
  disclaimer?: ComponentOverrideProps<DisclaimerRenderProps>;
  feedback?: ComponentOverrideProps<FeedbackRenderProps>;
}

export * from './hooks/mocks/types';
