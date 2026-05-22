"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useConversation({ pia, itemId, isConversation, callbacks, }) {
    var _a, _b, _c, _d;
    const { suggestedQuestions, answers, threadId } = pia;
    const { getAnswer } = answers;
    const context = (0, react_1.useMemo)(() => ({ itemId, threadId }), [itemId, threadId]);
    const [currentQuestion, setCurrentQuestion] = (0, react_1.useState)('');
    const [displayedQuestions, setDisplayedQuestions] = (0, react_1.useState)([]);
    const [conversationHistory, setConversationHistory] = (0, react_1.useState)([]);
    const entryIdRef = (0, react_1.useRef)(0);
    const prevAnswerValueRef = (0, react_1.useRef)((_a = answers.data) === null || _a === void 0 ? void 0 : _a.value);
    const callbacksRef = (0, react_1.useRef)(callbacks);
    const contextRef = (0, react_1.useRef)(context);
    const lastQuestionRef = (0, react_1.useRef)('');
    const lastSourceRef = (0, react_1.useRef)('user');
    (0, react_1.useEffect)(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);
    (0, react_1.useEffect)(() => {
        contextRef.current = context;
    }, [context]);
    const submitQuestion = (0, react_1.useCallback)((question, source) => {
        lastSourceRef.current = source;
        lastQuestionRef.current = question;
        setCurrentQuestion(question);
        getAnswer(question);
        if (isConversation) {
            entryIdRef.current += 1;
            const id = entryIdRef.current;
            setConversationHistory((prev) => [...prev, { id, question, answer: '', source }]);
        }
    }, [getAnswer, isConversation]);
    const handleSubmitQuestion = (0, react_1.useCallback)((question) => {
        var _a, _b;
        (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onQuestionSubmit) === null || _b === void 0 ? void 0 : _b.call(_a, question, contextRef.current, 'user');
        submitQuestion(question, 'user');
    }, [submitQuestion]);
    const handleQuestionClick = (0, react_1.useCallback)((question) => {
        var _a, _b;
        (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onQuestionSubmit) === null || _b === void 0 ? void 0 : _b.call(_a, question, contextRef.current, 'suggestion');
        submitQuestion(question, 'suggestion');
    }, [submitQuestion]);
    const handleInputFocus = (0, react_1.useCallback)(() => {
        var _a, _b;
        (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onFocus) === null || _b === void 0 ? void 0 : _b.call(_a, contextRef.current);
    }, []);
    const resetState = (0, react_1.useCallback)(() => {
        setCurrentQuestion('');
        setDisplayedQuestions(suggestedQuestions.data);
        setConversationHistory([]);
        prevAnswerValueRef.current = undefined;
    }, [suggestedQuestions.data]);
    (0, react_1.useEffect)(() => {
        setCurrentQuestion('');
        setDisplayedQuestions([]);
        setConversationHistory([]);
        prevAnswerValueRef.current = undefined;
    }, [itemId]);
    (0, react_1.useEffect)(() => {
        setDisplayedQuestions(suggestedQuestions.data);
    }, [suggestedQuestions.data]);
    (0, react_1.useEffect)(() => {
        var _a;
        if ((_a = answers.data) === null || _a === void 0 ? void 0 : _a.follow_up_questions)
            setDisplayedQuestions(answers.data.follow_up_questions);
    }, [answers.data]);
    (0, react_1.useEffect)(() => {
        var _a, _b, _c, _d, _e, _f;
        const answerValue = (_b = (_a = answers.data) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
        if (!answerValue)
            return;
        if (answerValue === prevAnswerValueRef.current)
            return;
        prevAnswerValueRef.current = answerValue;
        const answerThreadId = (_c = answers.data) === null || _c === void 0 ? void 0 : _c.thread_id;
        const qnaResultId = (_d = answers.data) === null || _d === void 0 ? void 0 : _d.qna_result_id;
        if (isConversation) {
            setConversationHistory((prev) => {
                var _a, _b;
                if (prev.length === 0)
                    return prev;
                const updated = [...prev];
                updated[updated.length - 1] = Object.assign(Object.assign({}, updated[updated.length - 1]), { answer: answerValue, items: answers.items, threadId: answerThreadId, qnaResultId });
                (_b = (_a = callbacksRef.current) === null || _a === void 0 ? void 0 : _a.onAnswer) === null || _b === void 0 ? void 0 : _b.call(_a, updated, contextRef.current);
                return updated;
            });
        }
        else {
            const entry = {
                id: entryIdRef.current,
                question: lastQuestionRef.current,
                answer: answerValue,
                source: lastSourceRef.current,
                items: answers.items,
                threadId: answerThreadId,
                qnaResultId,
            };
            (_f = (_e = callbacksRef.current) === null || _e === void 0 ? void 0 : _e.onAnswer) === null || _f === void 0 ? void 0 : _f.call(_e, [entry], contextRef.current);
        }
    }, [isConversation, answers.data, answers.items]);
    const currentAnswer = (_c = (_b = answers.data) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '';
    const currentItems = (_d = answers.items) !== null && _d !== void 0 ? _d : null;
    const error = answers.error || suggestedQuestions.error;
    const isLoading = answers.isLoading || suggestedQuestions.isLoading;
    return {
        currentQuestion,
        displayedQuestions,
        conversationHistory,
        currentAnswer,
        currentItems,
        isLoading,
        error,
        context,
        handleSubmitQuestion,
        handleQuestionClick,
        handleInputFocus,
        resetState,
    };
}
exports.default = useConversation;
