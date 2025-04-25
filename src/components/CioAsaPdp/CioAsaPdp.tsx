import React, { useState } from 'react';
import { CioAsaPdpProviderProps } from '../../types';
import CioAsaPdpProvider from './CioAsaPdpProvider';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import { MOCK_ANSWER, DEMO_ITEM_ID } from '../../constants';
import Feedback from '../Feedback/Feedback';
import { Question } from '../../hooks/mocks/types';

export type CioAsaPdpProps = CioAsaPdpProviderProps;

function AsaPdpContent() {
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const disclaimerText =
    'AI-generated answers aim to help, but they may occasionally miss details or be inaccurate. Double-check important information before purchasing.';

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question.value);
  };

  const handleSubmit = (question: string) => {
    setCurrentQuestion(question);
  };

  return (
    <div className='cio-asa-pdp-container'>
      <p className='cio-asa-pdp-title'>Any questions about this product?</p>
      <Input onSubmit={handleSubmit} value={currentQuestion} />
      {currentAnswer ? (
        <div className='cio-asa-pdp-answer-container'>
          <Answer text={MOCK_ANSWER} />
          <Feedback />
          <span className='cio-asa-pdp-disclaimer'>
            {disclaimerText}{' '}
            <a href='https://example.com/learn-more' className='cio-asa-pdp-learn-more'>
              <u>Learn More.</u>
            </a>
          </span>
        </div>
      ) : (
        <SuggestedQuestionsContainer itemId={DEMO_ITEM_ID} onQuestionClick={handleQuestionClick} />
      )}
    </div>
  );
}

export default function CioAsaPdp(props: CioAsaPdpProps) {
  const { apiKey, itemId, cioClient } = props;

  return (
    <CioAsaPdpProvider itemId={itemId} apiKey={apiKey} cioClient={cioClient}>
      <AsaPdpContent />
    </CioAsaPdpProvider>
  );
}
