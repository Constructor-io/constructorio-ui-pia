import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { within, userEvent, waitFor, expect } from '@storybook/test';
import PiaModal from '../../../components/PiaConversation/PiaModal';
import PiaConversation from '../../../components/PiaConversation/PiaConversation';
import useCioPia from '../../../hooks/useCioPia';
import useConversation from '../../../hooks/useConversation';
import { DEMO_API_KEY, DEMO_ITEM_ID, MOCK_QUESTIONS } from '../../../constants';

const mockQuestions = MOCK_QUESTIONS.slice(0, 3);

const mockConversationHistory = [
  {
    id: 1,
    question: 'Is this bunk board suitable for a platform bed?',
    answer:
      'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.',
    source: 'user' as const,
  },
];

const mockConversationHistoryMultiple = [
  ...mockConversationHistory,
  {
    id: 2,
    question: 'What sizes are available?',
    answer:
      'This bunk board is available in Twin, Full, Queen, and King sizes. Each size is designed to fit standard bed frame dimensions.',
    source: 'user' as const,
  },
];

const meta = {
  title: 'Components/PiaModal',
  component: PiaModal,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PiaModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveWrapper() {
  const pia = useCioPia({ apiKey: DEMO_API_KEY, itemId: DEMO_ITEM_ID });
  const {
    conversationHistory,
    displayedQuestions,
    isLoading,
    error,
    currentItems,
    handleSubmitQuestion,
    handleQuestionClick,
    resetState,
  } = useConversation({ pia, itemId: DEMO_ITEM_ID, isConversation: true });

  return (
    <PiaModal
      initialQuestions={pia.suggestedQuestions.data}
      handleSubmitQuestion={handleSubmitQuestion}
      handleQuestionClick={handleQuestionClick}
      isLoading={isLoading}
      onClose={resetState}>
      <PiaConversation
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        error={error}
        currentItems={currentItems}
        displayedQuestions={displayedQuestions}
        handleSubmitQuestion={handleSubmitQuestion}
        handleQuestionClick={handleQuestionClick}
      />
    </PiaModal>
  );
}

export const Default = {
  render: () => <InteractiveWrapper />,
};

export const WithAnswer: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
    handleQuestionClick: action('handleQuestionClick'),
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
        handleQuestionClick={args.handleQuestionClick!}
      />
    </PiaModal>
  ),
};

export const WithFeedback: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
    handleQuestionClick: action('handleQuestionClick'),
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
        handleQuestionClick={args.handleQuestionClick!}
      />
    </PiaModal>
  ),
};

export const WithLearnMore: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
    handleQuestionClick: action('handleQuestionClick'),
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
        handleQuestionClick={args.handleQuestionClick!}
      />
    </PiaModal>
  ),
};

// A closed <dialog> is display:none, so axe never sees the modal unless a story opens it.
export const Opened: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
    handleQuestionClick: action('handleQuestionClick'),
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
        handleQuestionClick={args.handleQuestionClick!}
      />
    </PiaModal>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: mockQuestions[0].value }));
    await waitFor(() => expect(canvasElement.querySelector('dialog')).toHaveAttribute('open'));
  },
};

export const MultipleConversations: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
    handleQuestionClick: action('handleQuestionClick'),
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
        handleQuestionClick={args.handleQuestionClick!}
      />
    </PiaModal>
  ),
};
