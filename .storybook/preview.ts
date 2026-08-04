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
        // Rules axe ships disabled by default: WCAG 2.2, plus best-practice ones
        // that are meaningful for isolated components (landmark/page-level ones are not).
        rules: {
          'target-size': { enabled: true },
          'aria-dialog-name': { enabled: true },
          'aria-allowed-role': { enabled: true },
          'presentation-role-conflict': { enabled: true },
          'focus-order-semantics': { enabled: true },
          tabindex: { enabled: true },
        },
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
