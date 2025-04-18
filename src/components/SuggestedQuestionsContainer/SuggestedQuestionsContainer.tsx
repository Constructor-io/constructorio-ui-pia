import React from 'react';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
import useSuggestedQuestions from '../../hooks/useSuggestedQuestions';
import { Question } from '../../hooks/mocks/types';

interface SuggestedQuestionsContainerProps {
  itemId: string;
  onQuestionClick: (question: Question) => void;
  isError?: boolean;
}

export default function SuggestedQuestionsContainer({
  itemId,
  onQuestionClick,
  isError = false,
}: SuggestedQuestionsContainerProps) {
  // Todo: Replace with useSuggestedQuestions hook
  const { questions, error } = useSuggestedQuestions({ itemId });

  if (!questions || questions.length === 0) {
    return null;
  }

  if (isError || error) {
    const errorMessage = error?.message ?? 'Error fetching suggested questions';
    return (
      <div data-testid='suggested-questions-container-error-block'>
        To be replaced with ErrorBlock component: {errorMessage}
      </div>
    );
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
