# Constructor AI Product Insights Agent UI library

![minzipped size](https://img.shields.io/bundlephobia/minzip/@constructor-io/constructorio-ui-pia?color=green)
[![NPM Version](https://img.shields.io/npm/v/@constructor-io/constructorio-ui-pia)](https://www.npmjs.com/package/@constructor-io/constructorio-ui-pia)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Constructor-io/constructorio-ui-pia/blob/main/LICENSE)

## Introduction

AI Product Insights Agent is an NLP chatbot embedded in product detail pages, designed to answer key technical product questions essential for final purchase decisions.

Our [Storybook Docs](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/general-introduction--docs) are the best place to explore the behavior and the available configuration options for this UI library.

## Installation

```bash
npm i @constructor-io/constructorio-ui-pia
```

## Usage

### Using the JavaScript Bundle

This is a framework agnostic method that can be used in any JavaScript project. The `CioPia` function provides a simple interface to inject the PIA component into the provided `selector`.

In addition to [PIA component props](https://constructor-io.github.io/constructorio-ui-pia/?path=/docs/components-ciopia--docs), this function also accepts `selector` and `includeCSS`.

```js
import CioPia from '@constructor-io/constructorio-ui-pia/constructorio-ui-pia-bundled';

CioPia({
  selector: '#pia-container',
  includeCSS: true, // Include the default CSS styles - defaults to true
  apiKey: 'key_M57QS8SMPdLdLx4x',
  itemId: '12345',
});
```

## Requirements

- Node.js v18.20.3 (LTS Hydrogen)
- React >=16.12.0
- React DOM >=16.12.0

## License

MIT © Constructor.io
