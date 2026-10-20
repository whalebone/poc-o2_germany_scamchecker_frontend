// Renders public/og.jpg, the 1200×630 link preview, from the page's own assets and texts.
// Run after changing the hero title or the brand assets: npm run og
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { STRINGS } from '../src/strings.js'

const asset = (file) => readFileSync(new URL(`../public/${file}`, import.meta.url)).toString('base64')
const font = (file) => `data:font/woff2;base64,${asset(`fonts/${file}`)}`

// Everything that matters sits in the centre 630 px square: WhatsApp crops small previews to it.
const html = `<!doctype html><html><head><style>
@font-face { font-family: 'On Air'; src: url(${font('OnAir-Bold.woff2')}); font-weight: 700; }
@font-face { font-family: 'On Air'; src: url(${font('OnAir-Black.woff2')}); font-weight: 900; }
html, body { margin: 0; }
body { width: 1200px; height: 630px; position: relative; overflow: hidden; color: #fff;
  font-family: 'On Air', Arial, sans-serif;
  background: linear-gradient(180deg, #00008c 0%, #0050ff 80%, #246cff 100%); }
.bubble { position: absolute; width: 420px; right: -150px; top: 150px; }
main { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.bar { display: flex; align-items: center; gap: 6px; margin-bottom: 36px; }
.bar img { width: 116px; margin: -24px -14px -24px -22px; }
.bar span { font-weight: 700; font-size: 38px; }
h1 { margin: 0; font-weight: 900; font-size: 84px; line-height: 1; }
p { margin: 20px 0 0; font-weight: 700; font-size: 44px; color: #82dcfa; }
</style></head><body>
<img class="bubble" src="data:image/webp;base64,${asset('bubble.webp')}">
<main>
  <div class="bar"><img src="data:image/svg+xml;base64,${asset('o2-logo-white.svg')}"><span>${STRINGS.de.product}</span></div>
  <h1>${STRINGS.de['hero.title']}</h1>
  <p>${STRINGS.en['hero.title']}</p>
</main>
</body></html>`

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: fileURLToPath(new URL('../public/og.jpg', import.meta.url)), type: 'jpeg', quality: 86 })
await browser.close()
console.log('Wrote public/og.jpg')
