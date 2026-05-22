"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const Input_1 = tslib_1.__importDefault(require("../Input/Input"));
const SuggestedQuestionsContainer_1 = tslib_1.__importDefault(require("../SuggestedQuestionsContainer/SuggestedQuestionsContainer"));
const SuggestedQuestionsSkeleton_1 = tslib_1.__importDefault(require("../SuggestedQuestionsContainer/SuggestedQuestionsSkeleton"));
const translate_1 = require("../../utils/translate");
const ConversationHistory_1 = tslib_1.__importDefault(require("../ConversationHistory/ConversationHistory"));
function PiaConversation({ conversationHistory, isLoading, error, currentItems, showFeedback, showPreviousItems, learnMoreUrl, disclaimerPosition, translations, callbacks, componentOverrides, displayedQuestions, handleSubmitQuestion, handleQuestionClick, containerRef, onInputFocus, }) {
    const hasHistory = conversationHistory.length > 0;
    return (react_1.default.createElement("div", { ref: containerRef, className: 'cio-pia-container cio-pia-conversation', "data-testid": 'cio-pia-container' },
        !hasHistory && (react_1.default.createElement("p", { className: 'cio-pia-title', "data-testid": 'cio-pia-title' }, (0, translate_1.translate)('Any questions about this product?', translations))),
        react_1.default.createElement(ConversationHistory_1.default, { conversationHistory: conversationHistory, isLoading: isLoading, error: error, currentItems: currentItems, showFeedback: showFeedback, showPreviousItems: showPreviousItems, learnMoreUrl: learnMoreUrl, disclaimerPosition: disclaimerPosition, translations: translations, callbacks: callbacks, componentOverrides: componentOverrides }),
        react_1.default.createElement("div", { className: 'cio-pia-conversation-footer' },
            isLoading && !error && react_1.default.createElement(SuggestedQuestionsSkeleton_1.default, null),
            !isLoading && !error && (react_1.default.createElement(SuggestedQuestionsContainer_1.default, { questions: displayedQuestions, onQuestionClick: handleQuestionClick, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.suggestedQuestions })),
            react_1.default.createElement(Input_1.default, { onSubmit: handleSubmitQuestion, onFocus: onInputFocus, disabled: isLoading, translations: translations }))));
}
exports.default = PiaConversation;
