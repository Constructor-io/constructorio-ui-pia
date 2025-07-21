import React from 'react';

interface SuggestedQuestionProps {
  question: string;
  onClick?: () => void;
}

function QuestionSvg() {
  return (
    <div className='cio-pia-suggested-question-icon'>
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <g id='help'>
          <path
            id='Vector'
            d='M8.00004 1.33331C4.32004 1.33331 1.33337 4.31998 1.33337 7.99998C1.33337 11.68 4.32004 14.6666 8.00004 14.6666C11.68 14.6666 14.6667 11.68 14.6667 7.99998C14.6667 4.31998 11.68 1.33331 8.00004 1.33331ZM8.66671 12.6666H7.33337V11.3333H8.66671V12.6666ZM10.0467 7.49998L9.44671 8.11331C8.96671 8.59998 8.66671 8.99998 8.66671 9.99998H7.33337V9.66665C7.33337 8.93331 7.63337 8.26665 8.11337 7.77998L8.94004 6.93998C9.18671 6.69998 9.33337 6.36665 9.33337 5.99998C9.33337 5.26665 8.73337 4.66665 8.00004 4.66665C7.26671 4.66665 6.66671 5.26665 6.66671 5.99998H5.33337C5.33337 4.52665 6.52671 3.33331 8.00004 3.33331C9.47337 3.33331 10.6667 4.52665 10.6667 5.99998C10.6667 6.58665 10.4267 7.11998 10.0467 7.49998Z'
            fill='#0F1324'
            fillOpacity='0.6'
          />
        </g>
      </svg>
    </div>
  );
}

function SuggestedQuestion({ question, onClick }: SuggestedQuestionProps) {
  return (
    <button type='button' className='cio-pia-suggested-question' onClick={onClick}>
      <QuestionSvg />
      {question}
    </button>
  );
}

export default SuggestedQuestion;
