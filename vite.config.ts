/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Base path: '/sxg-knowledge-hub/' for GitHub Pages
// Change to '/' for Azure Static Web Apps / local dev
export default defineConfig({
  plugins: [react()],
  base: '/sxg-knowledge-hub/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/', 'src/data/', 'src/types/'],
    },
  },
})
