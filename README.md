<div align="center">
  <img src="https://constructor.com/hubfs/constructor-favicon-2024-1.svg" alt="constructor logo" title="constructor logo" width="220px" height="220px">
  
  <h1>AI Shopping Assistant PDP UI library</h1>

  <p align="center" style="font-size: 1.2rem;">ASA PDP is an NLP chatbot embedded in product detail pages, designed to answer key technical product questions essential for final purchase decisions.</p>

[**Read The Docs**](https://constructor-io.github.io/constructorio-ui-asa-pdp)

</div>

<hr />
<div align="center">

![minzipped size](https://img.shields.io/bundlephobia/minzip/@constructor-io/constructorio-ui-asa-pdp?color=green&style=flat-square)
[![NPM Version](https://img.shields.io/npm/v/@constructor-io/constructorio-ui-asa-pdp?style=flat-square)](https://www.npmjs.com/package/@constructor-io/constructorio-ui-asa-pdp)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Constructor-io/constructorio-ui-asa-pdp/blob/main/LICENSE)

<img src="src/assets/asa-pdp-demo.png" alt="AI Shopping Assistant PDP UI demonstration" />

</div>

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
