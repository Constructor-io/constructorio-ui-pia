import type { Meta, StoryObj } from '@storybook/react';
import PiaConversation from '../../../components/PiaConversation/PiaConversation';
import { MOCK_QUESTIONS } from '../../../constants';

const meta = {
  title: 'Components/PiaConversation',
  component: PiaConversation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PiaConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockQuestions = MOCK_QUESTIONS.slice(0, 3);

export const Empty: Story = {
  args: {
    conversationHistory: [],
    isLoading: false,
    error: null,
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    suggestedQuestionsError: null,
  },
};

export const WithConversation: Story = {
  args: {
    conversationHistory: [
      { id: 1, question: 'Is this bunk board suitable for a platform bed?', answer: 'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.' },
      { id: 2, question: 'What sizes are available?', answer: 'This bunk board is available in Twin, Full, Queen, and King sizes. Each size is designed to fit standard bed frame dimensions.' },
    ],
    isLoading: false,
    error: null,
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    suggestedQuestionsError: null,
  },
};

export const Loading: Story = {
  args: {
    conversationHistory: [
      { id: 1, question: 'Is this bunk board suitable for a platform bed?', answer: 'Yes, this bunk board is designed to work well with platform beds.' },
      { id: 2, question: 'What sizes are available?', answer: '' },
    ],
    isLoading: true,
    error: null,
    displayedQuestions: [],
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    suggestedQuestionsError: null,
  },
};

export const WithError: Story = {
  args: {
    conversationHistory: [
      { id: 1, question: 'Is this bunk board suitable for a platform bed?', answer: '' },
    ],
    isLoading: false,
    error: new Error('Failed to fetch answer. Please try again.'),
    displayedQuestions: [],
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    suggestedQuestionsError: null,
  },
};

export const WithFeedback: Story = {
  args: {
    conversationHistory: [
      { id: 1, question: 'Is this bunk board suitable for a platform bed?', answer: 'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.' },
    ],
    isLoading: false,
    error: null,
    showFeedback: true,
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    suggestedQuestionsError: null,
  },
};

export const WithLearnMore: Story = {
  args: {
    conversationHistory: [
      { id: 1, question: 'Is this bunk board suitable for a platform bed?', answer: 'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.' },
    ],
    isLoading: false,
    error: null,
    learnMoreUrl: 'https://constructor.io/learn-more',
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    suggestedQuestionsError: null,
  },
};
