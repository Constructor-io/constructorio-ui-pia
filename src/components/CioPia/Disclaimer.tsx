import React from 'react';
import { Translations } from '../../types';
import { translate } from '../../utils/translate';
import { DISCLAIMER_TEXT } from '../../constants';

export default function Disclaimer({
  learnMoreUrl,
  translations,
}: {
  learnMoreUrl?: string;
  translations?: Translations;
}) {
  return (
    <span className='cio-pia-disclaimer'>
      {translate(DISCLAIMER_TEXT, translations)}{' '}
      {learnMoreUrl && (
        <a
          href={learnMoreUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='cio-pia-learn-more'>
          <u>{translate('Learn More.', translations)}</u>
        </a>
      )}
    </span>
  );
}
