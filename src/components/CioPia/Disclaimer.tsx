import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { Translations, DisclaimerRenderProps } from '../../types';
import { translate } from '../../utils/translate';
import { DISCLAIMER_TEXT } from '../../constants';

export default function Disclaimer({
  learnMoreUrl,
  translations,
  componentOverride,
}: {
  learnMoreUrl?: string;
  translations?: Translations;
  componentOverride?: ComponentOverrideProps<DisclaimerRenderProps>;
}) {
  return (
    <RenderPropsWrapper
      props={{ learnMoreUrl, translations }}
      override={componentOverride?.reactNode}>
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
    </RenderPropsWrapper>
  );
}
