import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // 🔥 attiva PWA anche in dev
      },
      manifest: {
        name: 'EnjoyEat',
        short_name: 'EnjoyEat',
        description: 'Gestione ordini ristorante',
        theme_color: '#111',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwaProLogo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwaLogo512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
