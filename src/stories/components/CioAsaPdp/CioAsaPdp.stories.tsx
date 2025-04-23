import type { Meta, StoryObj } from '@storybook/react';
import CioAsaPdp from '../../../components/CioAsaPdp/CioAsaPdp';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Components/CioAsaPdp',
  component: CioAsaPdp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CioAsaPdp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
  },
};
