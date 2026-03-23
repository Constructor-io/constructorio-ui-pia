import React from 'react';
import { Translations } from '../../types';
import { translate } from '../../utils/translate';

export default function Disclaimer({
  learnMoreUrl,
  translations,
}: {
  learnMoreUrl?: string;
  translations?: Translations;
}) {
  return (
    <span className='cio-pia-disclaimer'>
      {translate('disclaimerText', translations)}{' '}
      {learnMoreUrl && (
        <a
          href={learnMoreUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='cio-pia-learn-more'>
          <u>{translate('learnMoreText', translations)}</u>
        </a>
      )}
    </span>
  );
}
