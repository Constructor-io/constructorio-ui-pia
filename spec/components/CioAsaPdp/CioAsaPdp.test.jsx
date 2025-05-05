import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CioAsaPdp from '../../../src/components/CioAsaPdp/CioAsaPdp';
import useCioAsaPdp from '../../../src/hooks/useCioAsaPdp';
import { DEMO_QUESTION, DISCLAIMER_TEXT } from '../../../src/constants';

// Mock the useCioAsaPdp hook
jest.mock('../../../src/hooks/useCioAsaPdp', () => jest.fn());

describe('CioAsaPdp Component', () => {
  const mockProps = {
    apiKey: 'test-api-key',
    itemId: 'test-item-id',
    cioClient: { someClientMethod: jest.fn() },
  };

  const testQuestion = DEMO_QUESTION;

  const mockSuggestedQuestions = [
    { value: 'Suggested question 1?' },
    { value: 'Suggested question 2?' },
    { value: 'Suggested question 3?' },
  ];

  const mockAnswerData = {
    value: 'This is a test answer',
    follow_up_questions: [{ value: 'Follow-up question 1' }, { value: 'Follow-up question 2' }],
  };

  const mockGetAnswer = jest.fn();
  const mockGetSuggestedQuestions = jest.fn();

  const mockLoadingResponse = {
    suggestedQuestions: {
      data: [],
      isLoading: true,
      error: null,
      getSuggestedQuestions: jest.fn(),
    },
    answers: {
      data: null,
      isLoading: false,
      error: null,
      getAnswer: jest.fn(),
    },
  };

  const mockErrorResponse = {
    suggestedQuestions: {
      data: [],
      isLoading: false,
      error: new Error('Something went wrong'),
      getSuggestedQuestions: jest.fn(),
    },
    answers: {
      data: null,
      isLoading: false,
      error: null,
      getAnswer: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    useCioAsaPdp.mockImplementation(() => ({
      suggestedQuestions: {
        data: mockSuggestedQuestions,
        isLoading: false,
        error: null,
        getSuggestedQuestions: mockGetSuggestedQuestions,
      },
      answers: {
        data: null,
        isLoading: false,
        error: null,
        getAnswer: mockGetAnswer,
      },
    }));
  });

  it('renders the component with default state', () => {
    const { getByTestId, getByText, getByRole } = render(<CioAsaPdp {...mockProps} />);

    expect(getByTestId('cio-asa-pdp-container')).toBeInTheDocument();
    expect(getByTestId('cio-asa-pdp-title')).toBeInTheDocument();
    expect(getByRole('textbox')).toBeInTheDocument();

    mockSuggestedQuestions.forEach((question) => {
      expect(getByText(question.value)).toBeInTheDocument();
    });
  });

  it('passes the client to useCioAsaPdp', () => {
    render(<CioAsaPdp {...mockProps} />);

    expect(useCioAsaPdp).toHaveBeenCalledWith({
      apiKey: mockProps.apiKey,
      itemId: mockProps.itemId,
      cioClient: mockProps.cioClient,
    });
  });

  it('handles question submission via input', () => {
    const { getByRole } = render(<CioAsaPdp {...mockProps} />);

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: testQuestion } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockGetAnswer).toHaveBeenCalledWith(testQuestion);
  });

  it('handles question click from suggested questions', () => {
    const { getByText } = render(<CioAsaPdp {...mockProps} />);

    fireEvent.click(getByText(mockSuggestedQuestions[0].value));

    expect(mockGetAnswer).toHaveBeenCalledWith(mockSuggestedQuestions[0].value);
  });

  it('displays answer when available', () => {
    useCioAsaPdp.mockImplementation(() => ({
      suggestedQuestions: {
        data: mockSuggestedQuestions,
        isLoading: false,
        error: null,
        getSuggestedQuestions: mockGetSuggestedQuestions,
      },
      answers: {
        data: mockAnswerData,
        isLoading: false,
        error: null,
        getAnswer: mockGetAnswer,
      },
    }));

    const { getByText } = render(<CioAsaPdp {...mockProps} />);

    expect(getByText(mockAnswerData.value)).toBeInTheDocument();
    expect(getByText(DISCLAIMER_TEXT)).toBeInTheDocument();
  });

  it('displays follow-up questions when available in answers data', () => {
    useCioAsaPdp.mockImplementation(() => ({
      suggestedQuestions: {
        data: mockSuggestedQuestions,
        isLoading: false,
        error: null,
        getSuggestedQuestions: mockGetSuggestedQuestions,
      },
      answers: {
        data: mockAnswerData,
        isLoading: false,
        error: null,
        getAnswer: mockGetAnswer,
      },
    }));

    const { getByText } = render(<CioAsaPdp {...mockProps} />);

    mockAnswerData.follow_up_questions.forEach((question) => {
      expect(getByText(question.value)).toBeInTheDocument();
    });
  });

  it('displays loading state when loading', () => {
    useCioAsaPdp.mockReturnValue(mockLoadingResponse);
    const { getByTestId } = render(<CioAsaPdp {...mockProps} />);

    expect(getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    useCioAsaPdp.mockReturnValue(mockErrorResponse);

    render(<CioAsaPdp {...mockProps} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('updates current question when a question is submitted', () => {
    render(<CioAsaPdp {...mockProps} />);

    const questionToClick = mockSuggestedQuestions[1];
    fireEvent.click(screen.getByText(questionToClick.value));

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(questionToClick.value);
  });

  it('updates displayed questions when follow-up questions are available', async () => {
    useCioAsaPdp.mockImplementation(() => ({
      suggestedQuestions: {
        data: mockSuggestedQuestions,
        isLoading: false,
        error: null,
        getSuggestedQuestions: mockGetSuggestedQuestions,
      },
      answers: {
        data: null,
        isLoading: false,
        error: null,
        getAnswer: mockGetAnswer,
      },
    }));

    const { rerender } = render(<CioAsaPdp {...mockProps} />);

    // Initially should show the original suggested questions
    mockSuggestedQuestions.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });

    // Update the answers data with follow-up questions
    useCioAsaPdp.mockImplementation(() => ({
      suggestedQuestions: {
        data: mockSuggestedQuestions,
        isLoading: false,
        error: null,
        getSuggestedQuestions: mockGetSuggestedQuestions,
      },
      answers: {
        data: mockAnswerData,
        isLoading: false,
        error: null,
        getAnswer: mockGetAnswer,
      },
    }));

    rerender(<CioAsaPdp {...mockProps} />);

    mockAnswerData.follow_up_questions.forEach((question) => {
      expect(screen.getByText(question.value)).toBeInTheDocument();
    });
  });
});
