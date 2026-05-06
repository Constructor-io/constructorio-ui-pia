import React from 'react';
import {
  IncludeComponentOverrides,
  IncludeRenderProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import Disclaimer from './Disclaimer';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import useCioPia from '../../hooks/useCioPia';
import useConversation from '../../hooks/useConversation';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  CioPiaDisplayConfigs,
  Translations,
  SuggestedQuestionsParameters,
  Formatters,
} from '../../types';
import { translate } from '../../utils/translate';
import PiaCustomCarousel from './PiaCustomCarousel';
import PiaModal from '../PiaConversation/PiaModal';
import PiaConversation from '../PiaConversation/PiaConversation';

export interface CioPiaProps
  extends
    IncludeRenderProps<CioPiaRenderProps>,
    IncludeComponentOverrides<CioPiaComponentOverrides> {
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
  /**
   * Display configuration options:
   *
   * `mode: 'default' | 'conversation'` — Display mode. Defaults to `'default'`.
   *
   * `type: 'inline' | 'modal'` — Component type. Defaults to `'inline'`.
   *
   * `showFeedback: boolean` — Show feedback controls on answers.
   *
   * `showPreviousItems: boolean` — Show product carousels from previous conversation entries. Defaults to `true`.
   *
   * `learnMoreUrl: string` — URL for the "Learn More" disclaimer link.
   */
  displayConfigs?: CioPiaDisplayConfigs;

  /**
   * Callback handlers for user interactions:
   *
   * `onQuestionSubmit: (question: string) => void` —
   * Called when a question is submitted (via Enter key, Send button, or suggested question click).
   *
   * `onProductCardClick: (item: Item) => void` — Called when a product card in the carousel is clicked.
   *
   * `onFeedback: (type: 'up' | 'down') => void` —
   * Called when the user submits positive or negative feedback on an answer.
   */
  callbacks?: Callbacks;

  /**
   * Custom component overrides via reactNode or render props functions:
   *
   * `reactNode: (props: CioPiaRenderProps) => ReactNode` — Override the entire CioPia component.
   *
   * `carousel` — Override carousel sub-components (item, previous, next).
   *
   * `answer: { reactNode: (props: { text }) => ReactNode }` — Override the answer display.
   *
   * `suggestedQuestions: { reactNode: (props: { questions, onQuestionClick }) => ReactNode }` —
   * Override suggested questions.
   *
   * `disclaimer: { reactNode: (props: { learnMoreUrl?, translations? }) => ReactNode }` — Override the disclaimer.
   *
   * `feedback: { reactNode: (props: { translations?, onFeedback? }) => ReactNode }` — Override feedback controls.
   */
  componentOverrides?: CioPiaComponentOverrides;

  /**
   * Formatter functions for transforming data before display.
   * Define outside the component or memoize to avoid unnecessary re-renders.
   *
   * `formatImageUrl: (url: string) => string`
   * Transforms image URLs before rendering (e.g., prepend a CDN base URL).
   */
  formatters?: Formatters;

  /**
   * UI string translations for internationalization.
   * All keys are optional — any non-provided translation falls back to English.
   *
   * `'Any questions about this product?'` — Title text.
   *
   * `'Ask anything'` — Input placeholder.
   *
   * `'Send'` — Send button label.
   *
   * `'Is this answer useful?'` — Feedback prompt.
   *
   * `'Learn More.'` — Disclaimer link text.
   *
   * `'Ask about this product'` — Modal title.
   */
  translations?: Translations;

  /**
   * Parameters for the suggested questions request.
   *
   * `numResults: number` — Number of suggested questions to fetch.
   */
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
}

export default function CioPia(props: CioPiaProps) {
  const {
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
    displayConfigs,
    componentOverrides,
    callbacks,
    formatters,
    children,
    translations,
    suggestedQuestionsParameters,
  } = props;
  const {
    learnMoreUrl,
    showFeedback,
    mode = 'default',
    type = 'inline',
    showPreviousItems,
  } = displayConfigs || {};
  const isConversation = mode === 'conversation' || type === 'modal';

  const pia = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
    suggestedQuestionsParameters,
    formatImageUrl: formatters?.formatImageUrl,
  });

  const {
    currentQuestion,
    displayedQuestions,
    conversationHistory,
    currentAnswer,
    currentItems,
    isLoading,
    error,
    handleSubmitQuestion,
    resetState,
  } = useConversation({ pia, itemId, isConversation, callbacks });

  const renderProps: CioPiaRenderProps = {
    items: currentItems,
    isLoading,
    error,
    currentAnswer,
    currentQuestion,
    displayedQuestions,
    handleSubmitQuestion,
    conversationHistory,
  };

  const conversationHistoryProps = {
    conversationHistory,
    isLoading,
    error,
    currentItems,
    showFeedback,
    showPreviousItems,
    learnMoreUrl,
    translations,
    callbacks,
    componentOverrides,
    displayedQuestions,
    handleSubmitQuestion,
  };

  if (type === 'modal') {
    return (
      <PiaModal
        initialQuestions={pia.suggestedQuestions.data}
        handleSubmitQuestion={handleSubmitQuestion}
        isLoading={isLoading}
        componentOverrides={componentOverrides}
        translations={translations}
        onClose={resetState}>
        <PiaConversation {...conversationHistoryProps} />
      </PiaModal>
    );
  }

  if (isConversation) return <PiaConversation {...conversationHistoryProps} />;

  // Default inline mode
  return (
    <div className='cio-pia-container' data-testid='cio-pia-container'>
      <RenderPropsWrapper props={renderProps} override={children || componentOverrides?.reactNode}>
        <p className='cio-pia-title' data-testid='cio-pia-title'>
          {translate('Any questions about this product?', translations)}
        </p>
        <Input
          onSubmit={handleSubmitQuestion}
          value={currentQuestion}
          translations={translations}
        />

        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && <ErrorBlock message={error?.message || 'Unexpected error'} />}

        {!isLoading && !error && (
          <>
            {currentAnswer && (
              <div className='cio-pia-answer-container'>
                <Answer text={currentAnswer} componentOverride={componentOverrides?.answer} />
                {currentItems && (
                  <PiaCustomCarousel
                    items={currentItems}
                    componentOverrides={componentOverrides?.carousel}
                    callbacks={callbacks}
                  />
                )}
                {showFeedback && (
                  <Feedback
                    translations={translations}
                    onFeedback={callbacks?.onFeedback}
                    componentOverride={componentOverrides?.feedback}
                  />
                )}
                <Disclaimer
                  learnMoreUrl={learnMoreUrl}
                  translations={translations}
                  componentOverride={componentOverrides?.disclaimer}
                />
              </div>
            )}

            <SuggestedQuestionsContainer
              questions={displayedQuestions}
              onQuestionClick={handleSubmitQuestion}
              componentOverride={componentOverrides?.suggestedQuestions}
            />
          </>
        )}
      </RenderPropsWrapper>
    </div>
  );
}
