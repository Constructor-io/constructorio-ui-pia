import React from 'react';
export default function LoadingSkeleton() {
    return (React.createElement("div", { className: 'cio-pia-loading-skeleton', "data-testid": 'loading-skeleton' },
        React.createElement("div", { className: 'skeleton-bar' }),
        React.createElement("div", { className: 'skeleton-bar' }),
        React.createElement("div", { className: 'skeleton-bar skeleton-short' })));
}
