import type { Meta, StoryObj } from '@storybook/react';
import UseAnswerResultsExample from './UseAnswerResultsExample';
import { DEMO_ITEM_ID, DEMO_QUESTION } from '../../../constants';

const meta = {
  title: 'Hooks/UseAnswerResults',
  component: UseAnswerResultsExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseAnswerResultsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    question: DEMO_QUESTION,
  },
};

export const IrrelevantQuestion: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    question: 'Can I buy a car?',
  },
};
