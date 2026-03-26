import type { Meta, StoryObj } from '@storybook/react';
import UseConversationExample from './UseConversationExample';
import { DEMO_ITEM_ID, DEMO_QUESTION } from '../../../constants';

const meta = {
  title: 'Hooks/UseConversation',
  component: UseConversationExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseConversationExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    question: DEMO_QUESTION,
    isConversation: false,
  },
};

export const ConversationMode: Story = {
  args: {
    itemId: DEMO_ITEM_ID,
    question: DEMO_QUESTION,
    isConversation: true,
  },
};
