// Screenshots of every page state, for design reviews. Needs the dev server.
// npm run shots [-- <outDir> <baseUrl>]  →  shots/ (git-ignored), 2x pixel density
// Names: m = phone 390×844 German, s = small phones (375×667, 360×780), e = English 360, d = desktop 1440.
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const out = process.argv[2] || 'shots'
const base = process.argv[3] || 'http://localhost:5180/'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' }) // the installed Google Chrome
const errors = []

async function open(viewport, { mobile = true, locale = 'de-DE' } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, locale })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  return page
}
const shot = (page, name, fullPage = false) => page.screenshot({ path: `${out}/${name}.png`, fullPage })
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const resultShown = async (page) => {
  await page.waitForSelector('#result:not([hidden])', { timeout: 10000 })
  await wait(900) // let the entry animation finish
}

// Phone, German
const m = await open({ width: 390, height: 844 })
await shot(m, 'm01-start')
await m.click('#submit')
await wait(300)
await shot(m, 'm02-empty-hint')
await m.click('#example')
await wait(300)
await shot(m, 'm03-example-filled')
await m.click('#submit')
await wait(1200)
await shot(m, 'm04-checking')
await resultShown(m)
await shot(m, 'm05-result-viewport')
await shot(m, 'm06-result-full', true)
await m.click('[data-rating="down"]')
await wait(300)
await m.locator('#feedback').scrollIntoViewIfNeeded()
await shot(m, 'm07-feedback-no')
await m.click('[data-reason="unclear"]')
await wait(300)
await shot(m, 'm08-feedback-thanks')
await m.locator('#share').scrollIntoViewIfNeeded()
await wait(300)
await shot(m, 'm09-protect-share')
await m.click('#upload')
await wait(500)
await shot(m, 'm10-upload-popup')
await m.keyboard.press('Escape')
await m.click('#reset')
await wait(900)
await shot(m, 'm11-after-reset')
await m.fill('#message', 'Hallo, kommst du heute Abend zum Essen? Liebe Grüße')
await m.click('#submit')
await m.waitForSelector('#notice:not([hidden])', { timeout: 10000 })
await wait(900)
await shot(m, 'm12-demo-notice')
await m.click('#notice-example')
await m.click('#submit')
await resultShown(m)
await m.evaluate(() => window.scrollTo(0, 0))
await m.click('[data-lang="en"]')
await wait(300)
await shot(m, 'm13-switch-en-refreshing', true)
await m.waitForSelector('#result:not([lang])', { timeout: 10000 })
await wait(300)
await shot(m, 'm14-switch-en-done', true)

// Small phones
const se = await open({ width: 375, height: 667 })
await shot(se, 's01-se-start')
const small = await open({ width: 360, height: 780 })
await small.click('#example')
await small.click('#submit')
await resultShown(small)
await shot(small, 's02-360-result-full', true)

// English (from the browser language), 360 px
const en = await open({ width: 360, height: 780 }, { locale: 'en-GB' })
await shot(en, 'e01-start')
await en.click('#example')
await en.click('#submit')
await resultShown(en)
await shot(en, 'e02-result-full', true)
await en.click('#upload')
await wait(500)
await shot(en, 'e03-upload-popup')

// Desktop
const d = await open({ width: 1440, height: 900 }, { mobile: false })
await shot(d, 'd01-start')
await d.click('#example')
await d.click('#submit')
await resultShown(d)
await shot(d, 'd02-result-full', true)
await d.click('#upload')
await wait(500)
await shot(d, 'd03-upload-popup')

await browser.close()
console.log(`Screenshots in ${out}/`)
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors')
process.exit(errors.length ? 1 : 0)
