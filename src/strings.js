// Every visible text in both languages. index.html refers to these keys with
// data-i18n (text), data-i18n-html (the few texts with markup), data-i18n-placeholder
// and data-i18n-label (aria-label).
// O₂ voice: short, spoken, no exclamation marks; German uses "du".
// On Air has no "₂", so page text writes O<sub>2</sub>.   = no-break space, ‑ = no-break hyphen.
// share.* texts leave the page (share sheet, e-mail), so they use plain characters.

export const STRINGS = {
  de: {
    title: 'Ist das Betrug? · O₂ Scam-Check',
    product: 'Scam‑Check',
    'hero.title': 'Ist das Betrug?',
    'hero.lead': 'Füg die Nachricht ein. Wir sagen dir sofort, woran du bist.',

    'form.label': 'Verdächtige Nachricht',
    'form.placeholder': 'SMS, E‑Mail oder Chat hier einfügen',
    'form.example': 'Beispiel einfügen',
    'form.screenshot': 'Screenshot hochladen',
    'form.submit': 'Jetzt prüfen',
    'form.busy': 'Wir prüfen …',
    'form.note': 'Kostenlos. Wir öffnen keine Links.',
    'form.empty': 'Füg zuerst eine Nachricht ein.',

    'progress.read': 'Text gelesen',
    'progress.link': 'Link geprüft',
    'progress.done': 'Ergebnis fertig',

    'result.steps': 'So bleibst du sicher',
    'result.call': '116 116 anrufen',

    'feedback.ask': 'War das hilfreich?',
    'feedback.yes': 'Ja',
    'feedback.no': 'Nein',
    'feedback.why': 'Was hat nicht gepasst?',
    'feedback.wrong': 'Stimmt nicht',
    'feedback.unclear': 'Unklar',
    'feedback.useless': 'Hilft mir nicht',
    'feedback.thanks': 'Danke für dein Feedback.',

    'protect.title': 'Mit Onlineschutz bist du davor schon geschützt.',
    'protect.text':
      'Die Seite steht auf unserer Sperrliste. Onlineschutz blockiert sie automatisch im O<sub>2</sub> Netz, bevor sie lädt. Ohne Installation.',
    'protect.cta': 'Onlineschutz ansehen',
    'protect.note': '',

    'share.title': 'Warn deine Liebsten.',
    'share.text': 'Diese Masche ist weit verbreitet.',
    'share.button': 'Warnung teilen',
    'share.email': 'E‑Mail',
    'share.copy': 'Kopieren',
    'share.copied': 'Kopiert',
    'share.subject.parcel_scam': 'Vorsicht vor falschen Paket-SMS',
    'share.message.parcel_scam':
      'Vorsicht vor falschen Paket-SMS: Die „Zollgebühr“ ist ein Trick, um an deine Kartendaten zu kommen. Tipp nicht auf den Link. Verdächtige Nachrichten prüfst du mit dem O₂ Scam-Check:',

    reset: 'Andere Nachricht prüfen',
    'notice.text': 'Diese Demo kennt bisher nur das Beispiel.',

    'upload.title': 'Screenshots prüfen wir bald.',
    'upload.text': 'Bitte hab noch etwas Geduld. Bis dahin kopier den Text und füg ihn ein.',
    'upload.ok': 'Alles klar',
    'upload.close': 'Schließen',

    'footer.text': 'Scam‑Check ersetzt keinen Virenschutz.',
  },

  en: {
    title: 'Is this a scam? · O₂ Scam Check',
    product: 'Scam Check',
    'hero.title': 'Is this a scam?',
    'hero.lead': 'Paste the message. We’ll tell you straight away where you stand.',

    'form.label': 'Suspicious message',
    'form.placeholder': 'Paste a text, email or chat here',
    'form.example': 'Use example',
    'form.screenshot': 'Upload a screenshot',
    'form.submit': 'Check now',
    'form.busy': 'Checking…',
    'form.note': 'Free. We don’t open links.',
    'form.empty': 'Paste a message first.',

    'progress.read': 'Message read',
    'progress.link': 'Link checked',
    'progress.done': 'Result ready',

    'result.steps': 'How to stay safe',
    'result.call': 'Call 116 116',

    'feedback.ask': 'Was this helpful?',
    'feedback.yes': 'Yes',
    'feedback.no': 'No',
    'feedback.why': 'What wasn’t right?',
    'feedback.wrong': 'That’s wrong',
    'feedback.unclear': 'Unclear',
    'feedback.useless': 'Doesn’t help me',
    'feedback.thanks': 'Thanks for your feedback.',

    'protect.title': 'With <span lang="de">Onlineschutz</span>, you’re already protected from this.',
    'protect.text':
      'This site is on our blocklist. <span lang="de">Onlineschutz</span> blocks it automatically on the O<sub>2</sub> network, before it loads. Nothing to install.',
    'protect.cta': 'More about <span lang="de">Onlineschutz</span>',
    'protect.note': 'Opens a page in German',

    'share.title': 'Warn your loved ones.',
    'share.text': 'This scam is doing the rounds.',
    'share.button': 'Share the warning',
    'share.email': 'Email',
    'share.copy': 'Copy',
    'share.copied': 'Copied',
    'share.subject.parcel_scam': 'Watch out for fake parcel texts',
    'share.message.parcel_scam':
      'Watch out for fake parcel texts: the ‘customs fee’ is a trick to get your card details. Don’t tap the link. Check suspicious messages with O₂ Scam Check:',

    reset: 'Check another message',
    'notice.text': 'For now, this demo only works with the example.',

    'upload.title': 'We’ll check screenshots soon.',
    'upload.text': 'Please bear with us. For now, copy and paste the text.',
    'upload.ok': 'Got it',
    'upload.close': 'Close',

    'footer.text': 'Scam Check doesn’t replace antivirus software.',
  },
}
