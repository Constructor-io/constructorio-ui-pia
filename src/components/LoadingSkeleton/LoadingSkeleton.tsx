import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className='cio-pia-loading-skeleton' data-testid='loading-skeleton'>
      <div className='skeleton-bar' />
      <div className='skeleton-bar' />
      <div className='skeleton-bar skeleton-short' />
    </div>
  );
}
