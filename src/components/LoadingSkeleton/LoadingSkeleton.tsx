import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className='cio-asa-pdp-loading-skeleton' data-testid='loading-skeleton'>
      <div className='skeleton-bar' />
      <div className='skeleton-bar' />
      <div className='skeleton-bar skeleton-short' />
    </div>
  );
}
