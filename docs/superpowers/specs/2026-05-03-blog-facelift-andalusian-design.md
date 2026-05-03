# barmag blog face-lift — Andalusian / Mamluk direction

**Date:** 2026-05-03
**Author:** Yasser Makram (with Claude)
**Status:** Approved direction, spec ready for implementation plan

## Context

`barmag.github.io` is currently the bare default `minima ~> 2.5` Jekyll theme on GitHub Pages. The author writes long-form essays on engineering leadership, neurodivergence, and tooling — a register the default theme does not honour. The face-lift exists to give the blog a visual identity that reflects the author's heritage (Andalusian / Mamluk Islamic art tradition) while staying lightweight, GH-Pages-friendly, and reading-first.

Goals:
- A distinctive, considered visual identity rooted in Mamluk/Andalusian Islamic art (sandstone + cobalt + gold, 8-point khatam motif, manuscript register).
- Bilingual logotype (`BARMAG` / `برمج`) as a personal anchor.
- Warm dark mode (deep brown + cream + gold) with a header toggle.
- Reading-time + post metadata visible.
- No infra change: still Jekyll, still GH Pages, still `theme: minima` in `_config.yml`.

Out of scope (explicitly): tags index, table of contents, comments, search, theme migration, SSG migration.

## Approach

Override `minima` locally with custom `_layouts`, `_includes`, `_sass`, and a single Sass entry point at `assets/css/main.scss`. Jekyll's theme-shadowing mechanism resolves local files before gem files, so no fork or vendoring is needed. All custom CSS lives under `_sass/barmag/`.

## Visual system

### Palette

| Token              | Light       | Dark        | Use                                        |
| ------------------ | ----------- | ----------- | ------------------------------------------ |
| `--color-bg`       | `#F5ECD9`   | `#1A140C`   | Page background (sandstone / warm-dark)    |
| `--color-bg-alt`   | `#EFE3CB`   | `#241B10`   | Header band background (subtle elevation)  |
| `--color-ink`      | `#2D2418`   | `#EFE3CB`   | Body text                                  |
| `--color-muted`    | `#8A7A52`   | `#A89570`   | Metadata, captions                         |
| `--color-heading`  | `#1F3A5F`   | `#D8B358`   | Headings, links                            |
| `--color-accent`   | `#C9A447`   | `#D8B358`   | Drop-cap, khatam glyph, dividers           |
| `--color-rule`     | `#E0D4BA`   | `#3A2E1C`   | Hairline rules between post rows           |
| `--color-band`     | `#1F3A5F`   | `#0F1F36`   | Header band (cobalt)                       |
| `--color-band-ink` | `#F5ECD9`   | `#EFE3CB`   | Text on header band                        |

Contrast verified at WCAG AA for body text (ink-on-sandstone, cream-on-warm-dark) and large text (gold-on-cobalt, gold-on-warm-dark).

### Typography

Font stacks (no web-font dependency for body — fast first paint):

- **Body (serif):** `'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif`
- **Display (serif):** `'Cormorant Garamond', 'Iowan Old Style', Georgia, serif` — pulled from Google Fonts (`wght@500;600`, italic 500), preconnect + `font-display: swap`.
- **Arabic wordmark:** `'Amiri', serif` — pulled from Google Fonts (`wght@400`).
- **Monospace:** `ui-monospace, SFMono-Regular, 'Menlo', 'Consolas', monospace` — for code only.

Sizes: body `1.0625rem` / `1.65` line-height; H1 `2.25rem`; H2 `1.5rem`; H3 `1.25rem`; metadata `0.75rem` uppercase tracked `0.06em`.

Reading column: `min(70ch, 100% - 2.5rem)` centered.

### Motifs (SVG, inline, currentColor-driven)

- **`khatam-strip.svg`** — a horizontal repeating band of 8-point stars (two overlapping squares rotated 45°). Sits directly under the cobalt header band, in gold. ~24px tall.
- **`khatam-glyph.svg`** — a single 8-point star, used as section divider at end of each post and (smaller) as separator between homepage rows.

Both are simple SVG `<symbol>`s defined once in `_includes/svg-defs.html` and referenced via `<use>` so they cost a single payload.

## Layouts

### Header (every page)

- Cobalt band (`--color-band`), full-width, ~52px tall.
- Left: `BARMAG` (Cormorant small-caps, tracked) + ` برمج ` (Amiri, slightly smaller, baseline-aligned, 12px gap).
- Right: nav `about · feed`, then dark/light toggle button (sun/moon SVG icon).
- Below the band: gold khatam strip, full-width, then content.

### Home (`/`)

- Optional one-sentence italic bio at top (~50 words max).
- Post list: each row has serif title (link to post), metadata line in gold uppercase (`MAY 2 · 8 MIN READ`), single-line excerpt; rows separated by `--color-rule` hairline.
- No pagination needed yet (6 posts).

### Post (`/posts/:title/`)

- Centered single column, `~70ch`.
- Above title: gold uppercase metadata (`MAY 2, 2026 · 8 MIN READ`).
- Title in cobalt (light) / gold (dark), Cormorant 600.
- First paragraph gets a drop-cap via CSS `.post-content > p:first-of-type::first-letter` (Cormorant 600, ~3.5em, gold, `float: left`, ~6px right padding, ~4px top margin). No HTML mutation required.
- End of post: centered khatam glyph + small prev/next navigation (small-caps).

### About (`/about/`)

Same chrome as post, no drop-cap, no end-mark.

### 404 (`/404.html`)

Same chrome, single line: "This page doesn't exist. Try the [homepage](/) or [feed](/feed.xml)."

## Dark mode

- Toggle button in header band, sun/moon SVG icon swap.
- State stored at `localStorage['barmag-theme']` ∈ `{light, dark, system}`. Default = `system`.
- An inline boot script in `<head>` (≤ 20 lines) reads localStorage + `prefers-color-scheme` and sets `<html data-theme="…">` *before* first paint to avoid flash.
- All theme-aware values are CSS custom properties, switched by `[data-theme="dark"]` selector in `_sass/barmag/_dark.scss`.
- A media query also respects `prefers-color-scheme: dark` when `data-theme` is unset/`system`.

## Reading time

Computed at build time:

```liquid
{% assign words = page.content | number_of_words %}
{% assign minutes = words | divided_by: 220 | plus: 1 %}
{{ minutes }} min read
```

220 wpm is a typical conservative estimate. No plugin needed.

## Files to create / modify

**Modify:**
- `_config.yml` — keep `theme: minima`; add `sass: { style: compressed }`, `permalink: /:year/:month/:day/:title/`, `lang: en`, `header_pages: [about.md]`.
- `Gemfile` — add `gem "webrick", "~> 1.8"` (needed for local serve on Ruby ≥ 3).
- `.gitignore` — add `_site`, `.sass-cache`, `.jekyll-cache`, `vendor/`, `.bundle/`, `.superpowers/`.
- `index.md` — keep; ensure front-matter is `layout: home`.
- `about.md` — keep; ensure front-matter is `layout: page`.

**Create:**
- `_layouts/default.html` — base shell (head, header, content slot, footer).
- `_layouts/home.html` — homepage with post list.
- `_layouts/post.html` — single post.
- `_layouts/page.html` — about / static pages.
- `_includes/head.html` — meta, fonts preconnect, theme-boot inline script, GA include.
- `_includes/header.html` — band, bilingual logotype, nav, theme toggle.
- `_includes/footer.html` — small-caps copyright + feed link.
- `_includes/svg-defs.html` — `<symbol>` defs for khatam strip and glyph.
- `_includes/khatam-strip.html` — `<svg><use href="#khatam-strip"></use></svg>`.
- `_includes/khatam-glyph.html` — `<svg><use href="#khatam-glyph"></use></svg>`.
- `_includes/post-meta.html` — date + reading-time line.
- `_sass/barmag/_tokens.scss` — CSS custom properties.
- `_sass/barmag/_typography.scss` — font stacks, sizes, line-heights.
- `_sass/barmag/_layout.scss` — header band, content column, footer.
- `_sass/barmag/_components.scss` — post list, drop-cap, khatam, nav, toggle.
- `_sass/barmag/_dark.scss` — `[data-theme="dark"]` overrides.
- `assets/css/main.scss` — Sass entry; imports the above.
- `assets/js/theme.js` — toggle handler (~25 lines, vanilla).

## Build sequence

1. **Infra prep** — update `Gemfile`, `.gitignore`; `bundle install`; verify `bundle exec jekyll serve` works on the unchanged minima.
2. **Config + tokens** — update `_config.yml`; create `_sass/barmag/_tokens.scss` with both palettes; create `assets/css/main.scss`.
3. **Layouts skeleton** — create `_layouts/default.html` + `_includes/head.html`, `header.html`, `footer.html` (no styling yet, just structure). Verify `home.md` and `about.md` render.
4. **Typography + layout CSS** — fill `_typography.scss` and `_layout.scss`; verify columns, line-lengths, header band.
5. **Khatam SVGs + components** — add `svg-defs.html` and the strip/glyph includes; render them in the header and end-of-post; style via `_components.scss`.
6. **Home + post layouts** — create `home.html` and `post.html`; render post list with metadata and excerpt; render single post with drop-cap and end-mark.
7. **Dark mode** — add `_dark.scss`, `theme.js`, and inline boot script in `head.html`; verify no flash and persistence.
8. **About + 404** — create `page.html` and update `404.html`.
9. **Polish + accessibility** — Lighthouse pass, contrast check on every theme-aware combo, mobile sweep at 375 / 768 / 1280.

## Verification

End-to-end check:

1. `cd /home/yassermakram/code/barmag.github.io && bundle install`
2. `bundle exec jekyll serve` → open `http://127.0.0.1:4000/`.
3. Visual sweep:
   - Homepage renders with cobalt header, gold khatam strip, post list with metadata.
   - Each of the 6 posts renders with drop-cap, reading time, end khatam.
   - About page renders without drop-cap.
   - 404 (`/404.html`) renders with header chrome.
4. Dark mode:
   - Toggle works, persists across reload, no flash on cold load.
   - System preference respected when localStorage is unset.
5. Mobile sweep (Chrome devtools 375 × 812):
   - Header band wraps gracefully (logotype + nav stack if needed).
   - Khatam strip scales without clipping stars.
   - Drop-cap doesn't crowd body text.
6. Lighthouse (mobile profile):
   - Accessibility ≥ 95.
   - Performance ≥ 95 (only one Google Fonts request, swap, no render-blocking JS).
7. Build artefacts not committed: confirm `_site/`, `.sass-cache/`, `.jekyll-cache/`, `vendor/`, `.bundle/` are ignored.

## Open questions / future work

- Tags index — deliberately deferred; reconsider once post count > ~15.
- Table of contents on long posts — deferred; reconsider if a single post exceeds ~3000 words.
- An illuminated `unwan`-style headpiece on the home/about pages — could be a v2 polish layer.
- Custom OpenGraph card per post (sandstone background + gold khatam corner) — v2.
