import React, { useEffect, useRef } from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import SuggestedQuestionsSkeleton from '../SuggestedQuestionsContainer/SuggestedQuestionsSkeleton';
import { translate } from '../../utils/translate';
import { Question } from '../../types';
import ConversationHistory, {
  ConversationHistoryProps,
} from '../ConversationHistory/ConversationHistory';

export interface PiaConversationProps extends ConversationHistoryProps {
  displayedQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick: (question: string) => void;
  containerRef?: (node: HTMLDivElement | null) => void;
  onInputFocus?: () => void;
  checkoutElement?: React.ReactNode;
}

export default function PiaConversation({
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
  onInputFocus,
  checkoutElement,
}: PiaConversationProps) {
  const hasHistory = conversationHistory.length > 0;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return undefined;

    const frameId = requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });

    return () => cancelAnimationFrame(frameId);
  }, [conversationHistory, isLoading]);

  return (
    <div
      ref={containerRef}
      className='cio-pia-container cio-pia-conversation'
      data-testid='cio-pia-container'>
      {!hasHistory && (
        <p className='cio-pia-title' data-testid='cio-pia-title'>
          {translate('Any questions about this product?', translations)}
        </p>
      )}

      <div ref={scrollContainerRef} className='cio-pia-conversation-body'>
        <ConversationHistory
          conversationHistory={conversationHistory}
          isLoading={isLoading}
          error={error}
          currentItems={currentItems}
          showFeedback={showFeedback}
          showPreviousItems={showPreviousItems}
          learnMoreUrl={learnMoreUrl}
          disclaimerPosition={disclaimerPosition}
          translations={translations}
          callbacks={callbacks}
          componentOverrides={componentOverrides}
        />

        {checkoutElement && <div className='cio-pia-conversation-checkout'>{checkoutElement}</div>}
      </div>

      <div className='cio-pia-conversation-footer'>
        {isLoading && !error && <SuggestedQuestionsSkeleton />}
        {!isLoading && !error && (
          <SuggestedQuestionsContainer
            questions={displayedQuestions}
            onQuestionClick={handleQuestionClick}
            componentOverride={componentOverrides?.suggestedQuestions}
          />
        )}
        <Input
          onSubmit={handleSubmitQuestion}
          onFocus={onInputFocus}
          disabled={isLoading}
          translations={translations}
        />
      </div>
    </div>
  );
}
