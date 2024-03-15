import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/munich-opendata/',
  server: {
    port: 8000,
    proxy: {
      '*': {
        target: 'https://opendata.muenchen.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  }
})
