import React from 'react';
import {
  IncludeComponentOverrides,
  IncludeRenderProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import useCioPia from '../../hooks/useCioPia';
import useConversation from '../../hooks/useConversation';
import useTracking from '../../hooks/useTracking';
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
import PiaInlineAnswer from '../PiaInlineAnswer/PiaInlineAnswer';
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
  itemName: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000"). */
  threadId?: string;
  /** Optional variation ID for the product. */
  variationId?: string;
  /** Optional Constructor.io client instance. If not provided, one will be created internally. */
  cioClient?: ConstructorIOClient;
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
}

export default function CioPia(props: CioPiaProps) {
  const {
    apiKey,
    itemId,
    itemName,
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

  const tracking = useTracking({ cioClient: pia.cioClient, itemId, itemName, variationId });

  const {
    currentQuestion,
    displayedQuestions,
    conversationHistory,
    currentAnswer,
    currentItems,
    isLoading,
    error,
    handleSubmitQuestion,
    handleQuestionClick,
    containerFocusProps,
    handleFeedback,
    resetState,
  } = useConversation({ pia, itemId, isConversation, callbacks, tracking });

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
    containerFocusProps,
    handleFeedback,
  };

  if (type === 'modal') {
    return (
      <PiaModal
        initialQuestions={pia.suggestedQuestions.data}
        handleSubmitQuestion={handleSubmitQuestion}
        handleQuestionClick={handleQuestionClick}
        containerFocusProps={containerFocusProps}
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
    <div className='cio-pia-container' data-testid='cio-pia-container' {...containerFocusProps}>
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
              <PiaInlineAnswer
                currentAnswer={currentAnswer}
                currentItems={currentItems}
                showFeedback={showFeedback}
                learnMoreUrl={learnMoreUrl}
                disclaimerPosition={disclaimerPosition}
                translations={translations}
                callbacks={callbacks}
                componentOverrides={componentOverrides}
                onFeedback={handleFeedback}
              />
            )}

            <SuggestedQuestionsContainer
              questions={displayedQuestions}
              onQuestionClick={handleQuestionClick}
              componentOverride={componentOverrides?.suggestedQuestions}
            />
          </>
        )}
      </RenderPropsWrapper>
    </div>
  );
}
