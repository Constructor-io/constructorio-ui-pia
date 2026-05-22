import React from 'react';
import { RenderPropsWrapper, } from '@constructor-io/constructorio-ui-components';
import Input from '../Input/Input';
import SuggestedQuestionsContainer from '../SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import useCioPia from '../../hooks/useCioPia';
import useConversation from '../../hooks/useConversation';
import useViewportCallbacks from '../../hooks/useViewportCallbacks';
import ErrorBlock from '../Error/ErrorBlock';
import LoadingSkeleton from '../LoadingSkeleton/LoadingSkeleton';
import { translate } from '../../utils/translate';
import PiaInlineAnswer from '../PiaInlineAnswer/PiaInlineAnswer';
import PiaModal from '../PiaConversation/PiaModal';
import PiaConversation from '../PiaConversation/PiaConversation';
export default function CioPia(props) {
    const { apiKey, itemId, threadId, variationId, cioClient, displayConfigs, componentOverrides, callbacks, formatters, children, translations, suggestedQuestionsParameters, } = props;
    const { learnMoreUrl, showFeedback, mode = 'default', type = 'inline', showPreviousItems, disclaimerPosition = 'bottom', } = displayConfigs || {};
    const isConversation = mode === 'conversation' || type === 'modal';
    const pia = useCioPia({
        apiKey,
        itemId,
        threadId,
        variationId,
        cioClient,
        suggestedQuestionsParameters,
        formatImageUrl: formatters?.formatImageUrl,
    });
    const { currentQuestion, displayedQuestions, conversationHistory, currentAnswer, currentItems, isLoading, error, context, handleSubmitQuestion, handleQuestionClick, handleInputFocus, resetState, } = useConversation({ pia, itemId, isConversation, callbacks });
    const { containerRef } = useViewportCallbacks({ callbacks, context });
    const renderProps = {
        items: currentItems,
        isLoading,
        error,
        currentAnswer,
        currentQuestion,
        displayedQuestions,
        handleSubmitQuestion,
        conversationHistory,
    };
    const conversationHistoryProps = {
        conversationHistory,
        isLoading,
        error,
        currentItems,
        showFeedback,
        showPreviousItems,
        learnMoreUrl,
        disclaimerPosition,
        translations,
        callbacks,
        componentOverrides,
        displayedQuestions,
        handleSubmitQuestion,
        handleQuestionClick,
        containerRef,
        onInputFocus: handleInputFocus,
    };
    if (type === 'modal') {
        return (React.createElement(PiaModal, { initialQuestions: pia.suggestedQuestions.data, handleSubmitQuestion: handleSubmitQuestion, handleQuestionClick: handleQuestionClick, containerRef: containerRef, isLoading: isLoading, componentOverrides: componentOverrides, translations: translations, onInputFocus: handleInputFocus, onClose: resetState },
            React.createElement(PiaConversation, { ...conversationHistoryProps })));
    }
    if (isConversation)
        return React.createElement(PiaConversation, { ...conversationHistoryProps });
    // Default inline mode
    return (React.createElement("div", { ref: containerRef, className: 'cio-pia-container', "data-testid": 'cio-pia-container' },
        React.createElement(RenderPropsWrapper, { props: renderProps, override: children || componentOverrides?.reactNode },
            React.createElement("p", { className: 'cio-pia-title', "data-testid": 'cio-pia-title' }, translate('Any questions about this product?', translations)),
            React.createElement(Input, { onSubmit: handleSubmitQuestion, onFocus: handleInputFocus, value: currentQuestion, translations: translations }),
            isLoading && React.createElement(LoadingSkeleton, null),
            !isLoading && error && React.createElement(ErrorBlock, { message: error?.message || 'Unexpected error' }),
            !isLoading && !error && (React.createElement(React.Fragment, null,
                currentAnswer && (React.createElement(PiaInlineAnswer, { currentAnswer: currentAnswer, currentItems: currentItems, showFeedback: showFeedback, learnMoreUrl: learnMoreUrl, disclaimerPosition: disclaimerPosition, translations: translations, callbacks: callbacks, componentOverrides: componentOverrides })),
                React.createElement(SuggestedQuestionsContainer, { questions: displayedQuestions, onQuestionClick: handleQuestionClick, componentOverride: componentOverrides?.suggestedQuestions }))))));
}
