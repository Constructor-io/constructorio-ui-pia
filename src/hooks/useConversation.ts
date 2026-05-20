import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Callbacks,
  ConversationEntry,
  PiaCallbackContext,
  Question,
  QuestionSource,
  Item,
} from '../types';
import { UseCioPiaReturn } from './useCioPia';

export interface UseConversationProps {
  pia: UseCioPiaReturn;
  itemId: string;
  isConversation: boolean;
  callbacks?: Callbacks;
}

export interface UseConversationReturn {
  currentQuestion: string;
  displayedQuestions: Question[];
  conversationHistory: ConversationEntry[];
  currentAnswer: string;
  currentItems: Item[] | null;
  isLoading: boolean;
  error: Error | null;
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick: (question: string) => void;
  handleInputFocus: () => void;
  resetState: () => void;
}

export default function useConversation({
  pia,
  itemId,
  isConversation,
  callbacks,
}: UseConversationProps): UseConversationReturn {
  const { suggestedQuestions, answers, threadId } = pia;
  const { getAnswer } = answers;

  const context: PiaCallbackContext = useMemo(() => ({ itemId, threadId }), [itemId, threadId]);

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  const entryIdRef = useRef(0);
  const prevAnswerValueRef = useRef(answers.data?.value);
  const callbacksRef = useRef(callbacks);
  const contextRef = useRef(context);
  const pendingOnAnswerRef = useRef(false);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const lastSourceRef = useRef<QuestionSource>('user');

  const submitQuestion = useCallback(
    (question: string, source: QuestionSource) => {
      lastSourceRef.current = source;
      setCurrentQuestion(question);
      getAnswer(question);

      if (isConversation) {
        entryIdRef.current += 1;
        const id = entryIdRef.current;
        setConversationHistory((prev) => [...prev, { id, question, answer: '', source }]);
      }
    },
    [getAnswer, isConversation],
  );

  const handleSubmitQuestion = useCallback(
    (question: string) => {
      callbacksRef.current?.onQuestionSubmit?.(question, context, 'user');
      submitQuestion(question, 'user');
    },
    [submitQuestion, context],
  );

  const handleQuestionClick = useCallback(
    (question: string) => {
      callbacksRef.current?.onQuestionSubmit?.(question, context, 'suggestion');
      submitQuestion(question, 'suggestion');
    },
    [submitQuestion, context],
  );

  const handleInputFocus = useCallback(() => {
    callbacksRef.current?.onFocus?.(context);
  }, [context]);

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
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  useEffect(() => {
    const answerValue = answers.data?.value ?? '';
    if (!answerValue) return;
    if (answerValue === prevAnswerValueRef.current) return;
    prevAnswerValueRef.current = answerValue;

    const threadId = answers.data?.thread_id;
    const qnaResultId = answers.data?.qna_result_id;

    if (isConversation) {
      setConversationHistory((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: answerValue,
          items: answers.items,
          threadId,
          qnaResultId,
        };
        return updated;
      });
      pendingOnAnswerRef.current = true;
    } else {
      const entry: ConversationEntry = {
        id: entryIdRef.current,
        question: currentQuestion,
        answer: answerValue,
        source: lastSourceRef.current,
        items: answers.items,
        threadId,
        qnaResultId,
      };
      callbacksRef.current?.onAnswer?.([entry], contextRef.current);
    }
  }, [isConversation, answers.data, answers.items, currentQuestion]);

  useEffect(() => {
    if (!pendingOnAnswerRef.current || conversationHistory.length === 0) return;
    const lastEntry = conversationHistory[conversationHistory.length - 1];
    if (!lastEntry.answer) return;
    pendingOnAnswerRef.current = false;
    callbacksRef.current?.onAnswer?.(conversationHistory, contextRef.current);
  }, [conversationHistory]);

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
    handleSubmitQuestion,
    handleQuestionClick,
    handleInputFocus,
    resetState,
  };
}
