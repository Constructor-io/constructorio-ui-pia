import React from 'react';

export default function SuggestedQuestionsSkeleton() {
  return (
    <div
      className='cio-pia-suggested-questions-container'
      data-testid='suggested-questions-skeleton'>
      <div className='cio-pia-suggested-question-skeleton' />
      <div className='cio-pia-suggested-question-skeleton' />
      <div className='cio-pia-suggested-question-skeleton' />
    </div>
  );
}
