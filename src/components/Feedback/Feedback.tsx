import React, { useState } from 'react';
import { Translations } from '../../types';
import { translate } from '../../utils/translate';

enum FeedbackType {
  UP = 'up',
  DOWN = 'down',
}

function ThumbsUpIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      {isSelected ? (
        <path
          d='M3.33317 6.66667H0.666504V14.6667H3.33317V6.66667ZM5.99984 14.6667C5.2665 14.6667 4.6665 14.0667 4.6665 13.3333V6.66667C4.6665 6.3 4.81317 5.96667 5.05317 5.72667L9.4465 1.33333L10.1532 2.03333C10.3332 2.21333 10.4465 2.46667 10.4465 2.74L10.4265 2.95333L9.79317 6.00001H13.9998C14.7332 6.00001 15.3332 6.60001 15.3332 7.33334V8.66668C15.3332 8.84001 15.2998 9.00001 15.2398 9.15334L13.2265 13.8533C13.0265 14.3333 12.5532 14.6667 11.9998 14.6667H5.99984Z'
          fill='#4CAF50'
          fillOpacity='1'
        />
      ) : (
        <path
          d='M5.99984 14.6667H11.9998C12.5532 14.6667 13.0265 14.3333 13.2265 13.8533L15.2398 9.15334C15.2998 9.00001 15.3332 8.84001 15.3332 8.66668V7.33334C15.3332 6.60001 14.7332 6.00001 13.9998 6.00001H9.79317L10.4265 2.95334L10.4465 2.74001C10.4465 2.46668 10.3332 2.21334 10.1532 2.03334L9.4465 1.33334L5.05317 5.72668C4.81317 5.96668 4.6665 6.30001 4.6665 6.66668V13.3333C4.6665 14.0667 5.2665 14.6667 5.99984 14.6667ZM5.99984 6.66668L8.89317 3.77334L7.99984 7.33334H13.9998V8.66668L11.9998 13.3333H5.99984V6.66668ZM0.666504 6.66668H3.33317V14.6667H0.666504V6.66668Z'
          fill='#0F1324'
          fillOpacity='0.6'
        />
      )}
    </svg>
  );
}

function ThumbsDownIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      {isSelected ? (
        <path
          d='M12.6665 9.33334H15.3332V1.33334H12.6665V9.33334ZM9.99984 1.33334C10.7332 1.33334 11.3332 1.93334 11.3332 2.66668V9.33334C11.3332 9.70001 11.1865 10.0333 10.9465 10.2733L6.55317 14.6667L5.8465 13.9667C5.6665 13.7867 5.55317 13.5333 5.55317 13.26L5.57317 13.0467L6.2065 10H1.99984C1.2665 10 0.666504 9.40001 0.666504 8.66668V7.33334C0.666504 7.16001 0.699837 7.00001 0.759837 6.84668L2.77317 2.14668C2.97317 1.66668 3.4465 1.33334 3.99984 1.33334H9.99984Z'
          fill='#F44336'
          fillOpacity='1'
        />
      ) : (
        <path
          d='M9.99984 1.33334H3.99984C3.4465 1.33334 2.97317 1.66668 2.77317 2.14668L0.759837 6.84668C0.699837 7.00001 0.666504 7.16001 0.666504 7.33334V8.66668C0.666504 9.40001 1.2665 10 1.99984 10H6.2065L5.57317 13.0467L5.55317 13.26C5.55317 13.5333 5.6665 13.7867 5.8465 13.9667L6.55317 14.6667L10.9465 10.2733C11.1865 10.0333 11.3332 9.70001 11.3332 9.33334V2.66668C11.3332 1.93334 10.7332 1.33334 9.99984 1.33334ZM9.99984 9.33334L7.1065 12.2267L7.99984 8.66668H1.99984V7.33334L3.99984 2.66668H9.99984V9.33334ZM12.6665 1.33334H15.3332V9.33334H12.6665V1.33334Z'
          fill='#0F1324'
          fillOpacity='0.6'
        />
      )}
    </svg>
  );
}

export default function Feedback({ translations }: { translations?: Translations }) {
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);

  const handleFeedback = (type: FeedbackType) => {
    setFeedback(type);
  };

  return (
    <div className='cio-pia-feedback-container'>
      <p className='cio-pia-feedback-text'>{translate('Is this answer useful?', translations)}</p>
      <button
        type='button'
        className='cio-pia-feedback-button'
        aria-label='thumbs up'
        onClick={() => handleFeedback(FeedbackType.UP)}>
        <ThumbsUpIcon isSelected={feedback === FeedbackType.UP} />
      </button>
      <button
        type='button'
        className='cio-pia-feedback-button'
        aria-label='thumbs down'
        onClick={() => handleFeedback(FeedbackType.DOWN)}>
        <ThumbsDownIcon isSelected={feedback === FeedbackType.DOWN} />
      </button>
    </div>
  );
}
