import type { Preview } from '@storybook/react'
import './storybook-styles.css';

const preview: Preview = {
  parameters: {
    a11y: {
      // Report-only by default; stories opt into blocking with `test: 'error'`.
      test: 'todo',
      options: {
        // No `runOnly`: its tag filter is applied before `rules` below, so a
        // WCAG-only tag list would silently drop every best-practice rule enabled here.
        rules: {
          // Off by default in axe, meaningful for isolated components.
          'target-size': { enabled: true },
          'aria-dialog-name': { enabled: true },
          'aria-allowed-role': { enabled: true },
          'presentation-role-conflict': { enabled: true },
          'focus-order-semantics': { enabled: true },
          tabindex: { enabled: true },
          // Colour is the consumer's to restyle, so contrast is not ours to enforce.
          'color-contrast': { enabled: false },
          // Page-level: a story renders a fragment, not a whole document.
          region: { enabled: false },
          'landmark-one-main': { enabled: false },
          'landmark-unique': { enabled: false },
          'page-has-heading-one': { enabled: false },
          bypass: { enabled: false },
          'skip-link': { enabled: false },
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
