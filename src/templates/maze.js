// The Demaze maze: the brand name as a picture. A seeded maze (recursive backtracker) and its one way through,
// computed at build time so the page ships plain SVG. It opens the home page and tells "How we work" on every page:
// the route finds its way through, then (journey.js, on scroll) the walls fall away, the route straightens into one
// line, four stops appear on it and a signal walks the stages. With reduced motion or no JS it is the finished drawing.
'use strict';

// Carve a perfect maze on a cols x rows grid, then find the route from the entrance (left edge, row `entry`)
// to the exit (right edge, row `exit`). `right`/`down` mark the walls on each cell's right and bottom sides.
function carve(cols, rows, seed, entry, exit) {
  let s = seed >>> 0;
  const rnd = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const id = (x, y) => y * cols + x;
  const inside = ([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows;
  const around = (x, y) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].filter(inside);
  const right = new Uint8Array(cols * rows).fill(1);
  const down = new Uint8Array(cols * rows).fill(1);
  const seen = new Uint8Array(cols * rows);
  const stack = [[0, entry]];
  seen[id(0, entry)] = 1;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const next = around(x, y).filter(([a, b]) => !seen[id(a, b)]);
    if (!next.length) { stack.pop(); continue; }
    const [a, b] = next[Math.floor(rnd() * next.length)];
    if (a !== x) right[id(Math.min(a, x), y)] = 0; else down[id(x, Math.min(b, y))] = 0;
    seen[id(a, b)] = 1;
    stack.push([a, b]);
  }
  const open = (x, y, a, b) => (a !== x ? !right[id(Math.min(a, x), y)] : !down[id(x, Math.min(b, y))]);
  const prev = new Int32Array(cols * rows).fill(-1);
  const queue = [id(0, entry)];
  prev[queue[0]] = queue[0];
  for (let i = 0; i < queue.length; i++) {
    const c = queue[i], x = c % cols, y = (c - x) / cols;
    for (const [a, b] of around(x, y)) {
      if (prev[id(a, b)] === -1 && open(x, y, a, b)) { prev[id(a, b)] = c; queue.push(id(a, b)); }
    }
  }
  const way = [];
  for (let c = id(cols - 1, exit); ; c = prev[c]) { way.unshift([c % cols, Math.floor(c / cols)]); if (prev[c] === c) break; }
  return { right, down, way };
}

// Walls as one path of merged straight runs (outer frame open at the entrance and the exit).
function wallPath(cols, rows, { right, down }, entry, exit, C) {
  const id = (x, y) => y * cols + x;
  const runs = [];
  const line = (x1, y1, x2, y2) => runs.push(`M${x1} ${y1}${y1 === y2 ? `H${x2}` : `V${y2}`}`);
  for (let j = 0; j <= rows; j++) {
    let start = null;
    for (let x = 0; x <= cols; x++) {
      const wall = x < cols && (j === 0 || j === rows || down[id(x, j - 1)]);
      if (wall && start === null) start = x;
      if (!wall && start !== null) { line(start * C, j * C, x * C, j * C); start = null; }
    }
  }
  for (let i = 0; i <= cols; i++) {
    let start = null;
    for (let y = 0; y <= rows; y++) {
      const wall = y < rows && (i === 0 ? y !== entry : i === cols ? y !== exit : right[id(i - 1, y)]);
      if (wall && start === null) start = y;
      if (!wall && start !== null) { line(i * C, start * C, i * C, y * C); start = null; }
    }
  }
  return runs.join('');
}

// The route's corners through cell centres (collinear points dropped), from just outside the entrance to just
// past the exit.
function routePoints(way, entry, exit, cols, C) {
  const pts = [[-C * 0.9, (entry + 0.5) * C], ...way.map(([x, y]) => [(x + 0.5) * C, (y + 0.5) * C]), [(cols + 0.55) * C, (exit + 0.5) * C]];
  return pts.filter((p, i) => {
    if (i === 0 || i === pts.length - 1) return true;
    const [a, b] = [pts[i - 1], pts[i + 1]];
    return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1]));
  });
}
const toPath = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${+x.toFixed(1)} ${+y.toFixed(1)}`).join('');

// The Demaze chevron (the logo's shape), its tip pointing right, centred on cx, cy.
const chevron = (cx, cy, s) => {
  const p = [[0, 0], [1, 0.5], [0, 1], [0.3, 0.5]].map(([x, y]) => `${+(cx + (x - 0.42) * s).toFixed(1)} ${+(cy + (y - 0.5) * s).toFixed(1)}`);
  return `M${p[0]}L${p[1]}L${p[2]}L${p[3]}Z`;
};

// One drawing. `stops` (fractions of the drawing's width) are where the four stages sit once the route is a line;
// they line up with the four step columns under the drawing. journey.js reads `data-geo` to do the straightening.
function maze({ cols, rows, seed, entry, exit, cls, stops = [0.012, 0.262, 0.512, 0.762] }) {
  const C = 40, W = cols * C, H = rows * C;
  const m = carve(cols, rows, seed, entry, exit);
  const pts = routePoints(m.way, entry, exit, cols, C);
  const vb = [-C, -8, W + C * 2.4, H + 16];
  const lineY = H / 2;
  const geo = { pts, y: lineY, stops: stops.map((f) => +(vb[0] + f * vb[2]).toFixed(1)), mark: [W + C * 0.95, (exit + 0.5) * C], C };
  return `<svg class="maze ${cls}" viewBox="${vb.join(' ')}" aria-hidden="true" focusable="false" data-geo='${JSON.stringify(geo)}'>
    <g class="maze__wallset"><path class="maze__walls" d="${wallPath(cols, rows, m, entry, exit, C)}"/></g>
    <path class="maze__route" d="${toPath(pts)}" pathLength="1"/>
    <path class="maze__line" d="M0 0"/>
    <path class="maze__trail" d="M0 0"/>
    <g class="maze__stops">${geo.stops.map((x) => `<circle class="maze__stop" cx="${x}" cy="${lineY}" r="7"/>`).join('')}</g>
    <g class="maze__markset"><path class="maze__mark" d="${chevron(geo.mark[0], geo.mark[1], C * 0.95)}"/></g>
    <circle class="maze__signal" r="6"><animateMotion dur="7s" repeatCount="indefinite" begin="indefinite" path="${toPath(pts)}"/></circle>
    <circle class="maze__traveler" cx="${geo.stops[0]}" cy="${lineY}" r="7"/>
  </svg>`;
}

module.exports = { maze, carve, chevron };
