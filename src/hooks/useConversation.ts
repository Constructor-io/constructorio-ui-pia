import { useCallback, useEffect, useRef, useState } from 'react';
import { ConversationEntry, Question, Item } from '../types';
import { UseCioPiaReturn } from './useCioPia';

export interface UseConversationProps {
  pia: UseCioPiaReturn;
  itemId: string;
  isConversation: boolean;
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
  resetState: () => void;
}

export default function useConversation({
  pia,
  itemId,
  isConversation,
}: UseConversationProps): UseConversationReturn {
  const { suggestedQuestions, answers } = pia;
  const { getAnswer } = answers;

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  const entryIdRef = useRef(0);
  const prevAnswerValueRef = useRef(answers.data?.value);

  const handleSubmitQuestion = useCallback(
    (question: string) => {
      setCurrentQuestion(question);
      getAnswer(question);

      if (isConversation) {
        entryIdRef.current += 1;
        const id = entryIdRef.current;
        setConversationHistory((prev) => [...prev, { id, question, answer: '' }]);
      }
    },
    [getAnswer, isConversation],
  );

  const resetState = useCallback(() => {
    setCurrentQuestion('');
    setDisplayedQuestions(suggestedQuestions.data);
    setConversationHistory([]);
    prevAnswerValueRef.current = undefined;
  }, [suggestedQuestions.data]);

  // Reset all state when itemId changes
  useEffect(() => {
    setCurrentQuestion('');
    setDisplayedQuestions([]);
    setConversationHistory([]);
    prevAnswerValueRef.current = undefined;
  }, [itemId]);

  // Sync initial suggested questions
  useEffect(() => {
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  // Sync follow-up questions from answer response
  useEffect(() => {
    if (answers.data?.follow_up_questions) setDisplayedQuestions(answers.data.follow_up_questions);
  }, [answers.data]);

  // Sync answer data into conversation history
  useEffect(() => {
    const answerValue = answers.data?.value ?? '';
    if (!isConversation || conversationHistory.length === 0 || !answerValue) return;
    if (answerValue === prevAnswerValueRef.current) return;
    prevAnswerValueRef.current = answerValue;
    setConversationHistory((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        answer: answerValue,
      };
      return updated;
    });
  }, [isConversation, conversationHistory.length, answers.data]);

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
    resetState,
  };
}
