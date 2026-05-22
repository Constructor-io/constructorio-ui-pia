import React from 'react';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import SuggestedQuestionsSkeleton from '../SuggestedQuestionsContainer/SuggestedQuestionsSkeleton';
import { translate } from '../../utils/translate';
import ConversationHistory from '../ConversationHistory/ConversationHistory';
export default function PiaConversation({ conversationHistory, isLoading, error, currentItems, showFeedback, showPreviousItems, learnMoreUrl, disclaimerPosition, translations, callbacks, componentOverrides, displayedQuestions, handleSubmitQuestion, handleQuestionClick, containerRef, onInputFocus, }) {
    const hasHistory = conversationHistory.length > 0;
    return (React.createElement("div", { ref: containerRef, className: 'cio-pia-container cio-pia-conversation', "data-testid": 'cio-pia-container' },
        !hasHistory && (React.createElement("p", { className: 'cio-pia-title', "data-testid": 'cio-pia-title' }, translate('Any questions about this product?', translations))),
        React.createElement(ConversationHistory, { conversationHistory: conversationHistory, isLoading: isLoading, error: error, currentItems: currentItems, showFeedback: showFeedback, showPreviousItems: showPreviousItems, learnMoreUrl: learnMoreUrl, disclaimerPosition: disclaimerPosition, translations: translations, callbacks: callbacks, componentOverrides: componentOverrides }),
        React.createElement("div", { className: 'cio-pia-conversation-footer' },
            isLoading && !error && React.createElement(SuggestedQuestionsSkeleton, null),
            !isLoading && !error && (React.createElement(SuggestedQuestionsContainer, { questions: displayedQuestions, onQuestionClick: handleQuestionClick, componentOverride: componentOverrides?.suggestedQuestions })),
            React.createElement(Input, { onSubmit: handleSubmitQuestion, onFocus: onInputFocus, disabled: isLoading, translations: translations }))));
}
