/* The moving background (src/templates/ambient.js): behind every page, a few doodles of the work keep appearing in
   free spots, drawing themselves on, floating, and after a while giving way to others. They lean with the cursor (each
   at its own depth), drift against the scroll, and perk up when the pointer comes near. Wide screens keep most of them
   in the margins, where sketches of the work appear too; site.css fades whatever sits behind the text column. Once the
   page has loaded, this also brings in the 3D crew (crew3d.js), and the doodles keep out of its way. With reduced
   motion a few rest in place, drawn, and the crew holds a pose. Decoration only: the layer is aria-hidden and never
   takes the pointer. */
(() => {
  'use strict';
  const root = document.documentElement;
  const layer = document.querySelector('[data-amb]');
  const set = document.querySelector('template[data-amb-set]');
  if (!layer || !set) return;
  const still = !root.classList.contains('motion');
  const pool = [...set.content.children];
  const kinds = { doodle: [], tag: [], sketch: [] };
  pool.forEach((el) => kinds[el.dataset.kind].push(el));

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const live = []; // { el, box, born, d, used }

  // The page's text column (site.css --wrap) and the margins either side of it.
  const geo = () => {
    const W = innerWidth, H = innerHeight;
    const wrap = W <= 560 ? W - 32 : Math.min(1200, W - 48);
    return { W, H, edge: (W - wrap) / 2 };
  };
  const target = () => (innerWidth >= 1400 ? 13 : innerWidth >= 1025 ? 9 : 5);

  // What to draw next, and how big. Everything prefers the margins, sized to fit them; a few go behind the text
  // column (faded there, site.css), and on narrow screens they sit at the edges, partly off-screen.
  const choose = ({ edge, W }) => {
    const r = Math.random();
    const busy = new Set(live.map((l) => l.used));
    const fresh = (list) => list.filter((el) => !busy.has(el));
    const big = W >= 861, room = edge - 24; // what fits in a margin
    const inMargin = (w) => room >= w * 0.85 && Math.random() < 0.85;
    if (room >= 170 && r < 0.2) return { src: pick(fresh(kinds.sketch)), kind: 'sketch', w: Math.min(230, room - 12), margin: true };
    // stickers need a margin or a wide screen's edge; on tablets and phones the text runs too close to the edge
    if (r < 0.45 && W >= 1025) return { src: pick(fresh(kinds.tag)), kind: 'tag', w: 0, margin: room >= 150, edgy: room < 150 };
    const w = Math.round(big ? Math.min(rnd(46, 82), Math.max(room - 10, 40)) : rnd(36, 54));
    return { src: pick(fresh(kinds.doodle)), kind: 'doodle', w, margin: inMargin(w) };
  };

  // A free spot for a box of w x h: in a margin (a little over the screen edge if it must), at a screen edge (`edgy`),
  // or anywhere; never on top of another.
  const place = (g, w, h, margin, edgy) => {
    for (let i = 0; i < 40; i++) {
      let x;
      const left = Math.random() < 0.5;
      if (margin) {
        const lo = left ? Math.min(10, g.edge - w - 8) : g.W - g.edge + 8, hi = left ? g.edge - w - 8 : Math.max(g.W - w - 10, g.W - g.edge + 8);
        x = rnd(Math.min(lo, hi), Math.max(lo, hi));
      } else if (edgy || g.W < 861) x = left ? rnd(-w * 0.35, 4) : rnd(g.W - w * 0.65, g.W - w - 4);
      else x = rnd(10, g.W - w - 10);
      const y = rnd(84, g.H - h - 24);
      const box = { x, y, w, h };
      const zones = crew ? crew.zones() : [];
      if (zones.some((z) => x < z.x + z.w + 16 && z.x < x + w + 16 && y < z.y + z.h + 16 && z.y < y + h + 16)) continue;
      const clear = live.every(({ box: b }) => x + w + 28 < b.x || b.x + b.w + 28 < x || y + h + 28 < b.y || b.y + b.h + 28 < y);
      if (clear) return box;
    }
    return null;
  };

  const spawn = () => {
    if (live.length >= target()) return;
    const g = geo();
    const c = choose(g);
    if (!c.src) return;
    const el = document.createElement('div');
    el.className = `amb__item amb__item--${c.kind}`;
    const float = document.createElement('div');
    float.className = 'amb__float';
    float.append(c.src.cloneNode(true));
    el.append(float);
    if (c.w) el.style.width = c.w + 'px';
    layer.append(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    const box = place(g, w, h, c.margin, c.edgy);
    if (!box) { el.remove(); return; }
    const d = c.kind === 'sketch' ? rnd(0.3, 0.6) : rnd(0.5, 1.3); // nearer things move more
    el.style.cssText += `;left:${box.x.toFixed(0)}px;top:${box.y.toFixed(0)}px;--r:${rnd(-9, 9).toFixed(1)}deg;--d:${d.toFixed(2)}`;
    float.style.cssText = `--dur:${rnd(5, 9).toFixed(1)}s;--delay:${rnd(-6, 0).toFixed(1)}s`;
    const item = { el, box, d, used: c.src, born: scrollY };
    // it leaves (after a while, or early to make way), and something else appears somewhere else
    let timer = 0;
    item.leave = () => {
      if (!live.includes(item)) return;
      clearTimeout(timer);
      live.splice(live.indexOf(item), 1);
      if (still) { el.remove(); fill(); return; }
      el.classList.add('is-out');
      setTimeout(() => { el.remove(); setTimeout(spawn, rnd(300, 1500)); }, 800);
    };
    live.push(item);
    if (still) { el.classList.add('is-in'); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
    timer = setTimeout(item.leave, (c.kind === 'doodle' || c.kind === 'tag' ? rnd(7, 12) : rnd(10, 16)) * 1000);
  };

  // The 3D crew (crew3d.js): loaded once the page has settled, never on Save-Data. Its zones stay free of doodles.
  let crew = null;
  if (layer.dataset.src && !navigator.connection?.saveData) {
    const load = () => import(new URL(layer.dataset.src, document.baseURI).href).then((m) => {
      crew = m.start(layer, { still });
      // doodles already sitting where the crew plays make way
      const zones = crew ? crew.zones() : [];
      for (const l of live.slice()) {
        const { x, y, w, h } = l.box;
        if (zones.some((z) => x < z.x + z.w && z.x < x + w && y < z.y + z.h && z.y < y + h)) l.leave();
      }
    }).catch(() => {});
    const idle = () => (window.requestIdleCallback ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 400));
    if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
  }

  const fill = () => { for (let i = live.length; i < target(); i++) setTimeout(spawn, still ? 0 : i * rnd(180, 420)); };
  fill();
  let resizing = 0;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => {
      const { W, H } = geo();
      live.slice().forEach((l) => { if (l.box.x > W || l.box.y > H) { l.el.remove(); live.splice(live.indexOf(l), 1); } });
      fill();
    }, 250);
  });
  if (still) return;

  // Depth: the layer leans with the cursor (eased), and each item drifts against the scroll by its depth.
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const aim = { x: 0, y: 0 }, now = { x: 0, y: 0 }, pointer = { x: -1e4, y: -1e4 };
  let raf = 0, lastScroll = scrollY;
  const frame = () => {
    raf = 0;
    now.x += (aim.x - now.x) * 0.08;
    now.y += (aim.y - now.y) * 0.08;
    layer.style.setProperty('--px', now.x.toFixed(3));
    layer.style.setProperty('--py', now.y.toFixed(3));
    for (const l of live) {
      l.el.style.setProperty('--sy', ((l.born - scrollY) * l.d * 0.14).toFixed(1) + 'px');
      if (fine) {
        const cx = l.box.x + l.box.w / 2, cy = l.box.y + l.box.h / 2;
        l.el.classList.toggle('is-near', Math.hypot(pointer.x - cx, pointer.y - cy) < Math.max(90, l.box.w * 0.75));
      }
    }
    if (Math.abs(aim.x - now.x) > 0.002 || Math.abs(aim.y - now.y) > 0.002 || scrollY !== lastScroll) queue();
    lastScroll = scrollY;
  };
  const queue = () => { raf ||= requestAnimationFrame(frame); };
  if (fine) {
    addEventListener('pointermove', (e) => {
      aim.x = (e.clientX / innerWidth - 0.5) * 2;
      aim.y = (e.clientY / innerHeight - 0.5) * 2;
      pointer.x = e.clientX; pointer.y = e.clientY;
      queue();
    }, { passive: true });
    document.addEventListener('pointerleave', () => { pointer.x = pointer.y = -1e4; aim.x = aim.y = 0; queue(); });
  }
  addEventListener('scroll', queue, { passive: true });
})();
