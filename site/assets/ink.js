// "How we work" on paper: a small ink character walks through the four stages as the section scrolls by.
//   01 Discover & Define   — plants a seed; a sprout curls up out of the ground
//   02 Design & Prototype  — a dashed blueprint of a tower sketches itself
//   03 Build & Integrate   — blocks drop in and stack into that tower
//   04 Launch & Scale      — it lifts a spark (the one colour in the scene); rings spread across the sky
// Scroll drives the story (the walk cycle follows the distance walked, like a flipbook); a light rAF loop
// adds breathing and the spark's flicker while the section is on screen. Reduced motion shows the finale.
(() => {
  const root = document.querySelector('[data-ink]');
  if (!root) return;
  const canvas = root.querySelector('[data-ink-canvas]');
  const track = root.querySelector('.ink__track');
  const steps = [...root.querySelectorAll('[data-ink-step]')];
  const ctx = canvas.getContext('2d');
  const animated = document.documentElement.classList.contains('motion') && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.toggle('is-scroll', animated);

  const INK = '#15161c', PAPER = '#efe9dc', BLUE = '#3d5afe';
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const jit = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s) - 0.5; }; // seeded, so lines never flicker

  let W = 0, H = 0, WW = 0, u = 1, G = 0, X = [];
  const resize = () => {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Narrow screens: size the drawing by height and lay the stations out on a wider world that the
    // camera pans across (following the character). The static finale still fits everything on screen.
    u = animated ? Math.max(0.62, Math.min(1.7, H / 270)) : Math.max(0.62, Math.min(1.7, H / 270, W / 820));
    WW = animated ? Math.max(W, 780 * u) : W;
    G = H * 0.84;
    X = [0.14, 0.38, 0.62, 0.86].map((f) => f * WW);
  };

  // ---------- drawing helpers: slightly unsteady lines read as hand-inked ----------
  const ground = (x) => G + Math.sin(x * 0.011) * 2.2 + Math.sin(x * 0.037 + 1) * 0.9;
  const stroke = (pts, w, alpha = 1, seed = 0) => {
    ctx.globalAlpha = alpha; ctx.lineWidth = w; ctx.strokeStyle = INK; ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach(([x, y], i) => { const px = x + jit(seed + i * 1.7) * 0.9, py = y + jit(seed + i * 2.3) * 0.9; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    ctx.stroke(); ctx.globalAlpha = 1;
  };
  const curve = (f, n = 24) => Array.from({ length: n + 1 }, (_, i) => f(i / n));

  function landscape() {
    // far hills, then the ground line with hatching underneath
    stroke(curve((t) => [t * WW * 0.7, G - 46 * u - Math.sin(t * 5.2) * 18 * u], 40), 1.1, 0.28, 3);
    stroke(curve((t) => [WW * 0.35 + t * WW * 0.65, G - 30 * u - Math.sin(t * 4.1 + 2) * 14 * u], 40), 1.1, 0.28, 9);
    stroke(curve((t) => [t * WW, ground(t * WW)], 80), 2.4 * u, 0.95, 21);
    for (let x = 18; x < WW; x += 38 * u) {
      const y = ground(x) + 7 * u;
      stroke([[x, y], [x - 7 * u, y + 5 * u]], 1, 0.35, x);
    }
  }

  function character(x, walkDist, walking, armUp, breath) {
    const y = ground(x);
    const ph = walkDist * 0.11;
    const bob = walking ? Math.abs(Math.sin(ph)) * 2.4 * u : breath * 1.2 * u;
    const lean = walking ? 0.07 : 0;
    // shadow
    ctx.globalAlpha = 0.13; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(x + 2 * u, y + 1.5 * u, 15 * u, 3 * u, 0, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    // legs
    const legs = [[-4, 0], [5, Math.PI]].map(([dx, off]) => {
      const s = walking ? Math.sin(ph + off) : 0;
      return [[x + dx * u, y - 9 * u - bob], [x + dx * u + s * 6 * u, y - Math.max(0, Math.cos(ph + off)) * (walking ? 3 * u : 0)]];
    });
    legs.forEach((l, i) => stroke(l, 2.6 * u, 1, 40 + i));
    ctx.save();
    ctx.translate(x, y - 9 * u - bob); ctx.rotate(lean);
    // body: an ink drop, tip up
    ctx.fillStyle = INK; ctx.beginPath();
    ctx.moveTo(0, -42 * u);
    ctx.bezierCurveTo(5 * u, -32 * u, 17 * u, -24 * u, 17 * u, -12 * u);
    ctx.arc(0, -12 * u, 17 * u, 0, Math.PI);
    ctx.bezierCurveTo(-17 * u, -24 * u, -5 * u, -32 * u, 0, -42 * u);
    ctx.fill();
    // eyes, looking the way it walks
    ctx.fillStyle = PAPER;
    [[3, -17], [11, -17]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.ellipse(ex * u, ey * u, 3.6 * u, 4.2 * u, 0, 0, 6.283); ctx.fill(); });
    ctx.fillStyle = INK;
    [[4.4, -16.4], [12.4, -16.4]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.arc(ex * u, ey * u, 1.8 * u, 0, 6.283); ctx.fill(); });
    ctx.restore();
    // arms (drawn in scene space so the raised one can reach the stem)
    const by = y - 9 * u - bob;
    const swing = walking ? Math.sin(ph) * 5 * u : breath * 1.5 * u;
    stroke([[x - 15 * u, by - 12 * u], [x - 20 * u - swing, by + 2 * u]], 2.4 * u, 1, 60);
    if (armUp) stroke([[x + 15 * u, by - 14 * u], [x + 22 * u, by - 34 * u], [x + 25 * u, by - 50 * u]], 2.4 * u, 1, 61);
    else stroke([[x + 15 * u, by - 12 * u], [x + 20 * u + swing, by + 2 * u]], 2.4 * u, 1, 62);
  }

  // 01: seed falls, then a sprout grows and curls
  function sprout(x, g) {
    const y = ground(x);
    if (g <= 0) return;
    const fall = clamp01(g / 0.28);
    if (fall < 1) { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, lerp(y - 34 * u, y - 2 * u, easeIO(fall)), 2.8 * u, 0, 6.283); ctx.fill(); return; }
    const grow = easeOut(clamp01((g - 0.28) / 0.72));
    const h = 78 * u * grow;
    const stem = curve((t) => [x + Math.sin(t * 3) * 5 * u * t, y - h * t], 18);
    stroke(stem, 3 * u, 1, 70);
    [[0.42, -1], [0.66, 1], [0.84, -1]].forEach(([at, side], i) => {
      const k = clamp01((grow - at + 0.2) / 0.3);
      if (!k) return;
      const [sx, sy] = stem[Math.round(at * 18)];
      ctx.fillStyle = INK; ctx.beginPath();
      ctx.ellipse(sx + side * 7 * u * k, sy - 2 * u, 8 * u * k, 3.4 * u * k, side * -0.5, 0, 6.283); ctx.fill();
    });
    if (grow > 0.8) { // the curl at the top
      const k = (grow - 0.8) / 0.2, [tx, ty] = stem[18];
      stroke(curve((t) => [tx + Math.cos(t * 4.4 * k - 1.6) * (1 - t * 0.6) * 10 * u + 9 * u, ty + Math.sin(t * 4.4 * k - 1.6) * (1 - t * 0.6) * 10 * u], 20), 2.4 * u, 1, 77);
    }
  }

  // 02: a dashed blueprint traced by length
  function blueprint(x, g) {
    if (g <= 0) return;
    const y = ground(x), w = 64 * u, h = 84 * u, roof = 34 * u;
    const L = x - w / 2, R = x + w / 2, T = y - h;
    const path = [[L, y], [L, T], [x, T - roof], [R, T], [R, y], [L, y], null, [L + 14 * u, T + 18 * u], [L + 28 * u, T + 18 * u], [L + 28 * u, T + 34 * u], [L + 14 * u, T + 34 * u], [L + 14 * u, T + 18 * u], null, [R - 26 * u, y], [R - 26 * u, y - 30 * u], [R - 12 * u, y - 30 * u], [R - 12 * u, y]];
    let total = 0;
    for (let i = 1; i < path.length; i++) if (path[i] && path[i - 1]) total += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    let left = total * easeIO(g);
    ctx.setLineDash([5 * u, 4 * u]); ctx.lineWidth = 1.5 * u; ctx.strokeStyle = INK; ctx.globalAlpha = 0.75; ctx.lineCap = 'butt';
    ctx.beginPath();
    for (let i = 0; i < path.length && left > 0; i++) {
      const p = path[i], q = path[i - 1];
      if (!p) continue;
      if (!q) { ctx.moveTo(p[0], p[1]); continue; }
      const d = Math.hypot(p[0] - q[0], p[1] - q[1]), k = Math.min(1, left / d);
      ctx.lineTo(lerp(q[0], p[0], k), lerp(q[1], p[1], k));
      left -= d;
    }
    ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    if (g > 0.85) { // dimension ticks
      const a = (g - 0.85) / 0.15;
      stroke([[R + 12 * u, y], [R + 12 * u, T - roof]], 1, 0.5 * a, 90);
      stroke([[R + 8 * u, y], [R + 16 * u, y]], 1, 0.5 * a, 91);
      stroke([[R + 8 * u, T - roof], [R + 16 * u, T - roof]], 1, 0.5 * a, 92);
    }
  }

  // 03: blocks drop in and stack (a little settle on landing)
  function build(x, g) {
    if (g <= 0) return;
    const y = ground(x);
    const blocks = [70, 62, 54, 46, 38].map((w) => w * u), bh = 17 * u;
    blocks.forEach((w, i) => {
      const k = clamp01((g - i * 0.16) / 0.2);
      if (!k) return;
      const land = y - bh * (i + 1);
      const drop = (1 - easeOut(k)) * 60 * u;
      const settle = k > 0.8 ? Math.sin((k - 0.8) / 0.2 * Math.PI) * 1.5 * u : 0;
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.roundRect(x - w / 2 + jit(i) * 2, land - drop + settle, w, bh - 1.5 * u, 3 * u); ctx.fill();
    });
    if (g > 0.95) { // windows appear once it stands
      ctx.fillStyle = PAPER;
      [[-14, 3], [8, 3], [-3, 2]].forEach(([dx, row]) => { ctx.beginPath(); ctx.roundRect(x + dx * u, y - bh * row - 11 * u, 6 * u, 7 * u, 1.5 * u); ctx.fill(); });
    }
  }

  // 04: a stem rises, the spark lights at its tip, then lifts off while rings spread
  function launch(x, g, time) {
    if (g <= 0) return;
    const y = ground(x);
    const sx = x - 33 * u; // right at the raised hand (the character stands 60u left of the station)
    const rise = easeOut(clamp01(g / 0.35));
    const top = y - 112 * u * rise;
    stroke(curve((t) => [sx + Math.sin(t * 2.4) * 3 * u, lerp(y, top, t)], 16), 3.4 * u, 1, 110);
    for (let i = 1; i <= 3; i++) if (rise > i * 0.25) {
      const ty = lerp(y, top, i * 0.25);
      stroke([[sx, ty], [sx + (i % 2 ? 9 : -9) * u, ty - 6 * u]], 2 * u, 1, 111 + i);
    }
    const lit = clamp01((g - 0.35) / 0.2);
    if (!lit) return;
    const lift = easeIO(clamp01((g - 0.62) / 0.38));
    const spx = sx, spy = top - 8 * u - lift * 70 * u;
    const flick = 0.9 + Math.sin(time * 9) * 0.06 + Math.sin(time * 23) * 0.04;
    // rings across the sky ("scale")
    [[-0.34, 0.34, 26], [-0.12, 0.2, 18], [0.02, 0.38, 14]].forEach(([dx, dy, r], i) => {
      const k = clamp01((lift - i * 0.18) / 0.5);
      if (!k) return;
      ctx.globalAlpha = 0.9; ctx.strokeStyle = INK; ctx.lineWidth = 3.6 * u * (1 - k * 0.3);
      ctx.beginPath(); ctx.arc(x + dx * W, H * dy - 10 * u, r * u * easeOut(k), 0.3, 6.283 - 0.4 * (1 - k)); ctx.stroke(); ctx.globalAlpha = 1;
    });
    // glow, rays, core
    const R = 46 * u * lit * flick;
    const glow = ctx.createRadialGradient(spx, spy, 0, spx, spy, R);
    glow.addColorStop(0, 'rgba(61, 90, 254, 0.55)'); glow.addColorStop(0.45, 'rgba(61, 90, 254, 0.18)'); glow.addColorStop(1, 'rgba(61, 90, 254, 0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(spx, spy, R, 0, 6.283); ctx.fill();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 1.4 * u; ctx.globalAlpha = lit;
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * 6.283 + time * 0.4, r1 = 7 * u, r2 = (13 + (i % 3) * 5) * u * lit * flick;
      ctx.beginPath(); ctx.moveTo(spx + Math.cos(a) * r1, spy + Math.sin(a) * r1); ctx.lineTo(spx + Math.cos(a) * r2, spy + Math.sin(a) * r2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(spx, spy, 3.2 * u * lit, 0, 6.283); ctx.fill();
    ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(spx, spy, 1.8 * u * lit, 0, 6.283); ctx.fill();
  }

  // ---------- story timeline ----------
  // Each quarter of the scroll: walk to the next station (first 35%), then act there (remaining 65%).
  function frame(p, time) {
    ctx.clearRect(0, 0, W, H);
    const k = Math.min(3, Math.floor(p * 4)), l = p * 4 - k;
    const g = [0, 1, 2, 3].map((i) => (i < k ? 1 : i > k ? 0 : clamp01((l - 0.35) / 0.65)));
    if (p >= 1) g.fill(1);
    const stand = (i) => X[i] - 60 * u;
    const from = k ? stand(k - 1) : -40 * u, to = stand(k);
    const w = p >= 1 ? 1 : clamp01(l / 0.35);
    const cx = lerp(from, to, easeIO(w));
    const walking = w > 0 && w < 1;
    const cam = Math.max(0, Math.min(WW - W, cx - W * 0.3));
    ctx.save();
    ctx.translate(-cam, 0);
    landscape();
    sprout(X[0], g[0]); blueprint(X[1], g[1]); build(X[2], g[2]); launch(X[3], g[3], time);
    // distance walked so far drives the legs, so they step in time with the scroll
    character(cx, cx + 40 * u, walking, k === 3 && g[3] > 0.3, Math.sin(time * 2.2));
    ctx.restore();
    steps.forEach((s, i) => { s.classList.toggle('is-active', i === k && p > 0.01); s.classList.toggle('is-done', i < k); });
  }

  let progress = animated ? 0 : 1, raf = 0, onScreen = false;
  const read = () => {
    if (!animated) return 1;
    const r = track.getBoundingClientRect();
    return clamp01((-r.top / Math.max(1, r.height - innerHeight) - 0.04) / 0.9);
  };
  const loop = (t) => { progress = read(); frame(progress, t / 1000); raf = onScreen ? requestAnimationFrame(loop) : 0; };
  resize();
  frame(progress, 0);
  new ResizeObserver(() => { resize(); frame(progress, performance.now() / 1000); }).observe(canvas);
  if (animated) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen && !raf) raf = requestAnimationFrame(loop); }).observe(root);
  } else {
    steps.forEach((s) => s.classList.add('is-done'));
  }
})();
