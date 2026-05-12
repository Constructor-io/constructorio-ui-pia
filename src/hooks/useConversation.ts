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

export interface ContainerFocusProps {
  onClick: () => void;
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
  containerFocusProps: ContainerFocusProps;
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

  // --- Handlers ---

  const handleSubmitQuestion = useCallback(
    (question: string) => {
      callbacks?.onQuestionSubmit?.(question);
      setCurrentQuestion(question);
      currentQuestionRef.current = question;
      getAnswer(question);
      tracking.trackQuestionSubmit(question);

      if (isConversation) {
        entryIdRef.current += 1;
        const id = entryIdRef.current;
        setConversationHistory((prev) => [...prev, { id, question, answer: '' }]);
      }
    },
    [getAnswer, isConversation, callbacks, tracking],
  );

  const handleQuestionClick = useCallback(
    (question: string) => {
      tracking.trackQuestionClick(question);
      handleSubmitQuestion(question);
    },
    [tracking, handleSubmitQuestion],
  );

  const handleFeedback = useCallback(
    (type: FeedbackType) => {
      tracking.trackAnswerFeedback(type, answers.data?.qna_result_id);
    },
    [tracking, answers.data?.qna_result_id],
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
    if (!focusedRef.current) {
      focusedRef.current = true;
      tracking.trackFocus();
    }
  }, [tracking]);

  // Reset focus state when user clicks outside the container
  // Implemented in such a manner to not cause multiple focus events
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

  const containerFocusProps: ContainerFocusProps = {
    onClick: handleContainerClick,
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

  // Sync displayed questions from API and track initial view
  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
    if (suggestedQuestions.data.length > 0) {
      tracking.trackView(suggestedQuestions.data);
    }
  }, [suggestedQuestions.data, tracking]);

  // Replace displayed questions with follow-ups and track answer view
  useEffect(() => {
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
    if (answers.data && currentQuestionRef.current) {
      tracking.trackAnswerView(currentQuestionRef.current, answers.data);
    }
  }, [answers.data, tracking]);

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
    containerFocusProps,
    handleFeedback,
    resetState,
  };
}
