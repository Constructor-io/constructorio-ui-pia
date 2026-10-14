import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { renderMarkdown } from '../../utils/contentTransformers';
import '../../components/Answer/AnswerStyles.css';

const PRESETS: Record<string, string> = {
  'Bold and lists': [
    'This shake is a **good everyday option**:',
    '',
    '- 9g protein per bottle',
    '- 26 vitamins and minerals',
    '',
    '1. Shake well',
    '2. Serve chilled',
  ].join('\n'),
  Links: [
    'See our [nutrition guide](/nutrition), email [help@shop.com](mailto:help@shop.com) or call [1-800-555-0100](tel:18005550100).',
    '',
    'A link to another site shows as plain text: [verify your order](https://evil.example/login).',
  ].join('\n'),
  'Blocked content': [
    'Images, inline styles and scripts are removed:',
    '',
    '![tracking pixel](https://evil.example/t.png?q=secret)',
    '<div style="position:fixed;inset:0;background:white">Session expired</div>',
    '<script>alert("xss")</script>',
  ].join('\n'),
};

function FormattedAnswerPreview() {
  const [preset, setPreset] = useState(Object.keys(PRESETS)[0]);
  return (
    <div style={{ width: '420px' }}>
      <div
        role='group'
        aria-label='Answer examples'
        style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            type='button'
            aria-pressed={name === preset}
            onClick={() => setPreset(name)}>
            {name}
          </button>
        ))}
      </div>
      <div
        className='cio-pia-answer'
        // Sanitized by renderMarkdown

        dangerouslySetInnerHTML={{ __html: renderMarkdown(PRESETS[preset]) }}
      />
    </div>
  );
}

const meta = {
  title: 'Examples/Formatted Answers',
  component: FormattedAnswerPreview,
  parameters: {
    a11y: { test: 'error' },
    layout: 'centered',
    docs: {
      source: {
        code: "<div className='cio-pia-answer' dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />",
      },
    },
  },
  tags: ['!dev'],
} satisfies Meta<typeof FormattedAnswerPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Presets: Story = {};
