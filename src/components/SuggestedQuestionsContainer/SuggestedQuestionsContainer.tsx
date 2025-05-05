import React from 'react';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
import { Question } from '../../hooks/mocks/types';

interface SuggestedQuestionsContainerProps {
  questions: Question[];
  onQuestionClick: (question: string) => void;
}

export default function SuggestedQuestionsContainer({
  questions,
  onQuestionClick,
}: SuggestedQuestionsContainerProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div
      className='cio-asa-pdp-suggested-questions-container'
      data-testid='suggested-questions-list'>
      {questions.map((question) => (
        <SuggestedQuestion
          key={question.value}
          question={question.value}
          onClick={() => onQuestionClick(question.value)}
        />
      ))}
    </div>
  );
}
