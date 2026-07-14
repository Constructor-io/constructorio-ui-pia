import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { LoadingRenderProps } from '../../types';

interface LoadingSkeletonProps {
  componentOverride?: ComponentOverrideProps<LoadingRenderProps>;
}

const skeleton = (
  <div className='cio-pia-loading-skeleton' data-testid='loading-skeleton'>
    <div className='skeleton-bar' />
    <div className='skeleton-bar' />
    <div className='skeleton-bar skeleton-short' />
  </div>
);

export default function LoadingSkeleton({ componentOverride }: LoadingSkeletonProps = {}) {
  return (
    <RenderPropsWrapper props={{ skeleton }} override={componentOverride?.reactNode}>
      {skeleton}
    </RenderPropsWrapper>
  );
}
