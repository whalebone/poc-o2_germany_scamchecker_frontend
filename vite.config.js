import { defineConfig, loadEnv } from 'vite'

// Link previews need an absolute image URL. Netlify sets URL during builds; locally it stays relative.
const siteUrl = process.env.URL ?? ''

export default defineConfig(({ mode }) => {
  // API_PROXY (in .env.development.local) passes /api on to the backend, so the browser talks to one origin and needs no CORS.
  const { API_PROXY } = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: 5180, // also set in runapp.bat and shutdown.bat
      strictPort: true, // fail instead of silently switching to another port
      proxy: API_PROXY ? { '/api': { target: API_PROXY, changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') } } : undefined,
    },
    plugins: [{ name: 'site-url', transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl) }],
  }
})
