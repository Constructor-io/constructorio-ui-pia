import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ErrorBlock from '../../../components/Error/ErrorBlock';

const meta = {
  title: 'Components/ErrorBlock',
  component: ErrorBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
  },
} satisfies Meta<typeof ErrorBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Error fetching data',
    onRetry: fn(),
  },
};

export const TimeOutError: Story = {
  args: {
    message:
      'This request took longer than expected and couldn’t be processed. Try refining your question.',
  },
};

export const ServerOverloadError: Story = {
  args: {
    message: 'Our servers are currently experiencing some issues. Try again later.',
  },
};

export const UnknownError: Story = {
  args: {
    message: 'Oops! Something went wrong. To fix it, you can try sending the message again.',
    onRetry: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'The retry button should only be displayed when onRetry function is provided.',
      },
    },
  },
};
