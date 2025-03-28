import type { Meta, StoryObj } from '@storybook/react';
import UseCioClientExample from './UseCioClientExample';
import { DEMO_API_KEY } from '../../../constants';
import MockConstructorIOClient from '../../../hooks/mocks/MockConstructorIOClient';

const meta = {
  title: 'Hooks/UseCioClient',
  component: UseCioClientExample,
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
    cioClient: new MockConstructorIOClient({
      apiKey: DEMO_API_KEY,
      serviceUrl: 'https://custom.client.com',
      quizzesServiceUrl: 'https://custom.client.quiz.com',
      assistantServiceUrl: 'https://custom.client.assistant.com',
      sendTrackingEvents: true,
      beaconMode: true,
    }),
  },
};
