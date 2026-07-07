import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Callbacks,
  ConversationEntry,
  FeedbackType,
  PiaCallbackContext,
  Question,
  QuestionSource,
  Item,
} from '../types';
import { UseCioPiaReturn } from './useCioPia';
import { UseTrackingReturn } from './useTracking';

export interface UseConversationProps {
  pia: UseCioPiaReturn;
  itemId: string;
  isConversation: boolean;
  callbacks?: Callbacks;
  tracking?: UseTrackingReturn;
}

export interface UseConversationReturn {
  currentQuestion: string;
  displayedQuestions: Question[];
  conversationHistory: ConversationEntry[];
  currentAnswer: string;
  currentItems: Item[] | null;
  isLoading: boolean;
  error: Error | null;
  context: PiaCallbackContext;
  handleSubmitQuestion: (question: string) => void;
  handleQuestionClick: (question: string) => void;
  handleInputFocus: () => void;
  handleFeedback: (type: FeedbackType) => void;
  resetState: () => void;
}

export default function useConversation({
  pia,
  itemId,
  isConversation,
  callbacks,
  tracking,
}: UseConversationProps): UseConversationReturn {
  const { suggestedQuestions, answers, threadId } = pia;
  const { getAnswer } = answers;

  const context: PiaCallbackContext = useMemo(() => ({ itemId, threadId }), [itemId, threadId]);

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  const entryIdRef = useRef(0);
  const prevAnswerValueRef = useRef(answers.data?.value);
  const trackedAnswerIdRef = useRef<string | undefined>(undefined);
  const answersRef = useRef(answers);
  const callbacksRef = useRef(callbacks);
  const contextRef = useRef(context);
  const trackingRef = useRef(tracking);
  const lastQuestionRef = useRef<string>('');
  const lastSourceRef = useRef<QuestionSource>('user');

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const submitQuestion = useCallback(
    (question: string, source: QuestionSource) => {
      lastSourceRef.current = source;
      lastQuestionRef.current = question;
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
      trackingRef.current?.trackQuestionSubmit(question);
      callbacksRef.current?.onQuestionSubmit?.(question, contextRef.current, 'user');
      submitQuestion(question, 'user');
    },
    [submitQuestion],
  );

  const handleQuestionClick = useCallback(
    (question: string) => {
      trackingRef.current?.trackQuestionClick(question);
      callbacksRef.current?.onQuestionSubmit?.(question, contextRef.current, 'suggestion');
      submitQuestion(question, 'suggestion');
    },
    [submitQuestion],
  );

  const handleInputFocus = useCallback(() => {
    trackingRef.current?.trackFocus();
    callbacksRef.current?.onFocus?.(contextRef.current);
  }, []);

  const handleFeedback = useCallback((type: FeedbackType) => {
    trackingRef.current?.trackAnswerFeedback(type, answersRef.current.data?.qna_result_id);
    callbacksRef.current?.onFeedback?.(type);
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
    const qnaResultId = answers.data?.qna_result_id;
    if (answers.data && lastQuestionRef.current && qnaResultId !== trackedAnswerIdRef.current) {
      trackedAnswerIdRef.current = qnaResultId;
      trackingRef.current?.trackAnswerView(lastQuestionRef.current, answers.data, answers.items);
    }
  }, [answers.data, answers.items]);

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
    handleFeedback,
    resetState,
  };
}
