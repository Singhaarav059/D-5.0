// The Demaze maze: the brand name as a picture. A seeded maze (recursive backtracker) and its one way through,
// computed at build time so the page ships plain SVG. site.js plays it on a loop: the walls draw in, the pitfalls
// (content.js `journey.pitfalls`) pop into the dead ends, the route is solved from the entrance to the exit and each
// pitfall drops away as the route passes it, the exit lights up, then the walls erase and it starts over. With
// reduced motion or no JS it is the finished drawing.
'use strict';

const C = require('../content');
const { esc, MARK } = require('./helpers');

// A small, fast seeded generator (mulberry32), so the same seed always draws the same maze.
const rng = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Carve a cols x rows maze from the top-left cell and find the way through. `toDead`: the route ends in the
// deepest dead end instead of leaving by the right edge (the 404's "you are here"). Up to seven dead ends off the
// route become pitfalls, each with `at`, how far along the route (0..1) it is passed. Label positions are returned
// as percentages of the drawing, so the HTML labels sit on the SVG at any size.
function carve(cols, rows, seed, u, toDead) {
  const r = rng(seed), N = cols * rows, W = [];
  for (let i = 0; i < N; i++) W.push({ n: 1, e: 1, s: 1, w: 1 });
  const seen = new Uint8Array(N), st = [0];
  seen[0] = 1;
  while (st.length) {
    const c = st[st.length - 1], x = c % cols, y = (c / cols) | 0, nb = [];
    if (y > 0 && !seen[c - cols]) nb.push(['n', c - cols, 's']);
    if (x < cols - 1 && !seen[c + 1]) nb.push(['e', c + 1, 'w']);
    if (y < rows - 1 && !seen[c + cols]) nb.push(['s', c + cols, 'n']);
    if (x > 0 && !seen[c - 1]) nb.push(['w', c - 1, 'e']);
    if (!nb.length) { st.pop(); continue; }
    const [d, n, o] = nb[(r() * nb.length) | 0];
    W[c][d] = 0; W[n][o] = 0; seen[n] = 1; st.push(n);
  }
  const nbrs = (c) => {
    const x = c % cols, y = (c / cols) | 0, o = [];
    if (!W[c].n && y > 0) o.push(c - cols);
    if (!W[c].s && y < rows - 1) o.push(c + cols);
    if (!W[c].e && x < cols - 1) o.push(c + 1);
    if (!W[c].w && x > 0) o.push(c - 1);
    return o;
  };
  const prev = new Int32Array(N).fill(-1), dist = new Int32Array(N).fill(-1), q = [0];
  dist[0] = 0;
  while (q.length) { const c = q.shift(); for (const n of nbrs(c)) if (dist[n] < 0) { dist[n] = dist[c] + 1; prev[n] = c; q.push(n); } }
  const dead = [];
  for (let c = 1; c < N - 1; c++) if (nbrs(c).length === 1) dead.push(c);
  const target = toDead ? dead.reduce((a, b) => (dist[b] > dist[a] ? b : a), dead[0]) : N - 1;
  const path = [];
  for (let c = target; c >= 0; c = prev[c]) path.unshift(c);
  const onPath = new Map(path.map((c, i) => [c, i]));
  W[0].w = 0;
  if (!toDead) W[N - 1].e = 0;
  const cand = dead.filter((c) => !onPath.has(c) && c !== target).map((c) => ({ c, k: r() })).sort((a, b) => a.k - b.k);
  const pits = [];
  for (const { c } of cand) {
    if (pits.length >= 7) break;
    const x = c % cols, y = (c / cols) | 0;
    if (x > cols - 3 && y < 1) continue;
    if (pits.some((p) => Math.abs(p.cx - x) + Math.abs(p.cy - y) < 4)) continue;
    let j = c;
    while (!onPath.has(j)) j = prev[j];
    pits.push({ cx: x, cy: y, x: x * u + u / 2, y: y * u + u / 2, at: onPath.get(j) / (path.length - 1) });
  }
  // walls as short segments, sorted from the top-left corner outward so they draw in as a sweep
  const seg = [];
  for (let c = 0; c < N; c++) {
    const x = c % cols, y = (c / cols) | 0;
    if (W[c].n) seg.push([x, y, x + 1, y]);
    if (W[c].w) seg.push([x, y, x, y + 1]);
    if (x === cols - 1 && W[c].e) seg.push([x + 1, y, x + 1, y + 1]);
    if (y === rows - 1 && W[c].s) seg.push([x, y + 1, x + 1, y + 1]);
  }
  seg.sort((a, b) => Math.hypot(a[0] + a[2], a[1] + a[3]) - Math.hypot(b[0] + b[2], b[1] + b[3]));
  const walls = seg.map((s) => `M${s[0] * u} ${s[1] * u}L${s[2] * u} ${s[3] * u}`).join('');
  const pts = path.map((c) => [(c % cols) * u + u / 2, ((c / cols) | 0) * u + u / 2]);
  let route = `M${-u * 0.9} ${u / 2}` + pts.map((p) => `L${p[0]} ${p[1]}`).join('');
  if (!toDead) route += `L${cols * u + u * 0.9} ${pts[pts.length - 1][1]}`;
  const last = pts[pts.length - 1];
  const vx = -u * 1.6, vy = -u * 0.9, vw = cols * u + u * 3.4, vh = rows * u + u * 1.8;
  const pc = (x, y) => [((x - vx) / vw * 100).toFixed(2) + '%', ((y - vy) / vh * 100).toFixed(2) + '%'];
  const [ex, ey] = pc(toDead ? last[0] : cols * u + u * 0.9, last[1]);
  const [sx, sy] = pc(-u * 0.9, u / 2);
  return { walls, route, pits: pits.map((p) => { const [lx, ly] = pc(p.x, p.y); return { at: p.at, lx, ly }; }), ex, ey, sx, sy, vb: `${vx} ${vy} ${vw} ${vh}` };
}

// The brand's chevron (the logo's arrow), used as the exit flag, the curtain's mark and the footer's.
const chevron = (cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0L10 5L0 10L3 5Z"/></svg>`;

// A maze as the page draws it: the SVG, the start label, the pitfalls and the end marker laid over it in HTML.
// `tone`: 'night' (light walls, the glowing blue route), 'day' (ink on a coloured panel) or 'lost' (the 404: the
// route runs into the deepest dead end, where "You are here" waits).
function maze({ cols, rows, seed, tone = 'night', start = C.journey.start, label = '' }) {
  const lost = tone === 'lost';
  const m = carve(cols, rows, seed, 44, lost);
  const end = lost
    ? '<div class="maze__end maze__end--lost" data-end>You are here ?</div>'
    : `<div class="maze__end" data-end>${chevron('maze__flag')}<span>${esc(C.journey.finish)}</span></div>`;
  const pits = lost ? [] : m.pits;
  return `<div class="maze maze--${tone}" data-maze>
  <svg viewBox="${m.vb}"${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'}>
    <path class="maze__walls" data-walls pathLength="1" d="${m.walls}"/>
    <path class="maze__route" data-route d="${m.route}"/>
    <circle class="maze__head" data-head cx="-40" cy="22" r="9"/>
  </svg>
  ${lost ? '' : `<span class="maze__start" style="left:${m.sx};top:${m.sy}" aria-hidden="true">${esc(start)} ↓</span>`}
  ${pits.map((p, i) => {
    const [, name, color] = C.journey.pitfalls[i % C.journey.pitfalls.length];
    return `<div class="maze__pin" style="left:${p.lx};top:${p.ly}" aria-hidden="true"><div class="maze__pit" data-pit data-at="${p.at.toFixed(4)}"><i style="background:${MARK[color]}"></i><span>${esc(name)}</span></div></div>`;
  }).join('')}
  <div class="maze__pin" style="left:${m.ex};top:${m.ey}" aria-hidden="true">${end}</div>
</div>`;
}

module.exports = { maze, chevron };
