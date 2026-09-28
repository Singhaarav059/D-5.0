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

// What we build (the moving band): one drawing per service.
Object.assign(D, {
  chip: { // AI & ML: a chip with a spark in it
    fill: '<rect x="19" y="19" width="30" height="30" rx="6"/>',
    ink: '<rect x="16" y="16" width="32" height="32" rx="6"/><path d="M24 16V9M32 16V9M40 16V9M24 55v-7M32 55v-7M40 55v-7M16 24H9M16 32H9M16 40H9M55 24h-7M55 32h-7M55 40h-7"/><path d="M32 24c1 4.5 3 6.5 7.5 7.5-4.5 1-6.5 3-7.5 7.5-1-4.5-3-6.5-7.5-7.5 4.5-1 6.5-3 7.5-7.5z"/>',
  },
  browser: { // web apps: a browser window with a page in it
    fill: '<rect x="10" y="15" width="48" height="38" rx="6"/>',
    ink: '<rect x="7" y="12" width="48" height="38" rx="6"/><path d="M7 22h48"/><path d="M14 31h17M14 38h11"/><rect x="36" y="29" width="12" height="14" rx="2.5"/>',
    dots: '<circle cx="13" cy="17" r="1.7"/><circle cx="18.5" cy="17" r="1.7"/><circle cx="24" cy="17" r="1.7"/>',
  },
  phone: { // mobile apps
    fill: '<rect x="22" y="9" width="24" height="46" rx="6"/>',
    ink: '<rect x="19" y="6" width="24" height="46" rx="6"/><path d="M27 12h8"/><path d="M25 21h12M25 28h12M25 35h7"/><path d="M47 17c3 2 4 5 4 8M50 12c5 3 7 8 7 13"/>',
    dots: '<circle cx="31" cy="45" r="2"/>',
  },
  layers: { // SaaS: a stack of plates
    fill: '<path d="M34 13l22 11-22 11-22-11z"/>',
    ink: '<path d="M32 10l22 11-22 11-22-11z"/><path d="M10 31l22 11 22-11"/><path d="M10 41l22 11 22-11"/>',
  },
  bag: { // eCommerce
    fill: '<path d="M16 24h36l-3 30H19z"/>',
    ink: '<path d="M13 21h36l-3 30H16z"/><path d="M23 27v-8c0-5 4-9 8-9s8 4 8 9v8"/>',
    dots: '<circle cx="23" cy="27.5" r="1.9"/><circle cx="39" cy="27.5" r="1.9"/>',
  },
  cloud: { // cloud: a cloud with an upload arrow
    fill: '<path d="M19 49h28a10 10 0 002-19.8A13 13 0 0024 26a11 11 0 00-5 23z"/>',
    ink: '<path d="M17 46h28a10 10 0 002-19.8A13 13 0 0022 23a11 11 0 00-5 23z"/><path d="M32 41V29M27 33l5-5 5 5"/>',
  },
  loop: { // automation: a cycle with a bolt in it
    fill: '<circle cx="34" cy="34" r="17"/>',
    ink: '<path d="M48 25a17 17 0 00-31-1"/><path d="M48 14v11H37"/><path d="M16 39a17 17 0 0031 1"/><path d="M16 50V39h11"/><path d="M34 21l-7 12h9l-6 11"/>',
  },
  pen: { // UI/UX: the vector pen tool on its handle
    fill: '<path d="M34 9l13 18-13 20-13-20z"/>',
    ink: '<path d="M32 6l13 18-13 20-13-20z"/><path d="M32 30V15"/><path d="M13 54h38"/><path d="M32 44v10"/>',
    dots: '<circle cx="32" cy="31" r="2.4"/><rect x="5" y="50" width="8" height="8" rx="1.5"/><rect x="51" y="50" width="8" height="8" rx="1.5"/>',
  },
});

// The industries we serve (services page), and the values on the about page.
Object.assign(D, {
  pulse: { // healthcare
    fill: '<path d="M34 54S14 42 14 28c0-7 5-12 11-12 4 0 7 2 9 6 2-4 5-6 9-6 6 0 11 5 11 12 0 14-20 26-20 26z"/>',
    ink: '<path d="M32 52S12 40 12 26c0-7 5-12 11-12 4 0 7 2 9 6 2-4 5-6 9-6 6 0 11 5 11 12 0 14-20 26-20 26z"/><path d="M4 33h14l4-8 6 15 5-11 3 4h24"/>',
  },
  card: { // fintech: a card and a coin
    fill: '<rect x="9" y="15" width="40" height="27" rx="5"/>',
    ink: '<rect x="6" y="12" width="40" height="27" rx="5"/><path d="M6 20h40"/><path d="M12 32h10"/><circle cx="46" cy="44" r="10"/><path d="M46 39v10"/>',
  },
  truck: { // logistics
    fill: '<path d="M8 20h30v25H8zM38 28h10l7 9v8H38z"/>',
    ink: '<path d="M10 43H5V17h30v26H21"/><path d="M35 25h10l7 9v9h-3M35 43h4"/>',
    dots: '<circle cx="15.5" cy="45" r="4.6"/><circle cx="44" cy="45" r="4.6"/>',
  },
  store: { // retail: a shopfront with an awning
    fill: '<path d="M12 30h42v24H12z"/>',
    ink: '<path d="M6 25l4-12h44l4 12"/><path d="M6 25c0 4 3 6 6.5 6s6.5-2 6.5-6c0 4 3 6 6.5 6s6.5-2 6.5-6c0 4 3 6 6.5 6s6.5-2 6.5-6c0 4 3 6 6.5 6s6.5-2 6.5-6"/><path d="M10 31v20h44V31"/><path d="M26 51V39h12v12"/>',
  },
  cart: { // eCommerce
    fill: '<path d="M17 20h38l-5 20H21z"/>',
    ink: '<path d="M4 11h8l7 29h29l6-22H14"/><path d="M19 40l-2 6h32"/>',
    dots: '<circle cx="21" cy="53" r="3.2"/><circle cx="45" cy="53" r="3.2"/>',
  },
  cap: { // education
    fill: '<path d="M34 16l26 11-26 11L8 27z"/>',
    ink: '<path d="M32 13l26 11-26 11L6 24z"/><path d="M16 29v11c0 4 7 8 16 8s16-4 16-8V29"/><path d="M54 26v13"/>',
    dots: '<circle cx="54" cy="42" r="2.6"/>',
  },
  bank: { // banking, financial services and insurance
    fill: '<path d="M34 9l24 12H10z"/>',
    ink: '<path d="M32 6l24 12H8z"/><path d="M13 24v19M24.5 24v19M39.5 24v19M51 24v19"/><path d="M9 44h46M6 51h52"/>',
  },
  gamepad: { // sports and gaming
    fill: '<path d="M18 22h30c7 0 11 6 12 14 1 7-2 12-7 12-4 0-6-4-10-7H22c-4 3-6 7-10 7-5 0-8-5-7-12 1-8 5-14 13-14z"/>',
    ink: '<path d="M16 19h30c7 0 11 6 12 14 1 7-2 12-7 12-4 0-6-4-10-7H20c-4 3-6 7-10 7-5 0-8-5-7-12 1-8 5-14 13-14z"/><path d="M17 25v10M12 30h10"/>',
    dots: '<circle cx="42" cy="27" r="2.3"/><circle cx="47.5" cy="32.5" r="2.3"/>',
  },
  bolt: { // energy and utilities
    fill: '<path d="M38 7L17 37h15l-5 21 22-31H33z"/>',
    ink: '<path d="M36 4L15 34h15l-5 21 22-31H31z"/>',
  },
  house: { // real estate
    fill: '<path d="M34 13l20 16v25H14V29z"/>',
    ink: '<path d="M5 30L32 8l27 22"/><path d="M11 25v26h42V25"/><path d="M26 51V37h12v14"/><path d="M44 16V9h6v12"/>',
  },
  play: { // media and entertainment
    fill: '<rect x="9" y="14" width="48" height="33" rx="7"/>',
    ink: '<rect x="6" y="11" width="48" height="33" rx="7"/><path d="M25 20v16l13-8z"/><path d="M20 55h20M30 44v11"/>',
  },
  car: { // automotive
    fill: '<path d="M10 40l4-12c2-4 5-6 9-6h18c4 0 7 2 9 5l8 8c1 1 2 3 2 5v6H10z"/>',
    ink: '<path d="M13 43H7v-7l4-11c2-4 5-6 9-6h18c4 0 7 2 9 5l7 7c2 1 3 3 3 5v7h-5"/><path d="M26 43h12"/><path d="M13 30h40M30 19v11"/>',
    dots: '<circle cx="19.5" cy="44" r="5"/><circle cx="44.5" cy="44" r="5"/>',
  },
  scales: { // legal and professional services
    fill: '<path d="M4 34h16c0 5-3.5 8-8 8s-8-3-8-8zM44 34h16c0 5-3.5 8-8 8s-8-3-8-8z"/>',
    ink: '<path d="M32 8v44M21 54h22M10 15h44"/><path d="M10 15L4 31M10 15l6 16M54 15l-6 16M54 15l6 16"/><path d="M2 31h16c0 5-3.5 8-8 8s-8-3-8-8zM46 31h16c0 5-3.5 8-8 8s-8-3-8-8z"/>',
    dots: '<circle cx="32" cy="10" r="3"/>',
  },
  badge: { // human resources: an ID badge
    fill: '<rect x="15" y="14" width="36" height="42" rx="6"/>',
    ink: '<rect x="12" y="11" width="36" height="42" rx="6"/><path d="M25 11V6h10v5"/><circle cx="30" cy="27" r="6"/><path d="M20 44c1-6 5-9 10-9s9 3 10 9"/>',
  },
  shield: { // insurance
    fill: '<path d="M34 9l20 7v14c0 13-9 21-20 25-11-4-20-12-20-25V16z"/>',
    ink: '<path d="M32 6l20 7v14c0 13-9 21-20 25-11-4-20-12-20-25V13z"/><path d="M23 30l6 6 12-12"/>',
  },
  chat: { // social commerce: a message with a heart in it
    fill: '<path d="M13 13h40a5 5 0 015 5v24a5 5 0 01-5 5H30l-11 9v-9h-6a5 5 0 01-5-5V18a5 5 0 015-5z"/>',
    ink: '<path d="M10 10h40a5 5 0 015 5v24a5 5 0 01-5 5H27l-11 9v-9h-6a5 5 0 01-5-5V15a5 5 0 015-5z"/><path d="M30 36s-9-5-9-11c0-3 2-5 4.5-5 2 0 3.5 1 4.5 3 1-2 2.5-3 4.5-3 2.5 0 4.5 2 4.5 5 0 6-9 11-9 11z"/>',
  },
  factory: { // manufacturing and B2B
    fill: '<path d="M9 56V30l13 8v-8l13 8v-8l13 8V14h8v42z"/>',
    ink: '<path d="M6 53V27l13 8v-8l13 8v-8l13 8V11h8v42z"/><path d="M3 53h58"/><path d="M13 45h6M25 45h6M37 45h6"/><path d="M49 7c-1.5-2 1.5-3 0-5"/>',
  },
  sprout: { // technology for good
    fill: '<path d="M34 34c0-12 8-20 20-20 0 12-8 20-20 20z"/>',
    ink: '<path d="M32 56V30"/><path d="M32 32c0-12 8-20 20-20 0 12-8 20-20 20z"/><path d="M32 42c0-9-6-15-15-15 0 9 6 15 15 15z"/><path d="M20 56h24"/>',
  },
  book: { // continuous learning
    fill: '<path d="M34 18c-6-4-14-5-22-4v34c8-1 16 0 22 4 6-4 14-5 22-4V14c-8-1-16 0-22 4z"/>',
    ink: '<path d="M32 15c-6-4-14-5-22-4v34c8-1 16 0 22 4 6-4 14-5 22-4V11c-8-1-16 0-22 4z"/><path d="M32 15v34"/><path d="M16 20c4-.5 8 0 11 2M16 27c4-.5 8 0 11 2M37 22c3-2 7-2.5 11-2M37 29c3-2 7-2.5 11-2"/>',
  },
});

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
