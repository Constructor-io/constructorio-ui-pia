import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ProductCard from '../../../components/ProductCard/ProductCard';

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    title: 'The Quilted Clubhouse Jacket (Navy)',
    price: '$159.00',
  },
};

export const LongTitle: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    title: 'The Quilted Clubhouse Jacket with Extended Name That Should Truncate',
    price: '$159.00',
  },
};

export const ShortTitle: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    title: 'Basic Tee',
    price: '$29.00',
  },
};

export const WithoutClickHandler: Story = {
  args: {
    imageUrl: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&h=400&fit=crop',
    title: 'The Sherpa Collar Bomber (Navy)',
    price: '$99.00',
    onClick: undefined,
  },
};
