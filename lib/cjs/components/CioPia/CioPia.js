"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const constructorio_ui_components_1 = require("@constructor-io/constructorio-ui-components");
const Input_1 = tslib_1.__importDefault(require("../Input/Input"));
const SuggestedQuestionsContainer_1 = tslib_1.__importDefault(require("../SuggestedQuestionsContainer/SuggestedQuestionsContainer"));
const useCioPia_1 = tslib_1.__importDefault(require("../../hooks/useCioPia"));
const useConversation_1 = tslib_1.__importDefault(require("../../hooks/useConversation"));
const useViewportCallbacks_1 = tslib_1.__importDefault(require("../../hooks/useViewportCallbacks"));
const ErrorBlock_1 = tslib_1.__importDefault(require("../Error/ErrorBlock"));
const LoadingSkeleton_1 = tslib_1.__importDefault(require("../LoadingSkeleton/LoadingSkeleton"));
const translate_1 = require("../../utils/translate");
const PiaInlineAnswer_1 = tslib_1.__importDefault(require("../PiaInlineAnswer/PiaInlineAnswer"));
const PiaModal_1 = tslib_1.__importDefault(require("../PiaConversation/PiaModal"));
const PiaConversation_1 = tslib_1.__importDefault(require("../PiaConversation/PiaConversation"));
function CioPia(props) {
    const { apiKey, itemId, threadId, variationId, cioClient, displayConfigs, componentOverrides, callbacks, formatters, children, translations, suggestedQuestionsParameters, } = props;
    const { learnMoreUrl, showFeedback, mode = 'default', type = 'inline', showPreviousItems, disclaimerPosition = 'bottom', } = displayConfigs || {};
    const isConversation = mode === 'conversation' || type === 'modal';
    const pia = (0, useCioPia_1.default)({
        apiKey,
        itemId,
        threadId,
        variationId,
        cioClient,
        suggestedQuestionsParameters,
        formatImageUrl: formatters === null || formatters === void 0 ? void 0 : formatters.formatImageUrl,
    });
    const { currentQuestion, displayedQuestions, conversationHistory, currentAnswer, currentItems, isLoading, error, context, handleSubmitQuestion, handleQuestionClick, handleInputFocus, resetState, } = (0, useConversation_1.default)({ pia, itemId, isConversation, callbacks });
    const { containerRef } = (0, useViewportCallbacks_1.default)({ callbacks, context });
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
        return (react_1.default.createElement(PiaModal_1.default, { initialQuestions: pia.suggestedQuestions.data, handleSubmitQuestion: handleSubmitQuestion, handleQuestionClick: handleQuestionClick, containerRef: containerRef, isLoading: isLoading, componentOverrides: componentOverrides, translations: translations, onInputFocus: handleInputFocus, onClose: resetState },
            react_1.default.createElement(PiaConversation_1.default, Object.assign({}, conversationHistoryProps))));
    }
    if (isConversation)
        return react_1.default.createElement(PiaConversation_1.default, Object.assign({}, conversationHistoryProps));
    // Default inline mode
    return (react_1.default.createElement("div", { ref: containerRef, className: 'cio-pia-container', "data-testid": 'cio-pia-container' },
        react_1.default.createElement(constructorio_ui_components_1.RenderPropsWrapper, { props: renderProps, override: children || (componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.reactNode) },
            react_1.default.createElement("p", { className: 'cio-pia-title', "data-testid": 'cio-pia-title' }, (0, translate_1.translate)('Any questions about this product?', translations)),
            react_1.default.createElement(Input_1.default, { onSubmit: handleSubmitQuestion, onFocus: handleInputFocus, value: currentQuestion, translations: translations }),
            isLoading && react_1.default.createElement(LoadingSkeleton_1.default, null),
            !isLoading && error && react_1.default.createElement(ErrorBlock_1.default, { message: (error === null || error === void 0 ? void 0 : error.message) || 'Unexpected error' }),
            !isLoading && !error && (react_1.default.createElement(react_1.default.Fragment, null,
                currentAnswer && (react_1.default.createElement(PiaInlineAnswer_1.default, { currentAnswer: currentAnswer, currentItems: currentItems, showFeedback: showFeedback, learnMoreUrl: learnMoreUrl, disclaimerPosition: disclaimerPosition, translations: translations, callbacks: callbacks, componentOverrides: componentOverrides })),
                react_1.default.createElement(SuggestedQuestionsContainer_1.default, { questions: displayedQuestions, onQuestionClick: handleQuestionClick, componentOverride: componentOverrides === null || componentOverrides === void 0 ? void 0 : componentOverrides.suggestedQuestions }))))));
}
exports.default = CioPia;
