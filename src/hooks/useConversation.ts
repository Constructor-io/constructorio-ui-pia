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
  /**
   * Entries to show before the first question, read once on mount. Ignored outside
   * conversation mode, which has no history to show them in.
   */
  initialConversationHistory?: ConversationEntry[];
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
  initialConversationHistory,
}: UseConversationProps): UseConversationReturn {
  const { suggestedQuestions, answers, threadId } = pia;
  const { getAnswer } = answers;

  const context: PiaCallbackContext = useMemo(() => ({ itemId, threadId }), [itemId, threadId]);

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>(() =>
    isConversation && initialConversationHistory ? [...initialConversationHistory] : [],
  );

  // Continue numbering after the seeded entries: `id` is the React key.
  const [lastSeededId] = useState(() =>
    conversationHistory.reduce(
      (max, entry) => (Number.isFinite(entry.id) ? Math.max(max, entry.id) : max),
      0,
    ),
  );
  const entryIdRef = useRef(lastSeededId);
  const conversationHistoryRef = useRef(conversationHistory);
  const prevItemIdRef = useRef(itemId);
  const prevAnswerDataRef = useRef(answers.data);
  const hasTrackedCurrentAnswerRef = useRef(false);
  const answersRef = useRef(answers);
  const callbacksRef = useRef(callbacks);
  const contextRef = useRef(context);
  const trackingRef = useRef(tracking);
  const lastQuestionRef = useRef<string>('');
  const lastSourceRef = useRef<QuestionSource>('user');
  // Set once an answer owns the question row, so a later suggested-questions
  // response cannot take it back.
  const showsFollowUpsRef = useRef(false);

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

  useEffect(() => {
    conversationHistoryRef.current = conversationHistory;
  }, [conversationHistory]);

  const submitQuestion = useCallback(
    (question: string, source: QuestionSource) => {
      lastSourceRef.current = source;
      lastQuestionRef.current = question;
      hasTrackedCurrentAnswerRef.current = false;
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
    // A seeded last entry has no live response behind it; its own id is the answer rated.
    const history = conversationHistoryRef.current;
    const qnaResultId =
      answersRef.current.data?.qna_result_id ?? history[history.length - 1]?.qnaResultId;
    trackingRef.current?.trackAnswerFeedback(type, qnaResultId);
    callbacksRef.current?.onFeedback?.(type);
  }, []);

  const resetState = useCallback(() => {
    setCurrentQuestion('');
    setDisplayedQuestions(suggestedQuestions.data);
    setConversationHistory([]);
    prevAnswerDataRef.current = null;
    showsFollowUpsRef.current = false;
  }, [suggestedQuestions.data]);

  useEffect(() => {
    // Skip the mount run: it would wipe the seeded history.
    if (prevItemIdRef.current === itemId) return;
    prevItemIdRef.current = itemId;
    setCurrentQuestion('');
    setDisplayedQuestions([]);
    setConversationHistory([]);
    prevAnswerDataRef.current = null;
    showsFollowUpsRef.current = false;
  }, [itemId]);

  useEffect(() => {
    // The ref, not `answers.data`, which outlives the item it answered.
    if (showsFollowUpsRef.current) return;
    setDisplayedQuestions(suggestedQuestions.data);
  }, [suggestedQuestions.data]);

  useEffect(() => {
    if (answers.data) {
      // An answer with no follow-ups empties the row: the pre-generated questions
      // include the one just asked.
      setDisplayedQuestions(answers.data.follow_up_questions ?? []);
      showsFollowUpsRef.current = true;
    }
    if (answers.data && lastQuestionRef.current && !hasTrackedCurrentAnswerRef.current) {
      hasTrackedCurrentAnswerRef.current = true;
      trackingRef.current?.trackAnswerView(lastQuestionRef.current, answers.data, answers.items);
    }
  }, [answers.data, answers.items]);

  useEffect(() => {
    const answerValue = answers.data?.value ?? '';
    if (!answerValue) return;
    // Compare by response object, not by text: two consecutive answers with
    // identical text are still two answers and both must reach the history.
    if (answers.data === prevAnswerDataRef.current) return;
    prevAnswerDataRef.current = answers.data;

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
