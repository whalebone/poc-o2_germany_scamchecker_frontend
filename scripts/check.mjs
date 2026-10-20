// Behaviour checks for the page. Needs the dev server: npm run check [-- http://localhost:5180/]
// Texts come from src/strings.js and src/demo.js, so copy edits don't break the checks.
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { STRINGS } from '../src/strings.js'
import { EXAMPLES } from '../src/demo.js'

const base = process.argv[2] || 'http://localhost:5180/'
const DE = STRINGS.de
const EN = STRINGS.en
const DOMAIN = EXAMPLES.de.match(/https?:\/\/([^/\s]+)/)[1]

let failed = 0
function check(name, ok, detail = '') {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? `  -> ${detail}` : ''}`)
}

// ---------- Texts ----------

const missingInEn = Object.keys(DE).filter((k) => !(k in EN))
const missingInDe = Object.keys(EN).filter((k) => !(k in DE))
check('de and en have the same keys', !missingInEn.length && !missingInDe.length, [...missingInEn, ...missingInDe].join(', '))
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const unknown = [...html.matchAll(/data-i18n(?:-html|-placeholder|-label)?="([^"]+)"/g)].map((m) => m[1]).filter((k) => !(k in DE))
check('every key in index.html exists', !unknown.length, unknown.join(', '))
const loud = [...Object.entries(DE), ...Object.entries(EN)].filter(([, v]) => v.includes('!')).map(([k]) => k)
check('no exclamation marks in any text (O₂ voice)', !loud.length, loud.join(', '))

// ---------- Page ----------

const browser = await chromium.launch({ channel: 'chrome' }) // the installed Google Chrome

async function open(path = '', { locale = 'de-DE', saved = null, viewport = { width: 390, height: 844 }, mobile = true } = {}) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, locale })
  if (saved) await ctx.addInitScript((lang) => localStorage.setItem('lang', lang), saved)
  const page = await ctx.newPage()
  page.logs = []
  page.requests = []
  page.on('console', (m) => page.logs.push(m.text()))
  page.on('pageerror', (e) => page.logs.push(`PAGEERROR ${e}`))
  page.on('request', (r) => page.requests.push(r.url()))
  await page.goto(base + path, { waitUntil: 'networkidle' })
  return page
}
const visible = (p, selector) => p.locator(selector).isVisible()
const focusedId = (p) => p.evaluate(() => document.activeElement?.id)
const showResult = async (p) => {
  await p.click('#example')
  await p.click('#submit')
  await p.waitForSelector('#result:not([hidden])', { timeout: 10000 })
}
const pageErrors = []

// Language
let p = await open('', { locale: 'de-DE' })
check('a German browser gets German', (await p.textContent('h1')) === DE['hero.title'])
check('html lang is de', (await p.getAttribute('html', 'lang')) === 'de')
p = await open('', { locale: 'en-GB' })
check('an English browser gets English', (await p.textContent('h1')) === EN['hero.title'])
check('html lang is en-GB', (await p.getAttribute('html', 'lang')) === 'en-GB')
p = await open('', { locale: 'fr-FR' })
check('other browser languages get German', (await p.textContent('h1')) === DE['hero.title'])
p = await open('?lang=en', { locale: 'de-DE' })
check('?lang=en opens English', (await p.textContent('h1')) === EN['hero.title'])
check('?lang=en is not saved', (await p.evaluate(() => localStorage.getItem('lang'))) === null)
await p.click('[data-lang="de"]')
check('tapping DE switches to German', (await p.textContent('h1')) === DE['hero.title'])
check('tapping DE saves the choice', (await p.evaluate(() => localStorage.getItem('lang'))) === 'de')
check('tapping DE drops ?lang from the URL', !(await p.evaluate(() => location.search)).includes('lang'))
check('aria-pressed follows the language', (await p.getAttribute('[data-lang="de"]', 'aria-pressed')) === 'true' && (await p.getAttribute('[data-lang="en"]', 'aria-pressed')) === 'false')
p = await open('', { locale: 'de-DE', saved: 'en' })
check('the saved choice beats the browser', (await p.textContent('h1')) === EN['hero.title'])

// Empty field
p = await open()
await p.click('#submit')
check('an empty check shows the hint', await visible(p, '#hint'))
check('the hint is linked to the field while it shows', (await p.getAttribute('#message', 'aria-describedby')) === 'hint')
check('an empty check focuses the field', (await focusedId(p)) === 'message')
await p.fill('#message', 'x')
check('typing hides and unlinks the hint', !(await visible(p, '#hint')) && (await p.getAttribute('#message', 'aria-describedby')) === null)

// Example and result
p = await open()
await p.click('#example')
check('"use example" fills the field', (await p.inputValue('#message')) === EXAMPLES.de)
check('"use example" does not focus the field (no keyboard)', (await focusedId(p)) !== 'message')
await p.click('#submit')
await p.waitForSelector('#result:not([hidden])', { timeout: 10000 })
check('the result headline gets focus', (await focusedId(p)) === 'headline')
check('the headline only breaks between sentences', await p.evaluate(() => {
  const h = document.getElementById('headline')
  return h.querySelectorAll('span').length === h.textContent.split(/(?<=\.) /).length
}))
check('the scam domain is marked', (await p.textContent('#reason mark')) === DOMAIN)
check('116 116 is a tel: link', (await p.getAttribute('#help a', 'href')) === 'tel:116116')
check('page text has no raw ₂ (On Air lacks it)', !(await p.evaluate(() => document.body.innerText.includes('₂'))))
check('Onlineschutz card shows for a domain in the database', await visible(p, '#protect'))
check('the Onlineschutz link opens in a new tab', (await p.getAttribute('#protect a', 'target')) === '_blank')
check('the share card shows for a known scam type', await visible(p, '#share'))
check('touch devices get the native share button', (await visible(p, '#share-native')) && !(await visible(p, '#share-links')))
check('the button is back to normal after the check', (await p.textContent('#submit-label')) === DE['form.submit'] && !(await p.isDisabled('#submit')))

// Feedback
await p.click('[data-rating="down"]')
await p.click('[data-reason="wrong_verdict"]')
const posts = p.logs.filter((l) => l.startsWith('POST /v1/feedback'))
const ids = posts.map((l) => l.match(/sc_\w+/)?.[0])
check('feedback posts twice with the same request_id', posts.length === 2 && ids[0] && ids[0] === ids[1], posts.join(' | '))
check('the second post carries the reason', posts[1]?.includes('wrong_verdict'))
check('feedback says thanks', await visible(p, '[data-step="thanks"]'))

// Language switch while a result shows: the whole card swaps at once
await p.click('[data-lang="en"]')
check('during the refresh the card stays fully German', (await p.textContent('#result h3')) === DE['result.steps'] && (await p.getAttribute('#result', 'lang')) === 'de')
check('during the refresh the rest of the page is English', (await p.textContent('h1')) === EN['hero.title'])
check('during the refresh the switch looks disabled', (await p.getAttribute('[data-lang="de"]', 'aria-disabled')) === 'true')
check('during the refresh the form button is not dimmed', !(await p.isDisabled('#submit')))
await p.waitForSelector('#result:not([lang])', { timeout: 10000 })
check('after the refresh the card is English', (await p.textContent('#result h3')) === EN['result.steps'])
check('after the refresh the switch works again', (await p.getAttribute('[data-lang="de"]', 'aria-disabled')) === 'false')
check('the refresh resets the feedback', await visible(p, '[data-step="ask"]'))
check('an untouched example follows the language', (await p.inputValue('#message')) === EXAMPLES.en)
check('focus stays on the language switch', await p.evaluate(() => document.activeElement?.dataset.lang === 'en'))

// Reset
await p.click('#reset')
check('reset hides the result', !(await visible(p, '#slot')))
check('reset clears and focuses the field', (await p.inputValue('#message')) === '' && (await focusedId(p)) === 'message')
await p.click('[data-lang="de"]')
await p.waitForTimeout(3000)
check('after reset, a language switch does not bring the result back', !(await visible(p, '#slot')))

// Demo notice
await p.fill('#message', 'Hallo, kommst du heute Abend zum Essen?')
await p.click('#submit')
check('other text shows the demo notice at once', await visible(p, '#notice'))
await p.click('#notice-example')
check('the notice button fills the example and hides the notice', (await p.inputValue('#message')) === EXAMPLES.de && !(await visible(p, '#slot')))

// Screenshot popup
await p.click('#upload')
check('the camera button opens the popup', await visible(p, '#upload-dialog'))
await p.keyboard.press('Escape')
check('Escape closes the popup', !(await visible(p, '#upload-dialog')))
check('focus returns to the camera button', (await focusedId(p)) === 'upload')
pageErrors.push(...p.logs.filter((l) => l.startsWith('PAGEERROR')))

// Phone with the keyboard open (about 400 px visible)
const k = await open('', { viewport: { width: 390, height: 400 } })
check('phones never download the desktop bubble', !k.requests.some((u) => u.includes('bubble')))
check('the field border has 3:1 contrast or more (#73737d)', (await k.evaluate(() => getComputedStyle(document.querySelector('.field')).borderTopColor)) === 'rgb(115, 115, 125)')
const before = await k.evaluate(() => document.getElementById('submit').getBoundingClientRect().bottom)
await k.focus('#message')
await k.waitForTimeout(300)
const after = await k.evaluate(() => document.getElementById('submit').getBoundingClientRect().bottom)
check(`the button moves above the keyboard (bottom ${Math.round(before)} -> ${Math.round(after)} of 400)`, before > 400 && after <= 389)

// Desktop
const d = await open('', { viewport: { width: 1280, height: 800 }, mobile: false })
await showResult(d)
check('desktop shows WhatsApp, e-mail and copy', (await visible(d, '#share-links')) && !(await visible(d, '#share-native')))
const shared = decodeURIComponent(await d.getAttribute('#share-whatsapp', 'href'))
const warnings = Object.keys(DE).filter((key) => key.startsWith('share.message.')).map((key) => DE[key])
check('the WhatsApp text is a warning plus the page URL', warnings.some((w) => shared.includes(w)) && shared.endsWith(base))
check('the shared URL has no ?lang', !shared.includes('lang='))
check('the shared text never contains the scam domain', !shared.includes(DOMAIN))
pageErrors.push(...d.logs.filter((l) => l.startsWith('PAGEERROR')))

check('no page errors', !pageErrors.length, pageErrors.join(' | '))
await browser.close()
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
