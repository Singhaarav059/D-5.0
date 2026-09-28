// The Demaze maze: the brand name as a picture. A seeded maze (recursive backtracker) and its one way through,
// computed at build time so the page ships plain SVG. It opens the home page and tells "How we work" on every page:
// the route finds its way through, then (journey.js, on scroll) the walls fall away, the route straightens into one
// line, four stops appear on it and a signal walks the stages. With reduced motion or no JS it is the finished drawing.
// Decoration, drawn as doodles (templates/doodles.js): the maze's dead ends hold the pitfalls a product gets lost in
// (content.js `journey.pitfalls`), a highlighter marks the way through, an idea waits at the entrance and a rocket
// at the exit.
'use strict';

const { doodleAt } = require('./doodles');
const { esc } = require('./helpers');

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

// Cells off the route with a single opening: the dead ends a visitor could wander into.
function deadEnds(cols, rows, { right, down, way }) {
  const id = (x, y) => y * cols + x;
  const route = new Set(way.map(([x, y]) => id(x, y)));
  const out = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (route.has(id(x, y))) continue;
      const open = (x < cols - 1 && !right[id(x, y)]) + (x > 0 && !right[id(x - 1, y)]) + (y < rows - 1 && !down[id(x, y)]) + (y > 0 && !down[id(x, y - 1)]);
      if (open === 1) out.push([x, y]);
    }
  }
  return out;
}

// `n` dead ends spread evenly across the maze: one per equal slice of its width, the nearest to the slice's middle,
// never in the column next to one already taken, and only where `label(i, end, taken)` finds room for its label
// (it returns the label's y, or null). Each pick is [x, y, label y].
function spread(ends, cols, n, label) {
  const taken = [];
  for (let i = 0; i < n; i++) {
    const mid = ((i + 0.5) * cols) / n;
    const fits = (e) => { const ly = label(i, e, taken); return ly === null ? [] : [[...e, ly]]; };
    let free = ends.filter((e) => !taken.some(([tx]) => Math.abs(tx - e[0]) < 2)).flatMap(fits);
    // nothing left that far apart: any other free dead end will do
    if (!free.length) free = ends.filter((e) => !taken.some(([tx, ty]) => tx === e[0] && ty === e[1])).flatMap(fits);
    if (!free.length) break;
    taken.push(free.reduce((a, b) => (Math.abs(b[0] - mid) < Math.abs(a[0] - mid) ? b : a)));
  }
  return taken;
}

// (Anything CSS animates is a wrapper <g> without a transform attribute: a CSS transform would replace it.)
// A sticker label: a small tilted tag in the doodle's colour, centred on x, y (width estimated from the text).
// `minX` keeps the whole tag right of that x (the drawing's left edge), so it is never cut off by the page margin.
const tagBox = (text, size) => [text.length * size * 0.56 + size * 1.3, size * 1.75];
const tag = (text, x, y, size, color, tilt, minX = -Infinity) => {
  const [w, h] = tagBox(text, size);
  x = Math.max(x, minX + w / 2);
  return `<g class="maze__tag" style="--dd:var(--${color})" transform="translate(${+x.toFixed(1)} ${+y.toFixed(1)}) rotate(${tilt})"><rect x="${+(-w / 2).toFixed(1)}" y="${+(-h / 2).toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" rx="${+(h / 2).toFixed(1)}"/><text y="${+(size * 0.36).toFixed(1)}" font-size="${size}">${esc(text)}</text></g>`;
};

// The Demaze chevron (the logo's shape), its tip pointing right, centred on cx, cy.
const chevron = (cx, cy, s) => {
  const p = [[0, 0], [1, 0.5], [0, 1], [0.3, 0.5]].map(([x, y]) => `${+(cx + (x - 0.42) * s).toFixed(1)} ${+(cy + (y - 0.5) * s).toFixed(1)}`);
  return `M${p[0]}L${p[1]}L${p[2]}L${p[3]}Z`;
};

// One drawing. `pits`: [doodle, label, colour] for the dead ends (as many as fit); `start`/`finish` label the entrance and exit
// doodles; `tagSize` is the label type size in user units (larger on the narrow maze, which is drawn smaller).
function maze({ cols, rows, seed, entry, exit, cls, pits = [], start = '', finish = '', tagSize = 10 }) {
  const C = 40, W = cols * C, H = rows * C;
  const m = carve(cols, rows, seed, entry, exit);
  const pts = routePoints(m.way, entry, exit, cols, C);
  const vb = [-C, -8, W + C * 2.4, H + 16];
  const mark = [W + C * 0.95, (exit + 0.5) * C]; // the chevron, just past the exit
  // A pitfall's label sits on the side of the maze with more room (under the doodle in the top half, over it below),
  // or on the other side if that is where it stays clear of the labels already placed and of the "Launch" tag under
  // the exit. The margin allows for the stickers' tilt.
  const box = (text, x, y) => ({ x, y, s: tagBox(text, tagSize) });
  const apart = (a, b) => Math.abs(a.x - b.x) > (a.s[0] + b.s[0]) / 2 + 10 || Math.abs(a.y - b.y) > (a.s[1] + b.s[1]) / 2 + 10;
  const fin = finish ? [box(finish, mark[0] + C * 0.05, mark[1] + C * 0.9)] : [];
  const label = (i, [x, y], taken) => {
    const others = [...fin, ...taken.map(([tx, , ty], j) => box(pits[j][1], (tx + 0.5) * C, ty))];
    const side = y < rows / 2 ? 1 : -1;
    for (const k of [side, -side]) {
      const ly = (y + 0.5) * C + k * C * 0.62;
      if (others.every((o) => apart(box(pits[i][1], (x + 0.5) * C, ly), o))) return ly;
    }
    return null;
  };
  const spots = spread(deadEnds(cols, rows, m), cols, pits.length, label);
  const pitfalls = spots.map(([x, y, ty], i) => {
    const [name, label, color] = pits[i];
    const cx = (x + 0.5) * C, cy = (y + 0.5) * C;
    return `<g class="maze__pit" style="--i:${i}"><g class="maze__pit-in">${doodleAt(name, cx, cy, C * 0.8, { color })}${tag(label, cx, ty, tagSize, color, i % 2 ? 4 : -4)}</g></g>`;
  }).join('');
  const [ex, ey] = pts[0];
  return `<svg class="maze ${cls}" viewBox="${vb.join(' ')}" aria-hidden="true" focusable="false">
    <g class="maze__wallset"><path class="maze__walls" d="${wallPath(cols, rows, m, entry, exit, C)}"/></g>
    <g class="maze__pits">${pitfalls}</g>
    <path class="maze__route" d="${toPath(pts)}" pathLength="1"/>
    <g class="maze__start">${doodleAt('bulb', ex + C * 0.35, ey - C * 1.05, C * 0.95, { color: 'sun' })}${start ? tag(start, ex + C * 0.35, ey - C * 1.95, tagSize, 'sun', -5, vb[0] + 4) : ''}</g>
    <g class="maze__markset"><g class="maze__rocket">${doodleAt('rocket', mark[0] + C * 0.05, mark[1] - C * 1.15, C * 1.05, { color: 'tomato' })}</g>${finish ? `<g class="maze__finish">${tag(finish, mark[0] + C * 0.05, mark[1] + C * 0.9, tagSize, 'tomato', 4)}</g>` : ''}<path class="maze__mark" d="${chevron(mark[0], mark[1], C * 0.95)}"/></g>
    <circle class="maze__signal" r="6"><animateMotion dur="7s" repeatCount="indefinite" begin="indefinite" path="${toPath(pts)}"/></circle>
  </svg>`;
}

module.exports = { maze, carve, chevron, tag };
