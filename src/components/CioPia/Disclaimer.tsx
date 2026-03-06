import React from 'react';
import { DISCLAIMER_TEXT } from '../../constants';

export default function Disclaimer({ learnMoreUrl }: { learnMoreUrl?: string }) {
  return (
    <span className='cio-pia-disclaimer'>
      {DISCLAIMER_TEXT}{' '}
      {learnMoreUrl && (
        <a
          href={learnMoreUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='cio-pia-learn-more'>
          <u>Learn More.</u>
        </a>
      )}
    </span>
  );
}
