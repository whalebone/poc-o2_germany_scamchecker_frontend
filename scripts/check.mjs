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

async function open(path = '', { locale = 'de-DE', saved = null, viewport = { width: 390, height: 844 }, mobile = true, reducedMotion = 'no-preference' } = {}) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, locale, reducedMotion })
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
  await p.waitForSelector('#result:not([hidden])', { timeout: 15000 })
}
const state = (p, selector) => p.locator(selector).evaluate((el) => el.dataset.state ?? 'idle')
const finishAnimations = (p, selector) => p.locator(selector).evaluate((el) => el.getAnimations({ subtree: true }).forEach((a) => a.finish()))
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

// The scam types on the landing page: still tiles that open on tap
p = await open()
check('the landing page shows all 5 scam types as tiles', (await p.locator('.tile').count()) === 5 && (await visible(p, '#types')))
await p.locator('#types').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
check('nothing moves on the landing page', (await p.evaluate(() => document.getAnimations().length)) === 0)
check('the tiles start closed', (await p.locator('.tile .steps:visible').count()) === 0)
check('a tile is at least 48 px tall to tap', (await p.locator('.tile summary').first().evaluate((el) => el.offsetHeight)) >= 48)
await p.click('.tile:nth-child(1) summary')
check('a tapped tile shows the three steps and the rule', (await p.locator('.tile:nth-child(1) .steps li:visible').count()) === 3 && (await visible(p, '.tile:nth-child(1) .rule')))
await p.evaluate(() => (document.documentElement.style.overflowAnchor = 'none')) // like Safari: no scroll anchoring
await p.locator('.tile:nth-child(2) summary').scrollIntoViewIfNeeded()
const tileTop = await p.locator('.tile:nth-child(2) summary').evaluate((el) => el.getBoundingClientRect().top)
await p.click('.tile:nth-child(2) summary')
await p.waitForTimeout(100)
const tileTopAfter = await p.locator('.tile:nth-child(2) summary').evaluate((el) => el.getBoundingClientRect().top)
check('a tapped tile stays put when the open one above closes', Math.abs(tileTopAfter - tileTop) < 2, `${tileTop} -> ${tileTopAfter}`)
check('only one tile is open at a time', (await p.locator('.tile details[open]').count()) === 1 && (await p.locator('.tile:nth-child(2) details').evaluate((el) => el.open)))

// Example, checking and result
p = await open()
await p.click('#example')
check('"use example" fills the field', (await p.inputValue('#message')) === EXAMPLES.de)
check('"use example" does not focus the field (no keyboard)', (await focusedId(p)) !== 'message')
await p.click('#submit')
await p.waitForTimeout(300)
check('checking starts by reading the message', (await p.getAttribute('#progress', 'data-phase')) === 'read' && (await p.textContent('#progress-text')) === DE['progress.read'])
check('the scam types hide while checking', !(await visible(p, '#types')))
await p.waitForTimeout(1700)
check('a message with a link goes to the blocklist', (await p.getAttribute('#progress', 'data-phase')) === 'link')
await p.waitForSelector('#result:not([hidden])', { timeout: 15000 })
check('the result headline gets focus', (await focusedId(p)) === 'headline')
check('the headline only breaks between sentences', await p.evaluate(() => {
  const h = document.getElementById('headline')
  return h.querySelectorAll('span').length === h.textContent.split(/(?<=\.) /).length
}))
check('the result names the scam type', (await p.textContent('#spotted')) === DE['result.spotted'].replace('{name}', DE['scam.parcel_scam.name']))
check('the spotted picture shows for a scam', await visible(p, '#verdict-art svg'))
check('the headline heads the white half of the verdict card', await p.evaluate(() => document.querySelector('.verdict-body').firstElementChild.id === 'headline'))
check('the reason marks the scam domain', (await p.textContent('#reason mark.fake')) === DOMAIN)
check('the reason marks the real site, as plain text', (await p.textContent('#reason mark.real')) === 'zoll.de' && !(await p.locator('#reason a').count()))
await p.waitForTimeout(400)
check('the verdict and Onlineschutz cards do not move', await p.evaluate(() => ['verdict', 'protect'].every((id) => !document.getElementById(id).getAnimations({ subtree: true }).length)))
check('the result explains the trick with its story', (await visible(p, '#trick')) && (await p.locator('#trick .sc-parcel_scam').count()) === 1)
check('the story does not play out of view', (await state(p, '#trick-story')) === 'idle')
await p.locator('#trick-story').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
check('the story plays once it is in view', (await state(p, '#trick-story')) === 'playing')
check('the toggle says "Pause" while it plays', (await p.getAttribute('#trick .scene-toggle', 'aria-label')) === DE['story.pause'])
await p.click('#trick .scene-toggle')
check('the toggle pauses the story', (await state(p, '#trick-story')) === 'paused')
await p.click('#trick .scene-toggle')
await finishAnimations(p, '#trick-story')
await p.waitForTimeout(100)
check('the story stops after one run', (await state(p, '#trick-story')) === 'done')
check('then the toggle offers "Nochmal ansehen"', (await p.getAttribute('#trick .scene-toggle', 'aria-label')) === DE['story.replay'])
await p.click('#trick .scene-toggle')
check('"Nochmal ansehen" plays it again', (await state(p, '#trick-story')) === 'playing')
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
check('during the refresh the card stays fully German', (await p.textContent('#result [data-i18n="result.steps"]')) === DE['result.steps'] && (await p.getAttribute('#result', 'lang')) === 'de')
check('during the refresh the rest of the page is English', (await p.textContent('h1')) === EN['hero.title'])
check('during the refresh the switch looks disabled', (await p.getAttribute('[data-lang="de"]', 'aria-disabled')) === 'true')
check('during the refresh the form button is not dimmed', !(await p.isDisabled('#submit')))
await p.waitForSelector('#result:not([lang])', { timeout: 15000 })
check('after the refresh the card is English', (await p.textContent('#result [data-i18n="result.steps"]')) === EN['result.steps'])
check('after the refresh the switch works again', (await p.getAttribute('[data-lang="de"]', 'aria-disabled')) === 'false')
check('the refresh resets the feedback', await visible(p, '[data-step="ask"]'))
check('the scam type is named in English', (await p.textContent('#spotted')) === EN['result.spotted'].replace('{name}', EN['scam.parcel_scam.name']))
check('an untouched example follows the language', (await p.inputValue('#message')) === EXAMPLES.en)
check('focus stays on the language switch', await p.evaluate(() => document.activeElement?.dataset.lang === 'en'))

// Reset
await p.click('#reset')
check('reset hides the result', !(await visible(p, '#slot')))
check('reset clears and focuses the field', (await p.inputValue('#message')) === '' && (await focusedId(p)) === 'message')
check('after reset the scam types are back', await visible(p, '#types'))
await p.click('[data-lang="de"]')
await p.waitForTimeout(5500)
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

// Reduced motion: nothing plays, the story shows its last frame with all steps
const r = await open('', { reducedMotion: 'reduce' })
await showResult(r)
await r.locator('#trick-story').scrollIntoViewIfNeeded()
await r.waitForTimeout(400)
check('with reduced motion, the story shows its last frame', (await state(r, '#trick-story')) === 'done')
check('with reduced motion, there is no play button', !(await visible(r, '#trick .scene-toggle')))

// Desktop
const d = await open('', { viewport: { width: 1280, height: 800 }, mobile: false })
check('desktop: one wide composer, the scam types below it at the same width', await d.evaluate(() => {
  const box = (id) => document.getElementById(id).getBoundingClientRect()
  const field = document.querySelector('.field').getBoundingClientRect()
  return box('types').top > box('form').bottom && Math.abs(box('types').width - box('form').width) < 2 && box('submit').left > field.right
}))
check('desktop: the tiles sit 3 + 2, the second row centred', await d.evaluate(() => {
  const [a, b, c, e, f] = [...document.querySelectorAll('.tile')].map((el) => el.getBoundingClientRect())
  const row = (x, y) => Math.abs(x.top - y.top) < 2
  return row(a, b) && row(b, c) && row(e, f) && e.top > a.bottom && Math.abs(e.left - a.left - (b.left - a.left) / 2) < 2
}))
await d.click('.tile:nth-child(1) summary')
check('desktop: an open tile does not stretch its neighbours', await d.evaluate(() => {
  const [a, b] = [...document.querySelectorAll('.tile')].map((el) => el.getBoundingClientRect())
  return a.height > b.height
}))
await d.click('#example')
await d.focus('#message')
await d.keyboard.press('Control+Enter')
check('desktop: Ctrl+Enter checks the message', await visible(d, '#progress'))
await d.waitForSelector('#result:not([hidden])', { timeout: 15000 })
check('desktop: the result is full-width rows, verdict then Onlineschutz', await d.evaluate(() => {
  const box = (id) => document.getElementById(id).getBoundingClientRect()
  return box('protect').top > box('verdict').bottom && Math.abs(box('protect').width - box('verdict').width) < 2
}))
check('desktop: the verdict card is split in two halves', await d.evaluate(() => {
  const head = document.querySelector('.verdict-head').getBoundingClientRect()
  const body = document.querySelector('.verdict-body').getBoundingClientRect()
  return body.left >= head.right && Math.abs(body.height - head.height) < 2
}))
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
