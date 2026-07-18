import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.jsx')
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === 'content' ? 'content.js' : 'assets/[name]-[hash].js';
        }
      }
    }
  }
});
