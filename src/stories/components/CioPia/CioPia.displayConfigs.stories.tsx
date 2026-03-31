import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from '@constructor-io/constructorio-ui-components';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Components/CioPia/DisplayConfigs',
  component: CioPia,
  parameters: {
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
  },
};

const demoSession = () =>
  Promise.resolve({
    clientSecret: 'cs_test_REPLACE_WITH_YOUR_OWN_CLIENT_SECRET',
    publishableKey: 'pk_test_REPLACE_WITH_YOUR_OWN_PUBLISHABLE_KEY',
  });

const demoSession2 = () =>
  Promise.resolve({
    clientSecret: 'cs_test_REPLACE_WITH_YOUR_OWN_CLIENT_SECRET',
    publishableKey: 'pk_test_REPLACE_WITH_YOUR_OWN_PUBLISHABLE_KEY',
  });

export const WithCheckout: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    checkoutProps: [
      {
        session: demoSession,
        items: { name: 'Demo Product', amount: 49.99, currencySign: '$' },
        triggerLabel: 'Buy Now - $49.99',
      },
    ],
  },
};

export const WithFeedback: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      showFeedback: true,
    },
  },
};

export const WithLearnMore: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      learnMoreUrl: 'https://constructor.io/learn-more',
    },
  },
};

export const ConversationMode: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      mode: 'conversation',
      showFeedback: true,
    },
  },
};

export const ModalType: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      type: 'modal',
      showFeedback: true,
    },
  },
};

export const ConversationWithCheckout: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      mode: 'conversation',
      showFeedback: true,
    },
    checkoutProps: [
      {
        session: demoSession,
        items: { name: 'Demo Product', amount: 49.99, currencySign: '$' },
        trigger: (
          <ProductCard
            product={{
              id: 'demo-product-1',
              name: 'Demo Product',
              price: 49.99,
              imageUrl: 'https://placehold.co/256x224',
              description: 'Click to checkout',
            }}
            priceCurrency='$'
          />
        ),
      },
    ],
  },
};

export const InlineCheckout: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      mode: 'conversation',
      showFeedback: true,
    },
    checkoutProps: [
      {
        session: demoSession,
        items: { name: 'Demo Product', amount: 49.99, currencySign: '$' },
        triggerLabel: 'Buy Now - $49.99',
        displayMode: 'inline',
      },
    ],
  },
};

export const ModalWithCheckout: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      type: 'modal',
      showFeedback: true,
    },
    checkoutProps: [
      {
        session: demoSession,
        triggerLabel: 'Buy Now - $49.99',
        translations: { 'CioCheckout.checkout.title': 'Complete Your Purchase' },
      },
      {
        session: demoSession2,
        triggerLabel: 'Buy All - $149.99',
        translations: { 'CioCheckout.checkout.title': 'Empty your cart' },
      },
    ],
  },
};

export const ModalWithInlineCheckout: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      type: 'modal',
      showFeedback: true,
    },
    checkoutProps: [
      {
        session: demoSession,
        items: { name: 'Demo Product', amount: 49.99, currencySign: '$' },
        triggerLabel: 'Buy Now - $49.99',
        displayMode: 'inline',
        triggerWhen: (state) =>
          state.conversationHistory.length >= 5 && !state.isLoading && !state.error,
      },
    ],
  },
};
