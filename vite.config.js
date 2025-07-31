import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Important for relative paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000
  }
})
