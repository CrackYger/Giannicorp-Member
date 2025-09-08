
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'icons/maskable-512.png'],
      manifest: {
        name: 'Giannicorp Member',
        short_name: 'Member',
        description: 'Abo-Katalog, Anfragen & Support für Giannicorp',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: { enabled: true }
    }),
  ],
  server: {
    host: true,          // Expose to LAN (0.0.0.0)
    port: 5173,
    strictPort: true,
    hmr: {
      // If HMR on iPad misbehaves, set your LAN IP:
      // host: '192.168.0.123'
    }
  }
})
