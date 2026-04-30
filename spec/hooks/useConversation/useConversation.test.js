import { renderHook, act } from '@testing-library/react';
import useConversation from '../../../src/hooks/useConversation';

describe('Testing Hook: useConversation', () => {
  const testQuestions = [
    { value: 'Mock question 1' },
    { value: 'Mock question 2' },
    { value: 'Mock question 3' },
  ];

  const followUpQuestions = [{ value: 'Follow-up question 1' }, { value: 'Follow-up question 2' }];

  const mockAnswerValue = 'Sample answer to the given question';

  function createMockPia(overrides = {}) {
    return {
      suggestedQuestions: {
        data: [],
        isLoading: false,
        error: null,
        getSuggestedQuestions: jest.fn(),
        ...overrides.suggestedQuestions,
      },
      answers: {
        data: null,
        items: null,
        isLoading: false,
        error: null,
        getAnswer: jest.fn(),
        ...overrides.answers,
      },
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.currentQuestion).toBe('');
    expect(result.current.displayedQuestions).toEqual([]);
    expect(result.current.conversationHistory).toEqual([]);
    expect(result.current.currentAnswer).toBe('');
    expect(result.current.currentItems).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls getAnswer and sets currentQuestion on handleSubmitQuestion', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    act(() => {
      result.current.handleSubmitQuestion('What is this product?');
    });

    expect(pia.answers.getAnswer).toHaveBeenCalledWith('What is this product?');
    expect(result.current.currentQuestion).toBe('What is this product?');
  });

  it('does not append to conversationHistory in default mode', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    act(() => {
      result.current.handleSubmitQuestion('What is this product?');
    });

    expect(result.current.conversationHistory).toEqual([]);
  });

  it('appends to conversationHistory in conversation mode', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: true }),
    );

    act(() => {
      result.current.handleSubmitQuestion('What is this product?');
    });

    expect(result.current.conversationHistory).toEqual([
      { id: 1, question: 'What is this product?', answer: '' },
    ]);
  });

  it('appends multiple entries to conversationHistory', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: true }),
    );

    act(() => {
      result.current.handleSubmitQuestion('First question');
    });
    act(() => {
      result.current.handleSubmitQuestion('Second question');
    });

    expect(result.current.conversationHistory).toHaveLength(2);
    expect(result.current.conversationHistory[0].question).toBe('First question');
    expect(result.current.conversationHistory[1].question).toBe('Second question');
    expect(result.current.conversationHistory[0].id).toBe(1);
    expect(result.current.conversationHistory[1].id).toBe(2);
  });

  it('syncs displayedQuestions from suggestedQuestions.data', () => {
    const pia = createMockPia({
      suggestedQuestions: { data: testQuestions },
    });

    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.displayedQuestions).toEqual(testQuestions);
  });

  it('updates displayedQuestions when suggestedQuestions.data changes', () => {
    let pia = createMockPia({
      suggestedQuestions: { data: testQuestions },
    });

    const { result, rerender } = renderHook((props) => useConversation(props), {
      initialProps: { pia, itemId: 'test-item', isConversation: false },
    });

    expect(result.current.displayedQuestions).toEqual(testQuestions);

    const newQuestions = [{ value: 'New question 1' }];
    pia = createMockPia({
      suggestedQuestions: { data: newQuestions },
    });

    rerender({ pia, itemId: 'test-item', isConversation: false });

    expect(result.current.displayedQuestions).toEqual(newQuestions);
  });

  it('updates displayedQuestions from follow_up_questions in answer data', () => {
    const pia = createMockPia({
      suggestedQuestions: { data: testQuestions },
      answers: {
        data: { value: mockAnswerValue, follow_up_questions: followUpQuestions },
      },
    });

    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.displayedQuestions).toEqual(followUpQuestions);
  });

  it('derives currentAnswer from answers.data.value', () => {
    const pia = createMockPia({
      answers: { data: { value: mockAnswerValue } },
    });

    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.currentAnswer).toBe(mockAnswerValue);
  });

  it('returns empty string for currentAnswer when answers.data is null', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.currentAnswer).toBe('');
  });

  it('derives currentItems from answers.items', () => {
    const mockItems = [{ itemName: 'Product 1' }];
    const pia = createMockPia({
      answers: { items: mockItems },
    });

    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.currentItems).toEqual(mockItems);
  });

  it('returns null for currentItems when answers.items is null', () => {
    const pia = createMockPia();
    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );

    expect(result.current.currentItems).toBeNull();
  });

  it('derives isLoading from answers or suggestedQuestions loading state', () => {
    const piaAnswersLoading = createMockPia({
      answers: { isLoading: true },
    });

    const { result: result1 } = renderHook(() =>
      useConversation({ pia: piaAnswersLoading, itemId: 'test-item', isConversation: false }),
    );
    expect(result1.current.isLoading).toBe(true);

    const piaSuggestionsLoading = createMockPia({
      suggestedQuestions: { isLoading: true },
    });

    const { result: result2 } = renderHook(() =>
      useConversation({ pia: piaSuggestionsLoading, itemId: 'test-item', isConversation: false }),
    );
    expect(result2.current.isLoading).toBe(true);
  });

  it('derives error from answers or suggestedQuestions error', () => {
    const answersError = new Error('Answer error');
    const piaAnswersError = createMockPia({
      answers: { error: answersError },
    });

    const { result: result1 } = renderHook(() =>
      useConversation({ pia: piaAnswersError, itemId: 'test-item', isConversation: false }),
    );
    expect(result1.current.error).toBe(answersError);

    const suggestionsError = new Error('Suggestions error');
    const piaSuggestionsError = createMockPia({
      suggestedQuestions: { error: suggestionsError },
    });

    const { result: result2 } = renderHook(() =>
      useConversation({ pia: piaSuggestionsError, itemId: 'test-item', isConversation: false }),
    );
    expect(result2.current.error).toBe(suggestionsError);
  });

  it('prioritizes answers.error over suggestedQuestions.error', () => {
    const answersError = new Error('Answer error');
    const suggestionsError = new Error('Suggestions error');
    const pia = createMockPia({
      answers: { error: answersError },
      suggestedQuestions: { error: suggestionsError },
    });

    const { result } = renderHook(() =>
      useConversation({ pia, itemId: 'test-item', isConversation: false }),
    );
    expect(result.current.error).toBe(answersError);
  });

  describe('conversation history syncing', () => {
    it('syncs answer value into the latest conversation entry', () => {
      const getAnswer = jest.fn();
      let pia = createMockPia({ answers: { getAnswer } });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: true },
      });

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      expect(result.current.conversationHistory[0].answer).toBe('');

      // Simulate answer arriving
      pia = createMockPia({
        answers: { getAnswer, data: { value: mockAnswerValue } },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      expect(result.current.conversationHistory[0].answer).toBe(mockAnswerValue);
    });

    it('does not sync answer into history when not in conversation mode', () => {
      const getAnswer = jest.fn();
      let pia = createMockPia({ answers: { getAnswer } });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: false },
      });

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      pia = createMockPia({
        answers: { getAnswer, data: { value: mockAnswerValue } },
      });
      rerender({ pia, itemId: 'test-item', isConversation: false });

      expect(result.current.conversationHistory).toEqual([]);
    });

    it('does not sync when answer value has not changed', () => {
      const getAnswer = jest.fn();
      let pia = createMockPia({
        answers: { getAnswer, data: { value: mockAnswerValue } },
      });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: true },
      });

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      // First sync
      rerender({ pia, itemId: 'test-item', isConversation: true });
      const historyAfterFirst = result.current.conversationHistory;

      // Re-render with same answer value
      pia = createMockPia({
        answers: { getAnswer, data: { value: mockAnswerValue } },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      // Should be the same reference (no unnecessary update)
      expect(result.current.conversationHistory).toEqual(historyAfterFirst);
    });

    it('updates only the last entry when multiple questions are asked', () => {
      const getAnswer = jest.fn();
      let pia = createMockPia({ answers: { getAnswer } });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: true },
      });

      act(() => {
        result.current.handleSubmitQuestion('First question');
      });

      // First answer arrives
      pia = createMockPia({
        answers: { getAnswer, data: { value: 'First answer' } },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      act(() => {
        result.current.handleSubmitQuestion('Second question');
      });

      // Second answer arrives
      pia = createMockPia({
        answers: { getAnswer, data: { value: 'Second answer' } },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      expect(result.current.conversationHistory).toHaveLength(2);
      expect(result.current.conversationHistory[0].answer).toBe('First answer');
      expect(result.current.conversationHistory[1].answer).toBe('Second answer');
    });

    it('syncs items into the latest conversation entry alongside the answer', () => {
      const getAnswer = jest.fn();
      const mockItems = [{ id: 'p1', name: 'Product 1', price: 10 }];
      let pia = createMockPia({ answers: { getAnswer } });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: true },
      });

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      expect(result.current.conversationHistory[0].items).toBeUndefined();

      // Simulate answer with items arriving
      pia = createMockPia({
        answers: { getAnswer, data: { value: 'An answer' }, items: mockItems },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      expect(result.current.conversationHistory[0].answer).toBe('An answer');
      expect(result.current.conversationHistory[0].items).toEqual(mockItems);
    });

    it('preserves items from previous entries when new questions are asked', () => {
      const getAnswer = jest.fn();
      const firstItems = [{ id: 'pA', name: 'Product A', price: 10 }];
      const secondItems = [{ id: 'pB', name: 'Product B', price: 20 }];
      let pia = createMockPia({ answers: { getAnswer } });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: true },
      });

      // First question and answer with items
      act(() => {
        result.current.handleSubmitQuestion('First question');
      });
      pia = createMockPia({
        answers: { getAnswer, data: { value: 'First answer' }, items: firstItems },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      // Second question and answer with different items
      act(() => {
        result.current.handleSubmitQuestion('Second question');
      });
      pia = createMockPia({
        answers: { getAnswer, data: { value: 'Second answer' }, items: secondItems },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      expect(result.current.conversationHistory).toHaveLength(2);
      expect(result.current.conversationHistory[0].items).toEqual(firstItems);
      expect(result.current.conversationHistory[1].items).toEqual(secondItems);
    });

    it('stores null items when answer arrives with no items', () => {
      const getAnswer = jest.fn();
      let pia = createMockPia({ answers: { getAnswer } });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'test-item', isConversation: true },
      });

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      expect(result.current.conversationHistory[0].items).toBeUndefined();

      pia = createMockPia({
        answers: { getAnswer, data: { value: 'An answer' }, items: null },
      });
      rerender({ pia, itemId: 'test-item', isConversation: true });

      expect(result.current.conversationHistory[0].items).toBeNull();
    });
  });

  describe('resetState', () => {
    it('clears all state back to initial values', () => {
      const getAnswer = jest.fn();
      const pia = createMockPia({
        suggestedQuestions: { data: testQuestions },
        answers: { getAnswer },
      });

      const { result } = renderHook(() =>
        useConversation({ pia, itemId: 'test-item', isConversation: true }),
      );

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      expect(result.current.currentQuestion).toBe('What is this?');
      expect(result.current.conversationHistory).toHaveLength(1);

      act(() => {
        result.current.resetState();
      });

      expect(result.current.currentQuestion).toBe('');
      expect(result.current.conversationHistory).toEqual([]);
      expect(result.current.displayedQuestions).toEqual(testQuestions);
    });
  });

  describe('itemId changes', () => {
    it('resets all state when itemId changes', () => {
      const getAnswer = jest.fn();
      const pia = createMockPia({
        suggestedQuestions: { data: testQuestions },
        answers: { getAnswer },
      });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'item-1', isConversation: true },
      });

      act(() => {
        result.current.handleSubmitQuestion('What is this?');
      });

      expect(result.current.currentQuestion).toBe('What is this?');
      expect(result.current.conversationHistory).toHaveLength(1);

      // Change itemId
      rerender({ pia, itemId: 'item-2', isConversation: true });

      expect(result.current.currentQuestion).toBe('');
      expect(result.current.conversationHistory).toEqual([]);
    });

    it('re-syncs displayedQuestions after itemId reset', () => {
      const newQuestions = [{ value: 'New question for item 2' }];
      let pia = createMockPia({
        suggestedQuestions: { data: testQuestions },
      });

      const { result, rerender } = renderHook((props) => useConversation(props), {
        initialProps: { pia, itemId: 'item-1', isConversation: false },
      });

      expect(result.current.displayedQuestions).toEqual(testQuestions);

      // Simulate itemId change with new suggested questions
      pia = createMockPia({
        suggestedQuestions: { data: newQuestions },
      });
      rerender({ pia, itemId: 'item-2', isConversation: false });

      expect(result.current.displayedQuestions).toEqual(newQuestions);
    });
  });
});
