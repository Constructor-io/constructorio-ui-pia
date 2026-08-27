import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { AgentRequestError } from '../../../errors';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';
import { createRecsPodStubClient, prependCdnBase, RecsStubOptions } from '../../utils';
import { RECS_SIX_GROUPS, RECS_TRENDING } from '../../recsFixtures';

const meta = {
  title: 'Components/CioPia',
  component: CioPia,
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
        '`mode: "default" | "conversation" | "recommendations"` — Display mode. Defaults to `"default"`.',
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
        '',
        '`"Add to Cart"` — Product card add-to-cart button label.',
        '',
        'Recommendations mode only — copy the API does not supply:',
        '',
        '`"Adapting recommendations to your preference"` — Title shown while a request is in flight.',
        '',
        '`"Products that work well with this one"` — The pod title for `"complementary_items"`, used whenever the response carries no title of its own, which is every response today.',
        '',
        '`"Similar products you might like"` — The pod title for `"alternative_items"`, same rule.',
        '',
        '`"Best selling products"` — Title shown when a request failed or came back degraded.',
        '',
        '`"Unsupported request, try a different feature."` — Message shown under the input when the agent rejects what was submitted.',
        '',
        '`"Not what you\'re looking for? Try:"` — Refinement prompt, used only when the API sends none of its own.',
        '',
        '`"Describe something else..."` — Refinement input placeholder. Separate from `"Ask anything"`, so the two inputs read differently.',
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
    recsPodParameters: {
      description: [
        'Parameters for the recommendations pod. Ignored unless `displayConfigs.mode` is `"recommendations"`.',
        '',
        '`strategy?: RecsStrategy` — Which kind of recommendations to fetch: `"complementary_items"` or `"alternative_items"`. Defaults to `"complementary_items"`. To serve another kind, supply a `cioClient` with your own `agent.getRecs`.',
        '',
        '`defaultTitle?: string` — The pod title, used whenever the response carries no title of its own, which is every response today. Without it, each strategy has a built-in title.',
        '',
        '`refinementOptions?: string[]` — The options the shopper can pick from, used whenever the response carries none of its own, which is every response today. Defaults to `["From a different brand", "A lower price"]`; pass `[]` for no options at all. An option is answered in the context of the previous turn rather than as a fresh catalog search, so absolute thresholds such as `"under $50"` often leave nothing.',
        '',
        '`showInput?: boolean` — Render the free-text refinement box. Defaults to `true`.',
        '',
        '`numResults?: number` — How many products to show. Does not reach the API today, so it only sizes the loading skeleton.',
      ].join('\n'),
      table: { type: { summary: 'RecsPodParameters' } },
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

export const WithCustomCurrency: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    productCardProps: {
      priceCurrency: '€',
    },
  },
};

export const WithCustomCurrencyConversation: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    productCardProps: {
      priceCurrency: '£',
    },
    displayConfigs: {
      mode: 'conversation',
    },
  },
};

/**
 * Recommendations mode. These stories supply their own client, so `apiKey` is inert in them and they
 * reach no network. `RecommendationsLive` at the end of the file is the exception.
 */
const recsArgs = (stub: RecsStubOptions = {}) => ({
  apiKey: DEMO_API_KEY,
  itemId: DEMO_ITEM_ID,
  itemName: DEMO_ITEM_NAME,
  displayConfigs: { mode: 'recommendations' as const },
  cioClient: createRecsPodStubClient(stub),
  // The stub answers with seven products, so the pod asks for seven and the placeholders match the
  // row replacing them card for card.
  recsPodParameters: { numResults: 7 },
});

/** `padded` leaves the pod in a block, the way a page would, rather than sizing it to its contents. */
const recsLayout = { layout: 'padded' as const };

export const RecommendationsPod: Story = {
  args: recsArgs(),
  parameters: {
    ...recsLayout,
    docs: {
      description: {
        story:
          'Click an option or type something: a new title, new products and new options every ' +
          'time, with a loading state in between.',
      },
    },
  },
};

export const RecommendationsTrending: Story = {
  args: recsArgs({ firstResult: RECS_TRENDING }),
  parameters: {
    ...recsLayout,
    docs: {
      description: {
        story: 'A shopper the API has nothing personal to go on, so it sends a general title.',
      },
    },
  },
};

export const RecommendationsUnknownError: Story = {
  args: recsArgs({ failAfterFirst: new AgentRequestError(500) }),
  parameters: {
    ...recsLayout,
    docs: {
      description: {
        story:
          'Refine once and the request fails: the products stay, under "Best selling products", ' +
          'and the input is left alone.',
      },
    },
  },
};

export const RecommendationsUnsupportedRequest: Story = {
  args: recsArgs({ freeText: 'reject422' }),
  parameters: {
    ...recsLayout,
    docs: {
      description: {
        story:
          'Type something the agent will not act on, such as "paint my house": the input turns ' +
          'red and everything else is held, while the options keep working.',
      },
    },
  },
};

export const RecommendationsWithParameters: Story = {
  args: {
    ...recsArgs({ groups: RECS_SIX_GROUPS }),
    recsPodParameters: {
      strategy: 'alternative_items',
      defaultTitle: 'Other options to consider',
      showInput: false,
      numResults: 6,
    },
  },
  parameters: {
    ...recsLayout,
    docs: {
      description: {
        story:
          'Six products rather than four, no free-text box, and a `defaultTitle` standing in ' +
          'because these responses carry no title of their own.',
      },
    },
  },
};

/** A product this API answers well for, so the story shows a working pod rather than the empty state. */
const LIVE_RECS_ITEM_ID = '109050174';
const LIVE_RECS_ITEM_NAME = 'Tortilla Chips Scoops';

export const RecommendationsLive: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: LIVE_RECS_ITEM_ID,
    itemName: LIVE_RECS_ITEM_NAME,
    displayConfigs: { mode: 'recommendations' },
  },
  parameters: {
    ...recsLayout,
    docs: {
      description: {
        story:
          'The only recommendations story with no `cioClient`, so this one reaches the API. Give it ' +
          'a few seconds - it is a language model round-trip, and the products rotate between loads.',
      },
    },
  },
};
