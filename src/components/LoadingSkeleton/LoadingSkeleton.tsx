import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { LoadingRenderProps } from '../../types';

interface LoadingSkeletonProps {
  componentOverride?: ComponentOverrideProps<LoadingRenderProps>;
}

export default function LoadingSkeleton({ componentOverride }: LoadingSkeletonProps = {}) {
  const skeleton = (
    <div className='cio-pia-loading-skeleton' data-testid='loading-skeleton' aria-hidden='true'>
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
