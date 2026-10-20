# O₂ Scam-Check: product context and UX decisions

Read this before UI or UX work. It holds what the page is built on: the brief, the backend proposal, the O₂ Onlineschutz facts and the decisions from the product-designer reviews of round 1 (2026-10-19) and round 2 (2026-10-20). Update it when a decision changes, so the next session doesn't redo the research.

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

Round 2 (feedback on the deployed round 1, 2026-10-20):
- Separate UX for mobile and desktop; mobile was a good start.
- Expect about 5 s of backend time and make the wait a fun, engaging animation.
- Show the key scam types, with a super simple animated "diagram" of how each one works, explained like to a kindergartner: minimum words, animated characters, 5–10 s each, no walls of text. Show the detected type's animation on the result too.
- A smaller "Beispiel einfügen", but keep it.
- A more playful result ("Steer clear" was "meh"): bring in an element of the scam type, explain, recommend the real website.
- Drop „Kostenlos. Wir öffnen keine Links.“, the footer „Scam‑Check ersetzt keinen Virenschutz.“ and "Opens a page in German".
- The empty landing page gets scrolling information on the five threat types.

## Backend proposal (from the brief; not built)

`POST /v1/scam-check` with `{ "text": "…", "language": "de" }`. The target is an answer in under 5 s.

| Field | Values | Used by the page for |
|---|---|---|
| `request_id` | `"sc_8f3k2p"` | the feedback call |
| `verdict` | `scam` · `caution` · `ok` | tone of the verdict card (`data-verdict`) |
| `type` | `parcel_scam` · `account_phishing` · `family_impersonation` · `fake_profit` · `romance_scam` · `null` | a known type shows the Trickser in its costume, the „Durchschaut“ tag, its story and the share card |
| `headline` | "Finger weg. Das ist Betrug." | verdict |
| `reason` | 1–3 short sentences | why; the domain gets highlighted |
| `link` | `{ domain, owner, status: malicious · legit · unknown, imitates }` or `null` | `malicious` shows the Onlineschutz card; `owner` isn't used |
| `link.imitates` | `"zoll.de"` or `null` (**new in round 2**) | the real site the link pretends to be: „Echt oder Fake?“ shows the scam domain next to it |
| `next_steps` | 1–2 strings | "So bleibst du sicher", numbered |
| `if_it_happened` | string or `null` | the help line; "116 116" becomes a `tel:` link |

- **Dropped from the brief's demo:** the follow-up question with answer buttons, and the tip.
- **Type names from the deck**, shown on the page since round 2: Paket‑Trickser, Konto‑Knacker, Hallo‑Mama‑Schwindler, Goldesel, Liebes‑Lügner. English: Parcel Trickster, Account Cracker, Hi‑Mum Faker, Golden Goose, Love Liar.
- **Share texts** exist only for `parcel_scam`. Write `share.subject.*` and `share.message.*` for the other four before the real backend sends them.
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

**Phones (one column):**
1. **Hero:** Blauverlauf (the O₂ blue gradient) with the logo, "Scam-Check", a Light Blue "Demo" tag and the DE|EN switch. H1 "Ist das Betrug?" and the lead „Füg die Nachricht ein. Wir sagen dir in Sekunden, woran du bist.“
2. **Form card:** it overlaps the hero.
   - The field, with a small "Beispiel einfügen" chip and an icon-only camera button inside its border.
   - The empty-field hint.
   - "Jetzt prüfen" with a search icon.
3. **Slot below the form** shows one of:
   - the checking card: the Lupe reads the message, takes the link to the blocklist book, thinks; one caption line per phase
   - the result:
     - the verdict card: the "spotted" scene (the Lupe has caught the Trickser in the type's costume), the „Durchschaut: Paket‑Trickser“ tag, the headline, the reason, „Echt oder Fake?“, numbered steps, the 116 116 help line and the feedback
     - „So läuft der Trick“: the type's story
     - the Onlineschutz card (the Trickser bounces off the shield), the share card and "Andere Nachricht prüfen"
   - the demo notice for any text other than the example
4. **„Kennst du diese Maschen?“** below the slot, only while the slot is empty: the five stories stacked.
5. **Screenshot popup:** a native `<dialog>`.

**Desktop (from 1024 px):** the same hero, then two columns (5:7). The form card on the left, sticky when the window is at least 700 px tall. On the right: the scam types as one card with five avatar tabs (the Trickser in each costume) and one story at a time; on check, the loader and then the result take that column.

**A story** (landing page and result): a cartoon of 9 s in three beats, the three steps under it as a little diagram (① — ② — ③, lit in step with the beats), and one rule to remember with a tick.

## UX decisions and why

Keep these unless you have a reason to change them. Round 1 comes first (the designer's verdict after its third review: ship as an internal PoC); **round 2** below adds to it and wins where they differ.

**Flow**
- One task. The H1 is the user's own question, so it fits any verdict. Phones get one column; desktop gets two since round 2.
- "Beispiel einfügen" only fills the field. It doesn't focus it, so no keyboard opens, and the user learns the flow: paste, then check.
- An empty check shows the hint and focuses the field. The button is never disabled.
- Text other than the example gets a neutral demo notice at once, with no fake checking. The example is recognised by its domain, so small edits still work.
- **One scroll.**
  - On check, the slot moves to the top of the screen and reserves a screen of height.
  - The checking card, then the result, swap in place.
  - Focus moves to the headline.
- Nothing in the loader may sound like "reply to the message" (e.g. "Antwort schreiben"), the one thing a scam target must not do. Round 1's checklist became the Lupe loader in round 2.
- **Result order:** verdict card → „So läuft der Trick“ (round 2) → Onlineschutz → share → restart.
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
- Tap targets: 48 px for the field buttons (36 px visible since round 2), pills, feedback and the story button; 44 px for the switch and the popup's close button.

**Brand and visual**
- Per the brand rules, one gradient per layout: the hero (the functional variant from the skill). The Onlineschutz card is solid Beyond Blue.
- **The bubble only shows from 720 px.**
  - On phones it sat behind white text: 2.3:1 contrast, and the brand keeps white text on the dark part of the gradient.
  - It's a CSS background, so phones don't download it.
- **Red:** O₂ red is officially reserved for price stickers. Here it's only the danger signal: an `#D42E50` icon disk and an `#FFF0F3` tint. The headline stays near-black. O₂ sign-off is still open.
- **Contrast:** WCAG AA, because Germany's accessibility law (BFSG) covers O₂'s consumer services.
  - field and pill borders `#73737D`
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
  - In English, "Onlineschutz" sits in `lang="de"`.
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
- side-by-side layouts (until round 2: desktop now has two columns, at the owner's request)

**Taken from it:**
- the "you check yourself → it stops automatically" contrast
- the product name next to the logo
- the icon in the main button
- the "we don't open links" reassurance (dropped in round 2 at the owner's request)
- white cards on soft grey

### Round 2 (2026-10-20)

The designer's verdict on the concept: go with changes; on the build: ship once the Hallo-Mama mask was redrawn (done, with its SHOULDs and most COULDs).

**The cast and its grammar**
- One recurring villain, „der Trickser“: a lila blob with a bandit mask, cheeky, never scary. Each scam type gives him a costume: delivery cap and parcel, grey beanie and fishing rod with a reel, a paper-plate child's face on a stick, top hat and money sack, an orange bow tie behind a dating photo (orange, so red stays the danger signal).
- Your phone on the left is you, he stands on the right, and whatever moves to the right is lost. Every story ends with your coins at his feet: one ending, so the logic is learnt after the first story.
- Lila marks his things (his SMS, the fishing line, the crayon, the plate's stick, the hearts, the „€?“ bubble, his fingers on the photo), so the viewer sees the trick before the victim does. Hearts are lila, not red.
- The Lupe, a Beyond Blue magnifying glass with eyes, is O₂'s helper: it reads in the loader and catches him on the result. **Only the Lupe may be a round face on a diagonal handle.** The first Hallo-Mama mask (a ringed plate on a slanted stick) read as a second Lupe; now it's a plain white plate with a cap, a Dark Blue fringe and pigtails, on a vertical lila stick, held by his hand in front (ink with a white rim like his other hands, not lila: lila on lila would vanish).
- Sticker style: a white rim and a Dark Blue outline around the Trickser. Lila alone is 2.9:1 on the pink verdict tint and 1.8:1 on Beyond Blue; graphics need 3:1.
- No words in the drawings except € and ?, so one drawing serves both languages; the steps under it carry the words.
- Characters may squash and hop. UI motion stays on the 200 ms brand easing with no overshoot.

**Stories**
- 9 s in three beats of 3 s, in step with the three steps ① — ② — ③ under the scene. One thing moves per beat; in beat ③ the money goes first, then the reveal.
- The storyboards (steps and rules are in `strings.js`):
  - Paket: his SMS with a parcel and a coin → you tap, your card and a coin go into his pay page → the card flies to him, your coins follow, his parcel opens and a moth flutters out: empty.
  - Konto: a padlock with a lila "?" → his login page comes down into your screen on his fishing line (lila hook), you type → he reels in your key, your coins follow.
  - Hallo Mama: a "?" number with a heart → "?" with € and a clock, the plate face wobbles → your coins fly, the plate falls flat.
  - Goldesel: his crayon hops from his hand into your phone along a dotted arc and draws a chart that only goes up → you pay in, his sack grows, the crayon keeps drawing, then hops back → he runs off with the sack, the chart crashes.
  - Liebes‑Lügner: hearts between your phone and a photo (his lila fingertips on both edges, his bandana tail peeking out) → „€?“, you send coins → the photo tips over, it was him, the heart breaks.
- **Play once, pausable** (WCAG 2.2.2, binding through the BFSG). A story plays once when it is fully in view (95 %, or 80 % of a short screen), so nobody gets a half-seen start at the bottom edge, and rests on its last frame with all steps lit. Its 48 px button sits next to the heading, outside the drawing, and reads Pause / Abspielen / Nochmal ansehen. Leaving the screen mid-play resets it. The spotted scene (1.3 s) and the Onlineschutz scene (3 s) play once, without a button.
- **Reduced motion:** nothing plays and there is no button. Each scene shows its last frame, which tells the most (him with the loot; in Goldesel he has already left), and all steps are lit. The loader stays still.
- **Phones stack the five stories.** The owner asked for scrolling, most people never swipe a carousel, and a peeking next card shrinks the scene. **Desktop** shows one at a time with five 56 px costume avatars as tabs; the active one gets a Beyond Blue ring, not a fill, so there is still one filled button per view.
- The stories hide while the slot shows anything and come back with "Andere Nachricht prüfen": under a result they'd dilute the Onlineschutz moment, and the result has its own story.

**Loader**
- Phases set by `main.js`: read (1.7 s) → link (1.8 s) → think (until the answer) → done (0.7 s). The Lupe's path takes the first 3.5 s, which is also the minimum on screen for a fresh check: a quick answer still shows the work (labour illusion). The refetch after a language switch keeps the old card and shows no loader.
- With no link in the text, phase 2 says „Wir suchen nach bekannten Maschen …“ and hides the link pill.
- Verdict-neutral: no red and no match signal before the answer. No progress bar: a bar that stalls reads as broken.
- The live region says „Wir prüfen …“ once; then the headline gets focus. The phase captions are `aria-hidden`.

**Result**
- „Durchschaut: Paket‑Trickser“, not „Erwischt“: "caught" suggests the danger is over while the SMS is still in the inbox.
- The spotted scene in cause-and-effect order: he stands there smug with his prop while the Lupe glides in (0–0.4 s); then his hands go up and the prop drops.
- „Echt oder Fake?“, not a quiz they can fail: the scam domain with a red cross and "Fake", the real site with a green tick and "Echt". The real site is plain text, not a link: step 1 says don't tap links, and typing the address yourself is the habit we teach. Long domains wrap; the tag stays.
- The reason no longer names the domain (the block shows it) and gets a little grin: „Die 2,99 € sind nur der Köder …“.
- `verdict: scam` with `type: null`: the plain Trickser, no tag, no story, no share card.
- The verdict scene is at most 120 px tall on phones, so step 1 of „So bleibst du sicher“ stays on the first screen at 390×844.
- The share card names the type: „Der Paket‑Trickser ist gerade viel unterwegs.“

**Desktop**
- Two columns, 5:7, from 1024 px; 720–1023 px stays one wide column.
- The form sticks only when the window is at least 700 px tall, so it fits next to the result on 768 px laptops. On check, the page scrolls only when the right column's top is out of sight.
- Ctrl/Cmd+Enter in the field checks the message.

**Copy and details**
- Lead: „Wir sagen dir in Sekunden, woran du bist.“ ("sofort" over-promised with a 5 s wait).
- Removed at the owner's request: „Kostenlos. Wir öffnen keine Links.“, the footer and "Opens a page in German". A footer comes back for Impressum and Datenschutz.
- "Beispiel einfügen" is a small chip (36 px visible, 14 px text, 48 px tap area); the camera button matches.

**More measured limits**
- Steps: three columns of about 92 px at 360 px; each label has two lines reserved, so nothing jumps while they light up.
- The longest name, „Hallo‑Mama‑Schwindler“ at 22 px, is about 250 px: it fits a 296 px card.
- Desktop stories are 280 px tall, so the rule stays on a 900 px screen; 220 px on windows up to 860 px tall.

## Open items

Before anyone outside the team gets the link:
- **Legal:** Impressum and Datenschutz links, plus one line on what happens to pasted text. Check whether the AI Act needs "Die Antworten erstellt eine KI. Fehler sind möglich." / "AI writes the answers. It can get things wrong."
- **Real devices:** test the keyboard handling on an iPhone in Safari and an Android phone in Chrome, with the example pasted. So far it's only verified in automation.
- **O₂ sign-off:** red as the scam signal, the Onlineschutz wording, and the Trickser with its lila grammar (a new kind of brand asset).
- **Footer:** Impressum and Datenschutz (removed in round 2 together with its old line).
- **Netlify:** check that the site is linked to this repo with `dev` as the production branch.

Next iteration:
- **Real API:** error and timeout states with copy, plus designs for the `caution` (orange) and `ok` (green) verdicts.
- **Tracking:** example vs. own text, each check, the verdict, feedback and its reason, Onlineschutz clicks, shares, and taps on the screenshot button. These answer the PoC's questions. Since round 2 also: stories watched to the end, pauses, replays and desktop tab clicks.
- **Share texts** for the four types other than `parcel_scam`.
- **Animation smoothness** on a low-end Android phone.
- **Second example:** a scam without a link („Hallo Mama“).
- **Accessibility audit:** axe or Lighthouse, plus a VoiceOver run.

## How to iterate

1. Keep the dev server running (`runapp.bat`): http://localhost:5180. Add `?lang=en` for English.
2. Where things live:
   - texts: `src/strings.js` (both languages)
   - styles: `src/style.css`
   - cartoons: `src/scenes.js`, their animations: `src/scenes.css`
   - markup: `index.html` (no texts)
   - behaviour: `src/main.js`
   - the demo answer: `src/demo.js`
3. `npm run check` runs the behaviour checks against the dev server. When you change behaviour on purpose, update `scripts/check.mjs` with it.
4. `npm run shots` writes every state to `shots/`:
   - `m…` phone 390 px German
   - `s…` small phones
   - `e…` English at 360 px
   - `d…` desktop 1440 and 1024 px
5. To check an animation, pause every animation at fixed times and take a screenshot of each moment, as a filmstrip (see the Gotchas in `CLAUDE.md`).
6. For any visible UX change, run a design review (below).
7. `npm run og` re-renders `public/og.jpg` after the hero title or the logo changes.
8. `npm run build`, then commit and push to `dev`. That deploys.

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
  - since round 2: every story readable frame by frame, anything moving longer than 5 s pausable, still frames with reduced motion
