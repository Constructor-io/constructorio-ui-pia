import type { Meta, StoryObj } from '@storybook/react';
import UseAnswerResultsStreamExample from './UseAnswerResultsStreamExample';
import { DEMO_ITEM_ID, DEMO_QUESTION } from '../../../constants';

const meta = {
  title: 'Hooks/UseAnswerResultsStream',
  component: UseAnswerResultsStreamExample,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A hook for streaming answer results from the Constructor.io API. This hook manages the state of the stream and provides handlers for stream events.',
      },
    },
  },
} satisfies Meta<typeof UseAnswerResultsStreamExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    question: DEMO_QUESTION,
  },
};

export const IrrelevantQuestions: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    question: 'Can I buy a car?',
  },
};
