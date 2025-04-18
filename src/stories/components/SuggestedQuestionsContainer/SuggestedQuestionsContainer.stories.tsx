import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SuggestedQuestionsContainer from '../../../components/SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import { DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Components/SuggestedQuestionsContainer',
  component: SuggestedQuestionsContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SuggestedQuestionsContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    onQuestionClick: fn(),
  },
};

export const Error: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    onQuestionClick: fn(),
    isError: true,
  },
};
