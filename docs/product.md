# O₂ Scam-Check: product context and UX decisions

Read this before UI or UX work. It holds what the first version (2026-10-19) was built on: the brief, the backend proposal, the O₂ Onlineschutz facts and the decisions from three product-designer reviews. Update it when a decision changes, so the next session doesn't redo the research.

## The product

- **What:** a customer pastes a suspicious SMS, e-mail or chat message and gets a clear answer in seconds: scam or not, why, and what to do now.
- **Who:** O₂ Telefónica Germany owns the page, the UX, approvals and traffic. Whalebone builds the backend (the "WhaleCheck API"), adds threat intelligence and sends a weekly usage report.
- **PoC goal:** learn how real people use it, live fast and better every week. The questions: what do people check, do they follow the advice, do they come back and upgrade? The brief wants every click tracked; tracking isn't built yet.
- **Sources:**
  - The brief deck, slides "Intro" to "Later": https://claude.ai/artifact/KEj3tMyfNzY3zh4sMZqTcy (org-shared; read it with the Artifact tool).
  - A desktop mock vibe-coded by O₂'s product manager, `onlineschutz.vercel.app/en/url-checker`: a URL checker inside an O₂ "Security" portal with a sidebar, comparing "Security Basis · free" with "Onlineschutz Smart".
  - The `o2-design` skill in `.claude/skills/`.

## What the owner asked for

These are the acceptance criteria for the page:

- A nice-looking, clean, minimalist O₂ page that follows the o2-design skill. Mobile first.
- Minimal text. The user always knows what to do next.
- One example case, no backend yet. Use only the key fields of the proposed response.
- Image upload exists, but for now it only shows a popup asking for patience.
- A feedback button on the answer.
- A share option when the result is a common scam: a call to protect other people, plus sharing to platforms.
- An upsell link to Onlineschutz that says explicitly: this site is already in our domain database, so with Onlineschutz you would already be protected. This is the main upsell moment.
- German and English from the start.

## Backend proposal (from the brief; not built)

`POST /v1/scam-check` with `{ "text": "…", "language": "de" }`. The target is an answer in under 5 s.

| Field | Values | Used by the page for |
|---|---|---|
| `request_id` | `"sc_8f3k2p"` | the feedback call |
| `verdict` | `scam` · `caution` · `ok` | tone of the verdict card (`data-verdict`) |
| `type` | `parcel_scam` · `account_phishing` · `family_impersonation` · `fake_profit` · `romance_scam` · `null` | non-null shows the share card |
| `headline` | "Finger weg. Das ist Betrug." | verdict |
| `reason` | 1–3 short sentences | why; the domain gets highlighted |
| `link` | `{ domain, owner, status: malicious · legit · unknown }` or `null` | `malicious` shows the Onlineschutz card; `owner` isn't used |
| `next_steps` | 1–2 strings | "So bleibst du sicher", numbered |
| `if_it_happened` | string or `null` | the help line; "116 116" becomes a `tel:` link |

- **Dropped from the brief's demo:** the follow-up question with answer buttons, and the tip.
- **Type names in the deck** (mascot-style, not shown on the page): Paket-Trickser, Konto-Knacker, Hallo-Mama-Schwindler, Goldesel, Liebes-Lügner.
- **How it decides:**
  1. If the text contains a link: the Whalebone resolver verdict, WHOIS/RDAP (owner and age of the domain), Google SERP and quick checks.
  2. Without a link: it reads the words for pressure, money requests, codes and passwords, and known tricks.
  3. Both paths use Whalebone's threat-intelligence library.
  4. An LLM writes the German answer: O₂ tone, one of the 5 types, what to do now, and help if it already happened.
- **Feedback:** `POST /v1/feedback { request_id, rating: up · down, reason: wrong_verdict · unclear · not_helpful · null }` → `202`. The brief's ask to O₂: thumbs under every answer, each tap sent back with its ID. The page posts once on the thumb and again with the reason, under the same `request_id`.
- **Later ideas in the brief:** screenshots and images, WhatsApp and other messengers, the "Oma Hilde" avatar, and a place inside the O₂ Security Hub (2027).

## O₂ Onlineschutz (the upsell)

- **Page:** https://www.o2online.de/extras/cloud-sicherheit/onlineschutz/. Its headline is "O₂ Onlineschutz: Vor Betrug, Datenklau & Gefahrenseiten." with "Automatisch im O₂ Netz. Ohne Installation."
- **How it works:**
  - A DNS filter in the O₂ mobile and home network checks each address against a list of known scam and malware sites, so the page never loads.
  - It does not work on other Wi-Fi networks, and brand-new scam sites can slip through.
  - The Plus tier adds a McAfee app and VPN.
- **Prices conflict** between sources (1,99 € with a 12-month term vs. 6 months free, then 2,49 € monthly, promo until 19.11.2026). **The page shows no prices.**
- **The pitch:** Scam-Check found the domain in the same database that Onlineschutz uses. Hence "Mit Onlineschutz bist du davor schon geschützt." It is shown only when `link.status === 'malicious'`.

## The page today

1. **Hero:** Blauverlauf (the O₂ blue gradient) with the logo, "Scam-Check", a Light Blue "Demo" tag and the DE|EN switch. H1 "Ist das Betrug?" and a one-line lead.
2. **Form card:** it overlaps the hero.
   - The field, with "Beispiel einfügen" and an icon-only camera button inside its border.
   - The empty-field hint.
   - "Jetzt prüfen" with a search icon.
   - "Kostenlos. Wir öffnen keine Links."
3. **Slot below the form** shows one of:
   - the checking card (3 ticking steps)
   - the result:
     - the verdict card: icon disk and tint, headline, reason, numbered steps, the 116 116 help line and the feedback
     - then the Onlineschutz card, the share card and "Andere Nachricht prüfen"
   - the demo notice for any text other than the example
4. **Footer:** "Scam-Check ersetzt keinen Virenschutz."
5. **Screenshot popup:** a native `<dialog>`.

## UX decisions and why

Keep these unless you have a reason to change them. The designer's verdict after round 3: ship as an internal PoC.

**Flow**
- One column, one task. The H1 is the user's own question, so it fits any verdict.
- "Beispiel einfügen" only fills the field. It doesn't focus it, so no keyboard opens, and the user learns the flow: paste, then check.
- An empty check shows the hint and focuses the field. The button is never disabled.
- Text other than the example gets a neutral demo notice at once, with no fake checking. The example is recognised by its domain, so small edits still work.
- **One scroll.**
  - On check, the slot moves to the top of the screen and reserves a screen of height.
  - The checking card, then the result, swap in place.
  - Focus moves to the headline.
- The steps read "Text gelesen · Link geprüft · Ergebnis fertig". Not "Antwort schreiben", which sounds like "reply to the message", the one thing a scam target must not do.
- **Result order:** verdict card → Onlineschutz → share → restart.
  - Feedback sits inside the verdict card because it rates the answer. Under two promo cards it would get fewer taps.
  - Its question sits above the Ja/Nein pills. Side by side doesn't fit below 390 px.
- **One filled button per view.** The form has "Jetzt prüfen". On the result, only the white Onlineschutz button is filled; share is an outline button and restart is a text button.
- **The 116 116 line stays** (the `if_it_happened` field). It's the only help for people who already tapped the link. It's a `tel:` link with a 48 px tap area.
- **Share:**
  - Touch devices get one "Warnung teilen" button that opens the native share sheet. Other devices get WhatsApp · E-Mail · Kopieren.
  - No Facebook, because it drops the text. No "Mehr …".
  - The shared text never contains the scam link, and the shared URL has no `?lang`.
  - Links show a branded preview (`public/og.jpg`).
- **Screenshot button:** a camera icon only, opening a "coming soon" popup. It works as a fake door: the taps measure demand. It's a bottom sheet on phones and centred on desktop; Escape and a tap on the backdrop close it.
- **Language switch while a result shows:**
  - The answer is fetched again in the new language.
  - The card stays fully in the old language (with a `lang` attribute) until the new answer arrives, then swaps all at once.
  - Meanwhile the switch looks disabled.

**Mobile mechanics**
- While typing, the page keeps "Jetzt prüfen" 12 px above the keyboard via `visualViewport`.
- The textarea grows from 4 to 8 rows with the text. Its font is 16 px or more, or iOS zooms in.
- Hover styles only apply under `(hover: hover)`, so taps don't leave stuck hover states.
- Tap targets: 48 px for the field buttons, pills and feedback; 44 px for the switch and the popup's close button.

**Brand and visual**
- Per the brand rules, one gradient per layout: the hero (the functional variant from the skill). The Onlineschutz card is solid Beyond Blue.
- **The bubble only shows from 720 px.**
  - On phones it sat behind white text: 2.3:1 contrast, and the brand keeps white text on the dark part of the gradient.
  - It's a CSS background, so phones don't download it.
- **Red:** O₂ red is officially reserved for price stickers. Here it's only the danger signal: an `#D42E50` icon disk and an `#FFF0F3` tint. The headline stays near-black. O₂ sign-off is still open.
- **Contrast:** WCAG AA, because Germany's accessibility law (BFSG) covers O₂'s consumer services.
  - field and pill borders `#73737D`
  - footer text `#3C3C46`
  - placeholder `#73737D`
- The "Demo" tag is Light Blue so it doesn't read as a button. The switch is a white outline pill.
- **Icons:** only O₂ icons from the skill, recoloured via CSS mask; no emoji, no third-party sets. The thumbs are O₂'s "Success" icon, rotated for "Nein".

**Copy**
- O₂ voice: short and spoken, no exclamation marks.
  - German: "du", „…“, "Wir prüfen …" with a space before the ellipsis.
  - English: British, with ’ and ‘…’, "Checking…" with no space.
- The product name is "Scam-Check" in German and "Scam Check" in English.
- **Typography:**
  - Page text writes `O<sub>2</sub>`, because On Air has no ₂.
  - In English, "Onlineschutz" sits in `lang="de"`, and "Opens a page in German" sits under its button.
- **Characters that keep words together:**
  - no-break space in "2,99 €" and "straight away"
  - no-break hyphen U+2011 in "Scam‑Check" and "E‑Mail"
  - the domain tag is `inline-block`
  - the example's URL sits on its own line
- In English, the 116 116 line adds "or your bank", because many English speakers in Germany have foreign cards.

**Measured layout limits** (On Air metrics, phones 360–390 px wide)
- **Field button row:** German only fits with an icon-only camera.
- **Verdict headline (26 px):** one span per sentence, so it breaks only between sentences.
- **H1:** at most 44 px below 400 px; at 48 px the German wraps at 360.
- **Card titles:** 22 px. The Onlineschutz title takes 2 lines at 22 px and 3 at 26.
- **Popup title:** one line only because the icon sits above it.
- **Wrapping:** the reason pills wrap 2 + 1; the share fallback pills wrap below 390 px.

**Not taken from the PM's portal mock:**
- portal chrome
- the stats row (zeros look broken)
- the empty result placeholder
- check history (privacy, no login)
- the tips block and prices
- "Network Protection" naming
- a link-only input (scams without a link need the text)
- side-by-side layouts

**Taken from it:**
- the "you check yourself → it stops automatically" contrast
- the product name next to the logo
- the icon in the main button
- the "we don't open links" reassurance
- white cards on soft grey

## Open items

Before anyone outside the team gets the link:
- **Legal:** Impressum and Datenschutz links, plus one line on what happens to pasted text. Check whether the AI Act needs "Die Antworten erstellt eine KI. Fehler sind möglich." / "AI writes the answers. It can get things wrong."
- **Real devices:** test the keyboard handling on an iPhone in Safari and an Android phone in Chrome, with the example pasted. So far it's only verified in automation.
- **O₂ sign-off:** red as the scam signal, and the Onlineschutz wording.
- **Netlify:** check that the site is linked to this repo with `dev` as the production branch.

Next iteration:
- **Real API:** error and timeout states with copy, plus designs for the `caution` (orange) and `ok` (green) verdicts.
- **Tracking:** example vs. own text, each check, the verdict, feedback and its reason, Onlineschutz clicks, shares, and taps on the screenshot button. These answer the PoC's questions.
- **Second example:** a scam without a link („Hallo Mama“).
- **Accessibility audit:** axe or Lighthouse, plus a VoiceOver run.

## How to iterate

1. Keep the dev server running (`runapp.bat`): http://localhost:5180. Add `?lang=en` for English.
2. Where things live:
   - texts: `src/strings.js` (both languages)
   - styles: `src/style.css`
   - markup: `index.html` (no texts)
   - behaviour: `src/main.js`
   - the demo answer: `src/demo.js`
3. `npm run check` runs the behaviour checks against the dev server. When you change behaviour on purpose, update `scripts/check.mjs` with it.
4. `npm run shots` writes every state to `shots/`:
   - `m…` phone 390 px German
   - `s…` small phones
   - `e…` English at 360 px
   - `d…` desktop
5. For any visible UX change, run a design review (below).
6. `npm run og` re-renders `public/og.jpg` after the hero title or the logo changes.
7. `npm run build`, then commit and push to `dev`. That deploys.

**Design review:**
- Start a general-purpose agent as a senior product designer (mobile-first consumer apps, anti-fraud UX, German telco).
- Give it read-only access to:
  - this file
  - the o2-design skill (`SKILL.md`, `README.md`, `colors_and_type.css`, `assets/icons/`)
  - the `shots/` folder
  - the source files
- Ask for:
  - MUST / SHOULD / COULD fixes, each naming its screenshot
  - exact German and English copy for any new text
  - layout risks at 360–390 px
  - a SHIP / NOT YET verdict
- Keep the same agent across rounds with SendMessage, and report your deviations back to it.
- Its standing checks:
  - the keyboard never hides the button
  - one scroll to the result
  - one filled button per view
  - feedback inside the result card
  - 48 px targets and AA contrast
  - copy word for word
  - no bubble behind text on phones
  - no mixed languages during a refresh
