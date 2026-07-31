import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Components/CioPia/Mobile',
  component: CioPia,
  parameters: {
    // Fixed and verified against axe - keep it that way.
    a11y: { test: 'error' },
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  tags: ['autodocs'],
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
