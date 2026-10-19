import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5180, // also set in runapp.bat and shutdown.bat
    strictPort: true, // fail instead of silently switching to another port
  },
})
