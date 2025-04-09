import React, { useEffect, useState } from 'react';
import SuggestedQuestionElement from './SuggestedQuestionElement';
import useSuggestedQuestions from '../../hooks/useSuggestedQuestions';
import { Question } from '../../hooks/mocks/assistant';

interface SuggestedQuestionsProps {
  itemId: string;
  onQuestionClick: (question: Question) => void;
}

function WarningIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='#e07b00;'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      className='lucide lucide-circle-alert-icon lucide-circle-alert'>
      <circle cx='12' cy='12' r='10' />
      <line x1='12' x2='12' y1='8' y2='12' />
      <line x1='12' x2='12.01' y1='16' y2='16' />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      className='lucide lucide-rotate-ccw-icon lucide-rotate-ccw'>
      <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
      <path d='M3 3v5h5' />
    </svg>
  );
}

export default function SuggestedQuestions({ itemId, onQuestionClick }: SuggestedQuestionsProps) {
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
  if (error) {
    return (
      <div className='cio-asa-pdp-suggested-questions-error-container'>
        <WarningIcon />
        <div>
          <p>Error loading suggested questions</p>
          <button
            onClick={() => refetch()}
            className='cio-asa-pdp-suggested-questions-retry-button'>
            <RetryIcon />
            Retry
          </button>
        </div>
      </div>
    );
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
