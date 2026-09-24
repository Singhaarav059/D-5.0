// Blueprint horizon: a perspective engineering grid that rises from the bottom of the hero and
// fades into the sky. Rows drift toward the viewer, light pulses travel along the lines toward the
// headline, and the vanishing point leans with the pointer. Canvas 2D; pauses when off screen.
window.initHorizon = function (canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  const host = canvas.parentElement;
  const COLS = 14, ROWS = 18, FAR = 18;
  let W = 0, H = 0, HY = 0, dpr = 1, raf = null, visible = true, reveal = 0, t0 = performance.now();
  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  let pointerAt = -1e9;

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    // Horizon height comes from the caller (measured from the layout), else a bit below centre.
    HY = Math.min(H * 0.78, Math.max(H * 0.45, opts.horizon ? opts.horizon() : H * 0.62));
  };

  // Ground-plane projection: world x (columns) and depth z (1 = bottom edge, FAR = horizon).
  const horizon = () => HY + lean.y * 10;
  const project = (x, z) => {
    const hy = horizon(), vx = W / 2 + lean.x * W * 0.08;
    return [vx + (x * W * (W < 700 ? 0.16 : 0.085)) / z, hy + (H - hy) / z];
  };
  // Fade with depth so the grid dissolves into the clouds at the horizon.
  const depthAlpha = (z) => Math.pow(Math.max(0, 1 - (z - 1) / (FAR - 1)), 2.2);

  const pulses = Array.from({ length: 7 }, (_, i) => ({ col: 0, z: 1, v: 0, delay: i * 0.9 }));
  const respawn = (p) => { p.col = Math.round((Math.random() * 2 - 1) * (COLS - 3)); p.z = 1; p.v = 2.2 + Math.random() * 2.4; };
  pulses.forEach(respawn);

  const frame = (now) => {
    raf = null;
    if (!visible || document.hidden) return;
    const t = (now - t0) / 1000;
    const dt = Math.min(0.05, (now - (frame.last || now)) / 1000);
    frame.last = now;
    // Pointer lean is damped; without a recent pointer the view sways by itself.
    if (now - pointerAt > 2500) { lean.tx = Math.sin(t * 0.18) * 0.5; lean.ty = Math.sin(t * 0.13) * 0.3; }
    lean.x += (lean.tx - lean.x) * 0.04; lean.y += (lean.ty - lean.y) * 0.04;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const hy = horizon();
    const shown = Math.min(1, reveal * 1.15); // rows light up from the bottom during the intro
    const zLimit = 1 + (FAR - 1) * shown;
    ctx.lineWidth = 1;

    // Rows: evenly spaced in depth, drifting toward the viewer.
    const phase = (t * 0.35) % 1;
    for (let i = 0; i < ROWS; i++) {
      const z = 1 + i - phase;
      if (z < 1 || z > zLimit) continue;
      const a = depthAlpha(z) * 0.7;
      if (a < 0.01) continue;
      const [x0, y] = project(-COLS * 1.6, z), [x1] = project(COLS * 1.6, z);
      ctx.strokeStyle = `rgba(214, 226, 255, ${a})`;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    }
    // Columns: converge on the vanishing point, faded toward the horizon.
    for (let c = -COLS; c <= COLS; c++) {
      const [xa, ya] = project(c, 1), [xb, yb] = project(c, zLimit);
      const g = ctx.createLinearGradient(0, ya, 0, Math.min(yb, ya - 1));
      g.addColorStop(0, `rgba(214, 226, 255, ${0.6 * shown})`);
      g.addColorStop(1, 'rgba(214, 226, 255, 0)');
      ctx.strokeStyle = g;
      ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke();
    }
    // Horizon line: a thin bright seam where the grid meets the sky.
    const hg = ctx.createLinearGradient(0, 0, W, 0);
    hg.addColorStop(0, 'rgba(220, 232, 255, 0)'); hg.addColorStop(0.5, `rgba(220, 232, 255, ${0.16 * shown})`); hg.addColorStop(1, 'rgba(220, 232, 255, 0)');
    ctx.fillStyle = hg; ctx.fillRect(0, hy + (H - hy) / FAR - 0.5, W, 1);

    // Pulses: short light streaks running up the columns toward the horizon.
    if (reveal >= 1) {
      ctx.lineCap = 'round';
      pulses.forEach((p) => {
        if (p.delay > 0) { p.delay -= dt; return; }
        p.z += p.v * dt * (1 + p.z * 0.12);
        if (p.z > FAR * 0.8) { respawn(p); p.delay = Math.random() * 1.5; return; }
        const a = depthAlpha(p.z);
        const [x, y] = project(p.col, p.z), [xt, yt] = project(p.col, Math.max(1, p.z - 1.4));
        const g = ctx.createLinearGradient(xt, yt, x, y);
        g.addColorStop(0, 'rgba(212, 255, 58, 0)'); g.addColorStop(1, `rgba(222, 255, 120, ${0.95 * a})`);
        ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(xt, yt); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = `rgba(240, 255, 190, ${a})`;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
      });
      ctx.lineWidth = 1;
    }
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

  host.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = host.getBoundingClientRect();
    lean.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    lean.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    pointerAt = performance.now();
  }, { passive: true });
  addEventListener('resize', resize, { passive: true });
  document.fonts && document.fonts.ready.then(resize);
  document.addEventListener('visibilitychange', start);
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; start(); }).observe(host);

  resize();
  start();
  // Intro: caller drives `reveal` from 0 to 1 (rows rise from the bottom), then pulses begin.
  return { set reveal(v) { reveal = v; }, get reveal() { return reveal; } };
};
