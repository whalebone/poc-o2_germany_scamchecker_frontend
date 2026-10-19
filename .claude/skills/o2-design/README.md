# o2 Design System

> Design system & UI kit for **O₂ / Telefónica Deutschland** (Privatkundenmarke).
> Distilled from the official Brand Factory guidelines, the master Markenhandbuch (Stand März/April 2026), the o2 PowerPoint master template, and the production icon set (≈600 SVGs).

---

## Source materials

This system was built from the following inputs (paths refer to the user's local mount — readers may not have access to the originals, so all relevant assets have been copied into this project under `assets/`, `fonts/`, etc.):

- **`Master_Brand_Guidelines_o2/O2_Brand_Guidelines_MASTER.md`** — consolidated brand-guidelines markdown (DE), covering Markenstrategie, Logo, can-do, Farben, Blauverlauf, Bubbles, Typografie, Bildsprache, Icons, Tone of Voice, Barrierefreiheit.
- **`Master_Brand_Guidelines_o2/assets/`** — Logo SVGs (Beyond Blue + White), On Air font family (woff2 + otf + variable), o2 Bubble PNGs (10 product bubbles + 5 stage formats), PowerPoint master template.
- **`o2/`** — internal product-marketing materials (Gaming, o2 Produkte, Partner, VAS, Präsentationen, AI/KI). Not redistributed; used for tone/copy reference only.
- **`uploads/`** — the full icon set as `Name _1Outline.svg` / `Name _2Solid.svg` pairs (≈600 files).
- **Original Brand Factory:** https://brandfactory.telefonica.com/document/1992 (canonical source of truth — defer to it on conflicts; contact `branding-de@telefonica.com`).

---

## Brand at a glance

| Aspect | Value |
|---|---|
| **Brand core** | "can do" — always lowercase, always at the start of a headline if used. |
| **Ambition** | "Unlock Telco" — rethink the telco category. |
| **Tonality** | "Refreshingly different" — light, bold, humorous (smart, not slapstick). |
| **Personas** | Daniel (Digital Performer), Sophie (Students & Trainees), Udo (Uninvolved Mainstream). |
| **Mark name** | Always **O₂** — On-Air glyph (`ooo`+`2`) when font is available, else "2" subscripted. Never bare "O2". |
| **Primary color** | Beyond Blue `#0050FF` |
| **Hausschrift** | **On Air** (variable). Arial as system fallback in Office contexts. |

---

## CONTENT FUNDAMENTALS

### Voice — "Refreshingly different"

The o2 voice is **gesprochen, nicht geschrieben** — spoken, not written. Short sentences, active verbs, rhythm, a small grin behind every line. It's confident without being loud, witty without being mean.

**Three lenses for every line:**
1. **Unbeschwert** (unburdened) — never lecturing, never corporate-stiff.
2. **Unangepasst** (non-conformist) — say it differently than the rest of the telco category would.
3. **Humorvoll** — dosed humor; self-irony with a wink. Never insider, never platt (cheap), never below the belt.

### Voice — How vs how not (excerpts)

| ✅ Do | ❌ Don't |
|---|---|
| Gesprochene Sprache: "Mach Schluss mit Kabelfernsehen und schalt um auf O₂ TV." | Behördendeutsch: "Der Wegfall des Nebenkostenprivilegs ist eine Gelegenheit…" |
| Kurz & prägnant: "Mit 5G Plus noch schneller und energiesparender surfen." | Werbefloskeln, Superlative ohne Substanz |
| Selbstbewusst: "O₂ holt den Testsieg." | Passiv, vage, ausweichend |
| Rhythmisch: "Mehr Datenvolumen. Mehr Service. Mehr Erlebnis." | Verspielt, verschnörkelt |
| Selbstironie: "Unsere Buchhaltung war dagegen. Trotzdem für dich: deine neue iPhone-Hülle geschenkt." | Slang/Anbiederung: "Gönn dir O₂ Home für echte Homies." |

### Anrede — du / Sie

| Context | Form |
|---|---|
| Private Kundschaft (alle Kanäle) | **„du"** durchgängig — *immer klein außer am Satzanfang*. |
| Business-Kundschaft | **„Sie"** durchgängig — *immer groß*. |
| System-, Vertrags-, Rechnungskommunikation | „Sie". |
| 1:1-Anrede | „Hallo Marlin Muster" (du) / „Guten Tag Marlin Muster" (Sie) — genderneutral. |

### Formalien

- **Keine Ausrufezeichen.** „Leiser ist lauter." (Fragezeichen sind ok.)
- **Punkte in Headlines** nur, wenn die Headline ein ganzer Satz ist.
- **Deutsche Gänsefüßchen** „..." — keine "geraden" Anführungszeichen.
- Sätze dürfen mit *Und* oder *Weil* beginnen.
- **Englisch** sparsam, britisch, nur „Simple English" wenn geläufig.
- **Inklusiv & genderneutral** — Bildungsgrade und kulturelle Vielfalt mitdenken.

### Preise & Geldbeträge

| Fall | Schreibweise |
|---|---|
| Ganze Beträge | `17 €` (ohne Dezimalstellen) |
| Null | `0,–` (nicht „0" — Verwechslung mit „O") |
| Ungerade | `19,99 €` |
| Tausender | `1.000 €` |
| Reihenfolge in Text | „… 245,15 €." (Summe – Währung) |
| „Euro" als Wort | `500 EUR` (Versalien) |
| Streichpreise | **nur online** |

### "can do" mechanic

- Schreibweise: **immer klein**, auch am Satzanfang. **Fett** in werblichen Sublines/Fließtexten.
- **Position:** immer am **Anfang** der Headline — nie in Mitte oder Ende.
- **Haltung:** inspirieren, ermutigen, Mindset zeigen — kein generischer Content.
- **Don'ts:** nicht auf Hardware, nicht auf Kleidung, nicht als bloße Dekoration, nicht mit Störer kombinieren.

> **On-brand:** *can do denkt nicht in alten Mustern. Sondern in bunten Farben.*
> *can do sieht Chancen. Und ergreift sie auch. Jetzt wechseln und 100 € Wechselbonus sichern.*

---

## VISUAL FOUNDATIONS

### Color

- **Beyond Blue (`#0050FF`)** is the brand. Always dominant. The whole system is built around it.
- **Dark Blue / Light Blue / White** are the supporting secondaries — used for hierarchy and contrast.
- **Accents** (Orange, Lila, Grün, Rot) set highlights — they **never dominate**. **Rot is reserved exclusively for Preis-Störer.**
- **Neutrals** are the black scale `#00001E` and its 80/60/40/20 % steps — used for typography and structure, almost never as a brand statement.
- See `colors_and_type.css` for the full token set (raw + semantic).

### The Blauverlauf (blue gradient)

- The Blauverlauf is the **primary background for Erstkontakt-Medien** — it announces o2 *before you see the logo*. Beyond Blue solid backgrounds are only for *Zweitkontakt*.
- Built bottom-light → top-dark; rotation allowed within ±45°. Light end always at the bottom.
- Logo and white text always sit in the **dark area**; white-on-blue safezone ends at `#246CFF`.
- Per layout: **one gradient only**, not bearbeitet, not mehrfach gedreht.
- A "functional" variant is provided in the tokens for online cases needing higher contrast on small UI.

### Bubbles

The o2 Bubble is the brand's signature symbol — a visual stand-in for Sauerstoff. Three layers (hard light → soft light → shadow), natural and dynamic in form (never a perfect circle), with directional lighting that **matches the scene**.

- **Three roles:** Stage-Bubble (frame a product), atmosphere (depth + focus, max 5 per layout, varied size + Gaussian blur), connector (link sections / lead the eye).
- **Never** use bubbles as a container for prices, devices or messages. Never on real photography (exception: as a connector). Never combine a Stage-Bubble with extra bubbles. Never use a white gradient behind bubbles.

### Typography

- **On Air** is the only display + body face — variable, with Light/Regular/Bold/Black + Italics. Special **Condensed** and **Extended Black** styles exist for two of the three sanctioned Headline-Kombinationen, but **condensed only on the Blauverlauf or solid Beyond Blue**, never on photography.
- **Arial / Arial Narrow** as Systemschrift fallback (PowerPoint, Word, devices without On Air).
- Headlines: bold or kombination; tracking `0`; line-height **88–110%**.
- Sublines: bold/regular; line-height **120%**.
- Body: regular/light (never super-thin); line-height **140%**.
- **Versalien-Headlines:** only with Brand-Team-Freigabe.

### Imagery — Bildsprache

Bildstil sits on four pillars:

1. **Spannende Perspektiven** — bird/frog, first-person, perspective switches, deliberate framing.
2. **Starke Farben & lebendige Kontraste** — kühler Weißabgleich, o2-Palette in the scene.
3. **Authentische Blueness** — blau muss als natürliches Bildelement vorkommen (sky through a window, styling, props).
4. **Klare Kompositionen** — viel Hintergrund in alle Richtungen → das Motiv lässt sich auf 16:9 / 1:1 / 9:16 / 4:5 erweitern.

Themes: Real People · Real Stories · Everyday Indoor · Urban Outdoor · Product & Still Life.

**Don'ts:** keine gestellten Posen, keine farbigen Filter, niemals surreal/düster/bedrohlich, keine extreme Tiefenschärfe, keine zu warmen Weißabgleiche.

### Layout, surfaces, motion

- **Corner radii** in this system: cards `16px` (`--radius-md`), large panels `24px`, pills `999px`. The Brand Factory itself doesn't mandate a single radius — these are sensible defaults; adjust per surface so long as the bubble vocabulary is honoured.
- **Cards** sit on white or `--bg-soft` (`#F3F3F5`) with `--shadow-2`; never use a bluish-purple gradient backdrop or a coloured left-border accent — both off-brand.
- **Shadows** are subtle and cool-blue tinted (`rgba(0,0,30,…)`), never warm.
- **Borders** are mostly `1px` in `--border` (`#F3F3F5`) or `--border-strong` (`#B4B4BE`). Heavy borders are avoided — typography and colour do the work.
- **Motion** is calm and confident: 200ms `cubic-bezier(.22,1,.36,1)` for state changes; pulsing/floating bubbles for hero treatments. No bouncy springs, no overshooting easings.
- **Hover** = darker primary (Dark Blue), or `--o2-black-80` on neutrals. **Press** = brief scale-down (`scale .98`) + darker shade — no colour shifts beyond the family.
- **Transparency / blur** — used sparingly on the Blauverlauf (functional darken-overlays only). The brand prefers solid, confident colour blocks over glassmorphism.

---

## ICONOGRAPHY

o2 ships its own icon system designed primarily for digital use:

- **Two versions** — *Outline* (primary; all sizes) and *Solid* (small formats, dense UI).
- **Grid:** 64×64 with a 4 px protective frame → live area 56×56.
- **Stroke:** Outline 3.5 px, Solid outer 3.5 / inner 2.5, optical corrections 2.5.
- **Corners:** radii 4 / 8 / 12 px or circular; line endings always rounded.
- **Colour:** White on Beyond Blue / secondary; Beyond Blue when contrast against white is needed. Minimum **3:1** background↔icon contrast.
- **Rules:** icons always carry meaning — never decoration. Don't combine icons. Don't recolour outside Beyond Blue / White. New icons go through Design Bridge + Brand Team.

**No icon font.** o2 distributes the set as paired SVG files (`Name _1Outline.svg` + `Name _2Solid.svg`). This system copies a curated subset (~120 icons covering UI navigation, telco product concepts, money, devices, security, business). The full ~600-icon set lives in `uploads/`; copy more in as needed.

**No emoji**, no unicode dingbats, no third-party CDN icon set (Lucide/Heroicons/etc.). Use only o2's own icons.

---

## FILE INDEX

```
README.md                       — this file
SKILL.md                        — Agent Skill entrypoint (cross-compat)
colors_and_type.css             — tokens (raw + semantic) + base type utilities

fonts/                          — On Air (woff2 family + variable)
assets/
  logo/                         — o2 Logo (Beyond Blue + White SVG)
  bubbles/                      — 10 product bubbles + Stage bubbles (1:1, 16:9, 9:16)
  icons/                        — curated outline/solid SVGs (~120)

preview/                        — Design-System tab cards
  *.html                        — colour swatches, type specimens, components, etc.

ui_kits/
  website/                      — o2.de–style web UI kit
    index.html                  — interactive demo
    *.jsx                       — components (Header, Footer, Hero, ProductCard, …)
    README.md
  app/                          — My o2-style mobile app UI kit (optional, see folder)

slides/                         — o2 PowerPoint–style HTML slide templates
  index.html                    — deck shell, all templates in order
  *.html                        — individual slide HTML pages (registered)
```

---

## CAVEATS / KNOWN LIMITATIONS

- **No production codebase** was provided — the website + app UI kits are reconstructed from the brand guidelines, the PowerPoint template, and screenshots of `brandfactory.telefonica.com`. They are pixel-credible recreations, not pulled from o2's React/Vue source. If you have access to the actual code, point me at it and I'll align.
- The Blauverlauf in CSS is a 4-stop approximation; the real gradient is built bubble-by-bubble in Photoshop/Figma per layout. Use the CSS gradient for prototypes and *generate the real thing* for any finished asset.
- Bubbles are **PNGs** copied from the master kit (low-res). The Brand Factory ships hi-res versions and a "Bubble Factory" generator — use them for production.
- "can do" tags exist as a separate artistic mechanic. They are **not** recreated here — they require Brand Team sign-off and are produced by Design Bridge and Partners.

When in doubt: the Brand Factory (`https://brandfactory.telefonica.com/document/1992`) is the source of truth.
