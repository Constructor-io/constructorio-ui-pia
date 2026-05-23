import React, { useCallback, useRef } from 'react';
import {
  IncludeComponentOverrides,
  IncludeRenderProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { CioCheckout } from '@constructor-io/constructorio-ui-checkout';
import type {
  CioCheckoutProps,
  CioCheckoutHandle,
} from '@constructor-io/constructorio-ui-checkout';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import useCioPia from '../../hooks/useCioPia';
import useConversation from '../../hooks/useConversation';
import useViewportCallbacks from '../../hooks/useViewportCallbacks';
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
  DisclaimerPosition,
  Item,
  Question,
} from '../../types';
import { translate } from '../../utils/translate';
import PiaInlineAnswer from '../PiaInlineAnswer/PiaInlineAnswer';
import PiaModal from '../PiaConversation/PiaModal';
import PiaConversation from '../PiaConversation/PiaConversation';

function defaultTriggerWhen(state: CioPiaRenderProps) {
  return state.conversationHistory.length >= 3 && !state.isLoading && !state.error;
}

interface PiaCheckoutsProps {
  checkoutProps: CioCheckoutProps<CioPiaRenderProps>[];
  checkoutRef: React.RefObject<CioCheckoutHandle | null>;
  renderProps: CioPiaRenderProps;
}

function PiaCheckouts({ checkoutProps, checkoutRef, renderProps }: PiaCheckoutsProps) {
  if (checkoutProps.length === 0) return null;
  return (
    <div className='cio-pia-checkout-container'>
      {checkoutProps.map((checkout) => (
        <CioCheckout
          key={`cio-checkout-${JSON.stringify(checkout.session)}`}
          ref={checkoutRef}
          {...checkout}
          triggerWhen={checkout.triggerWhen ?? defaultTriggerWhen}
          triggerState={renderProps}
        />
      ))}
    </div>
  );
}

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
  /** Display configuration options (mode, type, showFeedback, etc.). */
  displayConfigs?: CioPiaDisplayConfigs;
  /** Callback handlers for user interactions (onQuestionSubmit, onProductCardClick, onFeedback). */
  callbacks?: Callbacks;
  // Redeclared from IncludeComponentOverrides for Storybook autodocs.
  /** Custom component overrides via reactNode or render props functions. */
  componentOverrides?: CioPiaComponentOverrides;
  /** Formatter functions for transforming data before display. */
  formatters?: Formatters;
  /** UI string translations for internationalization. */
  translations?: Translations;
  /** Parameters for the suggested questions request. */
  suggestedQuestionsParameters?: SuggestedQuestionsParameters;
  /** Checkout props — triggerWhen receives PIA state for type inference */
  checkoutProps?: CioCheckoutProps<CioPiaRenderProps>[];
}

interface PiaInlineModeProps {
  currentQuestion: string;
  currentAnswer: string;
  currentItems: Item[] | null;
  isLoading: boolean;
  error: Error | null;
  displayedQuestions: Question[];
  showFeedback?: boolean;
  learnMoreUrl?: string;
  disclaimerPosition?: DisclaimerPosition;
  translations?: Translations;
  callbacks?: Callbacks;
  componentOverrides?: CioPiaComponentOverrides;
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick: (question: string) => void;
  onInputFocus: () => void;
  checkoutElement: React.ReactNode;
}

function PiaInlineMode({
  currentQuestion,
  currentAnswer,
  currentItems,
  isLoading,
  error,
  displayedQuestions,
  showFeedback,
  learnMoreUrl,
  disclaimerPosition,
  translations,
  callbacks,
  componentOverrides,
  handleSubmitQuestion,
  handleQuestionClick,
  onInputFocus,
  checkoutElement,
}: PiaInlineModeProps) {
  return (
    <>
      <p className='cio-pia-title' data-testid='cio-pia-title'>
        {translate('Any questions about this product?', translations)}
      </p>
      <Input
        onSubmit={handleSubmitQuestion}
        onFocus={onInputFocus}
        value={currentQuestion}
        translations={translations}
      />

      {isLoading && <LoadingSkeleton />}

      {!isLoading && error && <ErrorBlock message={error?.message || 'Unexpected error'} />}

      {!isLoading && !error && checkoutElement}

      {!isLoading && !error && (
        <>
          {currentAnswer && (
            <PiaInlineAnswer
              currentAnswer={currentAnswer}
              currentItems={currentItems}
              showFeedback={showFeedback}
              learnMoreUrl={learnMoreUrl}
              disclaimerPosition={disclaimerPosition}
              translations={translations}
              callbacks={callbacks}
              componentOverrides={componentOverrides}
            />
          )}

          <SuggestedQuestionsContainer
            questions={displayedQuestions}
            onQuestionClick={handleQuestionClick}
            componentOverride={componentOverrides?.suggestedQuestions}
          />
        </>
      )}
    </>
  );
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
    checkoutProps = [],
  } = props;
  const {
    learnMoreUrl,
    showFeedback,
    mode = 'default',
    type = 'inline',
    showPreviousItems,
    disclaimerPosition = 'bottom',
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

  const checkoutRef = useRef<CioCheckoutHandle>(null);

  const {
    currentQuestion,
    displayedQuestions,
    conversationHistory,
    currentAnswer,
    currentItems,
    isLoading,
    error,
    context,
    handleSubmitQuestion,
    handleQuestionClick,
    handleInputFocus,
    resetState: resetConversation,
  } = useConversation({ pia, itemId, isConversation, callbacks });

  const resetState = useCallback(() => {
    resetConversation();
    checkoutRef.current?.reset();
  }, [resetConversation]);

  const { containerRef } = useViewportCallbacks({ callbacks, context });

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
    disclaimerPosition,
    translations,
    callbacks,
    componentOverrides,
    displayedQuestions,
    handleSubmitQuestion,
    handleQuestionClick,
    containerRef,
    onInputFocus: handleInputFocus,
  };

  const checkoutElement = (
    <PiaCheckouts
      checkoutProps={checkoutProps}
      checkoutRef={checkoutRef}
      renderProps={renderProps}
    />
  );

  if (type === 'modal') {
    return (
      <PiaModal
        initialQuestions={pia.suggestedQuestions.data}
        handleSubmitQuestion={handleSubmitQuestion}
        handleQuestionClick={handleQuestionClick}
        containerRef={containerRef}
        isLoading={isLoading}
        componentOverrides={componentOverrides}
        translations={translations}
        onInputFocus={handleInputFocus}
        onClose={resetState}>
        <PiaConversation {...conversationHistoryProps} checkoutElement={checkoutElement} />
      </PiaModal>
    );
  }

  if (isConversation) {
    return <PiaConversation {...conversationHistoryProps} checkoutElement={checkoutElement} />;
  }

  return (
    <div ref={containerRef} className='cio-pia-container' data-testid='cio-pia-container'>
      <RenderPropsWrapper props={renderProps} override={children || componentOverrides?.reactNode}>
        <PiaInlineMode
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
          currentItems={currentItems}
          isLoading={isLoading}
          error={error}
          displayedQuestions={displayedQuestions}
          showFeedback={showFeedback}
          learnMoreUrl={learnMoreUrl}
          disclaimerPosition={disclaimerPosition}
          translations={translations}
          callbacks={callbacks}
          componentOverrides={componentOverrides}
          handleSubmitQuestion={handleSubmitQuestion}
          handleQuestionClick={handleQuestionClick}
          onInputFocus={handleInputFocus}
          checkoutElement={checkoutElement}
        />
      </RenderPropsWrapper>
    </div>
  );
}
