import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [cssInjectedByJsPlugin({
    styleId: 'cio-asa-pdp-styles'
  })],
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      input: {
        app: "./src/bundled.jsx",
      },
      output: {
        entryFileNames: `constructorio-ui-asa-pdp-bundled.js`,
      },
    },
  },
});
