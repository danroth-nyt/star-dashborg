import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only use base path in production for GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/star-dashborg/' : '/',
})
