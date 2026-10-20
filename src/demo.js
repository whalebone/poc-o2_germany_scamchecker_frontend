// Stand-in for the Scam-Check backend until it exists: one example message and the answer
// POST /v1/scam-check { text, language } would return for it, trimmed to the fields the page uses.

const DOMAIN = 'paket-zoll-de.info'

// The link gets its own line, so the domain isn't split across lines.
export const EXAMPLES = {
  de: `Ihr Paket wird beim Zoll festgehalten. Bitte zahlen Sie heute 2,99 € Gebühr, sonst wird es zurückgeschickt:\nhttps://${DOMAIN}/z/8K2P`,
  en: `Your parcel is being held at customs. Please pay the €2.99 fee today or it will be returned:\nhttps://${DOMAIN}/z/8K2P`,
}

const ANSWERS = {
  de: {
    verdict: 'scam', // scam | caution | ok
    type: 'parcel_scam', // a known, common scam type, or null
    headline: 'Finger weg. Das ist Betrug.',
    reason: `Die SMS tut so, als käme sie vom Zoll. Der Link führt aber zu ${DOMAIN}, nicht zum echten zoll.de. Die 2,99 € sind nur der Köder: Eigentlich wollen die Betrüger deine Kartendaten.`,
    // malicious = in our domain database; imitates = the real site the link pretends to be, or null.
    // The reason names both; the page highlights them.
    link: { domain: DOMAIN, status: 'malicious', imitates: 'zoll.de' },
    next_steps: ['Tipp nicht auf den Link.', 'Lösch die SMS.'],
    if_it_happened: 'Schon Daten eingegeben? Lass deine Karte sperren: 116 116',
  },
  en: {
    verdict: 'scam',
    type: 'parcel_scam',
    headline: 'Steer clear. This is a scam.',
    reason: `The text pretends to come from German Customs, but the link leads to ${DOMAIN}, not the real zoll.de. The €2.99 fee is just the bait: what they’re really after is your card details.`,
    link: { domain: DOMAIN, status: 'malicious', imitates: 'zoll.de' },
    next_steps: ['Don’t tap the link.', 'Delete the text.'],
    if_it_happened: 'Already entered your details? Call 116 116 or your bank to cancel your card.',
  },
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// The demo recognises the example by its link, so small edits still work.
export const isExample = (text) => text.includes(DOMAIN)

export async function checkMessage(text, language) {
  await wait(5000) // what we expect from the real backend (its target is under 5 s)
  return { request_id: `sc_${Math.random().toString(36).slice(2, 10)}`, ...ANSWERS[language] }
}

// POST /v1/feedback — logged until the backend exists.
export function sendFeedback(feedback) {
  console.info('POST /v1/feedback', feedback)
}
