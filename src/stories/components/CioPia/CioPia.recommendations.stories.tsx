import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';
import type { Item } from '../../../types';
import { FeedbackType } from '../../../types';

const meta = {
  title: 'General/Integration Guide/Examples',
  component: CioPia,
  parameters: {
    layout: 'centered',
  },
  tags: [],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
  },
};

export const WithAllCallbacks: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      showFeedback: true,
    },
    callbacks: {
      onQuestionSubmit: (question: string) => {
        console.log('Question submitted:', question);
      },
      onProductCardClick: (item: Item) => {
        console.log('Product clicked:', item.id, item.name);
      },
      onFeedback: (type: FeedbackType) => {
        console.log('Feedback submitted:', type);
      },
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<CioPia
  apiKey="YOUR_API_KEY"
  itemId="YOUR_ITEM_ID"
  displayConfigs={{ showFeedback: true }}
  callbacks={{
    onQuestionSubmit: (question) => {
      console.log('Question submitted:', question);
    },
    onProductCardClick: (item) => {
      console.log('Product clicked:', item.id, item.name);
    },
    onFeedback: (type) => {
      console.log('Feedback submitted:', type); // 'up' | 'down'
    },
  }}
/>`,
      },
    },
  },
};

export const WithTrackingExample: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      showFeedback: true,
    },
    callbacks: {
      onQuestionSubmit: (question: string) => {
        console.log('[Analytics] Question submitted:', question);
      },
      onProductCardClick: (item: Item) => {
        console.log('[Analytics] Product clicked:', item.id, item.name);
      },
      onFeedback: (type: FeedbackType) => {
        console.log('[Analytics] Feedback:', type);
      },
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<CioPia
  apiKey="YOUR_API_KEY"
  itemId="YOUR_ITEM_ID"
  displayConfigs={{ showFeedback: true }}
  callbacks={{
    onQuestionSubmit: (question) => {
      analytics.track('PIA Question Submitted', { question });
    },
    onProductCardClick: (item) => {
      analytics.track('PIA Product Clicked', {
        productId: item.id,
        name: item.name,
        price: item.price,
      });
    },
    onFeedback: (type) => {
      analytics.track('PIA Feedback', { type });
    },
  }}
/>`,
      },
    },
  },
};

export const CustomProductCardWithTracking: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    callbacks: {
      onProductCardClick: (item: Item) => {
        console.log('Product clicked:', item.id, item.name);
      },
    },
    componentOverrides: {
      carousel: {
        item: {
          reactNode: ({ item }) => (
            <div
              style={{
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                textAlign: 'center',
                minWidth: '140px',
              }}>
              {item?.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item?.name}
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
              )}
              <p style={{ fontSize: '13px', fontWeight: 500, margin: '8px 0 4px' }}>{item?.name}</p>
              {item?.price && (
                <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: 600, margin: 0 }}>
                  ${item.price}
                </p>
              )}
            </div>
          ),
        },
      },
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<CioPia
  apiKey="YOUR_API_KEY"
  itemId="YOUR_ITEM_ID"
  callbacks={{
    onProductCardClick: (item) => {
      analytics.track('Product Clicked', { id: item.id, name: item.name });
      if (item.url) window.open(item.url, '_blank', 'noopener,noreferrer');
    },
  }}
  componentOverrides={{
    carousel: {
      item: {
        reactNode: ({ item }) => (
          <div className="my-product-card">
            {item?.imageUrl && <img src={item.imageUrl} alt={item?.name} />}
            <p>{item?.name}</p>
            {item?.price && <span>\${item.price}</span>}
          </div>
        ),
      },
    },
  }}
/>`,
      },
    },
  },
};

const prependCdnBase = (url: string) => (url.startsWith('/') ? `https://example.com${url}` : url);

export const WithFormatterAndTracking: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    formatters: {
      formatImageUrl: prependCdnBase,
    },
    callbacks: {
      onProductCardClick: (item: Item) => {
        console.log('Product clicked:', item.id);
      },
    },
  },
  parameters: {
    docs: {
      source: {
        code: `// Define outside the component to avoid unnecessary re-renders
const formatImageUrl = (url) =>
  url.startsWith('/') ? \`https://cdn.example.com\${url}\` : url;

<CioPia
  apiKey="YOUR_API_KEY"
  itemId="YOUR_ITEM_ID"
  formatters={{ formatImageUrl }}
  callbacks={{
    onProductCardClick: (item) => {
      analytics.track('Product Clicked', { id: item.id });
    },
  }}
/>`,
      },
    },
  },
};
