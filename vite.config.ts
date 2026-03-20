import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path: '/sxg-knowledge-hub/' for GitHub Pages
// Change to '/' for Azure Static Web Apps / local dev
export default defineConfig({
  plugins: [react()],
  base: '/sxg-knowledge-hub/',
})
