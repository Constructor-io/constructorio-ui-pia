import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SuggestedQuestion from '../../../components/SuggestedQuestion/SuggestedQuestion';

const meta = {
  title: 'Internal/SuggestedQuestion',
  component: SuggestedQuestion,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
  args: { onClick: fn() },
  tags: ['!dev'],
} satisfies Meta<typeof SuggestedQuestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What are the available sizes and colors for this item?',
  },
};

export const LongQuestion: Story = {
  args: {
    question:
      'Does this product come with a warranty, and what does the warranty coverage include?',
  },
};
