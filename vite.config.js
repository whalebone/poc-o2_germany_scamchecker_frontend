import { defineConfig } from 'vite'

// Link previews need an absolute image URL. Netlify sets URL during builds; locally it stays relative.
const siteUrl = process.env.URL ?? ''

export default defineConfig({
  server: {
    port: 5180, // also set in runapp.bat and shutdown.bat
    strictPort: true, // fail instead of silently switching to another port
  },
  plugins: [{ name: 'site-url', transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl) }],
})
