import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Input from '../../../components/Input/Input';

const meta = {
  title: 'Internal/Input',
  component: Input,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
  },
  args: { onSubmit: fn() },
  tags: ['!dev'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Type your question...',
  },
};

export const NoPlaceholder: Story = {
  args: {
    placeholder: '',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
