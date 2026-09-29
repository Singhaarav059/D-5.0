/* Glowing silk behind the night page, the sheets and the footer: a ribbon of fine threads that folds slowly across,
   so the glass panels on it have light to catch. The page has one fixed canvas behind everything (quieter, site.css
   .silk--page); each sheet gets its own canvas (2D, drawn at half resolution: silk is
   soft anyway, and it keeps WebGL contexts free for the reels). Colours come from the sheet's --silk-a / --silk-b.
   Only sheets on screen are drawn; with reduced motion each draws one still frame. Without JS the sheet's CSS glow
   stands in. Decoration only: the canvas is aria-hidden and never takes the pointer. */
(() => {
  'use strict';
  const root = document.documentElement;
  const still = !root.classList.contains('motion');
  const page = document.createElement('div');
  page.className = 'silk silk--page';
  document.body.prepend(page);
  const sheets = [page, ...document.querySelectorAll('.sheet:not(.sheet--day), .footer__panel')];

  const THREADS = 42, STEP = 10, SCALE = 0.5;
  const GLOW = 'filter' in CanvasRenderingContext2D.prototype; // canvas blur; without it, the sheet's CSS glow
  const items = sheets.map((el, n) => {
    const c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    if (el === page) { c.style.cssText = 'width:100%;height:100%;display:block'; page.setAttribute('aria-hidden', 'true'); } else c.className = 'silk';
    el.prepend(c);
    const css = getComputedStyle(el);
    return {
      el, c, ctx: c.getContext('2d'), on: false, seed: n * 1.7,
      a: css.getPropertyValue('--silk-a').trim() || '#3d5afe',
      b: css.getPropertyValue('--silk-b').trim() || '#a58bff',
      w: 0, h: 0,
    };
  });

  const size = (it) => {
    const r = it.el.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2) * SCALE;
    it.w = Math.max(1, Math.round(r.width * dpr));
    it.h = Math.max(1, Math.round(r.height * dpr));
    it.c.width = it.w; it.c.height = it.h; it.drawn = false;
  };

  // One frame: the ribbon runs corner to corner through the lower half; every thread is the same wave with a small
  // phase and amplitude shift, so together they read as one sheet of cloth twisting.
  const draw = (it, t) => {
    const { ctx, w, h } = it;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = Math.max(1, w / 900);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, it.a); grad.addColorStop(0.55, it.b); grad.addColorStop(1, it.a);
    ctx.strokeStyle = grad;
    const s = it.seed, amp = Math.min(h * 0.22, w * 0.14);
    const thread = (v) => {
      ctx.beginPath();
      for (let x = -STEP; x <= w + STEP; x += STEP) {
        const p = x / w;
        const base = h * (0.78 - 0.34 * p);
        const twist = Math.sin(p * 3.1 + t * 0.21 + s) * v * 1.9;
        const y = base
          + amp * Math.sin(p * 4.2 + t * 0.33 + s + v * 0.9) * (0.7 + twist)
          + amp * 0.45 * Math.sin(p * 9.0 - t * 0.27 + s * 2 + v * 2.4)
          + v * h * 0.16 * Math.cos(p * 2.4 - t * 0.18 + s);
        if (x === -STEP) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    // the glow: the ribbon's middle drawn wide and blurred, the light the threads give off
    if (GLOW) {
      ctx.filter = `blur(${Math.round(amp * 0.35)}px)`;
      ctx.lineWidth = amp * 0.9; ctx.globalAlpha = 0.34; thread(0);
      ctx.filter = 'none'; ctx.lineWidth = Math.max(1, w / 900);
    }
    for (let i = 0; i < THREADS; i++) {
      const v = i / (THREADS - 1) - 0.5;
      ctx.globalAlpha = 0.08 + 0.22 * (1 - Math.abs(v) * 1.6);
      thread(v);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  items.forEach(size);
  let raf = 0, last = 0, clock = 0, scrolledAt = -1e9;
  // While the page is being scrolled the silk holds still: the glass above it would re-blur the ribbon on every frame
  // of every canvas on screen, right when the scroll needs the frame. It picks up where it stopped (its clock waits
  // too), a moment after the scrolling ends; the ribbon drifts too slowly for the pause to show.
  addEventListener('scroll', () => { scrolledAt = performance.now(); }, { passive: true });
  const loop = (now) => {
    raf = 0;
    if (document.hidden) return;
    const gap = now - last;
    if (gap > 33) { // ~30fps is plenty for slow silk
      last = now;
      const moving = now - scrolledAt <= 160;
      if (!moving) clock += Math.min(gap, 100) / 1000;
      // (a canvas with nothing on it yet, new to the screen or just resized, is drawn at once, scrolling or not)
      items.forEach((it) => { if (it.on && (!moving || !it.drawn)) { draw(it, clock); it.drawn = true; } });
    }
    if (items.some((it) => it.on)) raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!still && !raf) raf = requestAnimationFrame(loop); };

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const it = items.find((x) => x.el === e.target);
    it.on = e.isIntersecting;
    if (!it.on) return;
    if (still) draw(it, 8); else kick();
  }), { rootMargin: '120px 0px' });
  items.forEach((it) => io.observe(it.el));

  let rt = 0;
  const resize = () => { clearTimeout(rt); rt = setTimeout(() => items.forEach((it) => { size(it); if (still && it.on) draw(it, 8); }), 150); };
  addEventListener('resize', resize);
  new ResizeObserver(resize).observe(document.body);
  document.addEventListener('visibilitychange', kick);
})();
