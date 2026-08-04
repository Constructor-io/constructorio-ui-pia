import React from 'react';
import { Translations } from '../../types';
import { translate } from '../../utils/translate';

interface SuggestedQuestionsSkeletonProps {
  translations?: Translations;
}

export default function SuggestedQuestionsSkeleton({
  translations,
}: SuggestedQuestionsSkeletonProps = {}) {
  return (
    <div
      className='cio-pia-suggested-questions-container'
      data-testid='suggested-questions-skeleton'
      role='status'
      aria-busy='true'
      aria-label={translate('Loading suggestions', translations)}>
      <div className='cio-pia-suggested-question-skeleton' />
      <div className='cio-pia-suggested-question-skeleton' />
      <div className='cio-pia-suggested-question-skeleton' />
    </div>
  );
}
