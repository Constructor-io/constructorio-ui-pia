import React, { useState } from 'react';
import { CioAsaPdpProviderProps } from '../../types';
import CioAsaPdpProvider from './CioAsaPdpProvider';
import useCioAsaPdp from '../../hooks/useCioAsaPdp';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import Answer from '../Answer/Answer';
import { MOCK_ANSWER, DEMO_ITEM_ID } from '../../constants';
import Feedback from '../Feedback/Feedback';
import { Question } from '../../hooks/mocks/types';

export type CioAsaPdpProps = CioAsaPdpProviderProps;

function AsaPdpContent() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [error, setError] = useState('');

  const { questions } = useCioAsaPdp();

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question.value);
  };

  const handleSubmit = (question: string) => {
    setCurrentQuestion(question);
    if (questions.error) {
      setError(questions.error.message);
    }
  };

  return (
    <div className='cio-asa-pdp'>
      <p className='cio-asa-pdp-title'>Any questions about this product?</p>
      <Input onSubmit={handleSubmit} value={currentQuestion} />
      {currentAnswer ? (
        <div className='cio-asa-pdp-answer-container'>
          <Answer text={MOCK_ANSWER} />
          <Feedback />
        </div>
      ) : (
        /** TODO: To be replaced with useAsaPdpContext */
        <SuggestedQuestionsContainer
          itemId={DEMO_ITEM_ID}
          onQuestionClick={handleQuestionClick}
          isError={!!questions.error}
        />
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
