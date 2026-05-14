import React from 'react';
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
}

export default function PiaConversation({
  conversationHistory,
  isLoading,
  error,
  currentItems,
  currentResponse,
  showFeedback,
  showPreviousItems,
  learnMoreUrl,
  disclaimerPosition,
  translations,
  callbacks,
  componentOverrides,
  displayedQuestions,
  handleSubmitQuestion,
}: PiaConversationProps) {
  const hasHistory = conversationHistory.length > 0;

  return (
    <div className='cio-pia-container cio-pia-conversation' data-testid='cio-pia-container'>
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
        currentResponse={currentResponse}
        showFeedback={showFeedback}
        showPreviousItems={showPreviousItems}
        learnMoreUrl={learnMoreUrl}
        disclaimerPosition={disclaimerPosition}
        translations={translations}
        callbacks={callbacks}
        componentOverrides={componentOverrides}
      />

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
