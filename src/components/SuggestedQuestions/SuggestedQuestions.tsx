import React, { useEffect, useState } from 'react';
import SuggestedQuestionElement from './SuggestedQuestionElement';
import useSuggestedQuestions from '../../hooks/useSuggestedQuestions';
import { Question } from '../../hooks/mocks/assistant';
import ErrorBlock from '../ErrorBlock/ErrorBlock';

interface SuggestedQuestionsProps {
  itemId: string;
  onQuestionClick: (question: Question) => void;
  isError?: boolean; // For testing purposes
}

export default function SuggestedQuestions({
  itemId,
  onQuestionClick,
  isError = false,
}: SuggestedQuestionsProps) {
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

  // Handle error state
  if (isError || error) {
    const errorMessage = error?.message ?? 'Error fetching suggested questions';
    return <ErrorBlock message={errorMessage} onRetry={refetch} />;
  }

  const displayQuestions = isDesktop ? questions.slice(0, 6) : questions;
  if (displayQuestions.length === 0) {
    return null;
  }

  return (
    <div className='cio-asa-pdp-suggested-questions-container'>
      <div
        className={`${isDesktop ? 'cio-asa-pdp-suggested-questions-desktop-grid' : 'cio-asa-pdp-suggested-questions-mobile-scroll'}`}
        data-testid='suggested-questions-list'>
        {displayQuestions.map((question, index) => (
          <SuggestedQuestionElement
            key={index}
            question={question.value}
            onClick={() => onQuestionClick(question)}
          />
        ))}
      </div>
    </div>
  );
}
