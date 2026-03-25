import React from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import { translate } from '../../utils/translate';
import { Question } from '../../types';
import ConversationHistory, {
  ConversationHistoryProps,
} from '../ConversationHistory/ConversationHistory';

export interface PiaConversationProps extends ConversationHistoryProps {
  displayedQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
  suggestedQuestionsError: Error | null;
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
  suggestedQuestionsError,
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
        showFeedback={showFeedback}
        learnMoreUrl={learnMoreUrl}
        translations={translations}
        callbacks={callbacks}
        componentOverrides={componentOverrides}
      />

      <div className='cio-pia-conversation-footer'>
        {!isLoading && !suggestedQuestionsError && (
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
