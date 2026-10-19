---
name: o2-design
description: Use this skill to generate well-branded interfaces and assets for o2 / Telefónica Deutschland (websites, slides, mocks, campaigns, prototypes). Contains the full brand guidelines distilled from the official Telefónica Brand Factory, plus colors, type, fonts, assets, icons, and UI-kit components.
user-invocable: true
---

# o2 / Telefónica Deutschland — Design Skill

Read this file fully before producing anything. When in doubt, the [Brand Factory](https://brandfactory.telefonica.com/document/1992) is the canonical source of truth; contact `branding-de@telefonica.com` for sign-off on new assets.

## How to use this skill

- **If asked to create a visual artifact** (slide, mock, prototype, landing page, social asset, email): copy assets out of this skill, follow the rules below, output a static HTML file.
- **If working on production code:** copy assets and read the tokens in `colors_and_type.css`. Adopt the voice rules in any UI copy you write.
- **If the user invokes this skill with no further guidance:** ask what they want to build, ask 6–10 focused questions (audience, channel, du/Sie, length, variations, do they have photography), then design.

---

## 1 · BRAND CORE

| | |
|---|---|
| **Marke** | O₂ (Privatkundenmarke der Telefónica Germany) |
| **Mark name** | Always **O₂** — On-Air glyph (`ooo`+`2`) when the font is available, else `O` with `2` subscripted. Never bare "O2". |
| **Markenversprechen** | "Refreshingly different" |
| **Ambition** | "Unlock Telco" — die Telco-Kategorie neu denken |
| **Mechanic** | **can do** — immer klein, immer am **Anfang** der Headline, nie Mitte/Ende, nie auf Hardware/Kleidung, nicht mit Störer kombinieren |
| **Personas** | Daniel (Digital Performer) · Sophie (Students & Trainees) · Udo (Uninvolved Mainstream) |

### Tonalität — "Refreshingly different"

Drei Linsen für jede Zeile:
1. **Unbeschwert** — nie belehrend, nie korporativ steif
2. **Unangepasst** — anders als der Rest der Telco-Kategorie
3. **Humorvoll** — dosiert; Selbstironie mit Augenzwinkern; nie insider, nie platt, nie unter der Gürtellinie

---

## 2 · CONTENT FUNDAMENTALS

### Voice — Do / Don't

| ✅ on-brand | ❌ off-brand |
|---|---|
| „Mach Schluss mit Kabelfernsehen und schalt um auf O₂ TV." | „Der Wegfall des Nebenkostenprivilegs ist eine Gelegenheit…" |
| „Mit 5G Plus noch schneller und energiesparender surfen." | Werbefloskeln, leere Superlative |
| „O₂ holt den Testsieg." | Passiv, vage, ausweichend |
| „Mehr Datenvolumen. Mehr Service. Mehr Erlebnis." | Verspielt, verschnörkelt |
| „Unsere Buchhaltung war dagegen. Trotzdem für dich: deine neue Hülle geschenkt." | „Gönn dir O₂ Home für echte Homies." |

**Sprache ist gesprochen, nicht geschrieben:** kurze Sätze, aktive Verben, Rhythmus, ein kleines Grinsen.

### Anrede

| Kontext | Form |
|---|---|
| Privatkundschaft (alle Kanäle) | **„du"** durchgängig — *klein, außer am Satzanfang* |
| Business-Kundschaft | **„Sie"** durchgängig — *groß* |
| System, Vertrag, Rechnung | „Sie" |
| 1:1 | „Hallo Marlin Muster" (du) / „Guten Tag Marlin Muster" (Sie) — genderneutral |

### Formalien

- **Keine Ausrufezeichen.** „Leiser ist lauter." Fragezeichen sind ok.
- **Punkte in Headlines** nur, wenn die Headline ein ganzer Satz ist.
- **Deutsche Gänsefüßchen** „..." — niemals "gerade".
- Sätze dürfen mit *Und* oder *Weil* beginnen.
- **Englisch sparsam, britisch**, nur Simple English wenn geläufig.
- **Inklusiv & genderneutral**.
- **can do** ist **immer klein** — auch am Satzanfang. Fett in Sublines/Fließtext.

### Preise & Geldbeträge

| Fall | Schreibweise |
|---|---|
| Ganze Beträge | `17 €` (ohne Dezimalen) |
| Null | `0,–` (nicht „0" → Verwechslung mit „O") |
| Ungerade | `19,99 €` |
| Tausender | `1.000 €` |
| In Text | „… 245,15 €." (Summe — Währung) |
| „Euro" als Wort | `500 EUR` (Versalien) |
| Streichpreise | **nur online** |

---

## 3 · VISUAL FOUNDATIONS

### Color tokens (also in `colors_and_type.css`)

**Primary / Secondary**
- `--o2-beyond-blue: #0050FF` — *the* brand color, immer dominant
- `--o2-dark-blue: #00008C`
- `--o2-light-blue: #82DCFA`
- `--o2-white: #FFFFFF`

**Accents** (Highlights, nie dominant)
- `--o2-orange: #FFA55A`
- `--o2-lila: #A078FF`
- `--o2-gruen: #00DC7D`
- `--o2-rot: #F65D7C` — **ausschließlich für Preis-Störer**

**Neutrals** (Schwarz-Skala)
- `#00001E` 100 · `#3C3C46` 80 · `#73737D` 60 · `#B4B4BE` 40 · `#F3F3F5` 20

**Semantic**
- `--bg-page: #FFFFFF` · `--bg-soft: #F3F3F5`
- `--fg-1: #00001E` · `--fg-2: #3C3C46` · `--fg-3: #73737D`
- `--border: #F3F3F5` · `--border-strong: #B4B4BE`
- `--brand: var(--o2-beyond-blue)` · `--brand-hover: var(--o2-dark-blue)`

### Blauverlauf (the brand gradient)

- **Primärer Hintergrund für Erstkontakt-Medien.** Solid Beyond Blue nur für Zweitkontakt.
- Standard: `linear-gradient(180deg,#00008C 0%,#0050FF 55%,#82DCFA 100%)`
- Funktional (online, mehr Kontrast): `linear-gradient(180deg,#00008C 0%,#0050FF 80%,#246CFF 100%)`
- Bottom-light → top-dark. Rotation ±45°, helles Ende immer unten.
- **Pro Layout: nur ein Gradient.** Nicht mehrfach drehen, nicht bearbeiten.
- Logo + weißer Text immer im dunklen Bereich; Safezone endet bei `#246CFF`.

### Typography — On Air

| Style | Family | Weight | Size/LH | Use |
|---|---|---|---|---|
| Display | On Air | 900 Black | 80/95% | Bühne, Hero |
| H1 | On Air | 700 Bold | 52/100% | Page heading |
| H2 | On Air | 700 Bold | 36/105% | Section |
| H3 | On Air | 700 Bold | 26/110% | Sub |
| Subline | On Air | 700 Bold | 20/120% | Lead |
| Body | On Air | 400 Regular | 16/140% | Default |
| Body Light | On Air | 300 Light | 16/140% | Editorial |
| Small | On Air | 400 Regular | 14/140% | Microcopy |
| Caption | On Air | 400 Regular | 12/130% | Meta |

- **Tracking 0**, line-height **88–110%** für Headlines, **120%** für Sublines, **140%** für Body.
- **Versalien-Headlines:** nur mit Brand-Team-Freigabe.
- **Condensed / Extended Black:** nur auf Blauverlauf oder solid Beyond Blue, nie auf Fotografie.
- **Fallback:** Arial / Arial Narrow (PowerPoint, Word, Geräte ohne On Air).

### Spacing — 8 px grid (compatible 4 px steps)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

### Corner radii

| Token | Use |
|---|---|
| 4 px | Inputs (fine) |
| 8 px | Chips, small buttons |
| 14–16 px | Cards (default) |
| 20–24 px | Panels, modals |
| 28 px | Hero-Container |
| 999 px | Pill buttons, tags |

### Shadows (cool-blue tinted, never warm)

```
--shadow-1: 0 1px 2px rgba(0,0,30,.06);
--shadow-2: 0 4px 16px rgba(0,0,30,.08);   /* default card */
--shadow-3: 0 12px 28px rgba(0,0,30,.10);  /* popovers */
--shadow-4: 0 24px 48px rgba(0,0,30,.14);  /* modals */
```

### Borders

- Mostly `1px` in `var(--border)` or `var(--border-strong)`.
- Inputs: `1.5px solid var(--o2-black-40)`; focus = `var(--brand)`.
- Heavy borders are avoided — Typografie und Farbe übernehmen die Hierarchie.

### Motion

- `200ms cubic-bezier(.22, 1, .36, 1)` for state changes (default).
- **Hover** → darker primary (Dark Blue) / `--o2-black-80` für neutrale Elemente.
- **Press** → `scale(.98)` + dunklerer Ton.
- Pulsing / floating bubbles für Hero-Treatments. Keine bouncigen Springs, kein Overshoot.

### Transparency & Blur

Sparsam. Nur auf dem Blauverlauf (funktionale Darken-Overlays). **Kein** Glassmorphism als Stilmittel — die Marke setzt auf solide, selbstbewusste Farbflächen.

### Bubbles

Drei Layer (hard light → soft light → shadow). Niemals perfekte Kreise — natürlich, dynamisch, mit gerichteter Lichtquelle, die zur Szene passt.

**Drei Rollen:**
1. **Stage-Bubble** — frames a product / topic
2. **Atmosphere** — Tiefe + Fokus, max 5 pro Layout, varied size + Gaussian blur
3. **Connector** — verlinkt Sektionen, leitet das Auge

**Never:**
- ❌ Container für Preise, Geräte, Botschaften
- ❌ Auf realer Fotografie (Ausnahme: Connector)
- ❌ Stage-Bubble + extra Bubbles kombinieren
- ❌ Weißer Gradient hinter Bubbles

### Imagery — Bildsprache

Vier Säulen:
1. **Spannende Perspektiven** — bird/frog, first-person, bewusste Bildkadrierung
2. **Starke Farben & lebendige Kontraste** — kühler Weißabgleich, o2-Palette in der Szene
3. **Authentische Blueness** — blau als natürliches Bildelement (Himmel, Styling, Props)
4. **Klare Kompositionen** — viel Hintergrund → erweiterbar auf 16:9 / 1:1 / 9:16 / 4:5

**Themes:** Real People · Real Stories · Everyday Indoor · Urban Outdoor · Product & Still Life

**Don'ts:** keine gestellten Posen, keine farbigen Filter, niemals surreal/düster/bedrohlich, keine extreme Tiefenschärfe, keine warmen Weißabgleiche.

### Layout rules

- Cards sit on white or `--bg-soft` mit `--shadow-2`; **niemals** bluish-purple gradient backdrop oder farbiger Left-Border-Akzent — beides off-brand.
- Logo-Schutzzone: Höhe der "2" rundherum; mindestens 15 % der langen Seite.
- Auf Blauverlauf: weißes Logo. Auf Weiß / hellen Flächen: Beyond Blue Logo.

---

## 4 · ICONOGRAPHY

o2 ships its own icon system (no third-party CDN, no emoji):

- **Two versions** — *Outline* (primary, all sizes) und *Solid* (small / dense UI)
- **Grid:** 64×64 mit 4 px Schutzrahmen → Live-Area 56×56
- **Stroke:** Outline 3.5 px, Solid outer 3.5 / inner 2.5, optical corrections 2.5
- **Corners:** 4 / 8 / 12 px or circular; line endings always rounded
- **Colour:** Weiß auf Beyond Blue / Sekundär. Beyond Blue auf Weiß. Mindestens **3:1** Kontrast.
- **Rules:** Icons haben immer Bedeutung — nie Deko. Nicht kombinieren. Nicht außerhalb Beyond Blue / Weiß umfärben.

Curated subset in `assets/icons/` covers UI nav, telco product concepts, money, devices, security, business. Full ~600-icon set in `uploads/`.

**Never use:** emoji · unicode dingbats · Lucide / Heroicons / Material Icons / Font Awesome / any third-party.

---

## 5 · LAYOUT PATTERNS

### Buttons

```css
.btn {
  font-family: "On Air", Arial, sans-serif;
  font-weight: 700; font-size: 16px;
  padding: 14px 22px; border-radius: 999px; border: 0;
  transition: background .2s cubic-bezier(.22,1,.36,1);
}
.btn:active { transform: scale(.98); }
.btn-primary   { background: #0050FF; color: #fff; }
.btn-primary:hover { background: #00008C; }
.btn-secondary { background: transparent; color: #0050FF; border: 2px solid #0050FF; }
.btn-secondary:hover { background: #0050FF; color: #fff; }
.btn-tertiary  { background: transparent; color: #0050FF; padding-left: 0; }
.btn-on-blue   { background: #fff; color: #0050FF; }
```

### Inputs

- Pill: `border-radius: 12px;` `padding: 14px 16px;` border `1.5px solid #B4B4BE` → focus `#0050FF`
- Error border `#F65D7C`, error message `#D42E50`
- Toggles: `#B4B4BE` off → `#0050FF` on, 200 ms

### Cards (Produkt / Tarif)

- White card mit `box-shadow: 0 4px 16px rgba(0,0,30,.08)`, radius 16–18 px
- Highlighted variant: Blauverlauf (Dark Blue → Beyond Blue), weiße Schrift
- Preis: `font-weight: 900; font-size: 30–46px`; `/Monat` separat klein

### Preis-Störer

- Kreis, leicht rotiert (`transform: rotate(-8deg)`)
- Background **`#F65D7C`** (Rot — *nur hier* erlaubt), Schrift weiß, fett 900

### Hero

- Blauverlauf
- Stage-Bubble (1:1, 16:9 oder 9:16 je Format) rechts
- Headline: 72–110 px Black, Body 20–24 px, Pill-Buttons
- Optional: 1–2 Atmosphere-Bubbles, Gaussian-blurred

---

## 6 · FILES IN THIS SKILL

```
README.md                       — vollständige brand guide
SKILL.md                        — this file (entrypoint)
colors_and_type.css             — alle Tokens + @font-face

fonts/                          — On Air (.woff2 + .ttf für alle Schnitte)
assets/
  logo/                         — Beyond Blue + White SVG
  bubbles/                      — Product (10) + Stage (1:1, 16:9, 9:16) PNG
  icons/                        — curated outline/solid SVGs (~120)

templates/
  o2_template.pptx              — OFFIZIELLER PowerPoint-Folienmaster (Workflow A)
  fonts-for-powerpoint/         — On-Air .ttf zur Installation in Office (INSTALL.md)

preview/                        — Design-system specimen cards
ui_kits/website/                — React-style web UI kit
slides/                         — HTML-Slide-Templates (Workflow B/C, deck-stage)
```

`uploads/` (raw inputs) bleibt für tiefergehende Asset-Picks erhalten.

---

## 7 · POWERPOINT — empfohlener Workflow

Der **offizielle Folienmaster** liegt unter `templates/o2_template.pptx`. Drei Wege, abhängig vom Ziel:

### 0) Voraussetzung — On-Air-Schriften installieren

**Bevor du in PowerPoint loslegst:**
- Ordner `templates/fonts-for-powerpoint/` öffnen
- Alle `.ttf`-Dateien installieren (macOS: Doppelklick → "Schrift installieren" · Windows: Rechtsklick → "Installieren")
- PowerPoint neu starten

Ohne installierte Fonts fällt PPT auf Arial zurück (das ist laut Brand auch ok als System-Fallback — aber „On Air" sieht besser aus).

### A) Final-Decks: offizielles Template als Startpunkt (empfohlen)
1. `templates/o2_template.pptx` in PowerPoint öffnen.
2. Vorhandene Folienmaster-Layouts nutzen (Title, Section, Content, Comparison, Quote, Closing).
3. Inhalte aus HTML-Drafts manuell rüberkopieren.

→ **Pixelperfekte Master, korrekte Themes, voll editierbar.** Aufwand: manuell.

### B) Schnelle Drafts: HTML → editable PPTX
1. Folien als HTML mit `deck-stage.js` bauen (Templates in `slides/`).
2. Über `gen_pptx` (mode: `editable`) exportieren — erzeugt native Shapes & Textboxen.
3. **Wichtig:** auf der Zielmaschine müssen On-Air-Fonts installiert sein, sonst Arial-Fallback.
4. **Caveat:** das Original-Folienmaster wird **nicht** übernommen — Themes, Layout-Platzhalter und Master-Hintergründe gehen verloren.

→ **Gut für interne Reviews & Inhalts-Iteration.**

### C) Read-only Decks: HTML → Screenshot-PPTX
1. Folien als HTML bauen.
2. `gen_pptx` (mode: `screenshots`) — jede Folie als PNG.
3. **Caveat:** nicht editierbar, dafür visuell exakt 1:1 zum HTML, Fonts immer korrekt (sind Teil des PNGs).

→ **Wie ein PDF, aber im PPTX-Container.**

### Logos in PPT-Exports

- HTML-Slides nutzen `<img src="../assets/logo/o2_Logo_*.svg">` ohne CSS-Filter.
- `gen_pptx` bettet diese als saubere Bild-Shapes ein — das Logo bleibt ein Logo, nicht in Pfade zerlegt.
- **Nicht** `filter: brightness(0) invert(1)` oder CSS-Tricks auf Logos verwenden — diese überleben den PPT-Export nicht. Stattdessen die passende Farbvariante (`o2_Logo_White.svg` auf dunklem Hintergrund, `o2_Logo_Beyond_Blue.svg` auf hellem) direkt referenzieren.

### Entscheidungsbaum
- *Muss der Empfänger Text ändern können und sieht offizielle o2-Master?* → **A**
- *Schnelle Iteration mit Stakeholdern, Edits später ok?* → **B**
- *Finale, nicht-änderbare Distribution, Visuals = höchste Priorität?* → **C**

**Was ich (Claude) NICHT zuverlässig kann:** den bestehenden Folienmaster aus `o2_template.pptx` programmatisch mit neuen Inhalten füllen. Versuch produziert verschobene Platzhalter — bitte stattdessen Workflow A nutzen.

---

## 8 · WHEN BUILDING THINGS

**Checklist before output:**
- [ ] „du" oder „Sie" — habe ich Zielgruppe geklärt?
- [ ] „can do" — falls genutzt, klein und am Headline-Anfang?
- [ ] Keine Ausrufezeichen?
- [ ] Deutsche „Gänsefüßchen"?
- [ ] Preise im richtigen Format?
- [ ] Beyond Blue dominant? Rot nur für Preis-Störer?
- [ ] Max 5 Bubbles pro Layout, keine Bubble-Container für Preise?
- [ ] On Air geladen? Arial-Fallback gesetzt?
- [ ] Logo: weiß auf Blau, Beyond Blue auf Weiß?
- [ ] Icons aus `assets/icons/` — kein Lucide / Emoji?

**Reach for the foundations:**
- Tokens → `colors_and_type.css` (link or copy)
- Componenten-Patterns → `ui_kits/website/*.jsx` (cosmetic copies, not real prod code)
- Slide-Layouts → `slides/*.html` + `deck-stage.js`

When in doubt: ask the user, or open the Brand Factory.
