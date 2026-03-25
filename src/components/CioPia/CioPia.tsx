import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import {
  CioPiaRenderProps,
  CioPiaComponentOverrides,
  Callbacks,
  CioPiaDisplayConfigs,
  Translations,
  Question,
  ConversationEntry,
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
  } = props;
  const { learnMoreUrl, showFeedback, mode = 'default', type = 'inline' } = displayConfigs || {};
  const { suggestedQuestions, answers } = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
  });
  const { getAnswer } = answers;

  const isConversation = mode === 'conversation' || type === 'modal';

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const entryIdRef = useRef(0);

  const handleSubmitQuestion = useCallback(
    (question: string) => {
      setCurrentQuestion(question);
      getAnswer(question);

      if (isConversation) {
        entryIdRef.current += 1;
        const id = entryIdRef.current;
        setConversationHistory((prev) => [...prev, { id, question, answer: '' }]);
      }
    },
    [getAnswer, isConversation],
  );

  // Reset all state when itemId changes
  useEffect(() => {
    setCurrentQuestion('');
    setDisplayedQuestions([]);
    setConversationHistory([]);
  }, [itemId]);

  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  useEffect(() => {
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  // Update the last conversation entry when answer resolves
  useEffect(() => {
    if (!isConversation || conversationHistory.length === 0 || !answers.data) return;
    setConversationHistory((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        answer: answers.data?.value ?? '',
      };
      return updated;
    });
  }, [isConversation, conversationHistory.length, answers.data]);

  const currentAnswer = answers.data?.value ?? '';
  const currentItems = answers.items ?? null;
  const error = answers.error || suggestedQuestions.error;
  const isLoading = answers.isLoading || suggestedQuestions.isLoading;

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
  };

  if (type === 'modal') {
    return (
      <PiaModal
        currentAnswer={currentAnswer}
        currentItems={currentItems}
        displayedQuestions={displayedQuestions}
        handleSubmitQuestion={handleSubmitQuestion}
        isLoading={isLoading}
        showFeedback={showFeedback}
        learnMoreUrl={learnMoreUrl}
        componentOverrides={componentOverrides}
        callbacks={callbacks}
        translations={translations}>
        <PiaConversation
          {...conversationHistoryProps}
          displayedQuestions={displayedQuestions}
          handleSubmitQuestion={handleSubmitQuestion}
          suggestedQuestionsError={suggestedQuestions.error}
        />
      </PiaModal>
    );
  }

  if (isConversation) {
    return (
      <PiaConversation
        {...conversationHistoryProps}
        displayedQuestions={displayedQuestions}
        handleSubmitQuestion={handleSubmitQuestion}
        suggestedQuestionsError={suggestedQuestions.error}
      />
    );
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

        {!isLoading && error && (
          <ErrorBlock
            message={
              answers.error?.message || suggestedQuestions.error?.message || 'Unexpected error'
            }
          />
        )}

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
