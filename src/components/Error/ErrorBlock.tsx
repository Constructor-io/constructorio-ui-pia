import React from 'react';

interface ErrorBlockProps {
  message: string;
  onRetry?: () => void;
}

function WarningIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12.0004 2C6.4804 2 2.0004 6.48 2.0004 12C2.0004 17.52 6.4804 22 12.0004 22C17.5204 22 22.0004 17.52 22.0004 12C22.0004 6.48 17.5204 2 12.0004 2ZM13.0004 17H11.0004V15H13.0004V17ZM13.0004 13H11.0004V7H13.0004V13Z'
        fill='#F1923A'
      />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11.7633 4.23329C10.7966 3.26663 9.46992 2.66663 7.99659 2.66663C5.04992 2.66663 2.66992 5.05329 2.66992 7.99996C2.66992 10.9466 5.04992 13.3333 7.99659 13.3333C10.4833 13.3333 12.5566 11.6333 13.1499 9.33329H11.7633C11.2166 10.8866 9.73659 12 7.99659 12C5.78992 12 3.99659 10.2066 3.99659 7.99996C3.99659 5.79329 5.78992 3.99996 7.99659 3.99996C9.10326 3.99996 10.0899 4.45996 10.8099 5.18663L8.66326 7.33329H13.3299V2.66663L11.7633 4.23329Z'
        fill='white'
      />
    </svg>
  );
}

function ErrorBlock({ message, onRetry = undefined }: ErrorBlockProps) {
  return (
    <div className='cio-asa-pdp-error-block-container'>
      <div className='cio-asa-pdp-error-block-warning-icon-container'>
        <WarningIcon />
      </div>
      <div className='cio-asa-pdp-error-block-text-container'>
        <p className='cio-asa-pdp-error-block-text'>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className='cio-asa-pdp-error-block-retry-button'>
            <RetryIcon />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorBlock;
