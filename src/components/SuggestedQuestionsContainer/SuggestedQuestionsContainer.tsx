import React, { useEffect, useState } from 'react';
import SuggestedQuestion from '../SuggestedQuestion/SuggestedQuestion';
import useSuggestedQuestions from '../../hooks/useSuggestedQuestions';
import { Question } from '../../hooks/mocks/assistant';

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
  const { questions, error, refetch } = useSuggestedQuestions({ itemId });

  // Considering that we are prioritizing the mobile view, we will build the component for mobile first
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();

    window.addEventListener('resize', () => {
      checkIsDesktop();
    });

    return () => window.removeEventListener('resize', checkIsDesktop);
  });

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
      className={`${isDesktop ? 'cio-asa-pdp-suggested-questions-desktop-grid' : 'cio-asa-pdp-suggested-questions-mobile-scroll'}`}
      data-testid='suggested-questions-list'>
      {questions.map((question, index) => (
        <SuggestedQuestion
          key={index}
          question={question.value}
          onClick={() => onQuestionClick(question)}
        />
      ))}
    </div>
  );
}
