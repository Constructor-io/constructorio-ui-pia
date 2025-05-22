# Constructor AI Shopping Assistant PDP UI library

![minzipped size](https://img.shields.io/bundlephobia/minzip/@constructor-io/constructorio-ui-asa-pdp?color=green)
[![NPM Version](https://img.shields.io/npm/v/@constructor-io/constructorio-ui-asa-pdp)](https://www.npmjs.com/package/@constructor-io/constructorio-ui-asa-pdp)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Constructor-io/constructorio-ui-asa-pdp/blob/main/LICENSE)

## Introduction

ASA PDP is an NLP chatbot embedded in product detail pages, designed to answer key technical product questions essential for final purchase decisions.

Our [Storybook Docs](https://constructor-io.github.io/constructorio-ui-asa-pdp/?path=/docs/general-introduction--docs) are the best place to explore the behavior and the available configuration options for this UI library.

<img src="https://raw.githubusercontent.com/Constructor-io/constructorio-ui-asa-pdp/refs/heads/main/src/assets/asa-pdp-demo.png?token=GHSAT0AAAAAAC5V46QGEALKHJ446SQXKNQG2BEEL7A" alt="AI Shopping Assistant PDP UI demonstration" />

## Installation

```bash
npm i @constructor-io/constructorio-ui-asa-pdp
```

## Usage

### Using the JavaScript Bundle

This is a framework agnostic method that can be used in any JavaScript project. The `CioAsaPdp` function provides a simple interface to inject the ASA PDP component into the provided `selector`.

In addition to [ASA PDP component props](https://constructor-io.github.io/constructorio-ui-asa-pdp/?path=/docs/components-cioasapdp--docs), this function also accepts `selector` and `includeCSS`.

```js
import CioAsaPdp from '@constructor-io/constructorio-ui-asa-pdp/constructorio-ui-asa-pdp-bundled';

CioAsaPdp({
  selector: '#asa-pdp-container',
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
