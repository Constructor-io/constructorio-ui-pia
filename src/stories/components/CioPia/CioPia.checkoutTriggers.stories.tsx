import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CioPia from '../../../components/CioPia/CioPia';
import type { CheckoutTrigger } from '../../../components/CioPia/types';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';

const meta = {
  title: 'Components/CioPia/CheckoutTriggers',
  component: CioPia,
  parameters: {
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
  argTypes: {
    checkoutTriggers: {
      description: [
        'Checkout entry points rendered below the suggested questions. PIA renders the buttons; the merchant owns the checkout flow.',
        '',
        'Rendered in `default` and `conversation` modes and in the modal, below the answer. `recommendations` mode ignores the prop.',
        '',
        '`id: string` — React key, and forwarded to `renderButton`.',
        '',
        '`label?: string` — Button text. Defaults to the translated `"Checkout"`.',
        '',
        '`disabled?: boolean` — Disables the button, and is forwarded to `renderButton`.',
        '',
        '`triggerWhen?: (state: CioPiaRenderProps) => boolean` — Re-evaluated every render; return `false` to hide. Defaults to always visible.',
        '',
        '`renderButton?: (props) => ReactNode` — Replaces the default button. Receives `{ onClick, label, disabled, id }`.',
        '',
        '`onTrigger: (state: CioPiaRenderProps) => void` — Fires on click, with the current render-props snapshot.',
      ].join('\n'),
      table: { type: { summary: 'CheckoutTrigger[]' } },
    },
  },
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  apiKey: DEMO_API_KEY,
  itemId: DEMO_ITEM_ID,
  itemName: DEMO_ITEM_NAME,
};

/** One always-visible trigger, using the translated default label. */
export const Default: Story = {
  args: {
    ...baseArgs,
    checkoutTriggers: [{ id: 'checkout', onTrigger: action('onTrigger: checkout') }],
  },
};

/** Ask a question, or click a suggested one, to bring the button in. */
export const GatedOnAnswer: Story = {
  args: {
    ...baseArgs,
    checkoutTriggers: [
      {
        id: 'checkout',
        label: 'Buy Now — $24.99',
        triggerWhen: (state) => !!state.currentAnswer,
        onTrigger: action('onTrigger: checkout'),
      },
    ],
  },
};

/** Parallel checkout paths from one widget, all gated on an answer having arrived. */
export const MultipleTriggers: Story = {
  args: {
    ...baseArgs,
    checkoutTriggers: [
      {
        id: 'add-to-cart',
        label: 'Add to cart',
        triggerWhen: (state) => !!state.currentAnswer,
        onTrigger: action('onTrigger: add-to-cart'),
      },
      {
        id: 'buy-now',
        label: 'Buy Now — $24.99',
        triggerWhen: (state) => !!state.currentAnswer,
        onTrigger: action('onTrigger: buy-now'),
      },
      {
        id: 'bundle',
        label: 'Buy 2, save 25% — $37.49',
        triggerWhen: (state) => !!state.currentAnswer,
        onTrigger: action('onTrigger: bundle'),
      },
    ],
  },
};

/** `renderButton` replaces the default button; styling becomes the consumer's. */
export const CustomButton: Story = {
  args: {
    ...baseArgs,
    checkoutTriggers: [
      {
        id: 'checkout',
        label: 'Add to bag & checkout',
        renderButton: ({ onClick, label, disabled }) => (
          <button
            type='button'
            onClick={onClick}
            disabled={disabled}
            style={{
              background: 'linear-gradient(90deg, #6c3df4, #b03df4)',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
            {label}
          </button>
        ),
        onTrigger: action('onTrigger: checkout'),
      },
    ],
  },
};

/** A disabled trigger stays in the tab order and announces its state natively. */
export const Disabled: Story = {
  args: {
    ...baseArgs,
    checkoutTriggers: [
      {
        id: 'checkout',
        label: 'Out of stock',
        disabled: true,
        onTrigger: action('onTrigger: checkout'),
      },
    ],
  },
};

/** Conversation mode renders the bar between the thread and the footer. */
export const ConversationMode: Story = {
  args: {
    ...baseArgs,
    displayConfigs: { mode: 'conversation' },
    checkoutTriggers: [
      {
        id: 'checkout',
        label: 'Buy Now — $24.99',
        onTrigger: action('onTrigger: checkout'),
      },
    ],
  },
};

/** Six triggers, to check how the row wraps. */
export const ManyTriggers: Story = {
  args: {
    ...baseArgs,
    checkoutTriggers: Array.from({ length: 6 }, (_, index): CheckoutTrigger => {
      const id = `trigger-${index + 1}`;
      return { id, label: `Checkout option ${index + 1}`, onTrigger: action(`onTrigger: ${id}`) };
    }),
  },
};
