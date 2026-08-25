import React, { useCallback } from 'react';
import { RenderPropsWrapper } from '@constructor-io/constructorio-ui-components';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import useCioPia from '../../hooks/useCioPia';
import useConversation from '../../hooks/useConversation';
import useTracking from '../../hooks/useTracking';
import useViewportTracking from '../../hooks/useViewportTracking';
import useViewportCallbacks from '../../hooks/useViewportCallbacks';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import { CioPiaRenderProps } from '../../types';
import { translate } from '../../utils/translate';
import PiaInlineAnswer from '../PiaInlineAnswer/PiaInlineAnswer';
import PiaModal from '../PiaConversation/PiaModal';
import PiaConversation from '../PiaConversation/PiaConversation';
import type { CioPiaProps } from './types';

/** Inline, not a class: consumers who ship their own styling still must not see it. */
const SR_ONLY_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/** The question-and-answer experience: `mode: 'default'`, `mode: 'conversation'`, and the modal. */
// eslint-disable-next-line complexity
export default function CioPiaQna(props: CioPiaProps) {
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
    productCardProps,
    children,
    translations,
    suggestedQuestionsParameters,
    parameters,
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

  const { priceCurrency } = productCardProps || {};

  const pia = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
    suggestedQuestionsParameters,
    parameters,
    formatImageUrl: formatters?.formatImageUrl,
  });

  const tracking = useTracking({
    cioClient: pia.cioClient,
    itemId,
    itemName,
    variationId,
    threadId: pia.threadId,
  });

  const {
    currentQuestion,
    displayedQuestions,
    conversationHistory,
    currentAnswer,
    currentItems,
    isLoading,
    isAnswerLoading,
    error,
    context,
    handleSubmitQuestion,
    handleQuestionClick,
    handleInputFocus,
    handleFeedback,
    resetState,
  } = useConversation({ pia, itemId, isConversation, callbacks, tracking });

  const { containerRef: viewportContainerRef } = useViewportTracking({
    tracking,
    questions: displayedQuestions,
  });
  const { containerRef: callbackContainerRef } = useViewportCallbacks({ callbacks, context });

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportContainerRef(node);
      callbackContainerRef(node);
    },
    [viewportContainerRef, callbackContainerRef],
  );

  const qnaResultId = pia.answers.data?.qna_result_id;

  // Inline mode renders the answer outside any live region, so nothing announces
  // its arrival. The region below is always mounted - one created together with
  // its content is announced inconsistently.
  let answerStatus = '';
  if (isAnswerLoading) answerStatus = translate('Loading answer', translations);
  else if (currentAnswer) answerStatus = translate('Answer ready', translations);

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
    handleFeedback,
    onResultClick: tracking.trackResultClick,
    qnaResultId,
    containerRef,
    onInputFocus: handleInputFocus,
    priceCurrency,
  };

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
        <PiaConversation {...conversationHistoryProps} />
      </PiaModal>
    );
  }

  if (isConversation) return <PiaConversation {...conversationHistoryProps} />;

  // Default inline mode
  return (
    <div ref={containerRef} className='cio-pia-container' data-testid='cio-pia-container'>
      <div
        className='cio-pia-sr-only'
        style={SR_ONLY_STYLE}
        role='status'
        data-testid='answer-status'>
        {answerStatus}
      </div>
      <RenderPropsWrapper props={renderProps} override={children || componentOverrides?.reactNode}>
        <p className='cio-pia-title' data-testid='cio-pia-title'>
          {translate('Any questions about this product?', translations)}
        </p>
        <Input
          onSubmit={handleSubmitQuestion}
          onFocus={handleInputFocus}
          value={currentQuestion}
          translations={translations}
          componentOverride={componentOverrides?.input}
        />

        {isLoading && <LoadingSkeleton componentOverride={componentOverrides?.loading} />}

        {!isLoading && error && (
          <ErrorBlock message={error?.message || 'Unexpected error'} translations={translations} />
        )}

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
                onResultClick={tracking.trackResultClick}
                question={currentQuestion}
                qnaResultId={qnaResultId}
                priceCurrency={priceCurrency}
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
