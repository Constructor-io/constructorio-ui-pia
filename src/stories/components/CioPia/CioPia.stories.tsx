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
        'Recommendations mode only. These five are the strings the API cannot supply, because in those states there is no usable response yet:',
        '',
        '`"Adapting recommendations to your preference"` — Title shown while a request is in flight.',
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
        '`strategy?: RecsStrategy` — Which kind of recommendations to fetch: `"complementary_items"`, `"alternative_items"`, `"bestsellers"`, `"bundles"`, `"buy_it_again"`, `"recently_viewed_items"` or `"visually_similar_items"`. Defaults to `"complementary_items"`.',
        '',
        '`defaultTitle?: string` — Last-resort title, used only when the API returns products but no title of its own.',
        '',
        '`showInput?: boolean` — Render the free-text refinement box. Defaults to `true`.',
        '',
        '`numResults?: number` — How many products to request.',
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
 * Recommendations mode. Each story supplies its own client, because the endpoint that returns a
 * short title and refinement options is not deployed yet - so `apiKey` is inert here and nothing
 * below reaches the network.
 */
const recsArgs = (stub: RecsStubOptions = {}) => ({
  apiKey: DEMO_API_KEY,
  itemId: DEMO_ITEM_ID,
  itemName: DEMO_ITEM_NAME,
  displayConfigs: { mode: 'recommendations' as const },
  cioClient: createRecsPodStubClient(stub),
  // The stub answers with seven products, so the pod asks for seven. That is what lets the
  // placeholders match the row replacing them card for card, with nothing sliding sideways: absent
  // a `numResults`, the pod has only a guess to draw on the very first request.
  recsPodParameters: { numResults: 7 },
});

/**
 * The pod takes the width it is given, and the carousel inside it holds more products than fit -
 * that is what its arrows are for. `centered` makes Storybook's `body` a flex container, which sizes
 * a story to its contents rather than to the canvas, so the pod grows to the full width of the row
 * of cards and the page scrolls sideways. `padded` leaves it in a block, the way a page would.
 */
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
      strategy: 'bestsellers',
      defaultTitle: 'Our best sellers this week',
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
