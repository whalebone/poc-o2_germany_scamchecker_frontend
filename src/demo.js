// The example message and the answer the backend would give for it, in the backend's own shape
// (POST /v1/scam-check, see api.js), so the example and real messages run through the same page code.
// The example keeps this answer when the real backend is on, too.

const DOMAIN = 'paket-zoll-de.info'

// The link gets its own line, so the domain isn't split across lines.
export const EXAMPLES = {
  de: `Ihr Paket wird beim Zoll festgehalten. Bitte zahlen Sie heute 2,99 € Gebühr, sonst wird es zurückgeschickt:\nhttps://${DOMAIN}/z/8K2P`,
  en: `Your parcel is being held at customs. Please pay the €2.99 fee today or it will be returned:\nhttps://${DOMAIN}/z/8K2P`,
}

const ANSWERS = {
  de: {
    verdict: 'scam', // scam | caution | legit
    threat_type: 'parcel_delivery', // see scamType() in api.js
    impersonated_entity: 'Zoll',
    summary: 'Finger weg. Das ist Betrug.',
    // It names the scam domain and the official one; the page marks both.
    explanation: `Der Link führt zu ${DOMAIN}, nicht zum echten zoll.de. Die 2,99 € sind nur der Köder für deine Kartendaten.`,
    official_domains: ['zoll.de'],
    what_to_do: ['Tipp nicht auf den Link.', 'Lösch die SMS.'],
    if_already_happened: ['Schon Daten eingegeben? Lass deine Karte sperren: 116 116'],
    language: 'de',
  },
  en: {
    verdict: 'scam',
    threat_type: 'parcel_delivery',
    impersonated_entity: 'Zoll',
    summary: 'Steer clear. This is a scam.',
    explanation: `The link leads to ${DOMAIN}, not the real zoll.de. The €2.99 fee is just bait for your card details.`,
    official_domains: ['zoll.de'],
    what_to_do: ['Don’t tap the link.', 'Delete the text.'],
    if_already_happened: ['Already entered your details? Call 116 116 or your bank to cancel your card.'],
    language: 'en',
  },
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// The demo recognises the example by its link, so small edits still work.
export const isExample = (text) => text.includes(DOMAIN)

export async function checkMessage(text, language) {
  await wait(5000) // the backend's deadline; it usually answers in 2–3 s
  return {
    answer_id: `sc_${crypto.randomUUID()}`,
    answer: ANSWERS[language],
    fallback: false,
    // Not in the backend yet (asked for): the domains in the message and Whalebone's threat-intelligence
    // signal for each (strong · weak · none · trusted). strong = on the blocklist Onlineschutz uses.
    links: [{ domain: DOMAIN, signal: 'strong' }],
  }
}

// POST /v1/feedback, only logged for the example.
export function sendFeedback(feedback) {
  console.info('POST /v1/feedback', feedback)
}
