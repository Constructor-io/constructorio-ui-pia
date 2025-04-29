import type { Meta, StoryObj } from '@storybook/react';
import UseSuggestedQuestionsExample from './UseSuggestedQuestionsExample';
import { DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Hooks/UseSuggestedQuestions',
  component: UseSuggestedQuestionsExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseSuggestedQuestionsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
  },
};
