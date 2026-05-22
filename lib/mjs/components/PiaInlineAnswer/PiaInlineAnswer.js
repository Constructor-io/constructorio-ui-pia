import React from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
export default function PiaInlineAnswer({ currentAnswer, currentItems, showFeedback, learnMoreUrl, disclaimerPosition = 'bottom', translations, callbacks, componentOverrides, }) {
    const disclaimer = (React.createElement(Disclaimer, { learnMoreUrl: learnMoreUrl, translations: translations, componentOverride: componentOverrides?.disclaimer }));
    return (React.createElement("div", { className: 'cio-pia-answer-container' },
        disclaimerPosition === 'top' && disclaimer,
        React.createElement(Answer, { text: currentAnswer, componentOverride: componentOverrides?.answer }),
        currentItems && (React.createElement(PiaCustomCarousel, { items: currentItems, componentOverrides: componentOverrides?.carousel, callbacks: callbacks })),
        showFeedback && (React.createElement(Feedback, { translations: translations, onFeedback: callbacks?.onFeedback, componentOverride: componentOverrides?.feedback })),
        disclaimerPosition === 'bottom' && disclaimer));
}
