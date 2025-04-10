import type { Meta, StoryObj } from '@storybook/react';
import Answer from '../../../components/Answer/Answer';

const meta = {
  title: 'Components/Answer',
  component: Answer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Answer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'This is an answer text that should be displayed in the Answer component.',
  },
};

export const Loading: Story = {
  args: {
    text: '',
    isLoading: true,
  },
};
