import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SuggestedQuestion from '../../../components/SuggestedQuestion/SuggestedQuestion';

const meta = {
  title: 'Components/SuggestedQuestion',
  component: SuggestedQuestion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
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
