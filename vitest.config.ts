import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['src/app/**', 'node_modules/**'],
  },
});
