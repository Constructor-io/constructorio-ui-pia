import type { Meta, StoryObj } from '@storybook/react';
import CioPia from '../../../components/CioPia/CioPia';
import { DEMO_API_KEY, DEMO_ITEM_ID, DISCLAIMER_TEXT } from '../../../constants';

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
      'Any questions about this product?': 'Got a question? Ask our AI assistant!',
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
      'Any questions about this product?': '¿Alguna pregunta sobre este producto?',
      'Ask anything': 'Pregunta lo que quieras',
      Send: 'Enviar',
      [DISCLAIMER_TEXT]: 'Las respuestas de IA pueden no ser siempre precisas.',
      'Is this answer useful?': '¿Es útil esta respuesta?',
      'Learn More.': 'Más información.',
      'Ask about this product': 'Pregunta sobre este producto',
    },
  },
};
