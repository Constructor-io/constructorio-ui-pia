import React from 'react';
export default function SuggestedQuestionsSkeleton() {
    return (React.createElement("div", { className: 'cio-pia-suggested-questions-container', "data-testid": 'suggested-questions-skeleton', "aria-busy": 'true', "aria-label": 'Loading suggestions' },
        React.createElement("div", { className: 'cio-pia-suggested-question-skeleton' }),
        React.createElement("div", { className: 'cio-pia-suggested-question-skeleton' }),
        React.createElement("div", { className: 'cio-pia-suggested-question-skeleton' })));
}
