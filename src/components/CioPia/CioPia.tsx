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
import PiaCustomCarousel from './PiaCustomCarousel';
import PiaModal from '../PiaConversation/PiaModal';
import PiaConversation from '../PiaConversation/PiaConversation';

export interface CioPiaProps
  extends
    IncludeRenderProps<CioPiaRenderProps>,
    IncludeComponentOverrides<CioPiaComponentOverrides> {
  apiKey: string;
  itemId: string;
  itemName: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  variationId?: string;
  cioClient?: MockConstructorIOClient;
  displayConfigs?: CioPiaDisplayConfigs;

  /**
   * Callback handlers for user interactions:
   *
   * `onQuestionSubmit: (question: string) => void`
   * Called when a question is submitted (via Enter key, Send button, or suggested question click).
   *
   * `onProductCardClick: (item: Item) => void`
   * Called when a product card in the carousel is clicked.
   *
   * `onFeedback: (type: 'up' | 'down') => void`
   * Called when the user submits positive or negative feedback on an answer.
   */
  callbacks?: Callbacks;

  /** Define formatter functions outside the component or memoize to avoid unnecessary re-renders. */
  formatters?: Formatters;
  translations?: Translations;
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

  const disclaimer = (
    <Disclaimer
      learnMoreUrl={learnMoreUrl}
      translations={translations}
      componentOverride={componentOverrides?.disclaimer}
    />
  );

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
              <div className='cio-pia-answer-container'>
                {disclaimerPosition === 'top' && disclaimer}
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
                    onFeedback={(feedbackType) => {
                      handleFeedback(feedbackType);
                      callbacks?.onFeedback?.(feedbackType);
                    }}
                    componentOverride={componentOverrides?.feedback}
                  />
                )}
                {disclaimerPosition === 'bottom' && disclaimer}
              </div>
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
