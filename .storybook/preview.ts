import type { Preview } from '@storybook/react'
import './storybook-styles.css';

const preview: Preview = {
  parameters: {
    a11y: {
      // Ratchet default: report violations without failing. Individual stories opt
      // into blocking with `parameters: { a11y: { test: 'error' } }` once fixed.
      test: 'todo',
      options: {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
        // axe-core ships its WCAG 2.2 rules disabled by default.
        rules: { 'target-size': { enabled: true } },
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'General',
          ['Introduction'],
          'Components',
          'Hooks',
        ]
      }
    },
  },
};

export default preview;
