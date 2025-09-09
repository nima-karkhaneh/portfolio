import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // expose to LAN (same as 0.0.0.0 in Vite 6)
    port: 5173,   // optional, but good to be explicit
  }
})
