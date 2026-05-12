import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';

const meta = {
  title: 'Components/CioPia',
  component: CioPia,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define outside the component (or use useCallback) to avoid unnecessary re-renders.
const prependCdnBase = (url: string) => (url.startsWith('/') ? `https://example.com${url}` : url);

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
  },
};

export const WithLimitedQuestions: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    suggestedQuestionsParameters: { numResults: 2 },
  },
};

export const WithFormatImageUrl: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    formatters: {
      formatImageUrl: prependCdnBase,
    },
  },
};
