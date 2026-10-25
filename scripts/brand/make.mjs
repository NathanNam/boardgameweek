#!/usr/bin/env node
// Generates the favicon set and the 1200×630 share cards.
//
//   npm i --no-save puppeteer-core@23.11.1
//   node scripts/brand/make.mjs            # everything
//   node scripts/brand/make.mjs --issues   # only the per-issue cards
//
// Needs Google Chrome at CHROME_PATH (default: the macOS app path).
// Outputs (committed): public/icon.svg, public/favicon.ico, public/favicon-32.png,
// public/apple-touch-icon.png, public/og/site.png, public/og/issues/<slug>.png

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import puppeteer from 'puppeteer-core';
import { boxArtSvg, PALETTE } from '../../src/lib/boxart.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pub = path.join(root, 'public');
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const onlyIssues = process.argv.includes('--issues');

// ---- fonts, inlined so the cards render offline ----------------------------------------
const font = (pkg, file) => fs.readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');
const FONTS = `
@font-face{font-family:Shrikhand;font-weight:400;src:url(data:font/woff2;base64,${font('shrikhand', 'shrikhand-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:Oswald;font-weight:500;src:url(data:font/woff2;base64,${font('oswald', 'oswald-latin-500-normal.woff2')}) format('woff2')}
@font-face{font-family:Oswald;font-weight:600;src:url(data:font/woff2;base64,${font('oswald', 'oswald-latin-600-normal.woff2')}) format('woff2')}
@font-face{font-family:Karla;font-weight:600;src:url(data:font/woff2;base64,${font('karla', 'karla-latin-600-normal.woff2')}) format('woff2')}`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---- issues ---------------------------------------------------------------------------------
function readIssues() {
  const dir = path.join(root, 'src/content/issues');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = text.match(/^---\n([\s\S]*?)\n---/);
    if (!m) throw new Error(`No frontmatter in ${f}`);
    return { slug: f.replace(/\.md$/, ''), data: parseYaml(m[1]) };
  });
}

// ---- share card template -----------------------------------------------------------------
function card({ kicker, title, line, family, solo }) {
  const box = (art, cls, name, tag) => `
    <div class="box ${cls}">
      <div class="art">${boxArtSvg(art)}</div>
      ${name ? `<div class="band"><span class="tag">${esc(tag)}</span><b>${esc(name)}</b></div>` : ''}
    </div>`;
  const long = title.length > 22;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;overflow:hidden;background:${PALETTE.cream};color:${PALETTE.ink};font-family:Karla,sans-serif;position:relative;
    background-image:radial-gradient(rgba(42,31,22,.06) 1.5px,transparent 1.5px);background-size:9px 9px}
  .mast{position:absolute;left:0;right:0;top:0;height:150px;background:${PALETTE.forest};border-bottom:9px solid ${PALETTE.mustard}}
  .mast::after{content:"";position:absolute;left:0;right:0;bottom:-9px;height:9px;background:${PALETTE.rust}}
  .mast h1{position:absolute;left:64px;top:30px;font-family:Shrikhand;font-weight:400;font-size:66px;line-height:1;color:${PALETTE.mustard};text-shadow:4px 4px 0 ${PALETTE.rust};white-space:nowrap}
  .mast p{position:absolute;left:66px;top:112px;font-family:Oswald;font-weight:600;font-size:21px;letter-spacing:.16em;text-transform:uppercase;color:${PALETTE.mustardLt}}
  .stripes{position:absolute;right:0;top:0;width:250px;height:150px}
  .left{position:absolute;left:64px;top:206px;width:540px}
  .kicker{font-family:Oswald;font-weight:600;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:${PALETTE.rust}}
  .title{font-family:Shrikhand;font-weight:400;font-size:${long ? 62 : 76}px;line-height:1.05;color:${PALETTE.forest};margin-top:10px}
  .line{margin-top:22px;font-size:27px;line-height:1.35;font-weight:600;color:${PALETTE.ink}}
  .line span{display:block}
  .line i{font-style:normal;font-family:Oswald;font-weight:600;font-size:17px;letter-spacing:.12em;text-transform:uppercase;background:${PALETTE.ink};color:${PALETTE.cream};padding:3px 9px;border-radius:5px;margin-right:12px;position:relative;top:-4px}
  .box{position:absolute;border:4px solid ${PALETTE.ink};border-radius:14px;overflow:hidden;background:${PALETTE.paper};box-shadow:9px 9px 0 ${PALETTE.ink}}
  .box .art svg{display:block;width:100%;height:100%}
  .box.fam{left:650px;top:176px;width:490px}
  .box.fam .art{height:166px}
  .box.solo{left:842px;top:404px;width:300px;transform:rotate(-2.5deg)}
  .box.solo .art{height:131px}
  .band{padding:9px 16px 10px;border-top:4px solid ${PALETTE.ink};display:flex;gap:12px;align-items:center}
  .band b{font-family:Shrikhand;font-weight:400;font-size:25px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .solo .band b{font-size:20px}
  .tag{font-family:Oswald;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase;background:${PALETTE.ink};color:${PALETTE.cream};padding:3px 7px;border-radius:4px}
  .plank{position:absolute;left:620px;right:28px;top:596px;height:20px;border-radius:4px;background:linear-gradient(180deg,#a8723f,#8a5a33 40%,#5e3b1f)}
  .url{position:absolute;left:66px;bottom:30px;font-family:Oswald;font-weight:500;font-size:22px;letter-spacing:.08em;color:${PALETTE.muted}}
  </style></head><body>
  <div class="mast">
    <h1>Board Game of the Week</h1>
    <p>${esc(line)}</p>
    <svg class="stripes" viewBox="0 0 180 120" preserveAspectRatio="xMaxYMin meet">
      <path d="M180 18 C120 18 90 60 90 120" fill="none" stroke="#e3a92b" stroke-width="14"/>
      <path d="M180 36 C132 36 108 70 108 120" fill="none" stroke="#dd7a2b" stroke-width="14"/>
      <path d="M180 54 C144 54 126 80 126 120" fill="none" stroke="#b4481f" stroke-width="14"/>
    </svg>
  </div>
  <div class="left">
    <div class="kicker">${esc(kicker)}</div>
    <div class="title">${esc(title)}</div>
    <div class="line">
      ${family.name ? `<span><i>Family</i>${esc(family.name)}</span>` : ''}
      ${solo?.name ? `<span><i>Solo</i>${esc(solo.name)}</span>` : ''}
      ${family.text ? `<span>${esc(family.text)}</span>` : ''}
    </div>
  </div>
  <div class="plank"></div>
  ${box(family.art, 'fam', family.boxName, 'Family')}
  ${solo ? box(solo.art, 'solo', solo.boxName, 'Solo') : ''}
  <div class="url">boardgameweek.vercel.app</div>
  </body></html>`;
}

// ---- ICO writer (PNG-compressed entries) ---------------------------------------------------
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, o); header.writeUInt8(size >= 256 ? 0 : size, o + 1);
    header.writeUInt8(0, o + 2); header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4); header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(buf.length, o + 8); header.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.buf)]);
}

// ---- main -----------------------------------------------------------------------------------
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bgotw-brand-'));
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, userDataDir: profile });
try {
  const page = await browser.newPage();
  const shot = async (html, w, h, file) => {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const buf = await page.screenshot({ type: 'png', omitBackground: false, clip: { x: 0, y: 0, width: w, height: h } });
    if (file) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, buf); console.log('wrote', path.relative(root, file)); }
    return buf;
  };

  if (!onlyIssues) {
    const svg = fs.readFileSync(path.join(root, 'scripts/brand/icon.svg'), 'utf8');
    fs.writeFileSync(path.join(pub, 'icon.svg'), svg);
    console.log('wrote public/icon.svg');
    // bleed: square corners for iOS home screens (iOS rounds them itself).
    const iconHtml = (size, bleed) => `<!doctype html><html><body style="margin:0;background:transparent">
      <div style="width:${size}px;height:${size}px">${(bleed ? svg.replace('rx="7"', 'rx="0"') : svg).replace('<svg ', '<svg width="100%" height="100%" ')}</div></body></html>`;
    // Transparent corners for browser tabs; full-bleed square for iOS home screens.
    const pngAt = async (size, file) => {
      await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
      await page.setContent(iconHtml(size, false));
      const buf = await page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
      if (file) { fs.writeFileSync(file, buf); console.log('wrote', path.relative(root, file)); }
      return buf;
    };
    const p16 = await pngAt(16), p32 = await pngAt(32, path.join(pub, 'favicon-32.png')), p48 = await pngAt(48);
    fs.writeFileSync(path.join(pub, 'favicon.ico'), ico([{ size: 16, buf: p16 }, { size: 32, buf: p32 }, { size: 48, buf: p48 }]));
    console.log('wrote public/favicon.ico');
    await shot(iconHtml(180, true), 180, 180, path.join(pub, 'apple-touch-icon.png'));

    await shot(card({
      kicker: 'Every week',
      title: 'One family game, one solo game',
      line: 'Picked for what is happening in the world',
      family: { text: 'How to play, things to talk about, and tips so everyone can play.', art: { style: 'sunburst', word: 'Play', motif: 'meeple' } },
      solo: { art: { style: 'rings', word: 'Solo', caption: 'One player', motif: 'dice' } },
    }), 1200, 630, path.join(pub, 'og/site.png'));
  }

  for (const { slug, data: d } of readIssues()) {
    await shot(card({
      kicker: 'This week',
      title: d.theme,
      line: `Issue No. ${d.issue} · ${d.label}`,
      family: { name: d.family.name, art: d.family.art, boxName: d.family.name },
      solo: d.solo ? { name: d.solo.name, art: d.solo.art, boxName: d.solo.name } : undefined,
    }), 1200, 630, path.join(pub, 'og/issues', `${slug}.png`));
  }
} finally {
  await browser.close();
  fs.rmSync(profile, { recursive: true, force: true });
}
