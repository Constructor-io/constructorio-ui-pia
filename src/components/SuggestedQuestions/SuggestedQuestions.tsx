import React, { useEffect, useState } from 'react';
import SuggestedQuestionElement from './SuggestedQuestionElement';
import { MOCK_QUESTIONS } from '../../constants';

interface SuggestedQuestionsProps {
  itemId: string;
  onQuestionClick: (question: string) => void;
}

export default function SuggestedQuestions({ itemId, onQuestionClick }: SuggestedQuestionsProps) {
  // Todo: Replace with useSuggestedQuestions hook
  // const { questions, isLoading, error, refetch } = useSuggestedQuestions(itemId);
  const questions = MOCK_QUESTIONS;

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
            question={question}
            onClick={() => onQuestionClick(question)}
          />
        ))}
      </div>
    </div>
  );
}
