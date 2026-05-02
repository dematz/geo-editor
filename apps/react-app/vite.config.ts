import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@geo-editor/core':      path.resolve(__dirname, '../../libs/core/src/index.ts'),
      '@geo-editor/ui-react':  path.resolve(__dirname, '../../libs/design-system-react/src/index.ts'),
      '@geo-editor/tokens':    path.resolve(__dirname, '../../libs/design-tokens/src/index.css'),
    },
  },
});
