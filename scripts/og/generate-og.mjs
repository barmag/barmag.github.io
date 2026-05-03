#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import matter from 'gray-matter';
import wawoff2 from 'wawoff2';
import { buildWordmarkSvg } from './build-wordmark.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const POSTS_DIR = join(ROOT, '_posts');
const OUT_DIR = join(ROOT, 'assets', 'og');
const NODE_MODULES = join(ROOT, 'node_modules');
const WORDMARK_PATH = join(OUT_DIR, 'wordmark-ar.svg');

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  bg: '#F5ECD9',
  ink: '#2D2418',
  cobalt: '#1F3A5F',
  gold: '#C9A447',
  rule: '#E0D4BA',
  muted: '#8A7A52',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function slugFromFilename(filename) {
  // _posts/YYYY-MM-DD-some-title.md -> some-title
  const base = basename(filename, '.md');
  return base.replace(/^\d{4}-\d{2}-\d{2}-/, '').toLowerCase();
}

function titleFromFrontMatter(fm, filename) {
  if (fm.title) return fm.title;
  // Fallback: slug-cased filename
  return slugFromFilename(filename).replace(/-/g, ' ');
}

function dateFromFilename(filename) {
  const m = basename(filename).match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

function formatDate(d) {
  if (!d) return '';
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`.toUpperCase();
}

function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} MIN READ`;
}

// 8-point khatam: two squares rotated 0° and 45°. Inline SVG, gold stroke + fill.
function khatamCornerSvg(size) {
  // Two overlapping squares centered at (size/2, size/2), one rotated 45°.
  const c = size / 2;
  const r = size * 0.42;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <g fill="${COLORS.gold}" fill-opacity="0.92">
      <rect x="${c - r}" y="${c - r}" width="${r * 2}" height="${r * 2}" transform="rotate(0 ${c} ${c})" />
      <rect x="${c - r}" y="${c - r}" width="${r * 2}" height="${r * 2}" transform="rotate(45 ${c} ${c})" />
    </g>
    <g fill="${COLORS.bg}">
      <circle cx="${c}" cy="${c}" r="${r * 0.45}" />
    </g>
    <g fill="${COLORS.gold}">
      <rect x="${c - r * 0.06}" y="${c - r * 0.45}" width="${r * 0.12}" height="${r * 0.9}" />
      <rect x="${c - r * 0.45}" y="${c - r * 0.06}" width="${r * 0.9}" height="${r * 0.12}" />
    </g>
  </svg>`;
}

async function loadWoff2AsTtf(absPath) {
  const woff2 = await readFile(absPath);
  const ttf = await wawoff2.decompress(woff2);
  return Buffer.from(ttf);
}

async function loadFonts() {
  const cormorantPath = (weight, style) => join(
    NODE_MODULES,
    '@fontsource/cormorant-garamond/files',
    `cormorant-garamond-latin-${weight}-${style}.woff2`,
  );

  const [cormorant500, cormorant500Italic, cormorant600] = await Promise.all([
    loadWoff2AsTtf(cormorantPath(500, 'normal')),
    loadWoff2AsTtf(cormorantPath(500, 'italic')),
    loadWoff2AsTtf(cormorantPath(600, 'normal')),
  ]);

  return [
    { name: 'Cormorant Garamond', data: cormorant500, weight: 500, style: 'normal' },
    { name: 'Cormorant Garamond', data: cormorant500Italic, weight: 500, style: 'italic' },
    { name: 'Cormorant Garamond', data: cormorant600, weight: 600, style: 'normal' },
  ];
}

function buildTree({ title, dateLabel, readLabel, isDefault, wordmarkAr }) {
  const khatamSize = 320;
  const khatamSvg = khatamCornerSvg(khatamSize);
  const khatamDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(khatamSvg)}`;

  // Arabic wordmark is a pre-shaped SVG (paths only) — satori can't shape Arabic,
  // so the brand mark is rasterised once at build time by build-wordmark.mjs.
  const wordmarkArHeight = 64;
  const wordmarkArAspect = wordmarkAr.width / wordmarkAr.height;
  const wordmarkArWidth = Math.round(wordmarkArHeight * wordmarkArAspect);
  const wordmarkArDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(wordmarkAr.svg)}`;

  const wordmark = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Cormorant Garamond',
              fontWeight: 600,
              fontSize: '52px',
              letterSpacing: '0.18em',
              color: COLORS.cobalt,
              textTransform: 'uppercase',
            },
            children: 'BARMAG',
          },
        },
        {
          type: 'img',
          props: {
            src: wordmarkArDataUri,
            width: wordmarkArWidth,
            height: wordmarkArHeight,
          },
        },
      ],
    },
  };

  const meta = isDefault
    ? null
    : {
        type: 'div',
        props: {
          style: {
            fontFamily: 'Cormorant Garamond',
            fontWeight: 600,
            fontSize: '24px',
            letterSpacing: '0.18em',
            color: COLORS.gold,
            textTransform: 'uppercase',
            marginBottom: '24px',
          },
          children: [dateLabel, readLabel].filter(Boolean).join('  ·  '),
        },
      };

  // Title size tiers — aim to keep long titles to ~4-5 lines within ~1000px width.
  const len = title.length;
  let titleSize;
  if (len <= 35) titleSize = 92;
  else if (len <= 55) titleSize = 76;
  else if (len <= 80) titleSize = 60;
  else titleSize = 50;

  const heading = {
    type: 'div',
    props: {
      style: {
        fontFamily: 'Cormorant Garamond',
        fontWeight: 600,
        fontSize: `${titleSize}px`,
        lineHeight: 1.1,
        color: COLORS.cobalt,
        maxWidth: '1000px',
        letterSpacing: '-0.005em',
      },
      children: title,
    },
  };

  const tagline = isDefault
    ? {
        type: 'div',
        props: {
          style: {
            fontFamily: 'Cormorant Garamond',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '36px',
            color: COLORS.muted,
            marginTop: '32px',
            maxWidth: '760px',
            lineHeight: 1.35,
          },
          children: 'Engineering leadership, neurodivergence, and technology — by Yasser Makram',
        },
      }
    : null;

  const footerRule = {
    type: 'div',
    props: {
      style: {
        height: '1px',
        backgroundColor: COLORS.gold,
        opacity: 0.5,
        marginTop: '24px',
      },
    },
  };

  const footer = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'Cormorant Garamond',
        fontWeight: 500,
        fontSize: '22px',
        letterSpacing: '0.16em',
        color: COLORS.muted,
        textTransform: 'uppercase',
        marginTop: '20px',
      },
      children: [
        { type: 'div', props: { children: 'barmag.github.io' } },
        { type: 'div', props: { children: 'an essay' } },
      ],
    },
  };

  return {
    type: 'div',
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 80px',
        position: 'relative',
        fontFamily: 'Cormorant Garamond',
      },
      children: [
        // Khatam in top-right corner, partially clipped off-canvas for a "stamped" feel
        {
          type: 'img',
          props: {
            src: khatamDataUri,
            width: khatamSize,
            height: khatamSize,
            style: {
              position: 'absolute',
              top: `${-khatamSize * 0.3}px`,
              right: `${-khatamSize * 0.3}px`,
              opacity: 0.85,
            },
          },
        },
        wordmark,
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '24px',
            },
            children: [meta, heading, tagline].filter(Boolean),
          },
        },
        footerRule,
        footer,
      ],
    },
  };
}

async function renderPng(tree, fonts) {
  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts });
  const resvg = new Resvg(svg, { background: COLORS.bg, fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

async function isOlderThan(target, source) {
  if (!existsSync(target)) return true;
  const [t, s] = await Promise.all([stat(target), stat(source)]);
  return t.mtimeMs < s.mtimeMs;
}

async function loadWordmark() {
  // Build the Arabic wordmark SVG if missing; then return parsed dimensions + svg text.
  if (!existsSync(WORDMARK_PATH)) {
    await buildWordmarkSvg(WORDMARK_PATH);
  }
  const svg = await readFile(WORDMARK_PATH, 'utf8');
  const m = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  if (!m) throw new Error('wordmark-ar.svg has no parseable viewBox');
  return { svg, width: parseFloat(m[1]), height: parseFloat(m[2]) };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const [fonts, wordmarkAr] = await Promise.all([loadFonts(), loadWordmark()]);

  // Per-post images
  const posts = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'));
  let made = 0;
  let skipped = 0;
  const force = process.argv.includes('--force');
  for (const file of posts) {
    const srcPath = join(POSTS_DIR, file);
    const slug = slugFromFilename(file);
    const outPath = join(OUT_DIR, `${slug}.png`);
    const scriptPath = fileURLToPath(import.meta.url);
    const stale = force
      || (await isOlderThan(outPath, srcPath))
      || (await isOlderThan(outPath, scriptPath));
    if (!stale) {
      skipped++;
      continue;
    }
    const raw = await readFile(srcPath, 'utf8');
    const fm = matter(raw);
    const title = titleFromFrontMatter(fm.data, file);
    const date = dateFromFilename(file);
    const tree = buildTree({
      title,
      dateLabel: formatDate(date),
      readLabel: readingTime(fm.content),
      isDefault: false,
      wordmarkAr,
    });
    const png = await renderPng(tree, fonts);
    await writeFile(outPath, png);
    console.log(`  generated ${slug}.png  (${title})`);
    made++;
  }

  // Default OG card (for home / about / 404 / any non-post page)
  const defaultPath = join(OUT_DIR, 'default.png');
  const defaultStale = force
    || !existsSync(defaultPath)
    || (await isOlderThan(defaultPath, fileURLToPath(import.meta.url)));
  if (defaultStale) {
    const tree = buildTree({ title: 'barmag', isDefault: true, wordmarkAr });
    const png = await renderPng(tree, fonts);
    await writeFile(defaultPath, png);
    console.log('  generated default.png');
    made++;
  } else {
    skipped++;
  }

  console.log(`\nDone. ${made} generated, ${skipped} unchanged.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
