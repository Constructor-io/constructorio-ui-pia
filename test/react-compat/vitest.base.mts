import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plain object rather than vitest's defineConfig(): this file lives outside the
// fixture, so 'vitest/config' does not resolve from here. defineConfig is only
// an identity helper for editor types, so dropping it changes nothing at runtime.
export default {
  server: {
    fs: {
      allow: [__dirname],
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: [path.resolve(__dirname, 'setup.ts')],
  },
};
