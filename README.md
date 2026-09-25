# Constructor.io AI Product Insights Agent UI Library

[![npm](https://img.shields.io/npm/v/@constructor-io/constructorio-ui-pia)](https://www.npmjs.com/package/@constructor-io/constructorio-ui-pia)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Constructor-io/constructorio-ui-pia/blob/main/LICENSE)

A UI library that provides React components to manage the fetching and rendering logic for [Constructor.io's AI Product Insights Agent](https://constructor.io/). TypeScript support is available.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Local Development](#local-development)
- [Publishing New Versions](#publishing-new-versions)
- [Supporting Docs](#supporting-docs)
- [Related Libraries](#related-libraries)
- [License](#license)

## Overview

[Constructor.io's AI Product Insights Agent](https://constructor.io/) is an NLP chatbot embedded in product detail pages, designed to answer key technical product questions essential for final purchase decisions. This UI library simplifies the integration process by providing React components that handle the fetching and rendering logic for the AI Product Insights Agent.

[Our Storybook Docs](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/general-introduction--docs) are the best place to explore the behavior and the available configuration options for this UI library.

## Installation

```bash
npm i @constructor-io/constructorio-ui-pia
```

### Prerequisites

- Node.js >= 20
- React >= 16.12.0
- React DOM >= 16.12.0

## Usage

### Using the React Component

The `CioPia` component handles state management, data fetching, and rendering logic for the AI Product Insights Agent.

```jsx
import CioPia from '@constructor-io/constructorio-ui-pia';
import '@constructor-io/constructorio-ui-pia/styles.css';

function YourComponent() {
  return (
    <CioPia apiKey='YOUR_API_KEY' itemId='PRODUCT_ITEM_ID' />
  );
}
```

#### Display Modes

The component supports multiple display modes via the `displayConfigs` prop:

```jsx
// Default inline mode
<CioPia apiKey='YOUR_API_KEY' itemId='PRODUCT_ITEM_ID' />

// Conversation mode with chat history
<CioPia
  apiKey='YOUR_API_KEY'
  itemId='PRODUCT_ITEM_ID'
  displayConfigs={{ mode: 'conversation' }}
/>

// Modal mode
<CioPia
  apiKey='YOUR_API_KEY'
  itemId='PRODUCT_ITEM_ID'
  displayConfigs={{ type: 'modal' }}
/>
```

#### A/B Testing

Attach test cells to PIA tracking events, and track the control group without showing the widget:

```jsx
// Test arm: the widget renders, events carry ef-constructorio=variant_a
<CioPia
  apiKey="key_XXXXXXXX"
  itemId={itemId}
  itemName={itemName}
  abTest={{ testCells: { constructorio: 'variant_a', your_other_test: 'variant_b' }, isControl: false }}
/>

// Control arm: nothing visible renders, but the view event still fires with the control cell
<CioPia
  apiKey="key_XXXXXXXX"
  itemId={itemId}
  itemName={itemName}
  abTest={{ testCells: { constructorio: 'control' }, isControl: true }}
/>
```

Mount `CioPia` on every PDP and switch `isControl` per shopper — no placeholder markup of your own
is required.

`testCells` is `{ [testName]: cellName }`, and both halves are yours: the keys are your own test
names, not values Constructor defines. Each entry is sent as its own `ef-<testName>` parameter, so
a shopper in several concurrent tests carries every cell. Empty or non-string values are dropped,
so a cell read from a global that resolves to `undefined` is simply not sent.

Both arms fire the same `product_insights_agent.view` event through the same viewport tracking,
so the control group is measured the same way as the test group.

If you supply your own `cioClient`, that client owns its own options: set `testCells` there
instead, as a `ConstructorIOClient` constructor option. `abTest.testCells` is ignored in that
case, and passing both logs a warning rather than dropping the value silently.

`isControl` is required. Stating the arm per shopper is the one thing only you can know, and
omitting it would quietly put everyone in the test arm with no control group to compare against.

#### Configuration Options

| Prop | Type | Description |
|------|------|-------------|
| `apiKey` | `string` | Your Constructor.io API key (required) |
| `itemId` | `string` | The product item ID (required) |
| `variationId` | `string` | Optional variation ID |
| `threadId` | `string` | Optional thread ID for conversation context (must be a valid UUID) |
| `initialConversationHistory` | `ConversationEntry[]` | Entries to show before the first question, read once on mount. Conversation and modal modes only (see [Restoring a conversation](#restoring-a-conversation)) |
| `displayConfigs` | `object` | Display configuration options (see below) |
| `trackingConfigs` | `object` | Tracking configuration options (see below) |
| `callbacks` | `object` | Callback handlers for user interactions |
| `translations` | `object` | UI string translations for internationalization |
| `componentOverrides` | `object` | Custom component overrides |
| `abTest` | `object` | A/B test configuration — test cells for tracking, and a control-group placeholder (see below) |

**Display Configs:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `'default' \| 'conversation' \| 'recommendations'` | `'default'` | Display mode. `'recommendations'` is accepted by the type but not yet available — it renders nothing. |
| `type` | `'inline' \| 'modal'` | `'inline'` | Component type |
| `showFeedback` | `boolean` | `false` | Show feedback controls on answers |
| `showPreviousItems` | `boolean` | `true` | Show product carousels from previous conversation entries |
| `learnMoreUrl` | `string` | - | URL for the "Learn More" disclaimer link |

**Tracking Configs:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `viewThreshold` | `number` | `0.5` | Fraction of the container (0–1) that must be visible before the `product_insights_agent.view` event fires. Lower it (e.g. `0.01`) to have the view event fire on minimal visibility. |

**AB Test:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `testCells` | `Record<string, string>` | - | `{ [testName]: cellName }`, each sent as an `ef-<testName>` tracking parameter. Ignored when you supply your own `cioClient`. |
| `isControl` | `boolean` | required | Renders an invisible, tracking-only placeholder instead of the widget, so the control arm still records a view event. Takes precedence over `displayConfigs.mode`. |

**Callbacks:**

| Option | Type | Description |
|--------|------|-------------|
| `onQuestionSubmit` | `(question: string) => void` | Called when a question is submitted (via Enter key, Send button, or suggested question click) |
| `onProductCardClick` | `(item: Item) => void` | Called when a product card in the carousel is clicked |
| `onAddToCart` | `(item: Item, event: React.MouseEvent) => void` | Called when the "Add to Cart" button on a product card is clicked. Passing this callback is what renders the button; without it no cart control is shown |
| `onFeedback` | `(type: 'up' \| 'down') => void` | Called when the user submits positive or negative feedback on an answer |

#### Restoring a conversation

In conversation mode, `onAnswer` receives the whole history after every answer. Store it per product along with the thread ID, then pass both back to pick the conversation up where it left off:

```jsx
const saved = load(itemId);

<CioPia
  key={itemId}
  apiKey='YOUR_API_KEY'
  itemId={itemId}
  threadId={saved?.threadId}
  initialConversationHistory={saved?.history}
  displayConfigs={{ mode: 'conversation' }}
  callbacks={{
    onAnswer: (history, context) =>
      save(context.itemId, { threadId: context.threadId, history }),
  }}
/>
```

- The history is read once, on mount. Changing `itemId` clears it, so store it per product and remount with `key={itemId}` to load the next product's conversation.
- Pass the `threadId` the entries came from. The agent keeps the thread's context server-side, so history shown under a different thread is a transcript the agent does not remember.
- In `type: 'modal'` the entries appear in the dialog, which opens when the shopper asks their next question. Closing the modal clears them, as it does a live conversation.
- The suggested questions row shows the product's suggested questions, not the follow-ups from the last restored answer.
- It is ignored in `mode: 'default'`, which shows only the latest answer, in `mode: 'recommendations'`, and for the A/B control group (`abTest.isControl`).

### Using the JavaScript Bundle

This is a framework-agnostic method that can be used in any JavaScript project. The `CioPia` function provides a simple interface to inject the PIA component into the provided `selector`.

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

## Customization

### Styling

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

### Translations

All UI strings can be customized via the `translations` prop for internationalization:

```jsx
<CioPia
  apiKey='YOUR_API_KEY'
  itemId='PRODUCT_ITEM_ID'
  translations={{
    'Any questions about this product?': 'Have a question about this product?',
    'Ask anything': 'Type your question...',
    Send: 'Submit',
  }}
/>
```

### Component Overrides

You can override individual components using the `componentOverrides` prop. See our [Storybook Docs](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/general-introduction--docs) for available override options.

## Troubleshooting

### Known Issues

**Older JavaScript environments**

The library provides two different builds: CommonJS (cjs) and ECMAScript Modules (mjs).

For ECMAScript Modules (mjs) build, the JavaScript version is ESNext which might not be supported by your environment. If that's the case and your environment is using an older JavaScript version like ES6 (ES2015), you may get this error:

`Module parse failed: Unexpected token (15:32)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file`

To solve this you can import the CommonJS (cjs) build which supports ES6 (ES2015) syntax:

`import CioPia from '@constructor-io/constructorio-ui-pia/cjs'`

**ESLint**

There is a known issue with ESLint where it fails to resolve the paths exposed in the `exports` statement of NPM packages. If you are receiving the following error, you can safely disable ESLint using `// eslint-disable-line` for that line.

`Unable to resolve path to module '@constructor-io/constructorio-ui-pia/styles.css'`

Relevant open issues: [Issue 1868](https://github.com/import-js/eslint-plugin-import/issues/1868), [Issue 1810](https://github.com/import-js/eslint-plugin-import/issues/1810)

## Local Development

### Development Scripts

```bash
npm ci                  # Install dependencies for local dev
npm run dev             # Start a local dev server for Storybook
npm run lint            # Run lint
npm run test            # Run tests
npm run check-types     # Run TypeScript type checking
```

### Library Maintenance

```bash
npm run compile           # Generate lib folder for publishing to npm
npm run build-storybook   # Generate Storybook static bundle for deploy with GitHub Pages
```

## Publishing New Versions

Dispatch the [Publish](https://github.com/Constructor-io/constructorio-ui-pia/actions/workflows/publish.yml) workflow in GitHub Actions. You're required to provide two arguments:

- **Version Strategy**: `major`, `minor`, or `patch`.
- **Title**: A title for the release.

This workflow will automatically:

1. Bump the library version using the provided strategy.
2. Create a new git tag.
3. Create a new GitHub release.
4. Compile the library.
5. Publish the new version to NPM.
6. Deploy the Storybook docs to GitHub Pages.

#### Note: Please don't manually increase the package.json version or create new git tags.

The library version is tracked by releases and git tags. We intentionally keep the package.json version at `0.0.0` to avoid pushing changes to the `main` branch. This solves many security concerns by avoiding the need for branch-protection rule exceptions.

## New Storybook Version

Dispatch the [Deploy Storybook](https://github.com/Constructor-io/constructorio-ui-pia/actions/workflows/deploy-storybook.yml) workflow in GitHub Actions.

#### Note: This is already done automatically when publishing a new version.

## Supporting Docs

- [Storybook Docs](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/general-introduction--docs)
- [Constructor.io API Documentation](https://docs.constructor.io/)

## Related Libraries

- [@constructor-io/constructorio-client-javascript](https://github.com/Constructor-io/constructorio-client-javascript) - JavaScript client for Constructor.io API
- [@constructor-io/constructorio-ui-autocomplete](https://github.com/Constructor-io/constructorio-ui-autocomplete) - Autocomplete UI library
- [@constructor-io/constructorio-ui-plp](https://github.com/Constructor-io/constructorio-ui-plp) - Product Listing Page UI library
- [@constructor-io/constructorio-ui-quizzes](https://github.com/Constructor-io/constructorio-ui-quizzes) - Quizzes UI library

## Contributing

1. Fork the repo and create a new branch.
2. Run `npm ci` to install dependencies.
3. Make your changes.
4. Run `npm run lint` and `npm run test` to verify.
5. Submit a PR for review.

## License

MIT &copy; [Constructor.io Corporation](https://constructor.io/)
