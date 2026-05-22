"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const Answer_1 = tslib_1.__importDefault(require("../Answer/Answer"));
const Feedback_1 = tslib_1.__importDefault(require("../Feedback/Feedback"));
const Disclaimer_1 = tslib_1.__importDefault(require("../CioPia/Disclaimer"));
const ErrorBlock_1 = tslib_1.__importDefault(require("../Error/ErrorBlock"));
const LoadingSkeleton_1 = tslib_1.__importDefault(require("../LoadingSkeleton/LoadingSkeleton"));
const PiaCustomCarousel_1 = tslib_1.__importDefault(require("../CioPia/PiaCustomCarousel"));
function ConversationHistory({ conversationHistory, isLoading, error, currentItems, showFeedback, showPreviousItems = true, learnMoreUrl, disclaimerPosition = 'bottom', translations, callbacks, componentOverrides, }) {
    const scrollContainerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const container = scrollContainerRef.current;
        if (!container)
            return undefined;
        const frameId = requestAnimationFrame(() => {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        });
        return () => cancelAnimationFrame(frameId);
    }, [conversationHistory, isLoading]);
    const disclaimer = (react_1.default.createElement(Disclaimer_1.default, { learnMoreUrl: learnMoreUrl, translations: translations, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.disclaimer }));
    return (react_1.default.createElement("div", { className: 'cio-pia-conversation-history' },
        disclaimerPosition === 'top' && disclaimer,
        react_1.default.createElement("div", { ref: scrollContainerRef, className: 'cio-pia-conversation-entries', role: 'log', "aria-label": 'Conversation history' }, conversationHistory.map((entry, index) => {
            const isLast = index === conversationHistory.length - 1;
            const previousEntryItems = showPreviousItems ? entry.items : null;
            const latestEntryItems = currentItems !== undefined ? currentItems : entry.items;
            const carouselItems = isLast ? latestEntryItems : previousEntryItems;
            return (react_1.default.createElement("div", { key: entry.id, className: 'cio-pia-conversation-entry' },
                react_1.default.createElement("div", { className: 'cio-pia-chat-question' }, entry.question),
                isLast && isLoading && (react_1.default.createElement("div", { className: 'cio-pia-conversation-loading', "aria-live": 'polite' },
                    react_1.default.createElement(LoadingSkeleton_1.default, null))),
                isLast && !isLoading && error && (react_1.default.createElement(ErrorBlock_1.default, { message: error.message || 'Unexpected error' })),
                entry.answer && (react_1.default.createElement("div", { className: 'cio-pia-answer-container' },
                    react_1.default.createElement(Answer_1.default, { text: entry.answer, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.answer }),
                    carouselItems && (react_1.default.createElement(PiaCustomCarousel_1.default, { items: carouselItems, componentOverrides: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.carousel, callbacks: callbacks })),
                    isLast && showFeedback && (react_1.default.createElement(Feedback_1.default, { translations: translations, onFeedback: callbacks === null || callbacks === void 0 ? void 0 : callbacks.onFeedback, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.feedback }))))));
        })),
        disclaimerPosition === 'bottom' && disclaimer));
}
exports.default = ConversationHistory;
