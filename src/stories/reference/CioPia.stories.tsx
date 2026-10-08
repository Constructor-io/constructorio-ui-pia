import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../constants';

const meta = {
  title: 'Components & Utilities/CioPia',
  component: CioPia,
  parameters: {
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
  argTypes: {
    checkoutTriggers: { control: false },
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
        '`mode: "default" | "conversation" | "recommendations"` — Display mode. Defaults to `"default"`. `"recommendations"` is accepted by the type but not yet available: it renders nothing.',
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
      control: false,
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
        '`onAddToCart: (item: Item, event: React.MouseEvent) => void` — Called when the "Add to Cart" button on a product card is clicked. Passing this callback is what renders the button; cards show no cart control without it.',
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
    initialConversationHistory: {
      description: [
        'A conversation you manage, such as one saved from `onAnswer` in the browser or on your own server, shown before the first question.',
        'When provided, including as `[]`, it is the conversation shown on mount: pass `[]` rather than omitting it when nothing is saved. Read once on mount, so render after it has loaded, and cleared when `itemId` changes.',
        'Used by `mode: "conversation"` and `type: "modal"` only; the modal shows them once it opens.',
        '',
        'Pass the `threadId` the entries came from: the agent keeps the thread context server-side and will not remember entries from another thread.',
        '',
        'Each entry is `{ id: number, question: string, answer: string, source: "user" | "suggestion", items?: Item[] | null, threadId?: string, qnaResultId?: string }`, the same shape `onAnswer` passes. The widget replaces each `id` with its own numbering.',
      ].join('\n'),
      table: { type: { summary: 'ConversationEntry[]' } },
    },
    persistConversation: {
      description: [
        "Off by default. `{ enabled: true }` keeps each product's conversation in the browser: `sessionStorage` for a guest, `localStorage` for 7 days for a signed-in shopper. Pass `userId` with it.",
        'An explicit `initialConversationHistory` wins over the stored conversation. Used by `mode: "conversation"` and `type: "modal"` only.',
      ].join('\n'),
      table: { type: { summary: '{ enabled: boolean }' } },
    },
    userId: {
      description:
        "Whose persisted conversations these are: the signed-in shopper's stable, non-personal id, or `null` for a guest. A login carries the guest's conversations over; a logout switches to the guest's history.",
      table: { type: { summary: 'string | null' } },
    },
    componentOverrides: {
      control: false,
      description: [
        'Custom component overrides via reactNode or render props functions.',
        'See the [Customization guide](./?path=/docs/guides-customization--docs) for the full override hierarchy and live examples.',
      ].join('\n'),
      table: { type: { summary: 'CioPiaComponentOverrides' } },
    },
    formatters: {
      control: false,
      description: [
        'Formatter functions for transforming data before display.',
        'Define outside the component or memoize to avoid unnecessary re-renders.',
        '',
        '`formatImageUrl: (url: string) => string` — Transforms image URLs before rendering (e.g., prepend a CDN base URL).',
      ].join('\n'),
      table: { type: { summary: 'Formatters' } },
    },
    productCardProps: {
      description: [
        'Props forwarded to the ProductCard rendered inside the carousel.',
        '',
        '`priceCurrency?: string` — Currency symbol to display next to product prices (e.g., "€", "£"). When omitted, the default ProductCard price rendering is used.',
      ].join('\n'),
      table: { type: { summary: 'ProductCardDisplayProps' } },
    },
    translations: {
      description: [
        'UI string translations for internationalization. Any key you omit falls back to English; an empty string is used as-is.',
        'See the [Customization guide](./?path=/docs/guides-customization--docs#translations) for every key.',
      ].join('\n'),
      table: { type: { summary: 'Translations' } },
    },
    trackingConfigs: {
      description: [
        'Tracking configuration options.',
        '',
        '`viewThreshold?: number` — Fraction of the container (0–1) that must be visible before the `product_insights_agent.view` event fires. Defaults to `0.5`.',
      ].join('\n'),
      table: { type: { summary: 'CioPiaTrackingConfigs' } },
    },
    suggestedQuestionsParameters: {
      description: [
        'Parameters for the suggested questions request.',
        '',
        '`numResults?: number` — Number of suggested questions to fetch.',
      ].join('\n'),
      table: { type: { summary: 'SuggestedQuestionsParameters' } },
    },
    abTest: {
      description: [
        'A/B test configuration.',
        '',
        '`testCells?: Record<string, string>` — `{ [testName]: cellName }`, each sent as an `ef-<testName>` tracking parameter. Ignored when you supply your own `cioClient`, which owns its own options; passing both warns.',
        '',
        '`isControl: boolean` (required) — renders an invisible, tracking-only placeholder instead of the widget, so the control arm still records a view event. Takes precedence over `displayConfigs.mode`.',
      ].join('\n'),
      table: { type: { summary: 'CioPiaAbTest' } },
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
