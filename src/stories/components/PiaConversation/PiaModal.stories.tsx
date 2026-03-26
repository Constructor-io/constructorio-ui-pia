import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PiaModal from '../../../components/PiaConversation/PiaModal';
import PiaConversation from '../../../components/PiaConversation/PiaConversation';
import { MOCK_QUESTIONS } from '../../../constants';

const mockQuestions = MOCK_QUESTIONS.slice(0, 3);

const mockConversationHistory = [
  {
    id: 1,
    question: 'Is this bunk board suitable for a platform bed?',
    answer:
      'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.',
  },
];

const mockConversationHistoryMultiple = [
  ...mockConversationHistory,
  {
    id: 2,
    question: 'What sizes are available?',
    answer:
      'This bunk board is available in Twin, Full, Queen, and King sizes. Each size is designed to fit standard bed frame dimensions.',
  },
];

const meta = {
  title: 'Components/PiaModal',
  component: PiaModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PiaModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    isLoading: false,
  },
  render: (args) => (
    <PiaModal {...args}>
      <PiaConversation
        conversationHistory={[]}
        isLoading={false}
        error={null}
        displayedQuestions={mockQuestions}
        handleSubmitQuestion={args.handleSubmitQuestion}
        suggestedQuestionsError={null}
      />
    </PiaModal>
  ),
};

export const WithAnswer: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    isLoading: false,
  },
  render: (args) => (
    <PiaModal {...args}>
      <PiaConversation
        conversationHistory={mockConversationHistory}
        isLoading={false}
        error={null}
        displayedQuestions={mockQuestions}
        handleSubmitQuestion={args.handleSubmitQuestion}
        suggestedQuestionsError={null}
      />
    </PiaModal>
  ),
};

export const WithFeedback: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    isLoading: false,
  },
  render: (args) => (
    <PiaModal {...args}>
      <PiaConversation
        conversationHistory={mockConversationHistory}
        isLoading={false}
        error={null}
        showFeedback
        displayedQuestions={mockQuestions}
        handleSubmitQuestion={args.handleSubmitQuestion}
        suggestedQuestionsError={null}
      />
    </PiaModal>
  ),
};

export const WithLearnMore: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    isLoading: false,
  },
  render: (args) => (
    <PiaModal {...args}>
      <PiaConversation
        conversationHistory={mockConversationHistory}
        isLoading={false}
        error={null}
        learnMoreUrl='https://constructor.io/learn-more'
        displayedQuestions={mockQuestions}
        handleSubmitQuestion={args.handleSubmitQuestion}
        suggestedQuestionsError={null}
      />
    </PiaModal>
  ),
};

export const MultipleConversations: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: (question: string) => console.log('Submit:', question),
    isLoading: false,
  },
  render: (args) => (
    <PiaModal {...args}>
      <PiaConversation
        conversationHistory={mockConversationHistoryMultiple}
        isLoading={false}
        error={null}
        showFeedback
        displayedQuestions={mockQuestions}
        handleSubmitQuestion={args.handleSubmitQuestion}
        suggestedQuestionsError={null}
      />
    </PiaModal>
  ),
};
