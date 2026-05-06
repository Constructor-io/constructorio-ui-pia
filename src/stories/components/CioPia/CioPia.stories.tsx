import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Components/CioPia',
  component: CioPia,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    displayConfigs: {
      table: {
        type: { summary: 'CioPiaDisplayConfigs' },
      },
    },
    callbacks: {
      table: {
        type: { summary: 'Callbacks' },
      },
    },
    formatters: {
      table: {
        type: { summary: 'Formatters' },
      },
    },
    translations: {
      table: {
        type: { summary: 'Translations' },
      },
    },
    suggestedQuestionsParameters: {
      table: {
        type: { summary: 'SuggestedQuestionsParameters' },
      },
    },
    componentOverrides: {
      table: {
        type: { summary: 'CioPiaComponentOverrides' },
      },
    },
  },
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define outside the component (or use useCallback) to avoid unnecessary re-renders.
const prependCdnBase = (url: string) => (url.startsWith('/') ? `https://example.com${url}` : url);

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
  },
};

export const WithLimitedQuestions: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    suggestedQuestionsParameters: { numResults: 2 },
  },
};

export const WithFormatImageUrl: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    formatters: {
      formatImageUrl: prependCdnBase,
    },
  },
};
