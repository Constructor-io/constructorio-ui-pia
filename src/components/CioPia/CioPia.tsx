import React, { useEffect, useState } from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import { DISCLAIMER_TEXT } from '../../constants';
import { Question } from '../../hooks/mocks/types';
import useCioPia from '../../hooks/useCioPia';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import { CioPiaDisplayConfigs } from '../../types';

export interface CioPiaProps {
  apiKey: string;
  itemId: string;
  /** Thread ID for conversation context. Must be a valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000") */
  threadId?: string;
  variationId?: string;
  cioClient?: MockConstructorIOClient;
  displayConfigs?: CioPiaDisplayConfigs;
}

export default function CioPia(props: CioPiaProps) {
  const { apiKey, itemId, threadId, variationId, cioClient, displayConfigs } = props;
  const { learnMoreUrl, showFeedback } = displayConfigs || {};
  const { suggestedQuestions, answers } = useCioPia({
    apiKey,
    itemId,
    threadId,
    variationId,
    cioClient,
  });

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);

  const handleSubmitQuestion = (question: string) => {
    setCurrentQuestion(question);
    answers.getAnswer(question);
  };

  // Update displayed questions when suggested questions are fetched
  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  useEffect(() => {
    if (answers.data?.value) setCurrentAnswer(answers.data.value);
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  const error = answers.error || suggestedQuestions.error;
  const isLoading = answers.isLoading || suggestedQuestions.isLoading;

  return (
    <div className='cio-pia-container' data-testid='cio-pia-container'>
      <p className='cio-pia-title' data-testid='cio-pia-title'>
        Any questions about this product?
      </p>
      <Input onSubmit={handleSubmitQuestion} value={currentQuestion} />
      {isLoading && <LoadingSkeleton />}
      {!isLoading &&
        (error ? (
          <ErrorBlock
            message={
              answers.error?.message || suggestedQuestions.error?.message || 'Unexpected error'
            }
          />
        ) : (
          <>
            {!!currentAnswer && (
              <div className='cio-pia-answer-container'>
                <Answer text={currentAnswer} />
                {!!showFeedback && <Feedback />}
                <span className='cio-pia-disclaimer'>
                  {DISCLAIMER_TEXT}{' '}
                  {!!learnMoreUrl && (
                    <a
                      href={learnMoreUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='cio-pia-learn-more'>
                      <u>Learn More.</u>
                    </a>
                  )}
                </span>
              </div>
            )}

            <SuggestedQuestionsContainer
              questions={displayedQuestions}
              onQuestionClick={handleSubmitQuestion}
            />
          </>
        ))}
    </div>
  );
}
