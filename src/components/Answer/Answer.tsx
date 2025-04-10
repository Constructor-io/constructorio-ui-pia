import React from 'react';

interface AnswerProps {
  text: string;
  isLoading?: boolean;
}

export function AnswerSkeleton() {
  return (
    <div className='cio-asa-pdp-answer-loading' data-testid='answer-loading'>
      <div className='skeleton-bar' />
      <div className='skeleton-bar' />
      <div className='skeleton-bar skeleton-short' />
    </div>
  );
}

function Answer({ text, isLoading = false }: AnswerProps) {
  // TODO: Insert useAnswer hook

  return (
    <div className='cio-asa-pdp-answer-container' data-testid='answer-container'>
      {isLoading ? (
        <AnswerSkeleton />
      ) : (
        <div className='cio-asa-pdp-answer-text' data-testid='answer-text'>
          {text}
        </div>
      )}
    </div>
  );
}

export default Answer;
