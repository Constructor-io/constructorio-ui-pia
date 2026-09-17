import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';

const meta = {
  title: 'Components/CioPia/DisplayConfigs',
  component: CioPia,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
  },
};

export const WithFeedback: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    displayConfigs: {
      showFeedback: true,
    },
  },
};

export const WithLearnMore: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    displayConfigs: {
      learnMoreUrl: 'https://constructor.io/learn-more',
    },
  },
};

export const ConversationMode: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    displayConfigs: {
      mode: 'conversation',
      showFeedback: true,
    },
  },
};

export const DisclaimerPositionTop: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      disclaimerPosition: 'top',
    },
  },
};

export const ModalType: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    displayConfigs: {
      type: 'modal',
      showFeedback: true,
    },
  },
};
