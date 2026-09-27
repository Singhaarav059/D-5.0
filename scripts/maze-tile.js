// Draws the site's background paper: a maze carved on a torus, so the tile repeats seamlessly in both directions.
// Run once when the tile should change: `node scripts/maze-tile.js` writes public/assets/img/maze-tile.svg.
// (site.css lays it over the paper at a whisper; the hero and "How we work" draw the maze that gets solved.)
'use strict';

const fs = require('fs');
const path = require('path');

const N = 20; // cells per side
const C = 40; // cell size in px
const T = N * C;
let s = 20260927;
const rnd = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;

// Recursive backtracker on a torus: every cell has four neighbours, wrapping at the edges.
const id = (x, y) => ((y + N) % N) * N + ((x + N) % N);
const right = new Uint8Array(N * N).fill(1); // wall between (x, y) and (x + 1, y)
const down = new Uint8Array(N * N).fill(1); // wall between (x, y) and (x, y + 1)
const seen = new Uint8Array(N * N);
const stack = [[0, 0]];
seen[0] = 1;
while (stack.length) {
  const [x, y] = stack[stack.length - 1];
  const next = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => !seen[id(a, b)]);
  if (!next.length) { stack.pop(); continue; }
  const [a, b] = next[Math.floor(rnd() * next.length)];
  if (a !== x) right[id(a > x ? x : a, y)] = 0; else down[id(x, b > y ? y : b)] = 0;
  const cell = [(a + N) % N, (b + N) % N];
  seen[id(...cell)] = 1;
  stack.push(cell);
}

// Walls as merged straight runs, drawn as rows of fine dots (a maze pencilled on dotted paper, so it never reads as a
// layout hairline). A cell's right wall is drawn at the next cell's left edge, so the wall on the tile's right edge
// lands on its left edge instead; every line is set 1px in so its dots sit fully inside the tile.
const runs = [];
for (let x = 0; x < N; x++) { // vertical walls on the line x (the left side of column x)
  let start = null;
  for (let y = 0; y <= N; y++) {
    const wall = y < N && right[id(x - 1, y)];
    if (wall && start === null) start = y;
    if (!wall && start !== null) { runs.push(`M${x * C + 1} ${start * C + 1}V${y * C + 1}`); start = null; }
  }
}
for (let y = 0; y < N; y++) { // horizontal walls on the line y (the top side of row y)
  let start = null;
  for (let x = 0; x <= N; x++) {
    const wall = x < N && down[id(x, y - 1)];
    if (wall && start === null) start = x;
    if (!wall && start !== null) { runs.push(`M${start * C + 1} ${y * C + 1}H${x * C + 1}`); start = null; }
  }
}

// Ink dots for the paper, and light dots for the dark and blue sheets.
const tile = (color, opacity) => `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}" viewBox="0 0 ${T} ${T}"><path d="${runs.join('')}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.7" stroke-linecap="round" stroke-dasharray="0 8"/></svg>\n`;
for (const [name, svg] of [['maze-tile.svg', tile('#151514', 0.2)], ['maze-tile-light.svg', tile('#f4f1ea', 0.12)]]) {
  const out = path.join(__dirname, '..', 'public', 'assets', 'img', name);
  fs.writeFileSync(out, svg);
  console.log(`wrote ${path.relative(process.cwd(), out)} (${(svg.length / 1024).toFixed(1)} KB, ${T}px tile)`);
}
