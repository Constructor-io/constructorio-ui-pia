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
  checkoutElement?: React.ReactNode;
}

export default function PiaConversation({
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
    <div className='cio-pia-container cio-pia-conversation' data-testid='cio-pia-container'>
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
          learnMoreUrl={learnMoreUrl}
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
            onQuestionClick={handleSubmitQuestion}
            componentOverride={componentOverrides?.suggestedQuestions}
          />
        )}
        <Input onSubmit={handleSubmitQuestion} disabled={isLoading} translations={translations} />
      </div>
    </div>
  );
}
