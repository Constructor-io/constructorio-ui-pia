import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
export default function useConversation({ pia, itemId, isConversation, callbacks, }) {
    const { suggestedQuestions, answers, threadId } = pia;
    const { getAnswer } = answers;
    const context = useMemo(() => ({ itemId, threadId }), [itemId, threadId]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [conversationHistory, setConversationHistory] = useState([]);
    const entryIdRef = useRef(0);
    const prevAnswerValueRef = useRef(answers.data?.value);
    const callbacksRef = useRef(callbacks);
    const contextRef = useRef(context);
    const lastQuestionRef = useRef('');
    const lastSourceRef = useRef('user');
    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);
    useEffect(() => {
        contextRef.current = context;
    }, [context]);
    const submitQuestion = useCallback((question, source) => {
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
    const handleSubmitQuestion = useCallback((question) => {
        callbacksRef.current?.onQuestionSubmit?.(question, contextRef.current, 'user');
        submitQuestion(question, 'user');
    }, [submitQuestion]);
    const handleQuestionClick = useCallback((question) => {
        callbacksRef.current?.onQuestionSubmit?.(question, contextRef.current, 'suggestion');
        submitQuestion(question, 'suggestion');
    }, [submitQuestion]);
    const handleInputFocus = useCallback(() => {
        callbacksRef.current?.onFocus?.(contextRef.current);
    }, []);
    const resetState = useCallback(() => {
        setCurrentQuestion('');
        setDisplayedQuestions(suggestedQuestions.data);
        setConversationHistory([]);
        prevAnswerValueRef.current = undefined;
    }, [suggestedQuestions.data]);
    useEffect(() => {
        setCurrentQuestion('');
        setDisplayedQuestions([]);
        setConversationHistory([]);
        prevAnswerValueRef.current = undefined;
    }, [itemId]);
    useEffect(() => {
        setDisplayedQuestions(suggestedQuestions.data);
    }, [suggestedQuestions.data]);
    useEffect(() => {
        if (answers.data?.follow_up_questions)
            setDisplayedQuestions(answers.data.follow_up_questions);
    }, [answers.data]);
    useEffect(() => {
        const answerValue = answers.data?.value ?? '';
        if (!answerValue)
            return;
        if (answerValue === prevAnswerValueRef.current)
            return;
        prevAnswerValueRef.current = answerValue;
        const answerThreadId = answers.data?.thread_id;
        const qnaResultId = answers.data?.qna_result_id;
        if (isConversation) {
            setConversationHistory((prev) => {
                if (prev.length === 0)
                    return prev;
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    answer: answerValue,
                    items: answers.items,
                    threadId: answerThreadId,
                    qnaResultId,
                };
                callbacksRef.current?.onAnswer?.(updated, contextRef.current);
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
            callbacksRef.current?.onAnswer?.([entry], contextRef.current);
        }
    }, [isConversation, answers.data, answers.items]);
    const currentAnswer = answers.data?.value ?? '';
    const currentItems = answers.items ?? null;
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
