import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SuggestedQuestionsContainer from '../../../components/SuggestedQuestionsContainer/SuggestedQuestionsContainer';
import { MOCK_QUESTIONS } from '../../../constants';

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
    questions: MOCK_QUESTIONS,
    onQuestionClick: fn(),
  },
};
