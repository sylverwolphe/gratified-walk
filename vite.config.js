import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    // Remove the assetsDir line - let Vite use default
  },
  server: {
    port: 3000
  }
})
