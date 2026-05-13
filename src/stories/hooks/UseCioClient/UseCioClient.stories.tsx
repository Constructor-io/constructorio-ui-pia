import type { Meta, StoryObj } from '@storybook/react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import UseCioClientExample from './UseCioClientExample';
import { DEMO_API_KEY } from '../../../constants';

const meta = {
  title: 'Hooks/UseCioClient',
  component: UseCioClientExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseCioClientExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiKey: DEMO_API_KEY,
  },
};

export const WithCustomClient: Story = {
  args: {
    cioClient: new ConstructorIOClient({
      apiKey: DEMO_API_KEY,
      serviceUrl: 'https://custom.client.com',
      sendTrackingEvents: true,
    }),
  },
};
