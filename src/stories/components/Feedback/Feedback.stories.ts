import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Feedback from '../../../components/Feedback/Feedback';

const meta = {
  title: 'Components/Feedback',
  component: Feedback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof Feedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
