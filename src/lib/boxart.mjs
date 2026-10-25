// Original box-front drawings, generated from a few frontmatter fields.
// Shared by the site (Astro components) and scripts/brand/make.mjs (share cards).
// No publisher artwork: every shape here is drawn from scratch.

export const PALETTE = {
  mustard: '#e3a92b',
  mustardLt: '#f4d58a',
  forest: '#1e4a34',
  forestDk: '#14331f',
  rust: '#b4481f',
  orange: '#dd7a2b',
  cream: '#f6ecd4',
  paper: '#fffaf0',
  ink: '#2a1f16',
  muted: '#5b4a3a',
  sky: '#a9c6d6',
  sage: '#7fb08f',
  peach: '#e9a07a',
};

const c = (name, fallback) => PALETTE[name] ?? fallback;
const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
const INK = PALETTE.ink;

/** Motifs drawn inside an 80×80 box at the origin. */
const MOTIFS = {
  diamond: () => `
    <path d="M40 0 L80 40 L40 80 L0 40Z" fill="${PALETTE.paper}" stroke="${INK}" stroke-width="4"/>
    <circle cx="40" cy="0" r="6" fill="${INK}"/><circle cx="80" cy="40" r="6" fill="${INK}"/><circle cx="0" cy="40" r="6" fill="${INK}"/>
    <rect x="34" y="74" width="12" height="12" fill="${INK}" transform="rotate(45 40 80)"/>
    <circle cx="40" cy="40" r="9" fill="${PALETTE.rust}"/>`,
  dice: () => `
    <g transform="rotate(-12 22 32)"><rect x="0" y="10" width="44" height="44" rx="9" fill="${PALETTE.paper}" stroke="${INK}" stroke-width="3"/>
      <circle cx="12" cy="22" r="4" fill="${INK}"/><circle cx="22" cy="32" r="4" fill="${INK}"/><circle cx="32" cy="42" r="4" fill="${INK}"/></g>
    <g transform="rotate(10 64 14)"><rect x="46" y="-4" width="36" height="36" rx="8" fill="${PALETTE.mustard}" stroke="${INK}" stroke-width="3"/>
      <circle cx="56" cy="6" r="3.5" fill="${INK}"/><circle cx="72" cy="22" r="3.5" fill="${INK}"/></g>`,
  meeple: () => `
    <path transform="translate(4 2) scale(2.3)" d="M16 4a5 5 0 0 1 5 5c0 1-.3 1.8-.7 2.5L27 13.5c1.8.6 2 2.6.4 3.6L22 19.6 26 27a1.3 1.3 0 0 1-1.2 1.9H19L16 23.5 13 28.9H7.2A1.3 1.3 0 0 1 6 27l4-7.4-5.4-2.5c-1.6-1-1.4-3 .4-3.6l6.7-2c-.4-.7-.7-1.5-.7-2.5a5 5 0 0 1 5-5z"
      fill="${PALETTE.paper}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`,
  cards: () => `
    <g transform="rotate(-14 30 50)"><rect x="6" y="12" width="44" height="62" rx="6" fill="${PALETTE.paper}" stroke="${INK}" stroke-width="3"/></g>
    <g transform="rotate(8 50 40)"><rect x="30" y="4" width="44" height="62" rx="6" fill="${PALETTE.mustard}" stroke="${INK}" stroke-width="3"/>
      <circle cx="52" cy="35" r="10" fill="${PALETTE.rust}" stroke="${INK}" stroke-width="3"/></g>`,
  pawn: () => `
    <circle cx="40" cy="18" r="13" fill="${PALETTE.paper}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M30 34h20l8 34H22z" fill="${PALETTE.paper}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="14" y="66" width="52" height="12" rx="5" fill="${PALETTE.rust}" stroke="${INK}" stroke-width="3.5"/>`,
  ball: () => `
    <circle cx="40" cy="40" r="36" fill="${PALETTE.paper}" stroke="${INK}" stroke-width="4"/>
    <path d="M18 12c10 14 10 42 0 56M62 12c-10 14-10 42 0 56" fill="none" stroke="${PALETTE.rust}" stroke-width="3.5" stroke-dasharray="5 4"/>`,
  none: () => '',
};

function sunburst(art) {
  const bg = c(art.background, PALETTE.mustard);
  const motif = (MOTIFS[art.motif] ?? MOTIFS.meeple)();
  const size = art.word.length > 4 ? 44 : 54;
  return `
    <rect width="320" height="140" fill="${bg}"/>
    <g fill="${PALETTE.mustardLt}"><path d="M0 140 L0 60 L70 140Z"/><path d="M0 140 L60 0 L100 0Z"/><path d="M0 140 L150 0 L200 0Z"/><path d="M0 140 L260 20 L280 50Z"/><path d="M0 140 L320 100 L320 130Z"/></g>
    <path d="M-10 118 C80 118 140 70 330 70" stroke="${PALETTE.rust}" stroke-width="14" fill="none"/>
    <path d="M-10 134 C90 134 150 86 330 86" stroke="${PALETTE.orange}" stroke-width="14" fill="none"/>
    <path d="M-10 150 C100 150 160 102 330 102" stroke="${PALETTE.forest}" stroke-width="14" fill="none"/>
    <g transform="translate(205 26)">${motif}</g>
    <text x="16" y="62" font-family="Shrikhand, Georgia, serif" font-size="${size}" fill="${PALETTE.forest}">${esc(art.word)}</text>`;
}

function rings(art) {
  const bg = c(art.background, PALETTE.forest);
  const motif = (MOTIFS[art.motif] ?? MOTIFS.dice)();
  const sup = art.sup ? `<tspan font-size="34" dy="-36">${esc(art.sup)}</tspan>` : '';
  const size = art.word.length > 2 ? 56 : 78;
  const caption = art.caption
    ? `<text x="18" y="124" font-family="Oswald, sans-serif" font-weight="600" font-size="14" letter-spacing="3" fill="${PALETTE.cream}">${esc(art.caption.toUpperCase())}</text>`
    : '';
  return `
    <rect width="320" height="140" fill="${bg}"/>
    <circle cx="290" cy="150" r="120" fill="${PALETTE.forestDk}"/>
    <circle cx="290" cy="150" r="96" fill="none" stroke="${PALETTE.mustard}" stroke-width="10"/>
    <circle cx="290" cy="150" r="76" fill="none" stroke="${PALETTE.orange}" stroke-width="10"/>
    <circle cx="290" cy="150" r="56" fill="none" stroke="${PALETTE.rust}" stroke-width="10"/>
    <g transform="translate(176 46)">${motif}</g>
    <text x="16" y="96" font-family="Shrikhand, Georgia, serif" font-size="${size}" fill="${PALETTE.mustard}">${esc(art.word)}${sup}</text>
    ${caption}`;
}

/**
 * Returns the inner markup of a 320×140 box-front drawing.
 * @param {{style?: 'sunburst'|'rings', word: string, sup?: string, caption?: string, motif?: string, background?: string}} art
 */
export function boxArtInner(art) {
  return art.style === 'rings' ? rings(art) : sunburst(art);
}

/** A complete <svg> element (decorative: aria-hidden). */
export function boxArtSvg(art, attrs = '') {
  return `<svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" ${attrs}>${boxArtInner(art)}</svg>`;
}

const FAMILY_ROTATION = ['sage', 'peach', 'sky', 'mustard'];
const SOLO_ROTATION = ['mustardLt', 'paper', 'mustard', 'cream'];

/**
 * Colour for a game's box on the archive shelf: the game's own `color`,
 * else one picked from the issue number so neighbouring weeks differ.
 */
export function shelfColor(color, issue, kind = 'family') {
  if (color && PALETTE[color]) return PALETTE[color];
  const list = kind === 'solo' ? SOLO_ROTATION : FAMILY_ROTATION;
  return PALETTE[list[(Math.max(1, issue) - 1) % list.length]];
}
