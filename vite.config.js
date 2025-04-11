import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '3ae136ae-a5de-4351-85cc-4b56963af724-00-1bhn45hk2nnyl.sisko.replit.dev'
    ]
  }
})
