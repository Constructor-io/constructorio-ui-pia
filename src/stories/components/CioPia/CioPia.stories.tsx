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
      description: [
        'Display configuration options:',
        '',
        '`mode: "default" | "conversation"` — Display mode. Defaults to `"default"`.',
        '',
        '`type: "inline" | "modal"` — Component type. Defaults to `"inline"`.',
        '',
        '`showFeedback: boolean` — Show feedback controls on answers.',
        '',
        '`showPreviousItems: boolean` — Show product carousels from previous conversation entries. Defaults to `true`.',
        '',
        '`learnMoreUrl: string` — URL for the "Learn More" disclaimer link.',
        '',
        '`disclaimerPosition: "top" | "bottom"` — Position of the disclaimer. Defaults to `"bottom"`.',
      ].join('\n'),
      table: { type: { summary: 'CioPiaDisplayConfigs' } },
    },
    callbacks: {
      description: [
        'Callback handlers for user interactions:',
        '',
        '`onQuestionSubmit: (question: string) => void` — Called when a question is submitted (via Enter key, Send button, or suggested question click).',
        '',
        '`onProductCardClick: (item: Item) => void` — Called when a product card in the carousel is clicked.',
        '',
        '`onFeedback: (type: FeedbackType, question: string, response: GetAnswerResultsResponse) => void` — Called when the user submits positive or negative feedback on an answer.',
      ].join('\n'),
      table: { type: { summary: 'Callbacks' } },
    },
    componentOverrides: {
      description: [
        'Custom component overrides via reactNode or render props functions.',
        'See [ComponentOverrides](/?path=/docs/components-ciopia-componentoverrides--docs) for live examples and the full override hierarchy.',
      ].join('\n'),
      table: { type: { summary: 'CioPiaComponentOverrides' } },
    },
    formatters: {
      description: [
        'Formatter functions for transforming data before display.',
        'Define outside the component or memoize to avoid unnecessary re-renders.',
        '',
        '`formatImageUrl: (url: string) => string` — Transforms image URLs before rendering (e.g., prepend a CDN base URL).',
      ].join('\n'),
      table: { type: { summary: 'Formatters' } },
    },
    translations: {
      description: [
        'UI string translations for internationalization. All keys are optional — any non-provided translation falls back to English.',
        '',
        '`"Any questions about this product?"` — Title text.',
        '',
        '`"Ask anything"` — Input placeholder.',
        '',
        '`"Send"` — Send button label.',
        '',
        '`"AI-generated answers aim to help..."` — Disclaimer body text.',
        '',
        '`"Is this answer useful?"` — Feedback prompt.',
        '',
        '`"Learn More."` — Disclaimer link text.',
        '',
        '`"Ask about this product"` — Modal title.',
      ].join('\n'),
      table: { type: { summary: 'Translations' } },
    },
    suggestedQuestionsParameters: {
      description: [
        'Parameters for the suggested questions request.',
        '',
        '`numResults: number` — Number of suggested questions to fetch.',
      ].join('\n'),
      table: { type: { summary: 'SuggestedQuestionsParameters' } },
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
