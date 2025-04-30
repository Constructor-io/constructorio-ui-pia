import React from 'react';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
import { Question } from '../../hooks/mocks/types';
import ErrorBlock from '../Error/ErrorBlock';

interface SuggestedQuestionsContainerProps {
  questions: Question[];
  onQuestionClick: (question: Question) => void;
  isLoading: boolean;
  error: Error | null;
}

function SuggestedQuestionsLoader() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <circle fill='#FF156D' stroke='#FF156D' strokeWidth='15' r='15' cx='40' cy='100'>
        <animate
          attributeName='opacity'
          calcMode='spline'
          dur='2'
          values='1;0;1;'
          keySplines='.5 0 .5 1;.5 0 .5 1'
          repeatCount='indefinite'
          begin='-.4'
        />
      </circle>
      <circle fill='#FF156D' stroke='#FF156D' strokeWidth='15' r='15' cx='100' cy='100'>
        <animate
          attributeName='opacity'
          calcMode='spline'
          dur='2'
          values='1;0;1;'
          keySplines='.5 0 .5 1;.5 0 .5 1'
          repeatCount='indefinite'
          begin='-.2'
        />
      </circle>
      <circle fill='#FF156D' stroke='#FF156D' strokeWidth='15' r='15' cx='160' cy='100'>
        <animate
          attributeName='opacity'
          calcMode='spline'
          dur='2'
          values='1;0;1;'
          keySplines='.5 0 .5 1;.5 0 .5 1'
          repeatCount='indefinite'
          begin='0'
        />
      </circle>
    </svg>
  );
}

export default function SuggestedQuestionsContainer({
  questions,
  onQuestionClick,
  isLoading,
  error,
}: SuggestedQuestionsContainerProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  if (error) {
    const errorMessage = error?.message ?? 'Error fetching suggested questions';
    return <ErrorBlock message={errorMessage} />;
  }

  if (isLoading) {
    return <SuggestedQuestionsLoader />;
  }

  return (
    <div
      className='cio-asa-pdp-suggested-questions-container'
      data-testid='suggested-questions-list'>
      {questions.map((question) => (
        <SuggestedQuestion
          key={question.value}
          question={question.value}
          onClick={() => onQuestionClick(question)}
        />
      ))}
    </div>
  );
}
