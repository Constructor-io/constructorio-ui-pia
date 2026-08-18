import React from 'react';
import { QuestionIcon } from '../icons';

interface SuggestedQuestionProps {
  question: string;
  onClick?: () => void;
}

function SuggestedQuestion({ question, onClick }: SuggestedQuestionProps) {
  return (
    <button type='button' className='cio-pia-suggested-question' onClick={onClick}>
      {/* The wrapper carries the layout class, so the icon itself stays a plain SVG. */}
      <div className='cio-pia-suggested-question-icon'>
        <QuestionIcon />
      </div>
      {question}
    </button>
  );
}

export default SuggestedQuestion;
