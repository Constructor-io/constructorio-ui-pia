import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Runs axe-core against every story. Storybook 8's runner ignores
 * `parameters.a11y.test`, so it is honoured here: 'error' fails the run,
 * 'off' skips the story, anything else reports without failing.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    const a11y = storyContext.parameters?.a11y;

    if (a11y?.disable || a11y?.test === 'off') return;

    await checkA11y(
      page,
      '#storybook-root',
      {
        detailedReport: true,
        detailedReportOptions: { html: true },
        axeOptions: a11y?.options,
      },
      a11y?.test !== 'error',
    );
  },
};

export default config;
