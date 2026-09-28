/* The moving background (src/templates/ambient.js): behind every page, a few doodles of the work keep appearing in
   the side margins, one to a slot, drawing themselves on, floating, and after a while giving way to others. They lean
   with the cursor (each at its own depth), drift a little against the scroll, and perk up when the pointer comes near;
   wide margins get sketches of the work too. Screens without margins get none. Once the
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

  // Where doodles go: a lane down each side margin wide enough for one (not the crew's), split into evenly spaced
  // slots, one item to a slot, each kept whole on screen, clear of the edge and the text column even as it leans and
  // drifts. Narrower screens, where the text runs to the edges, get none.
  const PAD = 18, TOP = 96, BOTTOM = 24, SLOT = 190;
  const lanes = (g) => {
    const room = g.edge - 2 * PAD;
    if (g.W < 1025 || room < 44) return [];
    const zones = crew ? crew.zones() : [];
    return [{ x: PAD, w: room }, { x: g.W - g.edge + PAD, w: room }]
      .filter((l) => !zones.some((z) => l.x < z.x + z.w && z.x < l.x + l.w));
  };
  const slotsPer = (g) => Math.max(2, Math.floor((g.H - TOP - BOTTOM) / SLOT));
  const target = () => { const g = geo(); return lanes(g).length * slotsPer(g); };

  // What to draw in a lane, sized to it: a sketch if it is wide, a sticker if one fits, else a doodle.
  const choose = (lane) => {
    const r = Math.random();
    const busy = new Set(live.map((l) => l.used));
    const fresh = (list) => list.filter((el) => !busy.has(el));
    if (lane.w >= 170 && r < 0.25) return { src: pick(fresh(kinds.sketch)), kind: 'sketch', w: Math.min(210, lane.w) };
    if (lane.w >= 140 && r < 0.5) return { src: pick(fresh(kinds.tag)), kind: 'tag', w: 0 };
    return { src: pick(fresh(kinds.doodle)), kind: 'doodle', w: Math.round(Math.min(rnd(44, 64), lane.w)) };
  };

  const spawn = () => {
    if (live.length >= target()) return;
    const g = geo();
    const n = slotsPer(g), sh = (g.H - TOP - BOTTOM) / n;
    const free = [];
    lanes(g).forEach((lane, li) => { for (let k = 0; k < n; k++) if (!live.some((l) => l.lane === li && l.slot === k)) free.push([lane, li, k]); });
    if (!free.length) return;
    const [lane, li, k] = pick(free);
    const c = choose(lane);
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
    if (w > lane.w || h > sh - 16) { el.remove(); return; } // doesn't fit whole; the next try picks again
    const jx = Math.min(10, (lane.w - w) / 2), jy = Math.min(14, (sh - h) / 2 - 8);
    const box = { x: lane.x + (lane.w - w) / 2 + rnd(-jx, jx), y: TOP + k * sh + (sh - h) / 2 + rnd(-jy, jy), w, h };
    const d = c.kind === 'sketch' ? rnd(0.3, 0.6) : rnd(0.5, 1); // nearer things move more
    const tilt = c.kind === 'doodle' ? 8 : 4;
    el.style.cssText += `;left:${box.x.toFixed(0)}px;top:${box.y.toFixed(0)}px;--r:${rnd(-tilt, tilt).toFixed(1)}deg;--d:${d.toFixed(2)}`;
    float.style.cssText = `--dur:${rnd(5, 9).toFixed(1)}s;--delay:${rnd(-6, 0).toFixed(1)}s`;
    const item = { el, box, d, used: c.src, born: scrollY, lane: li, slot: k };
    // it leaves (after a while, or early to make way), and something else appears in a free slot
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
    timer = setTimeout(item.leave, (c.kind === 'doodle' || c.kind === 'tag' ? rnd(8, 13) : rnd(11, 16)) * 1000);
  };

  // The 3D crew (crew3d.js): loaded once the page has settled and only when the screen has a right margin wide enough
  // for them (now, or after a resize), never on Save-Data. Their zone stays free of doodles.
  let crew = null, wanted = false;
  const roomy = () => geo().edge >= 84 && innerHeight >= 560;
  const summon = () => {
    if (wanted || !roomy()) return;
    wanted = true;
    const load = () => import(new URL(layer.dataset.src, document.baseURI).href).then((m) => {
      crew = m.start(layer, { still });
      // doodles already sitting where the crew plays make way
      const zones = crew ? crew.zones() : [];
      for (const l of live.slice()) {
        const { x, y, w, h } = l.box;
        if (zones.some((z) => x < z.x + z.w && z.x < x + w && y < z.y + z.h && z.y < y + h)) l.leave();
      }
      fill();
    }).catch(() => {});
    const idle = () => (window.requestIdleCallback ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 400));
    if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
  };
  if (layer.dataset.src && !navigator.connection?.saveData) {
    summon();
    addEventListener('resize', summon);
  }

  const fill = () => { for (let i = live.length; i < target(); i++) setTimeout(spawn, still ? 0 : i * rnd(180, 420)); };
  fill();
  // a new size means new lanes: start over
  let resizing = 0;
  addEventListener('resize', () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => {
      live.splice(0).forEach((l) => l.el.remove());
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
      l.el.style.setProperty('--sy', Math.max(-14, Math.min(14, (l.born - scrollY) * l.d * 0.05)).toFixed(1) + 'px'); // a little, never out of its slot
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
