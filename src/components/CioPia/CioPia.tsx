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
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  variationId?: string;
  cioClient?: MockConstructorIOClient;
  displayConfigs?: CioPiaDisplayConfigs;
  callbacks?: Callbacks;
  translations?: Translations;
  /** Checkout props — triggerWhen receives PIA state for type inference */
  checkoutProps?: CioCheckoutProps<CioPiaRenderProps>[];
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
    children,
    translations,
    checkoutProps = [],
  } = props;
  const { learnMoreUrl, showFeedback, mode = 'default', type = 'inline' } = displayConfigs || {};
  const isConversation = mode === 'conversation' || type === 'modal';

  const pia = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
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
    handleSubmitQuestion,
    resetState: resetConversation,
  } = useConversation({ pia, itemId, isConversation });

  const resetState = useCallback(() => {
    resetConversation();
    checkoutRef.current?.reset();
  }, [resetConversation]);

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
    learnMoreUrl,
    translations,
    callbacks,
    componentOverrides,
    displayedQuestions,
    handleSubmitQuestion,
  };

  const checkoutElement = checkoutProps.length > 0 && (
    <div className='cio-pia-checkout-container'>
      {checkoutProps.map((checkout, index) => (
        <CioCheckout
          // eslint-disable-next-line react/no-array-index-key
          key={`cio-checkout-${index}`}
          ref={checkoutRef}
          {...checkout}
          triggerWhen={(state: CioPiaRenderProps) => {
            if (checkout.triggerWhen) {
              return checkout.triggerWhen(renderProps);
            }
            return state.conversationHistory.length > 0 && !state.isLoading && !state.error;
          }}
          triggerState={renderProps}
        />
      ))}
    </div>
  );

  if (type === 'modal') {
    return (
      <PiaModal
        initialQuestions={pia.suggestedQuestions.data}
        handleSubmitQuestion={handleSubmitQuestion}
        isLoading={isLoading}
        componentOverrides={componentOverrides}
        translations={translations}
        onClose={resetState}>
        <PiaConversation {...conversationHistoryProps} checkoutElement={checkoutElement} />
      </PiaModal>
    );
  }

  if (isConversation) {
    return <PiaConversation {...conversationHistoryProps} checkoutElement={checkoutElement} />;
  }

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

        {!isLoading && !error && checkoutElement}

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
