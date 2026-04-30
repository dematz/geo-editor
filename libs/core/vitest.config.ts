import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/use-cases/**/*.ts'],
      exclude: ['src/**/__tests__/**', 'src/**/index.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@core/domain':         resolve(__dirname, 'src/domain/index.ts'),
      '@core/use-cases':      resolve(__dirname, 'src/use-cases/index.ts'),
      '@core/infrastructure': resolve(__dirname, 'src/infrastructure/index.ts'),
    },
  },
});
