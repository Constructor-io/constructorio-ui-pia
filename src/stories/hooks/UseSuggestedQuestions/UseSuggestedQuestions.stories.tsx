import type { Meta, StoryObj } from '@storybook/react';
import useSuggestedQuestionsExample from './UseSuggestedQuestionsExample';
import { DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Hooks/UseSuggestedQuestions',
  component: useSuggestedQuestionsExample,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof useSuggestedQuestionsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
  },
};
