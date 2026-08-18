import React from 'react';

/**
 * Marks a label as AI-generated. Inherits the surrounding text color rather than fixing a hex, so
 * it follows whatever it sits in.
 *
 * TODO: replace the paths with the exported asset once it is available in the design handoff.
 */
export default function SparklesIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.5 1L7.9 5.1L12 6.5L7.9 7.9L6.5 12L5.1 7.9L1 6.5L5.1 5.1L6.5 1Z'
        fill='currentColor'
      />
      <path
        d='M12.25 10L12.95 11.55L14.5 12.25L12.95 12.95L12.25 14.5L11.55 12.95L10 12.25L11.55 11.55L12.25 10Z'
        fill='currentColor'
      />
    </svg>
  );
}
