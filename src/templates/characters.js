// The Demaze crew: soft plush characters who live in the moving background (templates/ambient.js), each holding
// something from the work. One shape for everyone (a rounded plush body with a face window, two dot eyes and a small
// smile), told apart by body colour, skin tone, hair and what they carry and do. Drawn in SVG with soft shading and a
// fuzzy edge, so they animate in CSS (site.css, "the crew"): they breathe and blink, and each has an action (wave,
// type, sip, a glowing idea, a rocket, a glass orb with the Demaze chevron). Decoration only: aria-hidden.
'use strict';

// Each character: body colour, skin, hair [style, colour], extras, prop, action.
// Hair styles: bun, long, ponytail, curly, bob, short, fringe, cropped. Extras: glasses, beard, cap, bow.
const CREW = [
  { body: '#ece2d0', skin: '#f6d9c6', hair: ['bun', '#3a2a22'], prop: 'orb', act: 'hold' },
  { body: '#cfdac5', skin: '#dcae8a', hair: ['short', '#231c19'], extra: ['glasses'], prop: 'laptop', act: 'type' },
  { body: '#dcd2ee', skin: '#8d5b3e', hair: ['long', '#1d1715'], prop: 'note', act: 'wave' },
  { body: '#8a837d', skin: '#e2b996', hair: ['cropped', '#4a3526'], extra: ['beard'], prop: 'mug', act: 'sip' },
  { body: '#cde0ef', skin: '#c99471', hair: ['ponytail', '#5b3a26'], prop: 'bulb', act: 'idea' },
  { body: '#f2d5c3', skin: '#6f452e', hair: ['short', '#161211'], extra: ['glasses'], prop: 'rocket', act: 'lift' },
  { body: '#f0e3b4', skin: '#f1cdb2', hair: ['curly', '#8a5a34'], prop: 'phone', act: 'hold' },
  { body: '#d9d0ea', skin: '#f3d6c2', hair: ['fringe', '#b58a57'], extra: ['glasses'], prop: 'orb', act: 'hold' },
  { body: '#cddbc9', skin: '#b67a55', hair: ['bob', '#2a1f1b'], extra: ['glasses'], prop: 'laptop', act: 'type' },
  { body: '#cfdfee', skin: '#5b3826', hair: ['cropped', '#141110'], extra: ['beard'], prop: 'note', act: 'wave' },
];

// shade a #rrggbb colour toward black (k < 0) or white (k > 0)
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
  const t = k < 0 ? 0 : 255, a = Math.abs(k);
  return '#' + c.map((v) => Math.round(v + (t - v) * a).toString(16).padStart(2, '0')).join('');
};

// The plush body: one piece from the top of the hood to the round bottom, a little narrower at the top.
const BODY = 'M60 10C86 10 99 30 99 58V110C99 132 83 143 60 143S21 132 21 110V58C21 30 34 10 60 10Z';
// the face window
const FACE = { x: 34, y: 34, w: 52, h: 40, r: 20 };

const hair = ([style, c]) => {
  const top = FACE.y, l = FACE.x, r = FACE.x + FACE.w;
  switch (style) {
    case 'bun': return `<circle cx="60" cy="17" r="9" fill="${c}"/><path d="M${l + 2} ${top + 12}C${l + 6} ${top - 1} ${r - 6} ${top - 1} ${r - 2} ${top + 12}C${r - 12} ${top + 6} ${l + 12} ${top + 6} ${l + 2} ${top + 12}Z" fill="${c}"/>`;
    case 'long': return `<path d="M${l + 1} ${top + 30}C${l - 1} ${top + 6} ${l + 10} ${top - 1} 60 ${top - 1}S${r + 1} ${top + 6} ${r - 1} ${top + 30}L${r - 7} ${top + 29}C${r - 8} ${top + 16} ${r - 14} ${top + 9} 60 ${top + 9}S${l + 8} ${top + 16} ${l + 7} ${top + 29}Z" fill="${c}"/><path d="M${l + 1} ${top + 28}c-2 10 0 22 4 30l6-2c-3-9-4-18-3-28zM${r - 1} ${top + 28}c2 10 0 22-4 30l-6-2c3-9 4-18 3-28z" fill="${c}"/>`;
    case 'ponytail': return `<path d="M${l + 2} ${top + 14}C${l + 4} ${top} ${r - 4} ${top} ${r - 2} ${top + 14}C${r - 12} ${top + 5} ${l + 16} ${top + 3} ${l + 2} ${top + 14}Z" fill="${c}"/><path d="M${r - 4} ${top + 2}c10-4 18 4 16 16-1 8-6 12-9 18 0-8-2-14-7-18z" fill="${c}"/>`;
    case 'curly': return [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${l + 5 + i * 8.4}" cy="${top + 4 + (i % 2) * 3}" r="6.4" fill="${c}"/>`).join('');
    case 'bob': return `<path d="M${l} ${top + 26}C${l - 2} ${top + 4} ${l + 10} ${top - 2} 60 ${top - 2}S${r + 2} ${top + 4} ${r} ${top + 26}L${r - 5} ${top + 26}C${r - 5} ${top + 14} ${r - 12} ${top + 11} ${r - 18} ${top + 9}C${r - 30} ${top + 15} ${l + 12} ${top + 13} ${l + 5} ${top + 26}Z" fill="${c}"/>`;
    case 'fringe': return `<path d="M${l + 2} ${top + 13}C${l + 3} ${top} ${r - 3} ${top} ${r - 2} ${top + 13}C${r - 10} ${top + 9} ${r - 18} ${top + 4} ${l + 20} ${top + 9}C${l + 14} ${top + 12} ${l + 8} ${top + 12} ${l + 2} ${top + 13}Z" fill="${c}"/>`;
    case 'short': return `<path d="M${l + 3} ${top + 10}C${l + 6} ${top - 1} ${r - 6} ${top - 1} ${r - 3} ${top + 10}C${r - 14} ${top + 5} ${l + 14} ${top + 5} ${l + 3} ${top + 10}Z" fill="${c}"/>`;
    case 'cropped': return `<path d="M${l + 5} ${top + 7}C${l + 10} ${top} ${r - 10} ${top} ${r - 5} ${top + 7}C${r - 16} ${top + 4} ${l + 16} ${top + 4} ${l + 5} ${top + 7}Z" fill="${c}"/>`;
    default: return '';
  }
};

const extras = (list = [], hairColour) => list.map((e) => {
  if (e === 'glasses') return '<g class="crew__glasses" fill="none" stroke="#1f1b19" stroke-width="1.6"><circle cx="49" cy="53" r="6.2"/><circle cx="71" cy="53" r="6.2"/><path d="M55.2 53h9.6"/></g>';
  // a short beard along the jaw, below the smile
  if (e === 'beard') return `<path d="M${FACE.x + 5} ${FACE.y + 25}C${FACE.x + 9} ${FACE.y + 41} ${FACE.x + FACE.w - 9} ${FACE.y + 41} ${FACE.x + FACE.w - 5} ${FACE.y + 25}C${FACE.x + FACE.w - 9} ${FACE.y + 33} 68 ${FACE.y + 35} 60 ${FACE.y + 35}S${FACE.x + 9} ${FACE.y + 33} ${FACE.x + 5} ${FACE.y + 25}Z" fill="${hairColour}" opacity=".92"/>`;
  if (e === 'cap') return '<path d="M30 30C34 12 86 12 90 30C80 26 40 26 30 30Z" fill="#3d5afe"/><path d="M52 29c10-3 26-3 40 4-12 1-26 0-40-4z" fill="#2b42e6"/><circle cx="60" cy="15" r="2.4" fill="#2b42e6"/>';
  if (e === 'bow') return '<path d="M74 14l10-6v12zM74 14l-8-6v12z" fill="#ff85b8"/><circle cx="74" cy="14" r="2.5" fill="#e0569a"/>';
  return '';
}).join('');

// What they carry, centred at the chest (60, 100).
const PROPS = {
  orb: (id) => `<g class="crew__prop crew__orb"><circle cx="60" cy="100" r="17" fill="url(#${id}-orb)"/><circle cx="60" cy="100" r="17" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="1"/><path d="M55 93L67 100 55 107 58.6 100Z" fill="#3d5afe"/><ellipse cx="53" cy="92" rx="5" ry="3" fill="#fff" opacity=".75" transform="rotate(-30 53 92)"/></g>`,
  laptop: () => '<g class="crew__prop"><path d="M40 88h40l-3 22H43z" fill="#26272c"/><path d="M42 90h36l-2.6 18H44.6z" fill="#3d5afe" opacity=".9"/><path d="M36 110h48l-3 5H39z" fill="#b9bcc6"/><circle cx="60" cy="99" r="3" fill="#fff" opacity=".85"/></g>',
  note: () => '<g class="crew__prop"><path d="M47 88l24-3 3 24-24 3z" fill="#ffcb45"/><path d="M52 95l14-2M53 101l11-1.5" stroke="#8a6a12" stroke-width="1.6" stroke-linecap="round"/></g>',
  mug: () => '<g class="crew__prop crew__mug"><path d="M50 90h20l-2 20H52z" fill="#ff6242"/><path d="M70 94h3a5 5 0 010 10h-4" fill="none" stroke="#ff6242" stroke-width="3"/><path class="crew__steam" d="M56 84c-2-3 2-5 0-8M63 84c-2-3 2-5 0-8" fill="none" stroke="#a8a49a" stroke-width="1.6" stroke-linecap="round"/></g>',
  bulb: () => '<g class="crew__prop crew__bulb"><circle class="crew__glow" cx="60" cy="96" r="20" fill="#ffcb45" opacity=".35"/><path d="M60 82c-8 0-13 6-13 13 0 6 4 8 6 13h14c2-5 6-7 6-13 0-7-5-13-13-13z" fill="#ffe08a" stroke="#c99a16" stroke-width="1.2"/><rect x="54" y="108" width="12" height="6" rx="2" fill="#a8a49a"/></g>',
  rocket: () => '<g class="crew__prop crew__rocket"><path d="M60 80c7 6 9 16 8 26H52c-1-10 1-20 8-26z" fill="#fff" stroke="#1f1b19" stroke-width="1.2"/><circle cx="60" cy="92" r="3.6" fill="#62c1ff" stroke="#1f1b19" stroke-width="1"/><path d="M52 98l-6 8 6 1zM68 98l6 8-6 1z" fill="#ff6242"/><path class="crew__flame" d="M55 106c1 6 3 9 5 11 2-2 4-5 5-11z" fill="#ffcb45"/></g>',
  phone: () => '<g class="crew__prop"><rect x="50" y="84" width="20" height="32" rx="4" fill="#1f1b19"/><rect x="52" y="87" width="16" height="26" rx="2" fill="#2fd0a0"/><path d="M55 95h10M55 100h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g>',
  none: () => '',
};

// Arms: from the shoulders to the hands at the prop, in the body colour with a darker edge. The action decides where the
// right arm goes (a raised arm waves; a lifted one holds something up).
const arm = (d, fill, cls = '') => `<g class="crew__arm${cls}"><path d="${d}" fill="none" stroke="${shade(fill, -0.1)}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${shade(fill, 0.08)}" stroke-width="12.5" stroke-linecap="round"/></g>`;
const ARMS = {
  hold: ['M29 80Q30 100 47 102', 'M91 80Q90 100 73 102'],
  type: ['M29 80Q30 100 47 100', 'M91 80Q90 100 73 100'],
  wave: ['M29 80Q30 100 47 102', 'M92 76Q108 62 104 42'],
  sip: ['M29 80Q30 100 47 102', 'M91 80Q92 100 72 102'],
  idea: ['M29 80Q30 100 47 102', 'M91 80Q90 100 73 102'],
  lift: ['M29 80Q28 96 46 100', 'M91 80Q92 96 74 100'],
};

let n = 0;
const character = (c) => {
  const id = `crew${n++}`;
  const [left, right] = ARMS[c.act] || ARMS.hold;
  const wave = c.act === 'wave';
  return `<svg class="crew crew--${c.act}" viewBox="0 0 120 150" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id}-body" cx="0.36" cy="0.22" r="0.95"><stop offset="0" stop-color="${shade(c.body, 0.35)}"/><stop offset="0.55" stop-color="${c.body}"/><stop offset="1" stop-color="${shade(c.body, -0.22)}"/></radialGradient>
    <radialGradient id="${id}-face" cx="0.45" cy="0.35" r="0.8"><stop offset="0" stop-color="${shade(c.skin, 0.12)}"/><stop offset="1" stop-color="${shade(c.skin, -0.1)}"/></radialGradient>
    <radialGradient id="${id}-orb" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="#dcd6ff"/><stop offset="0.7" stop-color="#9fd3ff"/><stop offset="1" stop-color="#f3a8d2"/></radialGradient>
  </defs>
  <ellipse class="crew__shadow" cx="60" cy="146" rx="30" ry="4"/>
  <g class="crew__body">
    <ellipse cx="46" cy="140" rx="10" ry="7" fill="${shade(c.body, -0.18)}"/><ellipse cx="74" cy="140" rx="10" ry="7" fill="${shade(c.body, -0.18)}"/>
    <g class="crew__fur"><path d="${BODY}" fill="url(#${id}-body)"/></g>
    <rect x="${FACE.x - 2}" y="${FACE.y - 1}" width="${FACE.w + 4}" height="${FACE.h + 3}" rx="${FACE.r + 2}" fill="${shade(c.body, -0.2)}" opacity=".45"/>
    <rect x="${FACE.x}" y="${FACE.y}" width="${FACE.w}" height="${FACE.h}" rx="${FACE.r}" fill="url(#${id}-face)"/>
    ${hair(c.hair)}${extras(c.extra, c.hair[1])}
    <ellipse cx="44" cy="61" rx="4.5" ry="2.6" fill="#ff85b8" opacity=".35"/><ellipse cx="76" cy="61" rx="4.5" ry="2.6" fill="#ff85b8" opacity=".35"/>
    <g class="crew__eyes"><circle cx="49" cy="53" r="3.1" fill="#1f1b19"/><circle cx="71" cy="53" r="3.1" fill="#1f1b19"/><circle cx="50" cy="52" r=".9" fill="#fff"/><circle cx="72" cy="52" r=".9" fill="#fff"/></g>
    <path d="M55.5 62Q60 66 64.5 62" fill="none" stroke="#1f1b19" stroke-width="1.8" stroke-linecap="round"/>
    ${PROPS[c.prop || 'none'](id)}
    ${arm(left, c.body)}${arm(right, c.body, wave ? ' crew__arm--wave' : c.act === 'sip' ? ' crew__arm--sip' : '')}
  </g>
</svg>`;
};

const crew = () => { n = 0; return CREW.map(character); };

module.exports = { crew, CREW };
