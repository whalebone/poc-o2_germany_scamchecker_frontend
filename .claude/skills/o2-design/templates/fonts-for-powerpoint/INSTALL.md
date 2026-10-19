# On Air — Fonts für PowerPoint & Office installieren

Diese `.ttf`-Dateien sind die offiziellen On-Air-Schriften für die o2-Marke. PowerPoint, Word, Keynote und alle Desktop-Office-Programme verwenden TrueType (`.ttf`) oder OpenType (`.otf`) Fonts — `.woff2` (Web-Format) funktioniert dort nicht.

## Warum installieren?

- Die offizielle `o2_template.pptx` hat die On-Air-Fonts zwar eingebettet, aber:
  - **Web-Version von PowerPoint** (Office 365 im Browser) ignoriert eingebettete Fonts → Arial-Fallback.
  - **macOS** zeigt eingebettete Fonts manchmal nur in der bearbeiteten Folie, nicht in allen Platzhaltern.
  - **Beim Teilen** mit Kolleg:innen ohne installierte Schrift kann das Rendering kippen.

→ Lokal installieren ist die einzige zuverlässige Lösung.

## Installation

### macOS
1. Diesen Ordner öffnen (`templates/fonts-for-powerpoint/`).
2. Alle `.ttf`-Dateien auswählen (`⌘ + A`).
3. Doppelklick auf eine der Dateien → in der Vorschau `Schrift installieren` klicken.
4. PowerPoint einmal komplett neu starten.

### Windows
1. Diesen Ordner öffnen.
2. Alle `.ttf`-Dateien auswählen.
3. Rechtsklick → `Installieren` (oder `Für alle Benutzer installieren`).
4. PowerPoint einmal komplett neu starten.

## Enthaltene Schnitte

| Datei | Verwendung |
|---|---|
| `OnAir-Light.ttf` | Body Light, redaktioneller Fließtext |
| `OnAir-Regular.ttf` | Body, Sublines |
| `OnAir-Italic.ttf` | Body italic |
| `OnAir-Bold.ttf` | Headlines, Buttons |
| `OnAir-BoldItalic.ttf` | Hervorhebungen in Headlines |
| `OnAir-Black.ttf` | Display, „can do."-Mechanik, Hero-Headlines |

## Fallback-Reihenfolge laut Brand Guidelines

Wenn On Air nicht verfügbar ist:
1. **Arial** (Bold, Regular) — der vom o2 Brand Team freigegebene Systemschrift-Fallback
2. **Arial Narrow** — für kondensierte Stellen

Smartphones ohne On-Air-Support → installierte serifenlose Systemschrift (Helvetica, etc.).

> Nie eine andere Schrift (Roboto, Inter, Open Sans …) verwenden — nur On Air oder Arial.
