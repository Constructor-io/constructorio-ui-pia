import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID } from '../../../constants';

const meta = {
  title: 'Components/CioPia/Translations',
  component: CioPia,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CioPia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomTitle: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    translations: {
      title: 'Got a question? Ask our AI assistant!',
    },
  },
};

export const AllCustomText: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    itemId: DEMO_ITEM_ID,
    displayConfigs: {
      showFeedback: true,
      learnMoreUrl: 'https://constructor.io/learn-more',
    },
    translations: {
      title: '¿Alguna pregunta sobre este producto?',
      inputPlaceholder: 'Pregunta lo que quieras',
      sendButtonText: 'Enviar',
      disclaimerText: 'Las respuestas de IA pueden no ser siempre precisas.',
      feedbackText: '¿Es útil esta respuesta?',
      learnMoreText: 'Más información.',
    },
  },
};
