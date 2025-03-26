import React from 'react';

interface AnswerProps {
  answerText: string;
  isLoading: boolean;
}

function AnswerLoader() {
  return (
    <div className='cio-asa-pdp-answer-loading' data-testid='answer-loading'>
      <div className='skeleton-bar' />
      <div className='skeleton-bar' />
      <div className='skeleton-bar skeleton-short' />
    </div>
  );
}

function Answer({ answerText, isLoading = true }: AnswerProps) {
  return (
    <div className='cio-asa-pdp-answer-container' data-testid='answer-container'>
      {isLoading ? (
        <AnswerLoader />
      ) : (
        <div className='cio-asa-pdp-answer-text' data-testid='answer-text'>
          {answerText}
        </div>
      )}
    </div>
  );
}

export default Answer;
