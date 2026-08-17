import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { AgentRequestError } from '../../../errors';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';
import { RecsResult } from '../../../types';
import { createRecsPodStubClient, RecsStubStep } from '../../utils';

/**
 * Every story here except `LiveApiToday` supplies its own client, because the API cannot yet
 * produce a short title or refinement options - see the "Provisional data source" note below.
 * That is what makes the designed appearance reviewable today.
 */
const meta = {
  title: 'Components/CioPia/RecsPod',
  component: CioPia,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A recommendations pod: a personalized title, a row of products, and short options for ' +
          'narrowing them down. It asks no questions and makes no Q&A requests, so a retailer can ' +
          'use it without PIA Q&A enabled. Turn it on with `displayConfigs.mode: "recommendations"`.' +
          '\n\n**Provisional data source.** The endpoint that returns a short title and refinement ' +
          'options is not deployed yet, so the pod currently reads the Q&A endpoint, which returns ' +
          'a long answer where the title belongs and product questions where the options belong. ' +
          'Every story below except `LiveApiToday` therefore supplies a stand-in client, so what ' +
          'you see is the designed appearance rather than the data available today.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Real products from the demo catalog, so the pod looks the way it will in a store. The title and
 * the options are what we expect the recommendations endpoint to send.
 */
const designedResult: RecsResult = {
  title: 'Since you prefer high-protein shakes, more like this in your style',
  items: [
    {
      id: '149100219',
      name: 'Ensure Nutrition Shake Original Milk Chocolate - 6-8 Fl. Oz.',
      price: 12.49,
      imageUrl: 'https://d17bbgoo3npfov.cloudfront.net/images/farmstand-149100219.png',
      url: '/',
    },
    {
      id: '149100235',
      name: 'Ensure Nutrition Shake Original Strawberry - 6-8 Fl. Oz.',
      price: 12.49,
      imageUrl: 'https://d17bbgoo3npfov.cloudfront.net/images/farmstand-149100235.png',
      url: '/',
    },
    {
      id: '149100203',
      name: 'Ensure Nutrition Shake Original Butter Pecan - 6-8 Fl. Oz.',
      price: 12.49,
      imageUrl: 'https://d17bbgoo3npfov.cloudfront.net/images/farmstand-149100203.png',
      url: '/',
    },
    {
      id: '960133397',
      name: 'Ensure High Protein Nutrition Shake Vanilla - 6-8 Fl. Oz.',
      price: 15.89,
      imageUrl: 'https://d17bbgoo3npfov.cloudfront.net/images/farmstand-960133397.png',
      url: '/',
    },
  ],
  refinement: {
    question: 'Not quite what you want? Try:',
    options: ['More protein', 'Chocolate', 'Under $13'],
  },
  resultId: 'story-result-id',
  threadId: '550e8400-e29b-41d4-a716-446655440000',
  status: 'complete',
};

/** The title and options come from the API here too - the library never writes this copy. */
const noResultsResult: RecsResult = {
  ...designedResult,
  title: "We couldn't find an exact match, but here are some popular favorites to explore:",
  items: designedResult.items!.slice(0, 3),
  refinement: { options: ['Popular this week', 'Under $13'] },
};

const noHistoryResult: RecsResult = {
  ...designedResult,
  title: 'Trending right now',
  refinement: { options: ['Best sellers', 'New arrivals'] },
};

/** RFC:461 - the response is degraded but its products are still worth showing. */
const partialResult: RecsResult = {
  ...designedResult,
  title: '',
  status: 'partial',
};

const baseArgs = {
  apiKey: DEMO_API_KEY,
  itemId: DEMO_ITEM_ID,
  itemName: DEMO_ITEM_NAME,
  displayConfigs: { mode: 'recommendations' as const },
};

const stubbed = (steps: RecsStubStep[]) => ({
  ...baseArgs,
  cioClient: createRecsPodStubClient(steps),
});

export const Designed: Story = {
  args: stubbed([designedResult]),
  parameters: {
    docs: {
      description: {
        story:
          'The pod as designed, and the story to sign off on: title, then products, then the ' +
          'refinement row with an option per suggestion and a free-text box after them. ' +
          'Refining is stubbed to return the same response, so clicking an option shows the ' +
          'loading appearance and then settles back to this.',
      },
    },
  },
};

export const FirstLoad: Story = {
  args: stubbed(['pending']),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing has come back yet, so there is no title to keep. The pod shows "Adapting ' +
          'recommendations to your preference" with placeholder blocks for the products, the ' +
          'options and the input. The request never settles, so this appearance holds still.',
      },
    },
  },
};

export const Refining: Story = {
  args: stubbed([designedResult, 'pending']),
  parameters: {
    docs: {
      description: {
        story:
          'Click an option or submit some text. The title and the refinement label hold still and ' +
          'only the products and the options become placeholders, so nothing moves up or down. ' +
          'The input keeps its place and is disabled while the request is in flight. The second ' +
          'request never settles, so this appearance holds still too.',
      },
    },
  },
};

export const NoResults: Story = {
  args: stubbed([noResultsResult]),
  parameters: {
    docs: {
      description: {
        story:
          'No exact match for what the shopper asked for. The API supplies both the explanation ' +
          'and the products it fell back to, in its normal response, so the library renders this ' +
          'the same way it renders a direct hit.',
      },
    },
  },
};

export const NoHistory: Story = {
  args: stubbed([noHistoryResult]),
  parameters: {
    docs: {
      description: {
        story:
          'A shopper the API has nothing personal to go on. Again the API decides, and sends a ' +
          'general title with general products, so the library does not branch.',
      },
    },
  },
};

export const UnsupportedRequest: Story = {
  args: stubbed([designedResult, new AgentRequestError(422)]),
  parameters: {
    docs: {
      description: {
        story:
          'Submit something the agent will not act on, such as "paint my house". The response ' +
          'already on screen is untouched - same title, same products, same options - and the ' +
          'only change is a red border on the input with a message underneath it. The message ' +
          'clears on the next refinement. The stub rejects every request after the first, so ' +
          'refine once to see it.',
      },
    },
  },
};

export const PartialResponse: Story = {
  args: stubbed([partialResult]),
  parameters: {
    docs: {
      description: {
        story:
          'The response arrived but is marked degraded, which means the products are usable and ' +
          'the personalized part is not. The pod shows them under "Best selling products" rather ' +
          'than inventing a title.',
      },
    },
  },
};

export const ErrorWhileRefining: Story = {
  args: stubbed([designedResult, new AgentRequestError(500)]),
  parameters: {
    docs: {
      description: {
        story:
          'Refine once and the request fails. The products already on screen stay, under "Best ' +
          'selling products", rather than disappearing mid-session. There is no warning panel ' +
          "and no message under the input - a failure that is not the shopper's fault is not " +
          'presented as one.',
      },
    },
  },
};

export const ServerError: Story = {
  args: stubbed([new AgentRequestError(500)]),
  parameters: {
    docs: {
      description: {
        story:
          '**This story renders nothing, and that is the expected result.** The very first ' +
          'request failed, so there are no products to show, and the pod renders no markup at ' +
          'all rather than an empty shell - whatever the retailer already had in that slot shows ' +
          'through instead. A failure on a *later* request behaves differently: see ' +
          '`ErrorWhileRefining`.',
      },
    },
  },
};

export const LiveApiToday: Story = {
  args: baseArgs,
  parameters: {
    docs: {
      description: {
        story:
          '**Visibly wrong on purpose.** No stand-in client, so this is the real API as it ' +
          'behaves today. The title is a long Q&A answer instead of a short line, and the ' +
          'options are questions about the product instead of ways to narrow the products down. ' +
          'The layout, the loading states and the refinement flow are all real; only the ' +
          'content is wrong, and it is wrong in one place - `getRecs` in the agent client.',
      },
    },
  },
};
