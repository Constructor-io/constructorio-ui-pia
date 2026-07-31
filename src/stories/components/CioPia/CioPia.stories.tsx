import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';
import { prependCdnBase } from '../../utils';

const meta = {
  title: 'Components/CioPia',
  component: CioPia,
  parameters: {
    // Fixed and verified against axe - keep it that way.
    a11y: { test: 'error' },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    cioClient: {
      description: [
        'Constructor.io client instance with identity/tracking options for PIA requests.',
        '',
        '`clientId?: string` — Unique browser/app identifier (sent as `i` query param).',
        '',
        '`sessionId?: number` — Session number (sent as `s` query param).',
        '',
        '`userId?: string` — Logged-in user identifier (sent as `ui` query param).',
        '',
        '`segments?: string[]` — User segments for targeting (sent as `us` query param).',
        '',
        '`version?: string` — Client version (sent as `c` query param, defaults to `cio-ui-pia-<packageVersion>`).',
      ].join('\n'),
      table: { type: { summary: 'CioClient' } },
    },
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
        'Callback handlers for user interactions.',
        '',
        '`context` is `{ itemId: string, threadId: string }` — identifies the product and conversation session.',
        '',
        "`onQuestionSubmit: (question, context, source) => void` — Called when a question is submitted. `source` is `'user'` (typed) or `'suggestion'` (clicked).",
        '',
        '`onAnswer: (history, context) => void` — Called when a new answer is received. Passes the full conversation history.',
        '',
        '`onProductCardClick: (item: Item) => void` — Called when a product card in the carousel is clicked.',
        '',
        '`onFeedback: (type: FeedbackType) => void` — Called when the user submits positive or negative feedback on an answer.',
        '',
        '`onFocus: (context) => void` — Called when the user focuses the input field.',
        '',
        '`onView: (context) => void` — Called when the widget enters the viewport.',
        '',
        '`onOutOfView: (context) => void` — Called when the widget leaves the viewport.',
      ].join('\n'),
      table: { type: { summary: 'Callbacks' } },
    },
    componentOverrides: {
      description: [
        'Custom component overrides via reactNode or render props functions.',
        'See [ComponentOverrides](./?path=/docs/components-ciopia-componentoverrides--docs) for live examples and the full override hierarchy.',
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
