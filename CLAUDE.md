# CLAUDE.md

Frontend-only PoC for the O₂ Germany Scam Checker: a static site built with Vite (plain HTML, CSS and JavaScript) and hosted on Netlify. The backend is a separate project — nothing server-side lives in this repo.

Status: demo page with one example flow (a fake customs/parcel SMS), in German and English. The backend is mocked in `src/demo.js`.

**Before any UI or UX work, read `docs/product.md`.** It holds:
- the product goal and the owner's requirements
- the backend proposal (all fields)
- the O₂ Onlineschutz facts behind the upsell
- every UX decision with its reason, and the measured layout limits
- the open items
- the iteration loop, including how to run a product-designer review

Don't redo that research. Update the file when a decision changes.

## Principles (KISS)

- Plain HTML, CSS and JavaScript (ES modules). No framework, TypeScript, linters or extra tooling until there is a concrete need.
- Add a dependency only when it clearly pays for itself, and say why in the commit message.
- Prefer small, readable files over abstractions. Delete code that isn't used.

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server with live reload at http://localhost:5180
- `npm run build` — production build into `dist/` (what Netlify runs)
- `npm run preview` — serve the built `dist/` locally
- `npm run check` — behaviour checks against the running dev server (language, check flow, result, feedback, share, keyboard, contrast)
- `npm run shots` — screenshots of every state into `shots/` (git-ignored): phone 390 px German, small phones, English at 360 px, desktop
- `npm run og` — re-render `public/og.jpg` (link preview) after changing the hero title or logo

On Windows, `runapp.bat` starts the dev server in the background and opens the browser; `shutdown.bat` stops it. The user usually has it running with the page open: edits reload in the browser on their own, so don't start a second server. Server output goes to `dev-server.log`. `check`, `shots` and `og` use `playwright-core` with the installed Google Chrome; no browser download.

## UI iteration loop

1. Read `docs/product.md` and make the change. Texts go in `src/strings.js` (both languages), styles in `src/style.css`.
2. Run `npm run check`. If you changed behaviour on purpose, update `scripts/check.mjs` too.
3. Run `npm run shots` and look at the result, 360 px, English and desktop shots.
4. For a visible UX change, run a product-designer review as described in `docs/product.md`.
5. Record any new decision in `docs/product.md`.
6. Run `npm run build`, then commit and push to `dev`.

## Layout

- `index.html` — page markup and entry point; every state (checking, result, demo notice, screenshot popup) is a `hidden` section
- `src/main.js` — JavaScript entry (imports `style.css`): language, check flow, result, feedback, share
- `src/strings.js` — every visible text, German (`de`) and English (`en`) with the same keys
- `src/demo.js` — stand-in for the backend: the example message and its answer (`POST /v1/scam-check`), feedback logging (`POST /v1/feedback`)
- `src/style.css` — styles, mobile first
- `public/` — static files served as-is from the site root: On Air fonts, O₂ icons and logo, the hero bubble, `og.jpg` (link preview)
- `vite.config.js` — dev server port 5180 (also set in both `.bat` files); fills in `__SITE_URL__` for the link preview
- `netlify.toml` — Netlify build settings
- `docs/product.md` — product context, backend proposal, UX decisions, open items
- `scripts/` — `check.mjs`, `shots.mjs`, `og.mjs` (see Commands)
- `.claude/skills/o2-design/` — O₂ brand design skill

## Texts and languages

- Never put text in `index.html`. Elements name a key from `src/strings.js` with `data-i18n` (text), `data-i18n-html` (the few texts with markup), `data-i18n-placeholder` or `data-i18n-label` (aria-label). Add every key to both `de` and `en`.
- Language order: `?lang=` in the URL (for that visit only), then the choice saved from the DE/EN switch, then the browser (English for `en…`, otherwise German).
- O₂ voice in both languages: short, spoken, no exclamation marks; German uses "du" and „…“, English is British.
- On Air has no "₂" glyph: page text writes `O<sub>2</sub>` (via `data-i18n-html`). Plain "O₂" is fine only where On Air isn't used (tab title, meta tags, shared texts).

## Backend hand-over

`src/demo.js` returns only the key fields of the proposed response: `request_id`, `verdict`, `type`, `headline`, `reason`, `link { domain, status }`, `next_steps`, `if_it_happened`. To go live, replace `checkMessage()` and `sendFeedback()` with `fetch` calls and drop `isExample()` and the demo notice. `link.status === 'malicious'` (known in the domain database) shows the Onlineschutz upsell; a non-null `type` (a known, common scam) shows the share card.

## Design: o2-design skill

Use the `o2-design` skill for any UI, styling or copy work. It holds O₂'s colour and type tokens (`colors_and_type.css`), the On Air fonts, logos, icons and the German voice rules (du/Sie, no exclamation marks, price formats). Copy the assets the app needs into `public/` (or `src/`) instead of referencing `.claude/` from app code — the skill is reference material and gets updated on its own.

## Deployment

The repo is `github.com/whalebone/poc-o2_germany_scamchecker_frontend`.

- Keep `dev` checked out. Commit and push straight to `dev`; no other branches or pull requests.
- Leave `main` alone: it only accepts pull requests that need someone else's approval.

Netlify's production branch is `dev` (set in the Netlify UI), so every push to `dev` deploys (`netlify.toml`: `npm run build` → `dist/`, Node 22). Pushing to `dev` means going live, so run `npm run build` first. The site sends `X-Robots-Tag: noindex` to keep the PoC out of search engines; remove that header at launch.

## Gotchas

- `.bat` files must keep CRLF line endings (enforced by `.gitattributes`).
- To change the port, update `vite.config.js`, `runapp.bat` and `shutdown.bat` together.
- Put `:hover` styles inside `@media (hover: hover)`; on phones a hover state sticks after a tap.
- Text fields need a font size of 16 px or more, or iOS zooms in on focus.
