import React, { useEffect, useState } from 'react';
import SuggestedQuestionElement from './SuggestedQuestionElement';

interface SuggestedQuestionsProps {
  itemId: string;
  onQuestionClick: (question: string) => void;
}

const MOCK_QUESTIONS = [
  'Is this bunkie board suitable for a platform bed?',
  'What are the benefits of using a bunkie board with a platform bed?',
  'What is a bunkie board and how does it differ from a box spring?',
  'Is this bunkie board made in the USA?',
  'What sizes are available for this bunkie board?',
  'Can this bunkie board be used with a memory foam mattress?',
];

export default function SuggestedQuestions({ itemId, onQuestionClick }: SuggestedQuestionsProps) {
  // Todo: Replace with useSuggestedQuestions hook
  const questions = MOCK_QUESTIONS;
  // const { questions, isLoading, error, refetch } = useSuggestedQuestions(itemId);

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

  return (
    <div className='cio-asa-pdp-suggested-questions-container'>
      <div
        className={`${isDesktop ? 'cio-asa-pdp-suggested-questions-desktop-grid' : 'cio-asa-pdp-suggested-questions-mobile-scroll'}`}>
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
