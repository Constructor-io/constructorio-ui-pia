import React, { useEffect, useState } from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import { DISCLAIMER_TEXT } from '../../constants';
import { Question } from '../../hooks/mocks/types';
import useCioAsaPdp from '../../hooks/useCioAsaPdp';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';

export interface CioAsaPdpProps {
  apiKey: string;
  itemId: string;
  cioClient?: MockConstructorIOClient;
}

export default function CioAsaPdp(props: CioAsaPdpProps) {
  const { apiKey, itemId, cioClient } = props;
  const { suggestedQuestions, answers } = useCioAsaPdp({ apiKey, itemId, cioClient });

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);

  const handleSubmitQuestion = (question: Question | string) => {
    const questionText = typeof question === 'string' ? question : question.value;
    setCurrentQuestion(questionText);
    answers.getAnswer(questionText);
  };

  useEffect(() => {
    // Update displayed questions when suggested questions are fetched
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  useEffect(() => {
    if (answers.data) {
      if (answers.data.value) setCurrentAnswer(answers.data.value);
      if (answers.data.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
    }
  }, [answers.data]);

  const error = answers.error || suggestedQuestions.error;
  const isLoading = answers.isLoading || suggestedQuestions.isLoading;

  return (
    <div className='cio-asa-pdp-container'>
      <p className='cio-asa-pdp-title'>Any questions about this product?</p>
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
            {!!currentAnswer && !answers.isLoading && (
              <div className='cio-asa-pdp-answer-container'>
                <Answer text={currentAnswer} />
                <Feedback />
                <span className='cio-asa-pdp-disclaimer'>
                  {DISCLAIMER_TEXT}{' '}
                  <a href='https://constructor.io' className='cio-asa-pdp-learn-more'>
                    <u>Learn More.</u>
                  </a>
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
