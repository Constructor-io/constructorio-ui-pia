import React from 'react';

const DEFAULT_COUNT = 3;

interface RecsOptionsSkeletonProps {
  /** How many pills to draw. Defaults to what the row usually holds. */
  count?: number;
}

/**
 * The refinement options, greyed out. Matching the real height is what keeps the row from
 * collapsing and shifting the page when the options land.
 *
 * Takes no override, the same way `SuggestedQuestionsSkeleton` takes none: `componentOverrides.
 * loading` stands in for the band above this one, and a caller who replaced it keeps these pills
 * underneath, exactly as a caller who replaces the answer skeleton in question-and-answer keeps the
 * question pills under theirs.
 */
export default function RecsOptionsSkeleton({ count }: RecsOptionsSkeletonProps) {
  return (
    <div
      className='cio-pia-recs-skeleton cio-pia-recs-skeleton--options'
      data-testid='cio-pia-recs-skeleton-options'
      aria-hidden='true'>
      {Array.from({ length: count ?? DEFAULT_COUNT }, (_, index) => (
        <div key={index} className='skeleton-bar cio-pia-recs-skeleton__block' />
      ))}
    </div>
  );
}
