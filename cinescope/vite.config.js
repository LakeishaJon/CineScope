import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './frontend',
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    port: 5173
  },
  css: {
    postcss: './postcss.config.js'
  }
})