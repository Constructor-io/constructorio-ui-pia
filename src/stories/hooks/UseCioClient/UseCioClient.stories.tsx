import type { Meta, StoryObj } from '@storybook/react';
import UseCioClientExample from './UseCioClientExample';
import { DEMO_API_KEY } from '../../../constants';
import CioClient from '../../../hooks/mocks/CioClient';

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
    cioClient: new CioClient({
      apiKey: DEMO_API_KEY,
      serviceUrl: 'https://custom.client.com',
      quizzesServiceUrl: 'https://custom.client.quiz.com',
      agentServiceUrl: 'https://custom.client.agent.com',
      sendTrackingEvents: true,
      beaconMode: true,
    }),
  },
};
