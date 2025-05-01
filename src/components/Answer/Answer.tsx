import React from 'react';

interface AnswerProps {
  text: string;
}

function Answer({ text }: AnswerProps) {
  if (!text) {
    return null;
  }

  return (
    <div className='cio-asa-pdp-answer' data-testid='answer-text'>
      {text}
    </div>
  );
}

export default Answer;
