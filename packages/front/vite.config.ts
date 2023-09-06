import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: '',
        secure: false,
        ws: false,
        rewrite: (path) => (path === '/' ? path : '/index.html')
      }
    }
  }
})
