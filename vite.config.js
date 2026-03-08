import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/italian-flashcards/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Parole – Italian Vocabulary',
        short_name: 'Parole',
        description: 'Learn Italian vocabulary with spaced repetition',
        theme_color: '#0f1117',
        background_color: '#0f1117',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/italian-flashcards/',
        scope: '/italian-flashcards/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Pre-cache everything in the build output
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        runtimeCaching: [
          {
            // Cache word data chunks at runtime (they're loaded lazily)
            urlPattern: /\/italian-flashcards\/assets\/words-\d+-.+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'word-data',
              expiration: { maxEntries: 15, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
        },
      },
    },
  },
})
