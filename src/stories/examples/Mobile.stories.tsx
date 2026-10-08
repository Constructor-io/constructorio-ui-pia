import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../constants';
import { functionArgTypes } from '../utils';

const meta = {
  title: 'Examples/Mobile',
  component: CioPia,
  parameters: {
    a11y: { test: 'error' },
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  argTypes: functionArgTypes,
  tags: ['!dev'],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      showFeedback: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default inline widget at a mobile viewport (320px). The carousel media queries ' +
          'respond to the viewport width — use the viewport toolbar to preview other device sizes.',
      },
    },
  },
};
