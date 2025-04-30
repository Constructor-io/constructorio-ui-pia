import React, { useEffect, useState } from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import MockConstructorIOClient from '../../hooks/mocks/MockConstructorIOClient';
import { DISCLAIMER_TEXT } from '../../constants';
import { Question } from '../../hooks/mocks/types';
import useCioAsaPdp from '../../hooks/useCioAsaPdp';

export interface CioAsaPdpProps {
  apiKey: string;
  itemId: string;
  cioClient?: MockConstructorIOClient;
}

export default function CioAsaPdp(props: CioAsaPdpProps) {
  const { apiKey, itemId, cioClient } = props;
  const { questions, answers } = useCioAsaPdp({ apiKey, itemId, cioClient });

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question.value);
    answers.fetchResult(question.value);
  };

  const handleSubmit = (question: string) => {
    setCurrentQuestion(question);
    answers.fetchResult(question);
  };

  useEffect(() => {
    if (answers.data?.value) {
      setCurrentAnswer(answers.data.value);
    }
  }, [answers.data]);

  return (
    <div className='cio-asa-pdp-container'>
      <p className='cio-asa-pdp-title'>Any questions about this product?</p>
      <Input onSubmit={handleSubmit} value={currentQuestion} />
      <div className='cio-asa-pdp-answer-container'>
        <Answer text={currentAnswer} isLoading={answers.isLoading} />
        {currentAnswer && (
          <>
            <Feedback />
            <span className='cio-asa-pdp-disclaimer'>
              {DISCLAIMER_TEXT}{' '}
              <a href='https://example.com/learn-more' className='cio-asa-pdp-learn-more'>
                <u>Learn More.</u>
              </a>
            </span>
          </>
        )}
      </div>
      <SuggestedQuestionsContainer
        questions={questions.data}
        isLoading={questions.isLoading}
        error={questions.error}
        onQuestionClick={handleQuestionClick}
      />
    </div>
  );
}
