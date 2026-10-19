# CLAUDE.md

Frontend-only PoC for the O₂ Germany Scam Checker: a static site built with Vite (plain HTML, CSS and JavaScript) and hosted on Netlify. The backend is a separate project — nothing server-side lives in this repo.

Status: scaffold only (Hello World). UX and design come next.

## Principles (KISS)

- Plain HTML, CSS and JavaScript (ES modules). No framework, TypeScript, linters or extra tooling until there is a concrete need.
- Add a dependency only when it clearly pays for itself, and say why in the commit message.
- Prefer small, readable files over abstractions. Delete code that isn't used.

## Commands

- `npm install` — install dependencies
- `npm run dev` — dev server with live reload at http://localhost:5180
- `npm run build` — production build into `dist/` (what Netlify runs)
- `npm run preview` — serve the built `dist/` locally

On Windows, `runapp.bat` starts the dev server in the background and opens the browser; `shutdown.bat` stops it. The user usually has it running with the page open: edits reload in the browser on their own, so don't start a second server. Server output goes to `dev-server.log`.

## Layout

- `index.html` — page markup and entry point
- `src/main.js` — JavaScript entry (imports `style.css`)
- `src/style.css` — styles
- `public/` — static files served as-is from the site root (create it when needed)
- `vite.config.js` — dev server port 5180 (also set in both `.bat` files)
- `netlify.toml` — Netlify build settings
- `.claude/skills/o2-design/` — O₂ brand design skill

## Design: o2-design skill

Use the `o2-design` skill for any UI, styling or copy work. It holds O₂'s colour and type tokens (`colors_and_type.css`), the On Air fonts, logos, icons and the German voice rules (du/Sie, no exclamation marks, price formats). Copy the assets the app needs into `public/` (or `src/`) instead of referencing `.claude/` from app code — the skill is reference material and gets updated on its own.

## Deployment

Netlify builds and deploys every push to `main` (`netlify.toml`: `npm run build` → `dist/`, Node 22). Pushing to `main` means going live, so run `npm run build` first. The site sends `X-Robots-Tag: noindex` to keep the PoC out of search engines; remove that header at launch.

## Gotchas

- `.bat` files must keep CRLF line endings (enforced by `.gitattributes`).
- To change the port, update `vite.config.js`, `runapp.bat` and `shutdown.bat` together.
