import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SuggestedQuestions from '../../../components/SuggestedQuestions/SuggestedQuestions';
import { DEMO_ITEM_ID } from '../../../constants';

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
    itemId: DEMO_ITEM_ID,
    onQuestionClick: fn(),
  },
};
