import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'pwa-manifest.json',
      manifest: {
        name: 'CouponPal',
        short_name: 'CouponPal',
        description: 'Find the best coupons automatically!',
        theme_color: '#8b5cf6',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
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
