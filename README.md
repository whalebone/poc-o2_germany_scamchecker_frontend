# O₂ Germany – Scam Checker (frontend PoC)

Static frontend built with [Vite](https://vite.dev): plain HTML, CSS and JavaScript. Hosted on Netlify — every push to `dev` deploys automatically. Work happens on `dev` for now; `main` only accepts pull requests. The backend is a separate project.

## Run locally

Requires [Node.js](https://nodejs.org) 22 or newer (LTS).

**Windows:** double-click `runapp.bat`. It installs dependencies, starts the dev server in the background and opens http://localhost:5180 in your browser. Edits show up live. Double-click `shutdown.bat` to stop it. Server output goes to `dev-server.log`.

**Any OS:**

```sh
npm install
npm run dev       # http://localhost:5180 with live reload
npm run build     # production build in dist/
npm run preview   # serve dist/ locally
```

## Deploy

Netlify reads `netlify.toml` (build command `npm run build`, publish directory `dist`, Node 22). One-time setup: in Netlify, choose **Add new site → Import an existing project → GitHub**, pick this repository, set the production branch to `dev` and keep the other detected settings.

## Layout

```
index.html          page markup (entry point)
src/                JavaScript and CSS
public/             static files served as-is (create when needed)
vite.config.js      dev server settings
netlify.toml        Netlify build settings
runapp.bat          start the dev server and open the browser (Windows)
shutdown.bat        stop the dev server (Windows)
CLAUDE.md           instructions for Claude Code
.claude/skills/     Claude Code skills (o2-design brand guidelines)
```
