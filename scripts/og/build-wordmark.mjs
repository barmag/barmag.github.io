#!/usr/bin/env node
/**
 * Render the Arabic wordmark "برمج" (Amiri 400) to a static SVG of vector paths.
 * Satori can't shape Arabic (incomplete OpenType layout in its forked opentype.js),
 * so we shape once with fontkit and let satori embed the resulting SVG as an image.
 *
 * Idempotent — safe to re-run. Re-run if you change the wordmark text or font.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const NODE_MODULES = join(ROOT, 'node_modules');
const DEFAULT_OUT = join(ROOT, 'assets', 'og', 'wordmark-ar.svg');

const TEXT = 'برمج';
const FONT_SIZE = 200;
const COLOR = '#1F3A5F';

export async function buildWordmarkSvg(outPath = DEFAULT_OUT) {
  const woff2 = await readFile(
    join(NODE_MODULES, '@fontsource/amiri/files', 'amiri-arabic-400-normal.woff2'),
  );
  const ttf = Buffer.from(await wawoff2.decompress(woff2));
  const font = fontkit.create(ttf);

  const run = font.layout(TEXT);
  const scale = FONT_SIZE / font.unitsPerEm;

  let x = 0;
  const pieces = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const path = glyph.path;
    if (path && path.commands.length > 0) {
      const tx = (x + pos.xOffset) * scale;
      const ty = -pos.yOffset * scale;
      const b = glyph.bbox;
      minX = Math.min(minX, tx + b.minX * scale);
      maxX = Math.max(maxX, tx + b.maxX * scale);
      minY = Math.min(minY, ty - b.maxY * scale);
      maxY = Math.max(maxY, ty - b.minY * scale);
      const d = path.scale(scale, -scale).translate(tx, ty).toSVG();
      pieces.push(d);
    }
    x += pos.xAdvance;
  });

  const w = Math.ceil(maxX - minX);
  const h = Math.ceil(maxY - minY);
  const dx = -minX, dy = -minY;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <g transform="translate(${dx} ${dy})" fill="${COLOR}">
    ${pieces.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>
`;
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, svg);
  return { path: outPath, width: w, height: h };
}

// CLI entry: `node scripts/og/build-wordmark.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  buildWordmarkSvg().then(
    ({ path, width, height }) => console.log(`wrote ${path}  (${width}×${height})`),
    (err) => {
      console.error(err);
      process.exit(1);
    },
  );
}
