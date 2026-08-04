import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { LoadingRenderProps, Translations } from '../../types';
import { translate } from '../../utils/translate';

interface LoadingSkeletonProps {
  componentOverride?: ComponentOverrideProps<LoadingRenderProps>;
  translations?: Translations;
}

export default function LoadingSkeleton({
  componentOverride,
  translations,
}: LoadingSkeletonProps = {}) {
  const skeleton = (
    <div
      className='cio-pia-loading-skeleton'
      data-testid='loading-skeleton'
      role='status'
      aria-busy='true'
      aria-label={translate('Loading answer', translations)}>
      <div className='skeleton-bar' />
      <div className='skeleton-bar' />
      <div className='skeleton-bar skeleton-short' />
    </div>
  );

  return (
    <RenderPropsWrapper props={{ skeleton }} override={componentOverride?.reactNode}>
      {skeleton}
    </RenderPropsWrapper>
  );
}
