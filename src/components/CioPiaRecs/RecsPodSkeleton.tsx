import React from 'react';
import {
  ComponentOverrideProps,
  RenderPropsWrapper,
} from '@constructor-io/constructorio-ui-components';
import { LoadingRenderProps } from '../../types';

/** Which block of the pod is being stood in for. Each shape matches the real thing's height. */
export type RecsPodSkeletonPart = 'carousel' | 'options' | 'input';

interface RecsPodSkeletonProps {
  part: RecsPodSkeletonPart;
  /** How many placeholders to draw. Defaults to what that part usually holds. */
  count?: number;
  componentOverride?: ComponentOverrideProps<LoadingRenderProps>;
}

const DEFAULT_COUNTS: Record<RecsPodSkeletonPart, number> = {
  carousel: 4,
  options: 3,
  input: 1,
};

/**
 * Placeholder blocks shaped like the pod's own content.
 *
 * The Q&A loading skeleton draws text bars, which is right above a paragraph answer and wrong
 * above a product row, so the pod has its own. Matching the real heights is what keeps the page
 * from jumping when the data lands.
 */
export default function RecsPodSkeleton({ part, count, componentOverride }: RecsPodSkeletonProps) {
  const total = count ?? DEFAULT_COUNTS[part];

  const skeleton = (
    <div
      className={`cio-pia-recs-skeleton cio-pia-recs-skeleton--${part}`}
      data-testid={`cio-pia-recs-skeleton-${part}`}
      aria-hidden='true'>
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className='skeleton-bar cio-pia-recs-skeleton__block' />
      ))}
    </div>
  );

  return (
    <RenderPropsWrapper props={{ skeleton }} override={componentOverride?.reactNode}>
      {skeleton}
    </RenderPropsWrapper>
  );
}
