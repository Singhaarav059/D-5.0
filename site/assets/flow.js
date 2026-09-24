// Hero signal flow: scattered data points drift in from the left, funnel into the Demaze core
// (a DOM tile at the centre), and leave on the right riding a bundle of smooth, ordered lines.
// Canvas 2D; pauses when off screen or in a hidden tab. Returns { reveal } for the intro tween.
window.initFlow = function (box) {
  const canvas = box.querySelector('canvas');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return false;
  let W = 0, H = 0, dpr = 1, raf = null, visible = true, reveal = 0, last = 0;
  const hover = { v: 0, t: 0 };

  // Output lanes: amplitude (fraction of height), wavelength, speed, phase, colour.
  const LANES = [
    { a: 0.34, k: 0.010, w: 1.6, p: 0.0, c: '163, 181, 255' },
    { a: 0.24, k: 0.013, w: 2.1, p: 1.9, c: '180, 155, 255' },
    { a: 0.16, k: 0.017, w: 2.6, p: 3.4, c: '212, 255, 58' },
    { a: 0.28, k: 0.008, w: 1.2, p: 4.6, c: '232, 238, 255' },
  ];
  let parts = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const core = () => ({ x: W / 2, half: Math.min(64, H * 0.28) });
  const spawn = (p, initial) => {
    p.x = initial ? rand(0, W) : rand(-40, 0);
    p.y0 = H / 2 + (Math.random() + Math.random() + Math.random() - 1.5) * H * 0.55; // soft bell spread
    p.v = rand(38, 80);
    p.s = Math.random() < 0.18 ? rand(2.8, 3.6) : rand(1.4, 2.4);
    p.lane = (Math.random() * LANES.length) | 0;
    p.j = rand(0, 6.28);
    p.o = rand(0.5, 1);
    return p;
  };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = box.clientWidth; H = box.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const n = Math.round(Math.min(700, W * 0.55));
    parts = Array.from({ length: n }, () => spawn({}, true));
  };
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const laneY = (L, x, t, amp) => {
    const { x: cx } = core();
    const env = smooth(cx, cx + W * 0.12, x) * (1 - smooth(W * 0.82, W, x) * 0.5);
    return H / 2 + Math.sin((x - cx) * L.k - t * L.w + L.p) * H * L.a * env * amp;
  };

  const frame = (now) => {
    raf = null;
    if (!visible || document.hidden) return;
    const t = now / 1000, dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    hover.v += (hover.t - hover.v) * 0.05;
    const amp = 1 + hover.v * 0.35;
    const { x: cx, half } = core();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = reveal;

    // Output lines: drawn first so the beads sit on top. Faded in from the core, out at the edge.
    LANES.forEach((L) => {
      const g = ctx.createLinearGradient(cx, 0, W, 0);
      g.addColorStop(0, `rgba(${L.c}, 0)`); g.addColorStop(0.08, `rgba(${L.c}, 0.95)`); g.addColorStop(0.75, `rgba(${L.c}, 0.6)`); g.addColorStop(1, `rgba(${L.c}, 0)`);
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = cx; x <= W; x += 4) { const y = laneY(L, x, t, amp); x === cx ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
    });

    // Particles: noisy on the left, funnelled into the core, then riding a lane on the right.
    parts.forEach((p) => {
      p.x += p.v * dt * (p.x > cx ? 1.6 : 1);
      if (p.x > W + 10) spawn(p, false);
      let y, a;
      if (p.x < cx - half) {
        const f = smooth(cx * 0.35, cx - half, p.x);             // funnel toward the core
        y = p.y0 + (H / 2 - p.y0) * f * 0.85 + Math.sin(t * 2 + p.j) * 3 * (1 - f);
        a = p.o * smooth(0, W * 0.18, p.x);                        // fade in from the left edge
        ctx.fillStyle = `rgba(236, 240, 255, ${a})`;
        ctx.fillRect(p.x, y, p.s, p.s);                            // square "pixels" = raw data
      } else if (p.x > cx + half * 0.6) {
        const L = LANES[p.lane];
        y = laneY(L, p.x, t, amp);
        a = (1 - smooth(W * 0.7, W, p.x)) * 0.95;
        ctx.fillStyle = `rgba(${L.c}, ${a})`;
        ctx.beginPath(); ctx.arc(p.x, y, p.s * 0.8, 0, 6.283); ctx.fill(); // round beads = structured output
      }
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

  // The panel's pointer excites the lines a little (bigger swell while hovering the hero).
  const host = box.closest('section') || box;
  host.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover.t = 1; });
  host.addEventListener('pointerleave', () => { hover.t = 0; });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', start);
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; start(); }).observe(box);
  resize();
  start();
  return { set reveal(v) { reveal = v; }, get reveal() { return reveal; } };
};
