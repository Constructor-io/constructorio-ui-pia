import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DEMO_ITEM_NAME } from '../../../constants';

const meta = {
  title: 'Internal/AbTestControlGroup',
  component: CioPia,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
  tags: ['!dev'],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    itemName: DEMO_ITEM_NAME,
    abTest: {
      testCells: { constructorio: 'control', your_other_test: 'variant_b' },
      isControl: true,
    },
  },
};
