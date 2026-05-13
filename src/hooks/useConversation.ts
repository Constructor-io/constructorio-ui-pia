import { useCallback, useEffect, useRef, useState } from 'react';
import { Callbacks, ConversationEntry, FeedbackType, Question, Item } from '../types';
import { UseCioPiaReturn } from './useCioPia';
import { UseTrackingReturn } from './useTracking';

export interface UseConversationProps {
  pia: UseCioPiaReturn;
  itemId: string;
  isConversation: boolean;
  callbacks?: Callbacks;
  tracking: UseTrackingReturn;
}

export interface ContainerClickProps {
  onClick: () => void;
}

export interface InputFocusProps {
  onFocus: () => void;
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
  containerClickProps: ContainerClickProps;
  inputFocusProps: InputFocusProps;
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
  const { suggestedQuestions, answers } = pia;
  const { getAnswer } = answers;

  // --- State ---

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  const entryIdRef = useRef(0);
  const prevAnswerValueRef = useRef(answers.data?.value);
  const currentQuestionRef = useRef(currentQuestion);
  const trackingRef = useRef(tracking);

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);

  // --- Handlers ---

  const submitQuestion = useCallback(
    (question: string) => {
      callbacks?.onQuestionSubmit?.(question);
      setCurrentQuestion(question);
      currentQuestionRef.current = question;
      getAnswer(question);

      if (isConversation) {
        entryIdRef.current += 1;
        const id = entryIdRef.current;
        setConversationHistory((prev) => [...prev, { id, question, answer: '' }]);
      }
    },
    [getAnswer, isConversation, callbacks],
  );

  const handleSubmitQuestion = useCallback(
    (question: string) => {
      trackingRef.current.trackQuestionSubmit(question);
      submitQuestion(question);
    },
    [submitQuestion],
  );

  const handleQuestionClick = useCallback(
    (question: string) => {
      trackingRef.current.trackQuestionClick(question);
      submitQuestion(question);
    },
    [submitQuestion],
  );

  const handleFeedback = useCallback(
    (type: FeedbackType) => {
      trackingRef.current.trackAnswerFeedback(type, answers.data?.qna_result_id);
    },
    [answers.data?.qna_result_id],
  );

  const resetState = useCallback(() => {
    setCurrentQuestion('');
    setDisplayedQuestions(suggestedQuestions.data);
    setConversationHistory([]);
    prevAnswerValueRef.current = undefined;
  }, [suggestedQuestions.data]);

  // --- Focus tracking ---

  const focusedRef = useRef(false);
  const clickedInsideRef = useRef(false);

  const handleContainerClick = useCallback(() => {
    clickedInsideRef.current = true;
  }, []);

  const handleInputFocus = useCallback(() => {
    if (!focusedRef.current) {
      focusedRef.current = true;
      trackingRef.current.trackFocus();
    }
  }, []);

  // Reset focus state when user clicks outside the container
  useEffect(() => {
    const onDocumentClick = () => {
      if (clickedInsideRef.current) {
        clickedInsideRef.current = false;
        return;
      }
      focusedRef.current = false;
    };
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, []);

  const containerClickProps: ContainerClickProps = {
    onClick: handleContainerClick,
  };

  const inputFocusProps: InputFocusProps = {
    onFocus: handleInputFocus,
  };

  // --- Effects ---

  // Reset all state when the product changes
  useEffect(() => {
    setCurrentQuestion('');
    setDisplayedQuestions([]);
    setConversationHistory([]);
    prevAnswerValueRef.current = undefined;
    focusedRef.current = false;
  }, [itemId]);

  // Sync displayed questions from API
  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  // Replace displayed questions with follow-ups and track answer view
  useEffect(() => {
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
    if (answers.data && currentQuestionRef.current) {
      trackingRef.current.trackAnswerView(currentQuestionRef.current, answers.data);
    }
  }, [answers.data]);

  // Sync answer and items into the latest conversation history entry
  useEffect(() => {
    const answerValue = answers.data?.value ?? '';
    if (!isConversation || !answerValue) return;
    if (answerValue === prevAnswerValueRef.current) return;
    prevAnswerValueRef.current = answerValue;
    setConversationHistory((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        answer: answerValue,
        items: answers.items,
      };
      return updated;
    });
  }, [isConversation, answers.data, answers.items]);

  // --- Derived values ---

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
    containerClickProps,
    inputFocusProps,
    handleFeedback,
    resetState,
  };
}
