// Hand-drawn doodles: the site's illustration language. Each one is an ink line drawing on a 64 x 64 grid over a
// flat blob of marker colour, set slightly off the line the way a quick sketch is coloured in. Ink paths carry
// pathLength="1" so CSS can draw them on (.dd__ink); the colour comes from --dd (one of the marker tokens in
// site.css). Used in the maze (the pitfalls in its dead ends, the idea at the entrance, the launch at the exit)
// and next to headlines. Always decoration: aria-hidden, never the only place something is said.
'use strict';

// fill: the colour blob (drawn first, a little off the ink); ink: the lines; dots: small solid ink marks.
const D = {
  bug: {
    fill: '<ellipse cx="35" cy="39" rx="14" ry="16"/>',
    ink: '<path d="M32 21c-9 0-14 8-14 16 0 10 6 17 14 17s14-7 14-17c0-8-5-16-14-16z"/><path d="M32 21c-4 0-7-3-7-6s3-6 7-6 7 3 7 6-3 6-7 6z"/><path d="M32 22v31"/><path d="M19 31l-8-4M18 39H9M20 47l-8 5M45 31l8-4M46 39h9M44 47l8 5"/><path d="M28 10c-2-4-6-6-9-5M36 10c2-4 6-6 9-5"/>',
    dots: '<circle cx="25.5" cy="34" r="2.2"/><circle cx="38.5" cy="42" r="2.4"/><circle cx="26.5" cy="46" r="1.7"/>',
  },
  clock: {
    fill: '<circle cx="35" cy="37" r="17"/>',
    ink: '<circle cx="32" cy="34" r="17"/><path d="M32 34V23M32 34l8 5"/><path d="M12 21c0-6 5-10 11-9M52 21c0-6-5-10-11-9"/><path d="M21 49l-4 6M43 49l4 6"/><path d="M7 31l-4-1M8 38l-4 2"/>',
    dots: '<circle cx="32" cy="34" r="2"/>',
  },
  tangle: {
    fill: '<circle cx="34" cy="35" r="16"/>',
    ink: '<path d="M17 37c-2-12 10-20 20-17s13 15 6 21-19 4-19-5 11-12 16-6 1 12-6 10-6-8 0-9"/><path d="M43 41c6 4 10 10 9 17"/><path d="M17 37c-4 1-8 4-10 9"/>',
  },
  question: {
    fill: '<path d="M16 18h34a5 5 0 015 5v19a5 5 0 01-5 5H32l-10 8v-8h-6a5 5 0 01-5-5V23a5 5 0 015-5z"/>',
    ink: '<path d="M13 15h34a5 5 0 015 5v19a5 5 0 01-5 5H29l-10 8v-8h-6a5 5 0 01-5-5V20a5 5 0 015-5z"/><path d="M24 23c0-4 3-6 6-6s6 2 6 5c0 4-6 5-6 9"/>',
    dots: '<circle cx="30" cy="36.5" r="1.9"/>',
  },
  flame: {
    fill: '<path d="M35 11c7 10 16 16 15 29-1 11-8 17-16 17s-16-6-16-16c0-8 5-12 7-19 3 5 4 8 7 9 2-7 1-13 3-20z"/>',
    ink: '<path d="M32 8c7 10 16 16 15 29-1 11-8 17-16 17s-16-6-16-16c0-8 5-12 7-19 3 5 4 8 7 9 2-7 1-13 3-20z"/><path d="M31 50c-4 0-7-3-7-7 0-4 3-6 4-10 2 3 3 4 5 5 1-2 1-4 1-6 3 3 5 7 5 11 0 4-4 7-8 7z"/>',
  },
  ghost: {
    fill: '<path d="M17 55V31c0-10 8-18 18-18s18 8 18 18v24l-6-5-6 5-6-5-6 5-6-5z"/>',
    ink: '<path d="M14 52V28c0-10 8-18 18-18s18 8 18 18v24l-6-5-6 5-6-5-6 5-6-5z"/><path d="M28 38c2 2 6 2 8 0"/><path d="M14 35l-7 5M50 35l7-6"/>',
    dots: '<circle cx="26" cy="28" r="2.7"/><circle cx="38" cy="28" r="2.7"/>',
  },
  lock: {
    fill: '<rect x="20" y="31" width="30" height="24" rx="5"/>',
    ink: '<rect x="17" y="28" width="30" height="24" rx="5"/><path d="M23 28v-7c0-6 4-10 9-10s9 4 9 10v7"/><path d="M32 39v6"/>',
    dots: '<circle cx="32" cy="38" r="2.6"/>',
  },
  bulb: {
    fill: '<circle cx="35" cy="28" r="15"/>',
    ink: '<path d="M32 10c-9 0-15 7-15 15 0 7 5 10 7 16h16c2-6 7-9 7-16 0-8-6-15-15-15z"/><path d="M25 46h14M27 51h10M30 56h4"/><path d="M28 34l2-6 2 4 2-4 2 6"/><path d="M32 1v4M11 8l3 3M53 8l-3 3M4 25h4M60 25h-4"/>',
  },
  rocket: {
    fill: '<path d="M35 9c9 8 12 20 10 34H25c-2-14 1-26 10-34z"/>',
    ink: '<path d="M32 6c9 8 12 20 10 34H22c-2-14 1-26 10-34z"/><circle cx="32" cy="22" r="5"/><path d="M22 30l-8 10 1 6 7-3M42 30l8 10-1 6-7-3"/>',
  },
  exhaust: {
    fill: '<path d="M27 44c1 7 3 11 6 14 3-3 5-7 6-14z"/>',
    ink: '<path d="M26 44c1 7 3 11 6 14 3-3 5-7 6-14"/>',
  },
  star: {
    fill: '<path d="M34 8c2 14 8 22 22 24-14 2-20 10-22 24-2-14-8-22-22-24 14-2 20-10 22-24z"/>',
    ink: '<path d="M32 6c2 14 8 22 22 24-14 2-20 10-22 24-2-14-8-22-22-24 14-2 20-10 22-24z"/>',
  },
  plane: {
    fill: '<path d="M9 33l49-20-13 42-10-16z"/>',
    ink: '<path d="M6 30l50-20-14 42-10-16z"/><path d="M32 36l24-26"/><path d="M32 36l-3 12 7-7"/>',
  },
  heart: {
    fill: '<path d="M34 54S14 42 14 28c0-7 5-12 11-12 4 0 7 2 9 6 2-4 5-6 9-6 6 0 11 5 11 12 0 14-20 26-20 26z"/>',
    ink: '<path d="M32 52S12 40 12 26c0-7 5-12 11-12 4 0 7 2 9 6 2-4 5-6 9-6 6 0 11 5 11 12 0 14-20 26-20 26z"/>',
  },
  arrow: {
    ink: '<path d="M6 46c10-22 34-28 38-14 3 10-9 14-11 6-3-10 12-18 24-12"/><path d="M49 19l9 7-10 4"/>',
  },
  cup: {
    fill: '<path d="M17 25h32l-4 29H21z"/>',
    ink: '<path d="M14 22h32l-4 29H18z"/><path d="M46 28h4a6 6 0 010 12h-6"/><path d="M24 14c-2-3 2-5 0-8M32 14c-2-3 2-5 0-8"/>',
  },
  spiral: {
    ink: '<path d="M33 33c0-2 3-3 4-1 2 3-1 7-5 7-5 0-8-5-7-9 1-6 8-9 13-7 7 2 10 10 8 16-2 8-11 12-18 10-9-2-14-12-11-20"/>',
  },
};

// A cog: eight teeth around a hub, computed once.
const cog = (cx, cy) => {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 ? 15 : 21, a0 = ((i - 0.32) * Math.PI) / 8, a1 = ((i + 0.32) * Math.PI) / 8;
    pts.push([cx + Math.cos(a0) * r, cy + Math.sin(a0) * r], [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r]);
  }
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
};
D.gear = { fill: '<circle cx="35" cy="35" r="17"/>', ink: `<path d="${cog(32, 32)}"/><circle cx="32" cy="32" r="6"/>` };
D.pencil = {
  fill: '<path d="M18 52l4-12 26-26 8 8-26 26z"/>',
  ink: '<path d="M14 49l4-12 26-26 8 8-26 26z"/><path d="M40 15l8 8M18 37l8 8"/><path d="M14 49l-3 5 5-3"/>',
};

const NAMES = Object.keys(D);

// The drawing's layers as SVG children (for use inside another SVG).
const layers = (name) => {
  const d = D[name];
  if (!d) throw new Error(`unknown doodle ${name}`);
  const ink = d.ink.replace(/<(path|circle|rect|ellipse)\b/g, '<$1 pathLength="1"');
  return `${d.fill ? `<g class="dd__fill">${d.fill}</g>` : ''}<g class="dd__ink">${ink}</g>${d.dots ? `<g class="dd__dots">${d.dots}</g>` : ''}`;
};

// A standalone doodle. `color` names a marker token (blue, tomato, sun, mint, lilac, pink, sky).
const doodle = (name, { color = 'sun', cls = '', attrs = '' } = {}) =>
  `<svg class="dd dd--${name}${cls ? ' ' + cls : ''}" viewBox="0 0 64 64" style="--dd:var(--${color})" aria-hidden="true" focusable="false"${attrs ? ' ' + attrs : ''}>${layers(name)}</svg>`;

// A doodle placed inside another SVG: centred on x, y at `size` user units.
const doodleAt = (name, x, y, size, { color = 'sun', cls = '' } = {}) => {
  const s = +(size / 64).toFixed(4);
  return `<g class="dd dd--${name}${cls ? ' ' + cls : ''}" style="--dd:var(--${color})" transform="translate(${+(x - size / 2).toFixed(1)} ${+(y - size / 2).toFixed(1)}) scale(${s})">${layers(name)}</g>`;
};

module.exports = { doodle, doodleAt, NAMES };
