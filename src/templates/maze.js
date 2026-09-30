// The Demaze maze: the brand name as a picture. A seeded maze (recursive backtracker) and its one way through,
// computed at build time so the page ships plain SVG. site.js plays it on a loop, the way a team finds a route: the
// walls draw in, the pitfalls (content.js `journey.pitfalls`, each with its drawing) sit in dead ends off the route,
// and the route is worked out from the entrance. At each pitfall's turning it tries the dead end, runs into the
// pitfall, rules it out (the pitfall is crossed out, its callout says so, the legend under the maze ticks it off)
// and backs out, leaving a dotted trace; then it carries on, reaches the exit and the chevron lights up. With reduced
// motion or no JS it is the finished drawing: the route, the traces, every pitfall ruled out.
'use strict';

const C = require('../content');
const { esc } = require('./helpers');

// A small, fast seeded generator (mulberry32), so the same seed always draws the same maze.
const rng = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Carve a cols x rows maze from the top-left cell (entered from above) and find the way through to the bottom-right
// cell (left by the right edge). `toDead`: the route ends in the deepest dead end instead (the 404's "you are
// here"). Up to `want` short dead-end branches off the route become pitfalls: each has its turning on the route
// (`s`, how far along the route in user units) and the probe from there into the dead end.
function carve(cols, rows, seed, u, want, toDead) {
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
  W[0].n = 0;
  if (!toDead) W[N - 1].e = 0;
  const ctr = (c) => [(c % cols) * u + u / 2, ((c / cols) | 0) * u + u / 2];

  // pitfalls: dead ends one to four cells off the route, spread out along it and across the maze
  const pits = [];
  if (!toDead) {
    const cand = dead.filter((c) => !onPath.has(c)).map((c) => {
      const branch = [c];
      let j = c;
      while (!onPath.has(prev[j])) { j = prev[j]; branch.unshift(j); }
      return { c, at: onPath.get(prev[j]), branch, k: r() };
    }).filter((p) => p.branch.length <= 4 && p.at > 0).sort((a, b) => a.k - b.k);
    for (const p of cand) {
      if (pits.length >= want) break;
      const x = p.c % cols, y = (p.c / cols) | 0;
      if (pits.some((o) => Math.abs(o.x - x) + Math.abs(o.y - y) < 3 || Math.abs(o.at - p.at) < 2)) continue;
      pits.push({ ...p, x, y });
    }
    pits.sort((a, b) => a.at - b.at);
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

  const pts = path.map(ctr);
  const last = pts[pts.length - 1];
  const exit = [cols * u + u * 0.5, last[1]];
  let route = `M${u / 2} ${-u * 0.85}` + pts.map((p) => `L${p[0]} ${p[1]}`).join('');
  if (!toDead) route += `L${exit[0]} ${exit[1]}`;
  // the route's length up to a cell on it: the lead-in from above, then one cell per step
  const along = (i) => u * 1.35 + i * u;
  const probes = pits.map((p) => {
    const cells = [path[p.at], ...p.branch].map(ctr);
    // stop at the drawing's edge, so the probe runs into the pitfall
    const [a, b] = cells.slice(-2);
    const d = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];
    cells[cells.length - 1] = [b[0] - d[0] * u * 0.3, b[1] - d[1] * u * 0.3];
    return { d: 'M' + cells.map((q) => `${q[0]} ${q[1]}`).join('L'), s: along(p.at), x: ctr(p.c)[0], y: ctr(p.c)[1] };
  });
  return { walls, route, probes, pathLen: path.length, exit, last, vb: [-u * 0.7, -u * 1.45, cols * u + u * 2.75, rows * u + u * 2.1] };
}

// The brand's chevron (the logo's arrow), used as the exit flag, the curtain's mark and the footer's.
const chevron = (cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 10 10" aria-hidden="true"><path d="M0 0L10 5L0 10L3 5Z"/></svg>`;

// A doodle's layers inside the maze's own SVG, as a nested <svg> (placed by x/y, never by a transform attribute, so
// the drawing can be animated about its own centre).
const icon = (name, x, y, size, color) => {
  const { doodle } = require('./doodles');
  return doodle(name, { color, attrs: `x="${+(x - size / 2).toFixed(1)}" y="${+(y - size / 2).toFixed(1)}" width="${size}" height="${size}"` });
};

// A maze as the page draws it. `tone`: 'night' (light walls, the blue route), 'day' (ink walls on a coloured panel,
// the same blue route) or 'lost' (the 404: the route runs into the deepest dead end, where "You are here" waits).
// `pits`: how many pitfalls it holds (and lists in the legend under it); `wait`: it starts when told (site.js, 'maze:go').
function maze({ cols, rows, seed, tone = 'night', pits: want = 6, wait = false, start = C.journey.start, label = '' }) {
  const lost = tone === 'lost';
  const u = 44;
  const m = carve(cols, rows, seed, u, lost ? 0 : want, lost);
  const [vx, vy, vw, vh] = m.vb;
  const pc = (x, y) => `left:${((x - vx) / vw * 100).toFixed(2)}%;top:${((y - vy) / vh * 100).toFixed(2)}%`;
  const list = m.probes.map((p, i) => ({ ...p, pf: C.journey.pitfalls[i % C.journey.pitfalls.length] }));
  const k = u * 0.08; // chevron: 10 units wide, set with its notch on the route's end
  const [ex, ey] = m.exit;
  return `<div class="maze maze--${tone}" data-maze${wait ? ' data-maze-wait' : ''}>
  <div class="maze__board">
    <svg viewBox="${m.vb.join(' ')}"${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'}>
      <path class="maze__walls" data-walls pathLength="1" d="${m.walls}"/>
      ${list.map((p) => `<path class="maze__trace" data-trace d="${p.d}"/>`).join('')}
      <path class="maze__route" data-route d="${m.route}"/>
      ${list.map((p) => `<path class="maze__probe" data-probe data-s="${p.s}" d="${p.d}"/>`).join('')}
      ${list.map((p, i) => `<g class="maze__pit is-out" data-pit="${i}">${icon(p.pf[0], p.x, p.y, u * 0.66, p.pf[2])}<path class="maze__x" d="M${p.x + u * 0.12} ${p.y - u * 0.36}l${u * 0.22} ${u * 0.22}m0 ${-u * 0.22}l${-u * 0.22} ${u * 0.22}"/></g>`).join('')}
      <circle class="maze__origin" data-origin cx="${u / 2}" cy="${-u * 0.85}" r="${u * 0.1}"/>
      ${lost ? '' : `<text class="maze__start" x="${u * 0.9}" y="${-u * 0.42}">${esc(start)}</text>`}
      ${lost ? '' : `<g class="maze__exit" data-end><svg x="${ex - 3 * k}" y="${ey - 5 * k}" width="${10 * k}" height="${10 * k}" viewBox="0 0 10 10"><path d="M0 0L10 5L0 10L3 5Z"/></svg><text x="${cols * u + u * 0.22}" y="${ey + u * 0.95}">${esc(C.journey.finish)}</text></g>`}
      <circle class="maze__head" data-head cx="${u / 2}" cy="${-u * 0.85}" r="${u * 0.17}"/>
    </svg>
    ${list.map((p, i) => `<span class="maze__call" data-call="${i}" data-tx="${p.x < cols * u * 0.3 ? '-16px' : p.x > cols * u * 0.7 ? 'calc(-100% + 16px)' : '-50%'}" style="${pc(p.x, p.y - u * 0.42)};--tx:${p.x < cols * u * 0.3 ? '-16px' : p.x > cols * u * 0.7 ? 'calc(-100% + 16px)' : '-50%'}" aria-hidden="true">${esc(p.pf[1])}<em>ruled out</em></span>`).join('')}
    ${lost ? `<div class="maze__pin" style="${pc(m.last[0], m.last[1])}" aria-hidden="true"><div class="maze__end maze__end--lost" data-end>You are here ?</div></div>` : ''}
  </div>
  ${list.length ? `<div class="maze__legend">
    <span class="maze__status" data-maze-status aria-hidden="true"><b data-maze-n>${list.length}</b> of ${list.length} ruled out</span>
    <ul aria-label="Pitfalls ruled out on the way" style="--cols:${list.length % 3 ? 2 : 3}">${list.map((p, i) => `<li class="is-out" data-leg="${i}">${require('./doodles').doodle(p.pf[0], { color: p.pf[2] })}${esc(p.pf[1])}</li>`).join('')}</ul>
  </div>` : ''}
</div>`;
}

module.exports = { maze, chevron, carve };
