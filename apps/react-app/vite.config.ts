import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@geo-editor/core': path.resolve(__dirname, '../../libs/core/src/index.ts'),
    },
  },
});
