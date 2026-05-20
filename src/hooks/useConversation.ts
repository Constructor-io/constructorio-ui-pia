import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Callbacks,
  ConversationEntry,
  GetAnswerResultsResponse,
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
  currentSource: QuestionSource;
  displayedQuestions: Question[];
  conversationHistory: ConversationEntry[];
  currentAnswer: string;
  currentResponse: GetAnswerResultsResponse | null;
  currentItems: Item[] | null;
  isLoading: boolean;
  error: Error | null;
  context: PiaCallbackContext;
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
  const [currentSource, setCurrentSource] = useState<QuestionSource>('user');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  const entryIdRef = useRef(0);
  const prevAnswerValueRef = useRef(answers.data?.value);
  const callbacksRef = useRef(callbacks);
  const contextRef = useRef(context);
  const lastQuestionRef = useRef<string>('');
  const lastSourceRef = useRef<QuestionSource>('user');

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const submitQuestion = useCallback(
    (question: string, source: QuestionSource) => {
      lastSourceRef.current = source;
      lastQuestionRef.current = question;
      setCurrentQuestion(question);
      setCurrentSource(source);
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
      callbacksRef.current?.onQuestionSubmit?.(question, contextRef.current, 'user');
      submitQuestion(question, 'user');
    },
    [submitQuestion],
  );

  const handleQuestionClick = useCallback(
    (question: string) => {
      callbacksRef.current?.onQuestionSubmit?.(question, contextRef.current, 'suggestion');
      submitQuestion(question, 'suggestion');
    },
    [submitQuestion],
  );

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
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  useEffect(() => {
    const answerValue = answers.data?.value ?? '';
    if (!answerValue) return;
    if (answerValue === prevAnswerValueRef.current) return;
    prevAnswerValueRef.current = answerValue;

    const answerThreadId = answers.data?.thread_id;
    const qnaResultId = answers.data?.qna_result_id;

    if (isConversation) {
      setConversationHistory((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: answerValue,
          items: answers.items,
          response: answers.data,
          threadId: answerThreadId,
          qnaResultId,
        };
        callbacksRef.current?.onAnswer?.(updated, contextRef.current);
        return updated;
      });
    } else {
      const entry: ConversationEntry = {
        id: entryIdRef.current,
        question: lastQuestionRef.current,
        answer: answerValue,
        source: lastSourceRef.current,
        items: answers.items,
        response: answers.data,
        threadId: answerThreadId,
        qnaResultId,
      };
      callbacksRef.current?.onAnswer?.([entry], contextRef.current);
    }
  }, [isConversation, answers.data, answers.items]);

  const currentAnswer = answers.data?.value ?? '';
  const currentResponse = answers.data ?? null;
  const currentItems = answers.items ?? null;
  const error = answers.error || suggestedQuestions.error;
  const isLoading = answers.isLoading || suggestedQuestions.isLoading;

  return {
    currentQuestion,
    currentSource,
    displayedQuestions,
    conversationHistory,
    currentAnswer,
    currentResponse,
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
