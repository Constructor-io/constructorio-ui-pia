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
    clientSecret:
      'cs_test_b1ZAiDKMyi8r6D0qfXgNOhKchjBbxV60s59cxgHZD77PjeURUBpk0M1ZOf_secret_fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0UUNwXUpMa09GcHQ3NU1tQW1rb25iNkldXU1NXzVkYGJ%2FaGppTWRmMVV3a3JjPFd2dlZjamlTMTBrPXNSc0phT313QFRQVFV0PTM3a05WTWBzPVJJUj12NTVVQG5HRn9KZCcpJ3BsSGphYCc%2FJ2BoZ2BhYWBhJyknaWR8anBxUXx1YCc%2FJ2hwaXFsWmxxYGgnKSd3YGFsd2BmcUprRmpodWlgcWxqayc%2FJ2tgc2B3JyknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYyd4JSUl',
    publishableKey:
      'pk_test_51TFuXOInJCuq20HhDhnjkg3LXXHHZ0aegzmolHac4Prnwf9RssSfolV45n8vWvOdJxrEQUQPq862nKSHev8WLW8s00PEkBCzOa',
  });

const demoSession2 = () =>
  Promise.resolve({
    clientSecret:
      'cs_test_b1ZAiDKMyi8r6D0qfXgNOhKchjBbxV60s59cxgHZD77PjeURUBpk0M1ZOf_secret_fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0UUNwXUpMa09GcHQ3NU1tQW1rb25iNkldXU1NXzVkYGJ%2FaGppTWRmMVV3a3JjPFd2dlZjamlTMTBrPXNSc0phT313QFRQVFV0PTM3a05WTWBzPVJJUj12NTVVQG5HRn9KZCcpJ3BsSGphYCc%2FJ2BoZ2BhYWBhJyknaWR8anBxUXx1YCc%2FJ2hwaXFsWmxxYGgnKSd3YGFsd2BmcUprRmpodWlgcWxqayc%2FJ2tgc2B3JyknZ2RmbmJ3anBrYUZqaWp3Jz8nJmNjY2NjYyd4JSUl',
    publishableKey:
      'pk_test_51TFuXOInJCuq20HhDhnjkg3LXXHHZ0aegzmolHac4Prnwf9RssSfolV45n8vWvOdJxrEQUQPq862nKSHev8WLW8s00PEkBCzOa',
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
