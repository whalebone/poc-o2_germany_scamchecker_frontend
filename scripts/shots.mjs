// Screenshots of every page state, for design reviews. Needs the dev server.
// npm run shots [-- <outDir> <baseUrl>]  →  shots/ (git-ignored), 2x pixel density
// Names: m = phone 390×844 German, s = small phones (375×667, 360×780), e = English 360, d = desktop 1440 and 1024.
import { mkdirSync, readdirSync, rmSync } from 'node:fs'
import { chromium } from 'playwright-core'

const out = process.argv[2] || 'shots'
const base = process.argv[3] || 'http://localhost:5180/'
mkdirSync(out, { recursive: true })
for (const file of readdirSync(out)) if (file.endsWith('.png')) rmSync(`${out}/${file}`) // no leftovers from removed states

const browser = await chromium.launch({ channel: 'chrome' }) // the installed Google Chrome
const errors = []

async function open(viewport, { mobile = true, locale = 'de-DE' } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile, locale })
  await ctx.route('**/v1/**', (route) => route.abort()) // never the real backend: a live dev server shows its error notice
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && !m.location().url.includes('/v1/') && errors.push(m.text())) // not the blocked call
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  return page
}
const shot = (page, name, fullPage = false) => page.screenshot({ path: `${out}/${name}.png`, fullPage })
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const resultShown = async (page) => {
  await page.waitForSelector('#result:not([hidden])', { timeout: 15000 })
  await wait(1800) // let the entry animations finish
}

// Phone, German
const m = await open({ width: 390, height: 844 })
await shot(m, 'm01-start')
await shot(m, 'm02-start-full', true)
await m.locator('.tiles-nav').scrollIntoViewIfNeeded()
await shot(m, 'm03-types')
await m.click('#tiles-next')
await m.click('#tiles-next')
await wait(800)
await shot(m, 'm04-types-swiped')
await m.locator('#tiles').evaluate((el) => (el.scrollLeft = 0))
await m.evaluate(() => window.scrollTo(0, 0))
await m.click('#submit')
await wait(300)
await shot(m, 'm05-empty-hint')
await m.click('#example')
await wait(300)
await shot(m, 'm06-example-filled')
await m.click('#submit')
await wait(1000)
await shot(m, 'm07-checking-read')
await wait(1700)
await shot(m, 'm08-checking-link')
await wait(1500)
await shot(m, 'm09-checking-think')
await resultShown(m)
await shot(m, 'm10-result-viewport')
await shot(m, 'm11-result-full', true)
await m.click('[data-rating="down"]')
await wait(300)
await m.locator('#feedback').scrollIntoViewIfNeeded()
await shot(m, 'm12-feedback-no')
await m.click('[data-reason="unclear"]')
await m.locator('#trick').scrollIntoViewIfNeeded()
await wait(4000)
await shot(m, 'm13-trick-story')
await m.locator('#share').scrollIntoViewIfNeeded()
await wait(3200)
await shot(m, 'm14-protect-share')
await m.click('#upload')
await wait(500)
await shot(m, 'm15-upload-popup')
await m.keyboard.press('Escape')
await m.click('#reset')
await wait(900)
await shot(m, 'm16-after-reset')
await m.fill('#message', 'Hallo, kommst du heute Abend zum Essen? Liebe Grüße')
await m.click('#submit')
await m.waitForSelector('#notice:not([hidden])', { timeout: 15000 })
await wait(900)
await shot(m, 'm17-notice') // the demo's notice, or with .env.development.local the error notice

// Small phones
const se = await open({ width: 375, height: 667 })
await shot(se, 's01-se-start')
const narrow = await open({ width: 360, height: 780 })
await narrow.locator('.tiles-nav').scrollIntoViewIfNeeded()
await shot(narrow, 's04-360-types')
const small = await open({ width: 360, height: 780 })
await small.click('#example')
await small.click('#submit')
await resultShown(small)
await shot(small, 's02-360-result-viewport')
await shot(small, 's03-360-result-full', true)

// English (from the browser language), 360 px
const en = await open({ width: 360, height: 780 }, { locale: 'en-GB' })
await shot(en, 'e01-start')
await shot(en, 'e02-start-full', true)
await en.click('#example')
await en.click('#submit')
await resultShown(en)
await shot(en, 'e03-result-full', true)

// Desktop
const d = await open({ width: 1440, height: 900 }, { mobile: false })
await shot(d, 'd01-start')
await d.locator('.tiles-nav').scrollIntoViewIfNeeded()
await wait(300)
await shot(d, 'd02-types')
await d.evaluate(() => window.scrollTo(0, 0))
await d.click('#example')
await d.click('#submit')
await wait(2600)
await shot(d, 'd03-checking')
await resultShown(d)
await shot(d, 'd04-result')
await shot(d, 'd05-result-full', true)
await d.click('#upload')
await wait(500)
await shot(d, 'd06-upload-popup')
const laptop = await open({ width: 1024, height: 768 }, { mobile: false })
await shot(laptop, 'd07-1024-start')
await laptop.locator('.tiles-nav').scrollIntoViewIfNeeded()
await shot(laptop, 'd09-1024-types')
await laptop.click('#example')
await laptop.click('#submit')
await resultShown(laptop)
await shot(laptop, 'd08-1024-result')

await browser.close()
console.log(`Screenshots in ${out}/`)
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors')
process.exit(errors.length ? 1 : 0)
