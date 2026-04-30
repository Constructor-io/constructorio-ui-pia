import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PiaConversation, {
  PiaConversationProps,
} from '../../../components/PiaConversation/PiaConversation';
import useCioPia from '../../../hooks/useCioPia';
import useConversation from '../../../hooks/useConversation';
import { DEMO_API_KEY, DEMO_ITEM_ID, MOCK_QUESTIONS } from '../../../constants';

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

function InteractiveWrapper(extraProps: Partial<PiaConversationProps> = {}) {
  const pia = useCioPia({ apiKey: DEMO_API_KEY, itemId: DEMO_ITEM_ID });
  const {
    conversationHistory,
    displayedQuestions,
    isLoading,
    error,
    currentItems,
    handleSubmitQuestion,
  } = useConversation({ pia, itemId: DEMO_ITEM_ID, isConversation: true });

  return (
    <PiaConversation
      conversationHistory={conversationHistory}
      isLoading={isLoading}
      error={error}
      currentItems={currentItems}
      displayedQuestions={displayedQuestions}
      handleSubmitQuestion={handleSubmitQuestion}
      {...extraProps}
    />
  );
}

export const Default = {
  render: () => <InteractiveWrapper />,
};

export const WithConversation: Story = {
  args: {
    conversationHistory: [
      {
        id: 1,
        question: 'Is this bunk board suitable for a platform bed?',
        answer:
          'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.',
      },
      {
        id: 2,
        question: 'What sizes are available?',
        answer:
          'This bunk board is available in Twin, Full, Queen, and King sizes. Each size is designed to fit standard bed frame dimensions.',
      },
    ],
    isLoading: false,
    error: null,
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
  },
};

export const Loading: Story = {
  args: {
    conversationHistory: [
      {
        id: 1,
        question: 'Is this bunk board suitable for a platform bed?',
        answer: 'Yes, this bunk board is designed to work well with platform beds.',
      },
      { id: 2, question: 'What sizes are available?', answer: '' },
    ],
    isLoading: true,
    error: null,
    displayedQuestions: [],
    handleSubmitQuestion: action('handleSubmitQuestion'),
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
    handleSubmitQuestion: action('handleSubmitQuestion'),
  },
};

export const WithFeedback: Story = {
  args: {
    conversationHistory: [
      {
        id: 1,
        question: 'Is this bunk board suitable for a platform bed?',
        answer:
          'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.',
      },
    ],
    isLoading: false,
    error: null,
    showFeedback: true,
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
  },
};

export const WithoutPreviousItems = {
  render: () => <InteractiveWrapper showPreviousItems={false} />,
};

export const WithLearnMore: Story = {
  args: {
    conversationHistory: [
      {
        id: 1,
        question: 'Is this bunk board suitable for a platform bed?',
        answer:
          'Yes, this bunk board is designed to work well with platform beds. It provides a solid, flat surface that supports your mattress evenly without the need for a box spring.',
      },
    ],
    isLoading: false,
    error: null,
    learnMoreUrl: 'https://constructor.io/learn-more',
    displayedQuestions: mockQuestions,
    handleSubmitQuestion: action('handleSubmitQuestion'),
  },
};
