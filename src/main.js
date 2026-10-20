// JavaScript entry point — Vite bundles everything imported from here.
import './style.css'
import './scenes.css'
import { STRINGS } from './strings.js'
import { EXAMPLES, isExample, checkMessage, sendFeedback } from './demo.js'
import { SCAM_TYPES, hasStory, story, portrait, RIM, spotted, CHECKING, BLOCKED } from './scenes.js'

const $ = (id) => document.getElementById(id)
const form = $('form')
const message = $('message')
const hint = $('hint')
const submit = $('submit')
const slot = $('slot')
const progress = $('progress')
const result = $('result')
const notice = $('notice')
const feedback = $('feedback')
const langButtons = document.querySelectorAll('[data-lang]')

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
const desktop = matchMedia('(min-width: 1024px)') // the wide layout: a composer, then full-width rows
const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth')
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let busy = false
let checkedText = ''
let requestId = null
let shareText = ''

// ---------- Language ----------
// A ?lang= link wins for this visit, then the choice saved from the switch, then the browser.

const LANGS = Object.keys(STRINGS)
let lang = pickLanguage()
const t = (key) => STRINGS[lang][key] ?? key
const named = (key, type) => t(key).replace('{name}', t(`scam.${type}.name`))

function pickLanguage() {
  let saved = null
  try {
    saved = localStorage.getItem('lang')
  } catch {}
  const browser = navigator.languages.map((l) => l.slice(0, 2).toLowerCase())
  return [new URLSearchParams(location.search).get('lang'), saved, ...browser].find((l) => LANGS.includes(l)) ?? 'de'
}

const htmlLang = (l) => (l === 'en' ? 'en-GB' : 'de')

// Put the current language's texts into `root`; `except` keeps one part as it is for now.
function translate(root = document, except = null) {
  const all = (attr) => [...root.querySelectorAll(`[${attr}]`)].filter((el) => !except?.contains(el))
  for (const el of all('data-i18n')) el.textContent = t(el.dataset.i18n)
  for (const el of all('data-i18n-html')) el.innerHTML = t(el.dataset.i18nHtml) // our own static strings
  for (const el of all('data-i18n-placeholder')) el.placeholder = t(el.dataset.i18nPlaceholder)
  for (const el of all('data-i18n-label')) el.setAttribute('aria-label', t(el.dataset.i18nLabel))
}

function applyLanguage(except = null) {
  document.documentElement.lang = htmlLang(lang)
  document.title = t('title')
  translate(document, except)
  for (const button of langButtons) button.setAttribute('aria-pressed', button.dataset.lang === lang)
}

function setLanguage(next) {
  if (busy || next === lang) return
  if (message.value === EXAMPLES[lang]) message.value = EXAMPLES[next] // only an untouched example
  const refresh = !result.hidden
  if (refresh) result.lang = htmlLang(lang) // the shown answer stays in its language until the new one is in
  lang = next
  try {
    localStorage.setItem('lang', lang)
  } catch {}
  const url = new URL(location.href)
  if (url.searchParams.has('lang')) {
    url.searchParams.delete('lang') // the saved choice applies from now on
    history.replaceState(null, '', url)
  }
  applyLanguage(refresh ? result : null)
  autoGrow()
  if (refresh) refreshResult()
}

for (const button of langButtons) button.addEventListener('click', () => setLanguage(button.dataset.lang))

// ---------- The trick's story on the result (scenes.js): it plays once when it is fully in view ----------
// It gets a pause / play / watch-again button: anything that moves for longer than 5 s
// must be pausable (WCAG 2.2.2). With reduced motion nothing plays: it shows its last frame (scenes.css).

const TOGGLE = { playing: 'story.pause', paused: 'story.play', done: 'story.replay' }

function setState(el, state) {
  if (state) el.dataset.state = state
  else delete el.dataset.state
  const toggle = el.querySelector('.scene-toggle')
  if (toggle) {
    toggle.dataset.i18nLabel = TOGGLE[state] ?? 'story.play'
    toggle.setAttribute('aria-label', t(toggle.dataset.i18nLabel))
  }
}

// It starts once the whole thing is on screen (or fills most of a short one), so nobody misses the start.
const inView = new IntersectionObserver(
  (entries) => {
    for (const { target, intersectionRatio, intersectionRect, rootBounds } of entries) {
      const seen = intersectionRatio >= 0.95 || intersectionRect.height >= 0.8 * rootBounds.height
      if (seen && !target.dataset.state) setState(target, 'playing')
      else if (!intersectionRatio && target.dataset.state === 'playing') setState(target, null) // starts over next time
    }
  },
  { threshold: [0, 0.25, 0.5, 0.75, 0.95, 1] },
)

// Watch a story from the start, also after its content changed.
function watch(el) {
  setState(el, reducedMotion.matches ? 'done' : null)
  inView.unobserve(el)
  if (!reducedMotion.matches) inView.observe(el)
}

document.addEventListener('animationend', (event) => {
  const el = event.target.closest('[data-state]')
  if (event.animationName === 'clock' && el?.dataset.state === 'playing') setState(el, 'done')
})

document.addEventListener('click', (event) => {
  const el = event.target.closest('.scene-toggle')?.closest('.story')
  if (!el) return
  if (el.dataset.state === 'playing') setState(el, 'paused')
  else if (el.dataset.state === 'paused') setState(el, 'playing')
  else {
    setState(el, null)
    void el.offsetWidth // so the animations start over
    setState(el, 'playing')
  }
})

// The story on the result: a heading with the play button, the cartoon, the three steps (in step with it)
// and the rule to remember.
const storyHTML = (type) => `
  <div class="story-head"><h2 data-i18n="result.trick"></h2><button type="button" class="scene-toggle"><span class="icon" aria-hidden="true"></span></button></div>
  <div class="scene">${story(type)}</div>
  <ol class="beats">${[1, 2, 3].map((n) => `<li data-i18n="scam.${type}.s${n}"></li>`).join('')}</ol>
  <p class="rule"><span class="icon i-tick" aria-hidden="true"></span><span data-i18n="scam.${type}.rule"></span></p>`

// ---------- The scam types on the landing page: a row of cards that scrolls sideways ----------
// Each card: the name, one line and a still picture. Nothing to open; the steps live in the result's story.

const tiles = $('tiles')
document.body.insertAdjacentHTML('beforeend', RIM) // the white rim of the pictures, defined once
for (const type of SCAM_TYPES) {
  tiles.insertAdjacentHTML(
    'beforeend',
    `<li class="tile">
      <h3 data-i18n="scam.${type}.name"></h3>
      <p data-i18n="scam.${type}.text"></p>
      <div class="tile-img">${portrait(type)}</div>
    </li>`,
  )
}

// The arrows move one card and do nothing at the ends (aria-disabled keeps their focus).
// The bar under the row is a scrollbar to look at: its thumb is the part on screen.
const prev = $('tiles-prev')
const next = $('tiles-next')
const cardStep = () => tiles.firstElementChild.offsetWidth + parseFloat(getComputedStyle(tiles).columnGap)

function updateTilesNav() {
  const max = tiles.scrollWidth - tiles.clientWidth
  prev.setAttribute('aria-disabled', tiles.scrollLeft <= 1)
  next.setAttribute('aria-disabled', tiles.scrollLeft >= max - 1)
  $('tiles-thumb').style.width = `${(100 * tiles.clientWidth) / tiles.scrollWidth}%`
  $('tiles-thumb').style.left = `${(100 * tiles.scrollLeft) / tiles.scrollWidth}%`
}

for (const [button, direction] of [[prev, -1], [next, 1]]) {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-disabled') === 'true') return
    tiles.scrollBy({ left: direction * cardStep(), behavior: scrollBehavior() })
  })
}
tiles.addEventListener('scroll', updateTilesNav, { passive: true })
new ResizeObserver(updateTilesNav).observe(tiles) // also when the row comes back after a result

// ---------- Message field ----------

// Fit the field to its text; min-height and max-height in style.css set the range (4–8 rows, 3–8 on desktop).
function autoGrow() {
  message.style.height = '0'
  message.style.height = `${message.scrollHeight}px`
}

// While typing, keep the button 12 px above the on-screen keyboard (it only shrinks the visual viewport).
function keepSubmitVisible() {
  if (document.activeElement !== message || !window.visualViewport) return
  const overlap = submit.getBoundingClientRect().bottom - (visualViewport.offsetTop + visualViewport.height - 12)
  if (overlap > 0) window.scrollBy(0, overlap)
}

message.addEventListener('focus', keepSubmitVisible)
window.visualViewport?.addEventListener('resize', keepSubmitVisible)

// The hint is only linked to the field while it shows, or screen readers would always read it.
function showHint(show) {
  hint.hidden = !show
  if (show) message.setAttribute('aria-describedby', 'hint')
  else message.removeAttribute('aria-describedby')
}

function useExample() {
  message.value = EXAMPLES[lang] // no focus, so the keyboard stays closed
  showHint(false)
  autoGrow()
}

message.addEventListener('input', () => {
  showHint(false)
  autoGrow()
  keepSubmitVisible()
})
message.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) form.requestSubmit() // a desktop shortcut
})
$('example').addEventListener('click', useExample)

const uploadDialog = $('upload-dialog')
$('upload').addEventListener('click', () => uploadDialog.showModal())
uploadDialog.addEventListener('click', (event) => {
  if (event.target === uploadDialog) uploadDialog.close() // a tap on the backdrop
})

// ---------- Check ----------

form.addEventListener('submit', (event) => {
  event.preventDefault()
  if (busy) return
  const text = message.value.trim()
  if (!text) {
    showHint(true)
    message.focus()
    return
  }
  message.blur()
  if (isExample(text)) check(text)
  else showNotice()
})

// Show progress, result or notice in the slot; no view hides the slot.
function showInSlot(view = null) {
  for (const el of [progress, result, notice]) el.hidden = el !== view
  slot.hidden = !view
  // On phones, progress and result reserve a screen of height, so the slot can sit at the top and the result swaps in place.
  slot.classList.toggle('reserved', view === progress || view === result)
}

// Phones move the slot to the top of the screen. Desktop has it right below the form, so it only
// scrolls as far as the loader needs.
function bringIntoView() {
  if (desktop.matches) progress.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' })
  else slot.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
}

// While busy, taps on the button and the language switch are ignored, and the switch looks it.
function setBusy(on) {
  busy = on
  for (const button of langButtons) button.setAttribute('aria-disabled', on) // aria- keeps focus on the switch
}

async function check(text) {
  setBusy(true)
  checkedText = text
  submit.disabled = true
  $('submit-label').textContent = t('form.busy')
  $('status').textContent = t('form.busy')
  delete progress.dataset.phase
  showInSlot(progress)
  bringIntoView()

  const answer = await showChecking(/https?:\/\/|www\./i.test(text), checkMessage(text, lang))

  showResult(answer)
  $('headline').focus({ preventScroll: true })
  $('status').textContent = ''
  $('submit-label').textContent = t('form.submit')
  submit.disabled = false
  setBusy(false)
}

// The loader's phases. The Lupe's path in scenes.css takes their first 3.5 s, so it also plays
// out when the answer comes sooner. Without a link there is nothing to look up in the blocklist.
async function showChecking(hasLink, pending) {
  progress.dataset.link = hasLink ? 'yes' : 'no'
  setPhase('read')
  await wait(1700)
  setPhase(hasLink ? 'link' : 'tricks')
  await wait(1800)
  setPhase('think')
  const answer = await pending
  setPhase('done')
  await wait(700)
  return answer
}

function setPhase(phase) {
  progress.dataset.phase = phase
  const caption = $('progress-text')
  caption.textContent = t(`progress.${phase}`)
  caption.classList.remove('in')
  void caption.offsetWidth // so the caption fades in again
  caption.classList.add('in')
}

// The backend answers in one language: after a switch, fetch the visible answer again
// and swap the whole card at once.
async function refreshResult() {
  setBusy(true)
  result.setAttribute('aria-busy', 'true')
  const answer = await checkMessage(checkedText, lang)
  result.removeAttribute('lang')
  applyLanguage()
  showResult(answer)
  result.removeAttribute('aria-busy')
  setBusy(false)
}

function showResult(answer) {
  requestId = answer.request_id
  const type = SCAM_TYPES.includes(answer.type) ? answer.type : null // a known, common scam
  $('verdict').dataset.verdict = answer.verdict

  // A scam shows the Trickser, spotted by the Lupe, in his costume when the type is known; other verdicts keep the icon.
  const art = $('verdict-art')
  const scam = answer.verdict === 'scam'
  art.hidden = !scam
  $('verdict-icon').hidden = scam
  if (scam) art.innerHTML = spotted(type)
  $('spotted').hidden = !type
  if (type) $('spotted').textContent = named('result.spotted', type)

  $('headline').replaceChildren(...sentences(answer.headline))
  // The reason names the scam domain and the real site it imitates: marked red and green, as plain text,
  // so people type the real address themselves.
  const { domain, imitates } = answer.link ?? {}
  const mark = (part) => Object.assign(document.createElement('mark'), { className: part === domain ? 'fake' : 'real' })
  $('reason').replaceChildren(...wrap(answer.reason, [domain, imitates], mark))

  $('steps').replaceChildren(...answer.next_steps.map((step) => Object.assign(document.createElement('li'), { textContent: step })))

  const help = $('help')
  help.hidden = !answer.if_it_happened
  if (answer.if_it_happened) {
    // 116 116 is the German hotline for blocking bank cards: make it tappable.
    const call = () => Object.assign(document.createElement('a'), { href: 'tel:116116', ariaLabel: t('result.call') })
    help.replaceChildren(...wrap(answer.if_it_happened, ['116 116'], call))
  }

  setFeedback('ask')

  $('trick').hidden = !hasStory(type)
  if (hasStory(type)) {
    $('trick-story').innerHTML = storyHTML(type)
    translate($('trick-story'))
    watch($('trick-story'))
  }

  $('protect').hidden = answer.link?.status !== 'malicious' // known in our domain database
  $('share').hidden = !type // a known, common scam is worth warning others about
  if (type) prepareShare(type)

  showInSlot(result)
}

// One span per sentence, so a headline only breaks between sentences.
function sentences(text) {
  return text.split(/(?<=\.) /).flatMap((sentence, i) => {
    const span = Object.assign(document.createElement('span'), { textContent: sentence })
    return i ? [' ', span] : [span]
  })
}

// Split text around the given parts and put each one into a node from make(part). Longer parts
// match first, so a real domain inside a fake one stays part of the fake one. A comma or full stop
// right after a part stays on its line (.glued): after an inline-block it could start the next one.
function wrap(text, parts, make) {
  const found = parts.filter(Boolean).sort((a, b) => b.length - a.length)
  if (!found.length) return [text]
  const escaped = found.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pieces = text.split(new RegExp(`(${escaped.join('|')})([.,:;]?)`)) // text, part, punctuation, text, …
  const nodes = [pieces[0]]
  for (let i = 1; i < pieces.length; i += 3) {
    const glued = Object.assign(document.createElement('span'), { className: 'glued' })
    glued.append(Object.assign(make(pieces[i]), { textContent: pieces[i] }), pieces[i + 1])
    nodes.push(glued, pieces[i + 2])
  }
  return nodes
}

function showNotice() {
  showInSlot(notice)
  notice.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' })
}

$('notice-example').addEventListener('click', () => {
  useExample()
  showInSlot()
  form.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' })
})

$('reset').addEventListener('click', () => {
  showInSlot()
  message.value = ''
  autoGrow()
  window.scrollTo({ top: 0, behavior: scrollBehavior() })
  message.focus({ preventScroll: true })
})

// ---------- Feedback: POST /v1/feedback with the answer's request_id ----------

function setFeedback(step) {
  for (const el of feedback.querySelectorAll('[data-step]')) el.hidden = el.dataset.step !== step
}

feedback.addEventListener('click', (event) => {
  const { rating, reason } = event.target.closest('button')?.dataset ?? {}
  if (rating) {
    sendFeedback({ request_id: requestId, rating, reason: null })
    setFeedback(rating === 'up' ? 'thanks' : 'why')
  } else if (reason) {
    sendFeedback({ request_id: requestId, rating: 'down', reason }) // updates the same record
    setFeedback('thanks')
  }
})

// ---------- Share: the native share sheet on phones, otherwise WhatsApp, e-mail or copy ----------

const pageUrl = location.origin + location.pathname // without ?lang, so each recipient gets their own language
const nativeShare = 'share' in navigator && matchMedia('(pointer: coarse)').matches
$('share-native').hidden = !nativeShare
$('share-links').hidden = nativeShare

function prepareShare(type) {
  $('share-text').textContent = named('share.text', type)
  shareText = t(`share.message.${type}`)
  $('share-whatsapp').href = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`
  $('share-email').href =
    `mailto:?subject=${encodeURIComponent(t(`share.subject.${type}`))}&body=${encodeURIComponent(`${shareText}\n\n${pageUrl}`)}`
}

$('share-native').addEventListener('click', () => {
  navigator.share({ text: shareText, url: pageUrl }).catch(() => {}) // closing the sheet rejects
})

$('share-copy').addEventListener('click', async (event) => {
  const button = event.currentTarget
  try {
    await navigator.clipboard.writeText(`${shareText} ${pageUrl}`)
  } catch {
    return
  }
  button.textContent = t('share.copied')
  setTimeout(() => (button.textContent = t('share.copy')), 2000)
})

// ---------- Start ----------

$('checking-scene').innerHTML = CHECKING
$('protect-art').innerHTML = BLOCKED
applyLanguage()
autoGrow()
