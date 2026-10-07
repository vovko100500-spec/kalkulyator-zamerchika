/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || '/',
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.io', '.trycloudflare.com'],
  },
  test: {
    globals: false,
  },
})
