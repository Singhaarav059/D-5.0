// Sketches of the work itself (a wireframe, a bezier curve, code, a git graph, a chart, sticky notes, a kanban
// board...): technical drawings rather than cartoons, so the page reads like a working notebook. Each is ink on a
// 200 x 160 sheet with one touch of marker colour and a small mono annotation; ink paths carry pathLength="1" so CSS
// can draw them on. The moving background (templates/ambient.js) plays them in the page margins. Decoration only.
'use strict';

const { esc } = require('./helpers');

// fill: the marker colour blob(s); ink: the lines; text: [x, y, label, anchor?] annotations in mono.
const S = {
  wireframe: {
    fill: '<rect x="26" y="49" width="100" height="45" rx="3"/>',
    ink: '<rect x="10" y="20" width="180" height="124" rx="6"/><path d="M10 35H190"/><path d="M122 27.5h12M140 27.5h12M158 27.5h20"/><rect x="22" y="45" width="100" height="45" rx="3"/><path d="M22 45L122 90M122 45L22 90"/><path d="M132 51h46M132 59h36M132 67h42"/><rect x="132" y="76" width="30" height="10" rx="5"/><rect x="22" y="101" width="48" height="31" rx="3"/><rect x="76" y="101" width="48" height="31" rx="3"/><rect x="130" y="101" width="48" height="31" rx="3"/><path d="M10 6v8M190 6v8M10 10H84M116 10H190"/>',
    dots: '<circle cx="20" cy="27.5" r="2"/><circle cx="27" cy="27.5" r="2"/><circle cx="34" cy="27.5" r="2"/>',
    text: [[100, 13, '1200', 'middle'], [134, 128, 'cards ×3']],
  },
  pen: {
    fill: '<circle cx="129" cy="73" r="12"/>',
    ink: '<path d="M20 118C44 40 108 30 126 70S168 128 184 60"/><path d="M108 30L144 110"/><circle cx="108" cy="30" r="3"/><circle cx="144" cy="110" r="3"/><rect x="17" y="115" width="6" height="6"/><rect x="123" y="67" width="6" height="6"/><rect x="181" y="57" width="6" height="6"/><path d="M28 146l10-28 10 28-10 6z"/><path d="M38 118v18"/>',
    dots: '<circle cx="38" cy="138" r="2"/>',
    text: [[20, 16, 'bezier · 3 anchors'], [150, 150, 'pen tool']],
  },
  code: {
    fill: '<rect x="40" y="63" width="84" height="11" rx="2"/>',
    ink: '<rect x="12" y="16" width="176" height="128" rx="6"/><path d="M12 32H188"/><path d="M34 45h26M66 45h40M42 57h58M42 69h22M70 69h48M50 81h38M50 93h56M42 105h30M34 117h10"/><path d="M144 112l-8 8 8 8M168 112l8 8-8 8M160 108l-8 24"/>',
    text: [[24, 27, 'orders.ts'], [22, 48, '1'], [22, 60, '2'], [22, 72, '3'], [22, 84, '4'], [22, 96, '5'], [22, 108, '6'], [22, 120, '7']],
  },
  git: {
    fill: '<circle cx="152" cy="122" r="11"/>',
    ink: '<path d="M16 120H184"/><path d="M70 120C84 120 88 80 102 80H128C142 80 146 120 150 120"/><circle cx="34" cy="120" r="5"/><circle cx="70" cy="120" r="5"/><circle cx="102" cy="80" r="5"/><circle cx="128" cy="80" r="5"/><circle cx="150" cy="120" r="6"/><circle cx="150" cy="120" r="2.5"/><path d="M178 120V92l14 5-14 5"/>',
    text: [[20, 140, 'main'], [92, 66, 'feature/checkout'], [160, 86, 'v2.4']],
  },
  chart: {
    fill: '<rect x="155" y="61" width="18" height="74"/>',
    ink: '<path d="M24 18V132H188"/><path d="M20 52h4M20 92h4"/><rect x="40" y="108" width="18" height="24"/><rect x="68" y="96" width="18" height="36"/><rect x="96" y="100" width="18" height="32"/><rect x="124" y="80" width="18" height="52"/><rect x="152" y="58" width="18" height="74"/><path d="M49 100L77 88 105 92 133 72 161 50"/><path d="M152 48l10 2-4 9"/>',
    text: [[140, 36, '+38% MoM'], [28, 148, 'W1'], [150, 148, 'W5']],
  },
  sticky: {
    fill: '<path d="M26 34l58-6 6 54-58 6z"/>',
    ink: '<path d="M22 30l58-6 6 54-58 6z"/><path d="M34 46l36-4M36 58l28-3M38 70l32-4"/><path d="M100 20l58 4-4 54-58-4z"/><path d="M110 38l34 2M109 50l26 2M108 62l30 2"/><path d="M58 94l58-2 2 54-58 2z"/><path d="M70 110l34-1M70 122l24-1"/><path d="M98 132l6 6 12-14"/>',
    dots: '<circle cx="50" cy="28" r="3"/><circle cx="130" cy="22" r="3"/><circle cx="88" cy="94" r="3"/>',
    text: [[166, 30, 'goals'], [124, 152, 'signed off']],
  },
  kanban: {
    fill: '<rect x="84" y="72" width="42" height="18" rx="3"/>',
    ink: '<rect x="14" y="24" width="54" height="120" rx="4"/><rect x="74" y="24" width="54" height="120" rx="4"/><rect x="134" y="24" width="54" height="120" rx="4"/><rect x="20" y="46" width="42" height="18" rx="3"/><rect x="20" y="70" width="42" height="18" rx="3"/><rect x="20" y="94" width="42" height="18" rx="3"/><rect x="80" y="46" width="42" height="18" rx="3"/><rect x="80" y="70" width="42" height="18" rx="3"/><rect x="140" y="46" width="42" height="18" rx="3"/><path d="M146 55l3 3 6-6"/><path d="M104 96c10 18 36 18 50 2"/><path d="M148 96l7 2-1 7"/>',
    text: [[20, 38, 'To do'], [80, 38, 'Doing'], [140, 38, 'Done']],
  },
  chat: {
    fill: '<path d="M76 84h110a6 6 0 016 6v26a6 6 0 01-6 6h-6l2 12-14-12H76a6 6 0 01-6-6V90a6 6 0 016-6z"/>',
    ink: '<path d="M18 22h110a6 6 0 016 6v34a6 6 0 01-6 6H44l-16 12 2-12h-12a6 6 0 01-6-6V28a6 6 0 016-6z"/><path d="M28 38h80M28 50h58"/><path d="M72 80h110a6 6 0 016 6v26a6 6 0 01-6 6h-6l2 12-14-12H72a6 6 0 01-6-6V86a6 6 0 016-6z"/><path d="M82 96h74M82 106h46"/><rect x="14" y="128" width="42" height="20" rx="10"/>',
    dots: '<circle cx="26" cy="138" r="2.4"/><circle cx="35" cy="138" r="2.4"/><circle cx="44" cy="138" r="2.4"/>',
    text: [[190, 152, 'replied in 2 min', 'end']],
  },
  map: {
    fill: '<path d="M142 26c-9 0-15 7-15 15 0 10 15 25 15 25s15-15 15-25c0-8-6-15-15-15z"/>',
    ink: '<path d="M8 40H192M8 104H192M58 8V152M150 8V152"/><path d="M8 44H192M8 100H192M62 8V152M146 8V152" opacity=".5"/><path d="M22 136H60V72H148V66" stroke-dasharray=".02 .03"/><path d="M140 22c-9 0-15 7-15 15 0 10 15 25 15 25s15-15 15-25c0-8-6-15-15-15z"/><circle cx="140" cy="37" r="5"/><path d="M180 30V14l-5 8M180 14l5 8"/>',
    dots: '<circle cx="22" cy="136" r="3"/>',
    text: [[180, 40, 'N', 'middle'], [70, 118, 'SG Hwy'], [96, 60, '1.2 km']],
  },
  phone: {
    fill: '<circle cx="152" cy="62" r="16"/>',
    ink: '<rect x="16" y="14" width="60" height="120" rx="10"/><path d="M38 22h16"/><path d="M26 40h40M26 50h30M26 60h36"/><rect x="26" y="72" width="40" height="28" rx="4"/><rect x="26" y="110" width="40" height="12" rx="6"/><path d="M84 76H110"/><path d="M104 70l6 6-6 6"/><rect x="120" y="14" width="60" height="120" rx="10"/><path d="M142 22h16"/><circle cx="150" cy="60" r="14"/><path d="M143 60l5 5 9-10"/><path d="M130 88h40M136 98h28"/><circle cx="46" cy="116" r="14" opacity=".5"/>',
    text: [[18, 152, 'tap → next'], [124, 152, 'success']],
  },
  flow: {
    fill: '<rect x="116" y="114" width="74" height="30" rx="6"/>',
    ink: '<rect x="14" y="16" width="68" height="30" rx="6"/><path d="M48 46V60"/><path d="M44 56l4 4 4-4"/><path d="M48 60l20 18-20 18-20-18z"/><path d="M28 78H10V31H14"/><path d="M68 78H112"/><path d="M107 74l5 4-5 4"/><rect x="112" y="64" width="74" height="28" rx="6"/><path d="M149 92V110"/><path d="M145 106l4 4 4-4"/><rect x="112" y="110" width="74" height="30" rx="6"/>',
    text: [[48, 35, 'Brief', 'middle'], [48, 81, 'ok?', 'middle'], [149, 82, 'Build', 'middle'], [149, 129, 'Launch', 'middle'], [90, 72, 'yes', 'middle'], [18, 70, 'no']],
  },
  db: {
    fill: '<circle cx="132" cy="43" r="5"/><circle cx="132" cy="75" r="5"/><circle cx="132" cy="107" r="5"/>',
    ink: '<ellipse cx="58" cy="36" rx="40" ry="12"/><path d="M18 36V112M98 36V112"/><path d="M18 112a40 12 0 0080 0M18 62a40 12 0 0080 0M18 87a40 12 0 0080 0"/><path d="M98 74H118" stroke-dasharray=".05 .05"/><rect x="118" y="30" width="66" height="26" rx="3"/><rect x="118" y="62" width="66" height="26" rx="3"/><rect x="118" y="94" width="66" height="26" rx="3"/><path d="M144 39h32M144 47h24M144 71h32M144 79h24M144 103h32M144 111h24"/><circle cx="130" cy="43" r="3"/><circle cx="130" cy="75" r="3"/><circle cx="130" cy="107" r="3"/>',
    text: [[30, 140, 'postgres'], [120, 140, 'p95 82 ms']],
  },
};

const NAMES = Object.keys(S);

const layers = (name) => {
  const s = S[name];
  if (!s) throw new Error(`unknown sketch ${name}`);
  const ink = s.ink.replace(/<(path|circle|rect|ellipse)\b/g, '<$1 pathLength="1"');
  const text = (s.text || []).map(([x, y, t, a]) => `<text x="${x}" y="${y}"${a ? ` text-anchor="${a}"` : ''}>${esc(t)}</text>`).join('');
  return `<g class="sk__fill">${s.fill || ''}</g><g class="sk__ink">${ink}</g>${s.dots ? `<g class="sk__dots">${s.dots}</g>` : ''}<g class="sk__text">${text}</g>`;
};

// One sketch as a standalone SVG (the moving background plays them, templates/ambient.js).
const sketchSvg = (name) => `<svg class="sk" viewBox="0 0 200 160" aria-hidden="true" focusable="false">${layers(name)}</svg>`;

module.exports = { sketchSvg, NAMES };
