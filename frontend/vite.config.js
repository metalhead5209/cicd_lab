/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'




// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  test: {
    environment: 'jsdom',   // lets React Testing Library access document/window
    globals: true,
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:5173'
      }
    }            // enables global Vitest functions (describe, it, expect)
  }
})