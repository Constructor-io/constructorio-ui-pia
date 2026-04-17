import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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

function InteractiveWrapper() {
  const pia = useCioPia({ apiKey: DEMO_API_KEY, itemId: DEMO_ITEM_ID });
  const {
    conversationHistory,
    displayedQuestions,
    isLoading,
    error,
    currentItems,
    handleSubmitQuestion,
    resetState,
  } = useConversation({ pia, itemId: DEMO_ITEM_ID, isConversation: true });

  return (
    <PiaModal
      initialQuestions={pia.suggestedQuestions.data}
      handleSubmitQuestion={handleSubmitQuestion}
      isLoading={isLoading}
      onClose={resetState}>
      <PiaConversation
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        error={error}
        currentItems={currentItems}
        displayedQuestions={displayedQuestions}
        handleSubmitQuestion={handleSubmitQuestion}
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
      />
    </PiaModal>
  ),
};

export const WithFeedback: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
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
      />
    </PiaModal>
  ),
};

export const WithLearnMore: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
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
      />
    </PiaModal>
  ),
};

export const MultipleConversations: Story = {
  args: {
    initialQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
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
      />
    </PiaModal>
  ),
};
