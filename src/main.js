// JavaScript entry point — Vite bundles everything imported from here.
import './style.css'
import { STRINGS } from './strings.js'
import { EXAMPLES, isExample, checkMessage, sendFeedback } from './demo.js'

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

function pickLanguage() {
  let saved = null
  try {
    saved = localStorage.getItem('lang')
  } catch {}
  const browser = navigator.languages.map((l) => l.slice(0, 2).toLowerCase())
  return [new URLSearchParams(location.search).get('lang'), saved, ...browser].find((l) => LANGS.includes(l)) ?? 'de'
}

const htmlLang = (l) => (l === 'en' ? 'en-GB' : 'de')

// Put the current language's texts into the page; `except` keeps one part as it is for now.
function applyLanguage(except = null) {
  document.documentElement.lang = htmlLang(lang)
  document.title = t('title')
  const all = (attr) => [...document.querySelectorAll(`[${attr}]`)].filter((el) => !except?.contains(el))
  for (const el of all('data-i18n')) el.textContent = t(el.dataset.i18n)
  for (const el of all('data-i18n-html')) el.innerHTML = t(el.dataset.i18nHtml) // our own static strings
  for (const el of all('data-i18n-placeholder')) el.placeholder = t(el.dataset.i18nPlaceholder)
  for (const el of all('data-i18n-label')) el.setAttribute('aria-label', t(el.dataset.i18nLabel))
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

// ---------- Message field ----------

function autoGrow() {
  message.style.height = 'auto'
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

// Show progress, result or notice in the slot below the form; no view hides the slot.
function showInSlot(view = null) {
  for (const el of [progress, result, notice]) el.hidden = el !== view
  slot.hidden = !view
  // Progress and result reserve a screen of height, so the slot can sit at the top and the result swaps in place.
  slot.classList.toggle('reserved', view === progress || view === result)
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
  showInSlot(progress)
  slot.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })

  const answer = await tickProgress(checkMessage(text, lang))

  showResult(answer)
  $('headline').focus({ preventScroll: true })
  $('status').textContent = ''
  $('submit-label').textContent = t('form.submit')
  submit.disabled = false
  setBusy(false)
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

// Tick the checklist while the answer loads; the last step waits for the answer.
async function tickProgress(pending) {
  const steps = [...progress.querySelectorAll('li')]
  for (const li of steps) li.className = ''
  for (const li of steps.slice(0, -1)) {
    li.className = 'active'
    await wait(800)
    li.className = 'done'
  }
  steps.at(-1).className = 'active'
  const answer = await pending
  steps.at(-1).className = 'done'
  await wait(400)
  return answer
}

function showResult(answer) {
  requestId = answer.request_id
  $('verdict').dataset.verdict = answer.verdict
  $('headline').replaceChildren(...sentences(answer.headline))
  $('reason').replaceChildren(...wrap(answer.reason, answer.link?.domain, document.createElement('mark')))
  $('steps').replaceChildren(...answer.next_steps.map((step) => Object.assign(document.createElement('li'), { textContent: step })))

  const help = $('help')
  help.hidden = !answer.if_it_happened
  if (answer.if_it_happened) {
    // 116 116 is the German hotline for blocking bank cards: make it tappable.
    const call = Object.assign(document.createElement('a'), { href: 'tel:116116' })
    call.setAttribute('aria-label', t('result.call'))
    help.replaceChildren(...wrap(answer.if_it_happened, '116 116', call))
  }

  setFeedback('ask')
  $('protect').hidden = answer.link?.status !== 'malicious' // known in our domain database
  $('share').hidden = !answer.type // a known, common scam is worth warning others about
  if (answer.type) prepareShare(answer.type)

  showInSlot(result)
}

// One span per sentence, so a headline only breaks between sentences.
function sentences(text) {
  return text.split(/(?<=\.) /).flatMap((sentence, i) => {
    const span = Object.assign(document.createElement('span'), { textContent: sentence })
    return i ? [' ', span] : [span]
  })
}

// Split text around the first `part` and put that part into `node`.
function wrap(text, part, node) {
  const at = part ? text.indexOf(part) : -1
  if (at < 0) return [text]
  node.textContent = part
  return [text.slice(0, at), node, text.slice(at + part.length)]
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

applyLanguage()
autoGrow()
