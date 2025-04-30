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
    // TODO: Add loading state
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
          onClick={() => onQuestionClick(question)}
        />
      ))}
    </div>
  );
}
