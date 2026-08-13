import React from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import SuggestedQuestionsSkeleton from '../SuggestedQuestionsContainer/SuggestedQuestionsSkeleton';
import { translate } from '../../utils/translate';
import { FeedbackType, Item, Question } from '../../types';
import ConversationHistory, {
  ConversationHistoryProps,
} from '../ConversationHistory/ConversationHistory';
import PoweredBy from '../CioPia/PoweredBy';

export interface PiaConversationProps extends ConversationHistoryProps {
  displayedQuestions: Question[];
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick: (question: string) => void;
  containerRef?: (node: HTMLDivElement | null) => void;
  handleFeedback?: (type: FeedbackType) => void;
  onResultClick?: (item: Item, position: number, question: string, qnaResultId?: string) => void;
  qnaResultId?: string;
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
  containerRef,
  handleFeedback,
  onResultClick,
  qnaResultId,
  onInputFocus,
  priceCurrency,
}: PiaConversationProps) {
  return (
    <div
      ref={containerRef}
      className='cio-pia-container cio-pia-conversation'
      data-testid='cio-pia-container'>
      <p className='cio-pia-title' data-testid='cio-pia-title'>
        {translate('Any questions about this product?', translations)}
      </p>

      <div className='cio-pia-conversation-body'>
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
          onResultClick={onResultClick}
          qnaResultId={qnaResultId}
          priceCurrency={priceCurrency}
        />

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
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}
