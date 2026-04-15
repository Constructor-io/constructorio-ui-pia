# Constructor.io AI Product Insights Agent UI Library

![minzipped size](https://img.shields.io/bundlephobia/minzip/@constructor-io/constructorio-ui-pia?color=green)
[![NPM Version](https://img.shields.io/npm/v/@constructor-io/constructorio-ui-pia)](https://www.npmjs.com/package/@constructor-io/constructorio-ui-pia)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Constructor-io/constructorio-ui-pia/blob/main/LICENSE)

## Introduction

[Constructor.io's AI Product Insights Agent](https://constructor.io/) is an NLP chatbot embedded in product detail pages, designed to answer key technical product questions essential for final purchase decisions. This UI library simplifies the integration process by providing React components that handle the fetching and rendering logic for the AI Product Insights Agent. TypeScript support is available.

[Our Storybook Docs](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/general-introduction--docs) are the best place to explore the behavior and the available configuration options for this UI library.

## Installation

```bash
npm i @constructor-io/constructorio-ui-pia
```

## Usage

### Using the React Component

The `CioPia` component handles state management, data fetching, and rendering logic for the AI Product Insights Agent.

```jsx
import CioPia from '@constructor-io/constructorio-ui-pia';

function YourComponent() {
  return (
    <CioPia apiKey='YOUR_API_KEY' itemId='PRODUCT_ITEM_ID' />
  );
}
```

### Using the JavaScript Bundle

This is a framework agnostic method that can be used in any JavaScript project. The `CioPia` function provides a simple interface to inject the PIA component into the provided `selector`.

In addition to [PIA component props](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/components-ciopia--docs), this function also accepts `selector` and `includeCSS`.

```js
import CioPia from '@constructor-io/constructorio-ui-pia/constructorio-ui-pia-bundled';

CioPia({
  selector: '#pia-container',
  includeCSS: true, // Include the default CSS styles - defaults to true
  apiKey: 'YOUR_API_KEY',
  itemId: 'PRODUCT_ITEM_ID',
  variationId: 'VARIATION_ID',
  // Optional: provide a thread ID to preserve conversation context (must be a valid UUID)
  threadId: '550e8400-e29b-41d4-a716-446655440000',
});
```

## Custom Styling

### Library defaults

By default, importing React components from this library does not pull any CSS into your project.

If you wish to use some starter styles from this library, add an import statement similar to the example below:

```js
import '@constructor-io/constructorio-ui-pia/styles.css';
```

- These starter styles can be used as a foundation to build on top of, or just as a reference for you to replace completely.
- To opt out of all default styling, do not import the `styles.css` stylesheet.
- All starter styles in this library are scoped within the `.cio-pia` CSS selector.
- These starter styles are intended to be extended by layering in your own CSS rules.

> Note: When using the JavaScript Bundle, CSS is included by default via the `includeCSS` option (defaults to `true`).

## Requirements

- Node.js v18.20.3 (LTS Hydrogen)
- React >=16.12.0
- React DOM >=16.12.0

## Local Development

```bash
npm ci                  # install dependencies for local dev
npm run dev             # start a local dev server for Storybook
npm run lint            # run linter
npm run test            # run tests
npm run compile         # build the library
```

## Supporting Docs

- [Storybook Docs](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/general-introduction--docs)
- [Constructor.io API Documentation](https://docs.constructor.io/)

## Related Libraries

- [@constructor-io/constructorio-client-javascript](https://github.com/Constructor-io/constructorio-client-javascript) — JavaScript client for Constructor.io API
- [@constructor-io/constructorio-ui-autocomplete](https://github.com/Constructor-io/constructorio-ui-autocomplete) — Autocomplete UI library
- [@constructor-io/constructorio-ui-plp](https://github.com/Constructor-io/constructorio-ui-plp) — Product Listing Page UI library
- [@constructor-io/constructorio-ui-quizzes](https://github.com/Constructor-io/constructorio-ui-quizzes) — Quizzes UI library

## About Constructor.io

[Constructor.io](https://constructor.io/) is an AI-powered product discovery platform that helps e-commerce companies deliver the best possible shopping experiences. Its services include search, browse, recommendations, and quizzes — all optimized with machine learning to drive revenue and conversions.

## License

MIT © Constructor.io