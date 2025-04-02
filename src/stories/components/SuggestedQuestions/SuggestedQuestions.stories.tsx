import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SuggestedQuestions from '../../../components/SuggestedQuestions/SuggestedQuestions';

const meta = {
  title: 'Components/SuggestedQuestions',
  component: SuggestedQuestions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SuggestedQuestions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: 'test-item-id',
    onQuestionClick: fn(),
  },
  decorators: [],
};
