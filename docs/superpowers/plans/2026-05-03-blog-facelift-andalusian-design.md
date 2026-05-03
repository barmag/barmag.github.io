# barmag blog face-lift — Andalusian / Mamluk · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bare default `minima` Jekyll theme with a fully overridden Andalusian/Mamluk-inspired identity (sandstone + cobalt + gold, bilingual logotype, khatam motifs, warm-dark mode) without changing infra (still Jekyll on GitHub Pages).

**Architecture:** Keep `theme: minima` as the parent gem. Override its layouts/includes/sass locally — Jekyll's theme-shadowing resolves local files first. All custom CSS lives under `_sass/barmag/` and is compiled via `assets/css/main.scss`. Dark mode is a `data-theme` attribute on `<html>` driven by ~25 lines of vanilla JS plus an inline boot script in `<head>` to avoid flash.

**Tech Stack:** Jekyll 3 (via `github-pages` gem) · minima 2.5 (parent theme) · Sass · vanilla JS · Google Fonts (Cormorant Garamond, Amiri) · SVG (inline `<symbol>`/`<use>`)

**Reference spec:** `docs/superpowers/specs/2026-05-03-blog-facelift-andalusian-design.md`

**Verification model:** Jekyll is a static-site generator with no unit-test harness. "Tests" in this plan are: (a) `bundle exec jekyll build` exits 0 with no warnings, (b) `grep` of the rendered `_site/` HTML for expected markers, (c) visual inspection at `http://127.0.0.1:4000/`. Each task ends with a commit.

---

## File map

| Path | Action | Responsibility |
|------|--------|----------------|
| `Gemfile` | modify | add `webrick` |
| `_config.yml` | modify | sass config, permalink, lang, header_pages |
| `index.md` | modify | front-matter `layout: home` (already correct, verify) |
| `about.md` | modify | front-matter `layout: page` (already correct, verify) |
| `404.html` | rewrite | use new `default` layout |
| `_layouts/default.html` | create | base shell — wraps head + header + content + footer |
| `_layouts/home.html` | create | homepage post list |
| `_layouts/post.html` | create | single post chrome (drop-cap, end-mark, prev/next) |
| `_layouts/page.html` | create | static pages (about) |
| `_includes/head.html` | create | meta, fonts preconnect, dark-mode boot script, GA |
| `_includes/header.html` | create | cobalt band + bilingual logotype + nav + theme toggle |
| `_includes/footer.html` | create | small-caps copyright + feed link |
| `_includes/svg-defs.html` | create | inline `<symbol>` defs for khatam motifs |
| `_includes/khatam-strip.html` | create | gold horizontal star band |
| `_includes/khatam-glyph.html` | create | single khatam used as section divider |
| `_includes/post-meta.html` | create | date + reading-time line |
| `_sass/barmag/_tokens.scss` | create | CSS custom properties (light palette) |
| `_sass/barmag/_typography.scss` | create | font stacks, sizes, line-heights |
| `_sass/barmag/_layout.scss` | create | header band, content column, footer |
| `_sass/barmag/_components.scss` | create | post list, drop-cap, khatam, theme toggle, prev/next |
| `_sass/barmag/_dark.scss` | create | `[data-theme="dark"]` overrides |
| `assets/css/main.scss` | create | Sass entry — imports all of `_sass/barmag/*` |
| `assets/js/theme.js` | create | theme toggle handler (~25 lines, vanilla) |

---

## URL note (read before Task 2)

Current Jekyll default permalink with the `categories:` front-matter on existing posts produces ugly nested URLs like `/engineering-management/leadership/2026/05/02/panopticon-vs-agency-in-management.html`. Task 2 sets `permalink: /:year/:month/:day/:title/` to drop categories from the URL and remove the `.html` suffix. **This will change existing URLs.** Inbound links to the two 2020 posts (if any exist) will 404. If preserving old URLs matters, add `redirect_from:` entries in each post's front-matter using the `jekyll-redirect-from` plugin (already supported on GitHub Pages) — that's a follow-up, not part of this plan. If you want to preserve the existing URL scheme entirely, skip the `permalink:` line in Task 2.

---

## Task 1: Infra prep (Gemfile + baseline build)

**Files:**
- Modify: `Gemfile`

- [ ] **Step 1: Add `webrick` to Gemfile**

Open `Gemfile` and add this line right after the `gem "github-pages", "~> 232", group: :jekyll_plugins` line:

```ruby
gem "webrick", "~> 1.8"
```

Why: Ruby 3+ no longer ships `webrick` in the stdlib, but `jekyll serve` requires it.

- [ ] **Step 2: Install gems**

Run:

```bash
bundle install
```

Expected: completes without error, lockfile updated.

- [ ] **Step 3: Verify the unmodified site still builds and serves**

Run:

```bash
bundle exec jekyll build
```

Expected: exits 0; `_site/index.html` exists; no "Build Warning" lines.

Then:

```bash
bundle exec jekyll serve --no-watch &
SERVE_PID=$!
sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4000/
kill $SERVE_PID
```

Expected: prints `200`.

- [ ] **Step 4: Commit**

```bash
git add Gemfile Gemfile.lock
git commit -m "$(cat <<'EOF'
Add webrick to Gemfile for local jekyll serve on Ruby 3+

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Config + Sass tokens scaffold

**Files:**
- Modify: `_config.yml`
- Create: `_sass/barmag/_tokens.scss`
- Create: `assets/css/main.scss`

- [ ] **Step 1: Update `_config.yml`**

Replace the contents of `_config.yml` with:

```yaml
title: barmag
description: >-
  Engineering leadership, neurodivergence, and technology -- by Yasser Makram
baseurl: ""
url: "https://barmag.github.io"
github_username: barmag
show_excerpts: true
lang: en

# URLs
permalink: /:year/:month/:day/:title/

# Header navigation (consumed by _includes/header.html)
header_pages:
  - about.md

# Analytics
google_analytics: G-LZJQ01M3KX

# Build
markdown: kramdown
theme: minima
sass:
  style: compressed
  sass_dir: _sass
plugins:
  - jekyll-feed
  - jekyll-sitemap
```

- [ ] **Step 2: Create `_sass/barmag/_tokens.scss`**

```scss
// barmag — design tokens (Andalusian / Mamluk palette)
// Light values are defaults on :root.
// Dark overrides live in _dark.scss under [data-theme="dark"].

:root {
  // Palette — light (sandstone + cobalt + gold)
  --color-bg:       #F5ECD9;
  --color-bg-alt:   #EFE3CB;
  --color-ink:      #2D2418;
  --color-muted:    #8A7A52;
  --color-heading:  #1F3A5F;
  --color-accent:   #C9A447;
  --color-rule:     #E0D4BA;
  --color-band:     #1F3A5F;
  --color-band-ink: #F5ECD9;

  // Typography stacks
  --font-body:    'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif;
  --font-display: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
  --font-arabic:  'Amiri', serif;
  --font-meta:    -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
  --font-mono:    ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  // Sizes
  --fs-body: 1.0625rem;
  --lh-body: 1.65;
  --fs-h1:   2.25rem;
  --fs-h2:   1.5rem;
  --fs-h3:   1.25rem;
  --fs-meta: 0.75rem;
  --tracked: 0.06em;

  // Layout
  --col-width: min(70ch, 100% - 2.5rem);
}
```

- [ ] **Step 3: Create `assets/css/main.scss`**

The leading `---` front-matter is required so Jekyll processes this file as Sass.

```scss
---
---

@import "barmag/tokens";
@import "barmag/typography";
@import "barmag/layout";
@import "barmag/components";
@import "barmag/dark";
```

- [ ] **Step 4: Create empty placeholder Sass partials so the import doesn't fail**

```bash
touch _sass/barmag/_typography.scss _sass/barmag/_layout.scss _sass/barmag/_components.scss _sass/barmag/_dark.scss
```

- [ ] **Step 5: Verify build**

```bash
bundle exec jekyll build
```

Expected: exits 0. Then:

```bash
test -f _site/assets/css/main.css && echo "css ok"
grep -q "color-bg" _site/assets/css/main.css && echo "tokens ok"
```

Expected: prints `css ok` and `tokens ok`.

- [ ] **Step 6: Commit**

```bash
git add _config.yml _sass/ assets/css/main.scss
git commit -m "$(cat <<'EOF'
Configure custom Sass entry and Andalusian palette tokens

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Default layout + head/header/footer skeleton

**Files:**
- Create: `_layouts/default.html`
- Create: `_includes/head.html`
- Create: `_includes/header.html`
- Create: `_includes/footer.html`

- [ ] **Step 1: Create `_includes/head.html`**

```html
<!DOCTYPE html>
<html lang="{{ site.lang | default: 'en' }}" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if page.title %}{{ page.title | escape }} · {{ site.title }}{% else %}{{ site.title | escape }}{% endif %}</title>
  <meta name="description" content="{{ page.excerpt | default: site.description | strip_html | normalize_whitespace | truncate: 160 | escape }}">
  <link rel="canonical" href="{{ page.url | absolute_url }}">
  <link rel="alternate" type="application/rss+xml" title="{{ site.title | escape }}" href="{{ '/feed.xml' | absolute_url }}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Amiri:wght@400&display=swap">

  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">

  <!-- Theme boot: set data-theme before paint to prevent flash -->
  <script>
    (function () {
      try {
        var stored = localStorage.getItem('barmag-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) { /* localStorage unavailable */ }
    })();
  </script>

  {% feed_meta %}
  {% include google-analytics.html %}
</head>
```

- [ ] **Step 2: Create `_includes/header.html`**

```html
<header class="site-header" role="banner">
  <div class="band">
    <a class="wordmark" href="{{ '/' | relative_url }}">
      <span class="wordmark-latin">BARMAG</span>
      <span class="wordmark-arabic" dir="rtl" lang="ar">برمج</span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      {%- assign default_paths = site.header_pages | default: '' -%}
      {%- for path in default_paths -%}
        {%- assign p = site.pages | where: 'path', path | first -%}
        {%- if p -%}
          <a class="nav-link" href="{{ p.url | relative_url }}">{{ p.title | downcase }}</a>
        {%- endif -%}
      {%- endfor -%}
      <a class="nav-link" href="{{ '/feed.xml' | relative_url }}">feed</a>
      <button class="theme-toggle" type="button" aria-label="Toggle dark mode" data-theme-toggle>
        <span class="theme-toggle-dot" aria-hidden="true"></span>
      </button>
    </nav>
  </div>
  {% include khatam-strip.html %}
</header>
```

- [ ] **Step 3: Create placeholder `_includes/khatam-strip.html`** (real version in Task 6)

```html
<div class="khatam-strip" aria-hidden="true"></div>
```

- [ ] **Step 4: Create `_includes/footer.html`**

```html
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <span class="footer-copy">© {{ 'now' | date: '%Y' }} Yasser Makram</span>
    <a class="footer-feed" href="{{ '/feed.xml' | relative_url }}">RSS</a>
  </div>
</footer>
```

- [ ] **Step 5: Create `_layouts/default.html`**

```html
{% include head.html %}
<body>
  {% include header.html %}
  <main class="site-main" role="main">
    {{ content }}
  </main>
  {% include footer.html %}
  <script src="{{ '/assets/js/theme.js' | relative_url }}" defer></script>
</body>
</html>
```

- [ ] **Step 6: Stub `assets/js/theme.js` so the script tag doesn't 404** (real version in Task 11)

```javascript
// barmag — theme toggle (stub; real impl in Task 11)
```

- [ ] **Step 7: Verify build and rendering**

```bash
bundle exec jekyll build
grep -q "wordmark-latin" _site/index.html && echo "header ok"
grep -q 'dir="rtl"' _site/index.html && echo "arabic ok"
grep -q "data-theme" _site/index.html && echo "boot ok"
grep -q "/assets/css/main.css" _site/index.html && echo "css link ok"
```

Expected: all four `ok` lines.

- [ ] **Step 8: Commit**

```bash
git add _layouts/default.html _includes/head.html _includes/header.html _includes/footer.html _includes/khatam-strip.html assets/js/theme.js
git commit -m "$(cat <<'EOF'
Add default layout shell with bilingual header and theme boot

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Typography styles + base reset

**Files:**
- Overwrite: `_sass/barmag/_typography.scss`

- [ ] **Step 1: Replace `_sass/barmag/_typography.scss`**

```scss
// barmag — typography + base reset

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

// Display headings — Cormorant
h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--color-heading);
  font-weight: 600;
  line-height: 1.18;
  margin: 1.6em 0 0.5em;
  letter-spacing: -0.005em;
}
h1 { font-size: var(--fs-h1); margin-top: 0; }
h2 { font-size: var(--fs-h2); }
h3 { font-size: var(--fs-h3); }

p { margin: 0 0 1em; }

a {
  color: var(--color-heading);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}
a:hover { color: var(--color-accent); }

blockquote {
  margin: 1.5em 0;
  padding: 0.4em 1.2em;
  border-left: 3px solid var(--color-accent);
  color: var(--color-muted);
  font-style: italic;
}

hr {
  border: 0;
  height: 1px;
  background: var(--color-rule);
  margin: 2em 0;
}

code, pre {
  font-family: var(--font-mono);
  font-size: 0.9em;
}
code { background: var(--color-bg-alt); padding: 0.1em 0.35em; border-radius: 3px; }
pre {
  background: var(--color-bg-alt);
  padding: 1em 1.2em;
  border-radius: 4px;
  overflow-x: auto;
  border: 1px solid var(--color-rule);
}
pre code { background: none; padding: 0; }

img { max-width: 100%; height: auto; display: block; }

::selection { background: var(--color-accent); color: var(--color-bg); }
```

- [ ] **Step 2: Verify build**

```bash
bundle exec jekyll build
grep -q "font-family" _site/assets/css/main.css && echo "typography ok"
```

Expected: `typography ok`.

- [ ] **Step 3: Commit**

```bash
git add _sass/barmag/_typography.scss
git commit -m "$(cat <<'EOF'
Add typography styles and base reset

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Layout styles — header band, content column, footer

**Files:**
- Overwrite: `_sass/barmag/_layout.scss`

- [ ] **Step 1: Replace `_sass/barmag/_layout.scss`**

```scss
// barmag — page layout, header band, footer

.site-header { position: relative; }

.band {
  background: var(--color-band);
  color: var(--color-band-ink);
  padding: 0.85rem 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 0.85rem;
  color: var(--color-band-ink);
  text-decoration: none;
}
.wordmark-latin {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}
.wordmark-arabic {
  font-family: var(--font-arabic);
  font-size: 1.5rem;
  line-height: 1;
}

.site-nav {
  display: inline-flex;
  align-items: center;
  gap: 1.1rem;
  font-family: var(--font-meta);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.nav-link {
  color: var(--color-band-ink);
  text-decoration: none;
  opacity: 0.88;
}
.nav-link:hover { opacity: 1; color: var(--color-accent); }

// .khatam-strip is styled in _components.scss (Task 6)

.site-main {
  width: var(--col-width);
  margin: 2.5rem auto 4rem;
}

.site-footer {
  border-top: 1px solid var(--color-rule);
  margin-top: 4rem;
  padding: 1.4rem 0;
  color: var(--color-muted);
  font-family: var(--font-meta);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.footer-inner {
  width: var(--col-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-feed {
  color: var(--color-muted);
  text-decoration: none;
}
.footer-feed:hover { color: var(--color-heading); }

@media (max-width: 540px) {
  .band { padding: 0.75rem 1rem; }
  .wordmark { gap: 0.6rem; }
  .wordmark-latin { font-size: 0.9rem; letter-spacing: 0.28em; }
  .wordmark-arabic { font-size: 1.3rem; }
  .site-nav { gap: 0.8rem; font-size: 0.65rem; }
}
```

- [ ] **Step 2: Verify**

```bash
bundle exec jekyll build
grep -q "site-header" _site/assets/css/main.css && echo "layout ok"
```

Expected: `layout ok`.

- [ ] **Step 3: Visual sanity check**

```bash
bundle exec jekyll serve --no-watch &
SERVE_PID=$!
sleep 4
curl -s http://127.0.0.1:4000/ | grep -q "BARMAG" && echo "homepage renders"
kill $SERVE_PID
```

Expected: `homepage renders`.

- [ ] **Step 4: Commit**

```bash
git add _sass/barmag/_layout.scss
git commit -m "$(cat <<'EOF'
Add header band, content column, and footer layout styles

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Khatam SVG motifs

**Files:**
- Create: `_includes/svg-defs.html`
- Overwrite: `_includes/khatam-strip.html`
- Create: `_includes/khatam-glyph.html`
- Modify: `_layouts/default.html` (include svg-defs once)

- [ ] **Step 1: Create `_includes/svg-defs.html`**

The 8-point khatam is two overlapping squares rotated 45°. Defined once as a `<symbol>`, referenced via `<use>` everywhere.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="khatam" viewBox="-15 -15 30 30">
      <g fill="currentColor" stroke="none">
        <rect x="-10" y="-10" width="20" height="20"></rect>
        <rect x="-10" y="-10" width="20" height="20" transform="rotate(45)"></rect>
      </g>
    </symbol>
  </defs>
</svg>
```

- [ ] **Step 2: Replace `_includes/khatam-strip.html`**

```html
<div class="khatam-strip" aria-hidden="true">
  <svg class="khatam-strip-svg" viewBox="0 0 360 18" preserveAspectRatio="xMidYMid meet">
    {% for n in (0..23) %}
    <use href="#khatam" x="{{ n | times: 16 | minus: 6 }}" y="2" width="14" height="14"></use>
    {% endfor %}
  </svg>
</div>
```

- [ ] **Step 3: Create `_includes/khatam-glyph.html`**

```html
<div class="khatam-glyph" aria-hidden="true">
  <svg viewBox="-15 -15 30 30" width="22" height="22">
    <use href="#khatam"></use>
  </svg>
</div>
```

- [ ] **Step 4: Modify `_layouts/default.html`** to include svg-defs once at the top of `<body>`

Replace the file with:

```html
{% include head.html %}
<body>
  {% include svg-defs.html %}
  {% include header.html %}
  <main class="site-main" role="main">
    {{ content }}
  </main>
  {% include footer.html %}
  <script src="{{ '/assets/js/theme.js' | relative_url }}" defer></script>
</body>
</html>
```

- [ ] **Step 5: Add motif styles to `_sass/barmag/_components.scss`**

```scss
// barmag — components (additive; rest in later tasks)

.khatam-strip {
  background: var(--color-band);
  color: var(--color-accent);
  padding: 0.3rem 0;
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.khatam-strip-svg {
  width: 100%;
  max-width: 380px;
  height: 18px;
  display: block;
}

.khatam-glyph {
  display: flex;
  justify-content: center;
  color: var(--color-accent);
  margin: 1.5rem 0 1rem;
}
.khatam-glyph svg { display: block; }
```

- [ ] **Step 6: Verify**

```bash
bundle exec jekyll build
grep -q '<symbol id="khatam"' _site/index.html && echo "symbol ok"
grep -q "khatam-strip-svg" _site/index.html && echo "strip ok"
```

Expected: both `ok` lines.

- [ ] **Step 7: Commit**

```bash
git add _includes/svg-defs.html _includes/khatam-strip.html _includes/khatam-glyph.html _layouts/default.html _sass/barmag/_components.scss
git commit -m "$(cat <<'EOF'
Add khatam (8-point star) SVG motifs for header band and dividers

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Home layout + post-meta include + post list

**Files:**
- Create: `_includes/post-meta.html`
- Create: `_layouts/home.html`
- Verify: `index.md` front-matter is `layout: home`
- Append to: `_sass/barmag/_components.scss`

- [ ] **Step 1: Create `_includes/post-meta.html`**

Reading-time formula: `words / 220 + 1`. Caller may pass `post` or default to `page`.

```html
{%- assign meta_target = include.post | default: page -%}
{%- assign words = meta_target.content | number_of_words -%}
{%- assign minutes = words | divided_by: 220 | plus: 1 -%}
<p class="post-meta">
  <time datetime="{{ meta_target.date | date_to_xmlschema }}">{{ meta_target.date | date: "%b %-d, %Y" }}</time>
  <span class="post-meta-sep">·</span>
  <span class="post-meta-time">{{ minutes }} min read</span>
</p>
```

- [ ] **Step 2: Create `_layouts/home.html`**

```html
---
layout: default
---

{%- if site.description -%}
<p class="home-bio">{{ site.description }}</p>
{%- endif -%}

<ul class="post-list">
  {%- for post in site.posts -%}
  <li class="post-list-item">
    {% include post-meta.html post=post %}
    <h2 class="post-list-title">
      <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
    </h2>
    {%- if site.show_excerpts -%}
    <p class="post-list-excerpt">{{ post.excerpt | strip_html | truncate: 220 }}</p>
    {%- endif -%}
  </li>
  {%- endfor -%}
</ul>
```

- [ ] **Step 3: Verify `index.md` front-matter**

Open `index.md`. The front-matter should be exactly:

```
---
layout: home
---
```

If it has extra comments or different content above/below, leave the rest but make sure `layout: home` is set.

- [ ] **Step 4: Append to `_sass/barmag/_components.scss`**

Append (do not replace existing khatam styles):

```scss
// Homepage

.home-bio {
  font-style: italic;
  color: var(--color-muted);
  font-size: 1rem;
  margin: 0 0 2rem;
  max-width: 60ch;
}

.post-list { list-style: none; padding: 0; margin: 0; }
.post-list-item { padding: 1.4rem 0; }
.post-list-item + .post-list-item { border-top: 1px solid var(--color-rule); }

.post-list-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0.25rem 0 0.4rem;
  line-height: 1.18;
}
.post-list-title a { color: var(--color-heading); text-decoration: none; }
.post-list-title a:hover { color: var(--color-accent); }

.post-list-excerpt {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-ink);
  line-height: 1.55;
}

.post-meta {
  font-family: var(--font-meta);
  font-size: var(--fs-meta);
  letter-spacing: var(--tracked);
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0;
}
.post-meta-sep { margin: 0 0.4rem; opacity: 0.7; }
```

- [ ] **Step 5: Verify**

```bash
bundle exec jekyll build
grep -q "post-list-item" _site/index.html && echo "list ok"
grep -q "min read" _site/index.html && echo "reading time ok"
```

Expected: both `ok` lines.

- [ ] **Step 6: Commit**

```bash
git add _includes/post-meta.html _layouts/home.html _sass/barmag/_components.scss index.md
git commit -m "$(cat <<'EOF'
Add home layout with post list and reading-time metadata

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Post layout + drop-cap + end-mark + prev/next

**Files:**
- Create: `_layouts/post.html`
- Append to: `_sass/barmag/_components.scss`

- [ ] **Step 1: Create `_layouts/post.html`**

```html
---
layout: default
---

<article class="post">
  {% include post-meta.html %}
  <h1 class="post-title">{{ page.title | escape }}</h1>

  <div class="post-content">
    {{ content }}
  </div>

  {% include khatam-glyph.html %}

  <nav class="post-nav" aria-label="Adjacent posts">
    {%- if page.previous.url -%}
    <a class="post-nav-prev" href="{{ page.previous.url | relative_url }}">
      <span class="post-nav-label">← prev</span>
      <span class="post-nav-title">{{ page.previous.title | escape }}</span>
    </a>
    {%- else -%}<span></span>{%- endif -%}

    {%- if page.next.url -%}
    <a class="post-nav-next" href="{{ page.next.url | relative_url }}">
      <span class="post-nav-label">next →</span>
      <span class="post-nav-title">{{ page.next.title | escape }}</span>
    </a>
    {%- else -%}<span></span>{%- endif -%}
  </nav>
</article>
```

- [ ] **Step 2: Append to `_sass/barmag/_components.scss`**

```scss
// Single post

.post-title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0.4rem 0 1.5rem;
}

.post-content > p:first-of-type::first-letter {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 3.4em;
  line-height: 0.85;
  color: var(--color-accent);
  float: left;
  padding: 0.25rem 0.45rem 0 0;
  margin-top: 0.25rem;
}

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--color-rule);
  padding-top: 1.2rem;
  margin-top: 1.4rem;
  font-family: var(--font-meta);
  font-size: 0.75rem;
}
.post-nav a {
  color: var(--color-heading);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 45%;
}
.post-nav-next { text-align: right; align-items: flex-end; }
.post-nav-label {
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-muted);
  font-size: 0.65rem;
}
.post-nav-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 500;
  font-style: italic;
}
.post-nav a:hover .post-nav-title { color: var(--color-accent); }
```

- [ ] **Step 3: Verify**

```bash
bundle exec jekyll build
SAMPLE=$(find _site -path '*panopticon*/index.html' | head -1)
test -n "$SAMPLE" && echo "post built: $SAMPLE"
grep -q 'class="post-title"' "$SAMPLE" && echo "post-title ok"
grep -q 'class="post-content"' "$SAMPLE" && echo "post-content ok"
grep -q 'min read' "$SAMPLE" && echo "reading time ok"
grep -q 'khatam-glyph' "$SAMPLE" && echo "endmark ok"
```

Expected: all four `ok` lines.

- [ ] **Step 4: Commit**

```bash
git add _layouts/post.html _sass/barmag/_components.scss
git commit -m "$(cat <<'EOF'
Add post layout with drop-cap, khatam end-mark, and prev/next nav

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Page layout + 404 + about/index front-matter check

**Files:**
- Create: `_layouts/page.html`
- Modify: `404.html`
- Verify: `about.md` front-matter is `layout: page`

- [ ] **Step 1: Create `_layouts/page.html`**

```html
---
layout: default
---

<article class="page">
  <h1 class="page-title">{{ page.title | escape }}</h1>
  <div class="page-content">
    {{ content }}
  </div>
</article>
```

- [ ] **Step 2: Append `.page-title` style to `_sass/barmag/_components.scss`**

```scss
// Static pages

.page-title {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 1.5rem;
}
```

- [ ] **Step 3: Verify `about.md`**

Front-matter must be:

```
---
layout: page
title: About
permalink: /about/
---
```

Adjust if missing any field. Body content stays as is.

- [ ] **Step 4: Replace `404.html`**

```html
---
layout: default
permalink: /404.html
---

<article class="page">
  <h1 class="page-title">Not found</h1>
  <p>This page doesn't exist. Try the <a href="{{ '/' | relative_url }}">homepage</a> or <a href="{{ '/feed.xml' | relative_url }}">feed</a>.</p>
</article>
```

- [ ] **Step 5: Verify**

```bash
bundle exec jekyll build
grep -q "About" _site/about/index.html && echo "about ok"
grep -q "Not found" _site/404.html && echo "404 ok"
```

Expected: both `ok` lines.

- [ ] **Step 6: Commit**

```bash
git add _layouts/page.html _sass/barmag/_components.scss about.md 404.html
git commit -m "$(cat <<'EOF'
Add page layout for about and 404 pages

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Theme-toggle button styling

**Files:**
- Append to: `_sass/barmag/_components.scss`

- [ ] **Step 1: Append theme-toggle styles to `_sass/barmag/_components.scss`**

```scss
// Theme toggle

.theme-toggle {
  appearance: none;
  -webkit-appearance: none;
  background: rgba(245, 236, 217, 0.18);
  border: 1px solid rgba(245, 236, 217, 0.3);
  border-radius: 999px;
  width: 34px;
  height: 18px;
  padding: 0;
  position: relative;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;
  display: inline-flex;
  align-items: center;
  margin-left: 0.4rem;
}
.theme-toggle:hover { background: rgba(245, 236, 217, 0.28); }
.theme-toggle:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.theme-toggle-dot {
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-band-ink);
  transition: left 0.18s ease, background 0.18s ease;
}
[data-theme="dark"] .theme-toggle-dot { left: 18px; }
```

- [ ] **Step 2: Verify**

```bash
bundle exec jekyll build
grep -q "theme-toggle-dot" _site/assets/css/main.css && echo "toggle ok"
```

Expected: `toggle ok`.

- [ ] **Step 3: Commit**

```bash
git add _sass/barmag/_components.scss
git commit -m "$(cat <<'EOF'
Style the dark-mode toggle button

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Dark mode (Sass overrides + theme.js)

**Files:**
- Overwrite: `_sass/barmag/_dark.scss`
- Overwrite: `assets/js/theme.js`

- [ ] **Step 1: Replace `_sass/barmag/_dark.scss`**

```scss
// barmag — warm-dark theme overrides

[data-theme="dark"] {
  --color-bg:       #1A140C;
  --color-bg-alt:   #241B10;
  --color-ink:      #EFE3CB;
  --color-muted:    #A89570;
  --color-heading:  #D8B358;
  --color-accent:   #D8B358;
  --color-rule:     #3A2E1C;
  --color-band:     #0F1F36;
  --color-band-ink: #EFE3CB;
}

[data-theme="dark"] .post-list-title a:hover,
[data-theme="dark"] a:hover { color: #ECC772; }

[data-theme="dark"] code,
[data-theme="dark"] pre { background: var(--color-bg-alt); border-color: var(--color-rule); }
```

- [ ] **Step 2: Replace `assets/js/theme.js`**

```javascript
// barmag — theme toggle. Persists to localStorage('barmag-theme') as 'light'|'dark'.
(function () {
  var STORAGE_KEY = 'barmag-theme';
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function init() {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(current() === 'dark'));
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      btn.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 3: Verify build**

```bash
bundle exec jekyll build
grep -q '\[data-theme="dark"\]' _site/assets/css/main.css && echo "dark css ok"
grep -q "barmag-theme" _site/assets/js/theme.js && echo "toggle js ok"
```

Expected: both `ok` lines.

- [ ] **Step 4: Visual verification**

```bash
bundle exec jekyll serve --no-watch &
SERVE_PID=$!
sleep 4
echo "Visit http://127.0.0.1:4000/ — toggle dark mode in the header. Reload to confirm persistence."
echo "Press Enter to stop the server when done."
read
kill $SERVE_PID
```

Manually verify: (a) toggle flips palette without flash, (b) reload preserves theme, (c) clearing localStorage and reloading respects `prefers-color-scheme`.

- [ ] **Step 5: Commit**

```bash
git add _sass/barmag/_dark.scss assets/js/theme.js
git commit -m "$(cat <<'EOF'
Add warm-dark mode with persistent toggle and no-flash boot

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Final verification & polish pass

**Files:** none modified unless issues found.

- [ ] **Step 1: Full build with verbose output**

```bash
bundle exec jekyll build --trace
```

Expected: exits 0; no warnings other than possible "Conversion error" lines (none expected).

- [ ] **Step 2: HTML output sanity grep across all rendered pages**

```bash
for f in $(find _site -name '*.html'); do
  grep -L "khatam-strip-svg" "$f" | grep -v "feed.xml" | grep -v "sitemap.xml"
done
echo "(empty output = every page has the header strip)"
```

Expected: empty output.

- [ ] **Step 3: Mobile sweep**

Start the server:

```bash
bundle exec jekyll serve --no-watch &
SERVE_PID=$!
sleep 4
```

In Chrome/Firefox devtools, set viewports 375 × 812, 768 × 1024, 1280 × 800. On each, visit `/`, one post, `/about/`, and `/404.html`. Confirm:
- Header band wordmark + nav fit (or wrap cleanly)
- Khatam strip stays centred and doesn't clip
- Drop-cap doesn't crowd body text
- Post list rows are readable
- Footer sits at the bottom, not floating

Stop the server: `kill $SERVE_PID`

- [ ] **Step 4: Lighthouse pass (manual)**

Run Lighthouse (Chrome devtools, mobile profile) on `/` and one post. Target scores:
- Accessibility ≥ 95
- Performance ≥ 95
- Best Practices ≥ 95

Common issues to fix if found:
- Color contrast warning on muted/accent text → bump opacity or saturation
- Render-blocking Google Fonts → already mitigated with preconnect + `display=swap`

- [ ] **Step 5: Cross-check the original four spec features are present**

Run:

```bash
grep -q 'wordmark-arabic' _site/index.html && echo "✓ bilingual logotype"
grep -q 'data-theme-toggle' _site/index.html && echo "✓ dark mode toggle"
grep -q 'min read' _site/index.html && echo "✓ reading time"
grep -q 'khatam-strip-svg' _site/index.html && echo "✓ khatam motif"
```

Expected: all four checkmarks.

- [ ] **Step 6: Commit any polish fixes**

If any tweaks were made:

```bash
git add -A
git commit -m "$(cat <<'EOF'
Polish — accessibility and mobile tweaks

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Done criteria

The face-lift is complete when:

1. Every commit in this plan is on `master`.
2. `bundle exec jekyll serve` renders the site at `127.0.0.1:4000` with the Andalusian/Mamluk identity (sandstone + cobalt + gold).
3. Bilingual logotype `BARMAG / برمج` appears in the header band on every page.
4. Each post renders with: gold uppercase metadata + reading-time, cobalt serif title, gold drop-cap on first paragraph, centered khatam at the end, prev/next navigation.
5. Dark mode toggle works, persists across reload, and produces no flash on cold load.
6. Lighthouse mobile accessibility ≥ 95.
