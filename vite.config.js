import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'static' // Use a different name to avoid conflict
  },
  server: {
    port: 3000
  }
})
