import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
})
