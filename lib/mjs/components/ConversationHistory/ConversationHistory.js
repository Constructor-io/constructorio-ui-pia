import React, { useEffect, useRef } from 'react';
import Answer from '../Answer/Answer';
import Feedback from '../Feedback/Feedback';
import Disclaimer from '../CioPia/Disclaimer';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import PiaCustomCarousel from '../CioPia/PiaCustomCarousel';
export default function ConversationHistory({ conversationHistory, isLoading, error, currentItems, showFeedback, showPreviousItems = true, learnMoreUrl, disclaimerPosition = 'bottom', translations, callbacks, componentOverrides, }) {
    const scrollContainerRef = useRef(null);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container)
            return undefined;
        const frameId = requestAnimationFrame(() => {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        });
        return () => cancelAnimationFrame(frameId);
    }, [conversationHistory, isLoading]);
    const disclaimer = (React.createElement(Disclaimer, { learnMoreUrl: learnMoreUrl, translations: translations, componentOverride: componentOverrides?.disclaimer }));
    return (React.createElement("div", { className: 'cio-pia-conversation-history' },
        disclaimerPosition === 'top' && disclaimer,
        React.createElement("div", { ref: scrollContainerRef, className: 'cio-pia-conversation-entries', role: 'log', "aria-label": 'Conversation history' }, conversationHistory.map((entry, index) => {
            const isLast = index === conversationHistory.length - 1;
            const previousEntryItems = showPreviousItems ? entry.items : null;
            const latestEntryItems = currentItems !== undefined ? currentItems : entry.items;
            const carouselItems = isLast ? latestEntryItems : previousEntryItems;
            return (React.createElement("div", { key: entry.id, className: 'cio-pia-conversation-entry' },
                React.createElement("div", { className: 'cio-pia-chat-question' }, entry.question),
                isLast && isLoading && (React.createElement("div", { className: 'cio-pia-conversation-loading', "aria-live": 'polite' },
                    React.createElement(LoadingSkeleton, null))),
                isLast && !isLoading && error && (React.createElement(ErrorBlock, { message: error.message || 'Unexpected error' })),
                entry.answer && (React.createElement("div", { className: 'cio-pia-answer-container' },
                    React.createElement(Answer, { text: entry.answer, componentOverride: componentOverrides?.answer }),
                    carouselItems && (React.createElement(PiaCustomCarousel, { items: carouselItems, componentOverrides: componentOverrides?.carousel, callbacks: callbacks })),
                    isLast && showFeedback && (React.createElement(Feedback, { translations: translations, onFeedback: callbacks?.onFeedback, componentOverride: componentOverrides?.feedback }))))));
        })),
        disclaimerPosition === 'bottom' && disclaimer));
}
