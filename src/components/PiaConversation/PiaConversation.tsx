import React from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import SuggestedQuestionsSkeleton from '../SuggestedQuestionsContainer/SuggestedQuestionsSkeleton';
import { translate } from '../../utils/translate';
import { FeedbackType, Question } from '../../types';
import { ContainerClickProps } from '../../hooks/useConversation';
import ConversationHistory, {
  ConversationHistoryProps,
} from '../ConversationHistory/ConversationHistory';

export interface PiaConversationProps extends ConversationHistoryProps {
  displayedQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick?: (question: string) => void;
  containerClickProps?: ContainerClickProps;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  handleFeedback?: (type: FeedbackType) => void;
  onInputFocus?: () => void;
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
  containerClickProps,
  containerRef,
  handleFeedback,
  onInputFocus,
}: PiaConversationProps) {
  const hasHistory = conversationHistory.length > 0;

  return (
    <div
      ref={containerRef}
      className='cio-pia-container cio-pia-conversation'
      data-testid='cio-pia-container'
      {...containerClickProps}>
      {!hasHistory && (
        <p className='cio-pia-title' data-testid='cio-pia-title'>
          {translate('Any questions about this product?', translations)}
        </p>
      )}

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
        handleFeedback={handleFeedback}
      />

      <div className='cio-pia-conversation-footer'>
        {isLoading && !error && <SuggestedQuestionsSkeleton />}
        {!isLoading && !error && (
          <SuggestedQuestionsContainer
            questions={displayedQuestions}
            onQuestionClick={handleQuestionClick || handleSubmitQuestion}
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
