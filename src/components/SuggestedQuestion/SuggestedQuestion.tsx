import React, { ReactNode } from 'react';
import { QuestionIcon } from '../icons';

interface SuggestedQuestionProps {
  question: string;
  onClick?: () => void;
  /** Replaces the leading icon. Defaults to a question mark. */
  icon?: ReactNode;
}

function SuggestedQuestion({ question, onClick, icon }: SuggestedQuestionProps) {
  return (
    <button type='button' className='cio-pia-suggested-question' onClick={onClick}>
      {/* The wrapper carries the layout class, so the icon itself stays a plain SVG. */}
      <div className='cio-pia-suggested-question-icon'>{icon ?? <QuestionIcon />}</div>
      {question}
    </button>
  );
}

export default SuggestedQuestion;
