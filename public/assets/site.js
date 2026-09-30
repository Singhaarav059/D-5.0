/* Demaze: every interaction and all the motion, with the Web Animations API (no libraries).

   Contents
     the curtain between pages · nav (pill, progress, phone menu) · reveals (fade-ups, rising words, counters,
     drawn lines) · loops (the scenes, demos and reels: [data-cycle] hosts playing their [data-kf] parts while on
     screen) · fitting scenes to their frames · the mazes · scroll (how we work, selected work, services, the quote,
     the aura) · pointer (magnetic buttons, tilting cards) · services, projects filter, tools tabs, industries ·
     the brief (contact form) · the 3D crew and studio

   With reduced motion (html.rm, boot.js) nothing loops or moves with the scroll: the pinned sections lay out flat
   by CSS only where the screen is small, so on large screens they still switch as you scroll, without transitions. */
(() => {
  'use strict';
  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const E = 'cubic-bezier(.22,1,.36,1)';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, '0');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const flatJourney = matchMedia('(max-width: 819px), (max-height: 719px)');
  const flatPins = matchMedia('(max-width: 819px), (max-height: 559px)');
  const safe = (f) => { try { f(); } catch (e) { console.warn(e); } };

  /* ---------- the curtain: a blue sheet sweeps up over the page with the next page's name, and off the next ---------- */
  const curtain = $('[data-curtain]');
  const EZ = 'cubic-bezier(.76,0,.24,1)';
  const LABELS = { '': 'Home', projects: 'Projects', services: 'Services', 'about-us': 'About', contact: 'Contact' };
  const labelOf = (url) => {
    const p = url.pathname.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
    if (p in LABELS) return LABELS[p];
    return p.startsWith('projects/') ? 'Case study' : 'Dead end';
  };
  // The pill it unfolds from and folds back into (site.css --pill), and the sheet at full size.
  const PILL = 'inset(18px calc(50% - 70px) calc(100% - 62px) calc(50% - 70px) round 22px)';
  const FULL = 'inset(0px 0px 0px 0px round 0px)';
  const lift = () => {
    if (!curtain || !root.classList.contains('curtain-in')) return;
    const lbl = $('[data-curtain-label]', curtain);
    lbl.textContent = JSON.parse(getComputedStyle(root).getPropertyValue('--curtain-label') || '""');
    curtain.style.visibility = 'visible';
    curtain.classList.add('is-open');
    root.classList.remove('curtain-in');
    $('.curtain__inner', curtain).animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.92) translateY(-30px)' }], { duration: 420, delay: 200, easing: EZ, fill: 'both' });
    const fold = curtain.animate([{ clipPath: FULL, opacity: 1 }, { clipPath: PILL, opacity: 1, offset: 0.82 }, { clipPath: PILL, opacity: 0 }], { duration: 900, delay: 220, easing: EZ, fill: 'both' });
    fold.onfinish = () => { curtain.style.visibility = ''; curtain.classList.remove('is-open'); curtain.getAnimations().forEach((x) => x.cancel()); $('.curtain__inner', curtain).getAnimations().forEach((x) => x.cancel()); };
  };
  safe(lift);
  let leaving = false;
  if (curtain && motion) document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // (a link on this page)
    e.preventDefault();
    leaving = true;
    const label = labelOf(url);
    try { sessionStorage.setItem('dmz-curtain', label); } catch {}
    $('[data-curtain-label]', curtain).textContent = label;
    curtain.style.visibility = 'visible';
    curtain.classList.remove('is-open');
    curtain.offsetWidth; // restart the drawings
    curtain.classList.add('is-open');
    curtain.animate([{ clipPath: PILL, opacity: 0 }, { clipPath: PILL, opacity: 1, offset: 0.12 }, { clipPath: FULL, opacity: 1 }], { duration: 760, easing: EZ, fill: 'forwards' });
    $('.curtain__inner', curtain).animate([{ transform: 'scale(0.9) translateY(-40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 200, easing: E, fill: 'both' });
    setTimeout(() => { location.href = url.href; }, 1000);
  });
  // back to a page kept in memory: the curtain it left with must not still cover it
  addEventListener('pageshow', (e) => {
    if (!e.persisted || !curtain) return;
    leaving = false;
    curtain.getAnimations().forEach((a) => a.cancel());
    curtain.style.visibility = '';
    curtain.classList.remove('is-open');
    $('.curtain__inner', curtain).getAnimations().forEach((a) => a.cancel());
  });

  /* ---------- nav: a glass pill glides to the hovered link and rests on the current page; Projects and Services open
     a menu with a preview of the page; the reading progress; the phone menu ---------- */
  const nav = $('[data-nav]');
  const links = $('[data-nav-links]');
  let placePill = () => {};
  if (links) {
    const pill = $('.nav__pill', links);
    const current = $('a[aria-current]', links);
    let openDrop = null;
    const rest = () => openDrop || current;
    const moveTo = (a) => {
      links.classList.toggle('has-pill', !!a);
      $$('a', links).forEach((l) => l.classList.toggle('is-pill', l === a));
      if (a) { pill.style.setProperty('--x', a.offsetLeft + 'px'); pill.style.setProperty('--w', a.offsetWidth + 'px'); }
    };
    links.addEventListener('pointerover', (e) => { const a = e.target.closest('a'); if (a) moveTo(a); });
    links.addEventListener('focusin', (e) => moveTo(e.target.closest('a')));
    links.addEventListener('pointerleave', () => moveTo(rest()));
    links.addEventListener('focusout', () => moveTo(rest()));
    // The menus: a mouse opens one on hover (with a grace period to travel into it) and a click follows the link; a
    // touch opens it on the first tap; ArrowDown opens it from the keyboard. Escape or a click elsewhere closes it.
    const triggers = $$('[data-drop]', links);
    let closing = 0;
    const setDrop = (t) => {
      clearTimeout(closing);
      openDrop = t;
      triggers.forEach((x) => {
        x.setAttribute('aria-expanded', x === t);
        document.getElementById(x.getAttribute('aria-controls')).classList.toggle('is-open', x === t);
      });
      nav.classList.toggle('has-drop', !!t);
      moveTo(t || current);
    };
    const later = () => { clearTimeout(closing); closing = setTimeout(() => setDrop(null), 220); };
    triggers.forEach((t) => {
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      t.addEventListener('click', (e) => { if (!fine && openDrop !== t) { e.preventDefault(); setDrop(t); } });
      t.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setDrop(t); const f = $('a', panel); if (f) f.focus(); } });
      if (fine) {
        t.addEventListener('pointerenter', () => setDrop(t));
        t.addEventListener('pointerleave', later);
        panel.addEventListener('pointerenter', () => clearTimeout(closing));
        panel.addEventListener('pointerleave', later);
      }
      panel.addEventListener('focusout', (e) => { if (!panel.contains(e.relatedTarget) && e.relatedTarget !== t) setDrop(null); });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openDrop) { const t = openDrop; setDrop(null); t.focus(); } });
    document.addEventListener('pointerdown', (e) => { if (openDrop && !e.target.closest('.nav__bar')) setDrop(null); });
    placePill = () => { pill.style.transition = 'none'; moveTo(rest()); pill.offsetWidth; pill.style.transition = ''; };
    placePill();
    if (document.fonts) document.fonts.ready.then(placePill);
  }
  // Liquid glass (Chromium, which can run an SVG filter on what is behind an element): a displacement map for the
  // capsule, pushing what shows through its rounded rim inward so the edge reads as a lens. Other browsers keep the
  // frosted glass.
  const bar = $('.nav__bar');
  if (bar && motion && navigator.userAgentData && navigator.userAgentData.brands.some((b) => /Chromium/.test(b.brand))) safe(() => {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0';
    svg.innerHTML = '<filter id="lg-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage result="map" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="map" scale="36" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.append(svg);
    const img = svg.querySelector('feImage');
    const build = () => {
      const W = Math.round(bar.offsetWidth), H = Math.round(bar.offsetHeight);
      if (!W || !H) return;
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const g = cv.getContext('2d'), px = g.createImageData(W, H), r = H / 2, B = 16;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const cx = Math.min(W - r, Math.max(r, x)), dx = x - cx, dy = y - r, len = Math.hypot(dx, dy) || 1;
        const d = r - len, t = d < B ? Math.pow(1 - Math.max(0, d) / B, 2) : 0; // 0 in the middle, 1 at the rim
        const o = (y * W + x) * 4;
        px.data[o] = 128 - (dx / len) * t * 127;
        px.data[o + 1] = 128 - (dy / len) * t * 127;
        px.data[o + 2] = 128; px.data[o + 3] = 255;
      }
      g.putImageData(px, 0, 0);
      img.setAttribute('href', cv.toDataURL());
      img.setAttribute('width', W); img.setAttribute('height', H);
    };
    build();
    root.classList.add('lg-refract');
    if ('ResizeObserver' in window) { let w = 0; new ResizeObserver(() => { if (Math.abs(bar.offsetWidth - w) > 1) { w = bar.offsetWidth; build(); } }).observe(bar); }
  });
  const toggle = $('[data-menu-toggle]');
  const menu = $('#menu');
  const scrim = $('[data-nav-scrim]');
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    menu.hidden = !open;
    if (scrim) scrim.hidden = !open;
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('menu-open', open);
  };
  if (toggle) toggle.addEventListener('click', () => setMenu(menu.hidden));
  if (scrim) scrim.addEventListener('click', () => setMenu(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); toggle.focus(); } });
  if (menu) menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* ---------- the opening (first page of a visit; boot.js decides): the maze draws, the route solves it and runs out
     into the logo, the name rises; then the sheet folds into the nav capsule while the logo flies to its place there.
     A click, key, wheel or touch skips straight to the fold. `opening` resolves as the page is uncovered, and the
     reveals wait for it. ---------- */
  const opening = new Promise((uncovered) => {
    const el = $('[data-intro]');
    if (!el || !motion || !root.classList.contains('intro-on')) { if (el) el.remove(); root.classList.remove('intro-on'); uncovered(); return; }
    let folded = false, gone = false;
    const timers = [], skipOn = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const end = () => { if (gone) return; gone = true; timers.forEach(clearTimeout); root.classList.remove('intro-on'); el.remove(); uncovered(); };
    const fold = (fast) => {
      if (folded) return;
      folded = true;
      skipOn.forEach((ev) => removeEventListener(ev, skip));
      try {
        if (fast) el.getAnimations({ subtree: true }).forEach((a) => a.finish());
        const bar = $('.nav__bar'), mark = $('.nav__brand img'), lock = $('[data-ilock]', el), chev = $('[data-ic]', el);
        const D = fast ? 460 : 860;
        [$('.intro__maze', el), $('[data-itag]', el)].forEach((x) => x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: D * 0.45, easing: 'ease', fill: 'forwards' }));
        const L = lock.getBoundingClientRect(), c = chev.getBoundingClientRect(), mk = mark.getBoundingClientRect(), r = bar.getBoundingClientRect();
        lock.style.transformOrigin = `${c.left + c.width / 2 - L.left}px ${c.top + c.height / 2 - L.top}px`;
        lock.animate([{ transform: 'none' }, { transform: `translate(${mk.left + mk.width / 2 - (c.left + c.width / 2)}px, ${mk.top + mk.height / 2 - (c.top + c.height / 2)}px) scale(${mk.width / c.width})` }], { duration: D, easing: EZ, fill: 'forwards' });
        el.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${getComputedStyle(bar).borderRadius || '999px'})` }], { duration: D, easing: EZ, fill: 'forwards' });
        el.animate([{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: D + 220, fill: 'forwards' }).onfinish = end;
        timers.push(setTimeout(uncovered, D * 0.35), setTimeout(end, D + 800));
      } catch (e) { console.warn(e); end(); }
    };
    const skip = () => fold(true);
    skipOn.forEach((ev) => addEventListener(ev, skip, { passive: true }));
    try {
      const IO = 'cubic-bezier(.65,0,.35,1)';
      $('[data-iw]', el).animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 760, easing: IO, fill: 'forwards' });
      $('[data-ir]', el).animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 950, delay: 420, easing: IO, fill: 'forwards' });
      $('[data-ic]', el).animate([{ opacity: 0, transform: 'translateX(-10px) scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 1300, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' });
      $$('[data-it] > span > span', el).forEach((s, i) => s.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 650, delay: 1380 + i * 45, easing: E, fill: 'forwards' }));
      $('[data-itag]', el).animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 1650, easing: E, fill: 'forwards' });
      timers.push(setTimeout(() => fold(false), 2300));
    } catch (e) { console.warn(e); end(); }
  });

  /* ---------- reveals: fade-ups, headlines rising word by word, counters, lines drawing themselves ---------- */
  const reveal = (el) => {
    const d = +(el.dataset.delay || 0) * 1000;
    if (el.hasAttribute('data-reveal')) {
      const a = el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 750, delay: d * 0.7, easing: E, fill: 'both' });
      a.onfinish = () => { el.style.opacity = ''; a.cancel(); };
    }
    if (el.hasAttribute('data-words')) $$('[data-w]', el).forEach((w, i) => {
      const a = w.animate([{ transform: 'translateY(108%) rotate(4deg)' }, { transform: 'none' }], { duration: 900, delay: d * 0.7 + i * 55, easing: E, fill: 'both' });
      a.onfinish = () => { w.style.transform = ''; a.cancel(); };
    });
    if (el.hasAttribute('data-drawin')) {
      const a = el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: +(el.dataset.dur || 1800), delay: d, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both' });
      a.onfinish = () => { el.style.strokeDashoffset = 0; a.cancel(); };
    }
    if (el.hasAttribute('data-count')) {
      const to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '', t0 = performance.now() + d;
      const step = (t) => { const k = clamp((t - t0) / 1600); el.textContent = pre + Math.round(to * (1 - Math.pow(1 - k, 4))) + suf; if (k < 1) requestAnimationFrame(step); };
      el.textContent = pre + '0' + suf;
      requestAnimationFrame(step);
    }
  };
  if (motion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    $$('[data-reveal], [data-words], [data-count], [data-drawin]').forEach((el) => {
      if (el.hasAttribute('data-reveal')) el.style.opacity = 0;
      if (el.hasAttribute('data-words')) $$('[data-w]', el).forEach((w) => { w.style.transform = 'translateY(108%)'; });
      if (el.hasAttribute('data-drawin')) el.style.strokeDashoffset = 1;
      opening.then(() => io.observe(el));
    });
  }

  /* ---------- loops: each [data-cycle] host (a scene, a demo, a reel) plays its parts on a loop of that many seconds,
     while it is on screen and, for a stage scene or a service demo, while its stage or service is the current one ---------- */
  const seq = (arr) => { let last = 0; return arr.map(([o, p]) => { last = Math.max(last, clamp(o)); return { offset: last, easing: E, ...p }; }); };
  const KF = {
    pop: (a, b) => seq([[0, { opacity: 0, transform: 'scale(.6)' }], [a, { opacity: 0, transform: 'scale(.6)' }], [a + 0.06, { opacity: 1, transform: 'scale(1.06)' }], [a + 0.1, { opacity: 1, transform: 'scale(1)' }], [b, { opacity: 1, transform: 'scale(1)' }], [b + 0.04, { opacity: 0, transform: 'scale(.9)' }], [1, { opacity: 0, transform: 'scale(.9)' }]]),
    rise: (a, b) => seq([[0, { opacity: 0, transform: 'translateY(14px)' }], [a, { opacity: 0, transform: 'translateY(14px)' }], [a + 0.08, { opacity: 1, transform: 'none' }], [b, { opacity: 1, transform: 'none' }], [b + 0.04, { opacity: 0, transform: 'translateY(-8px)' }], [1, { opacity: 0, transform: 'translateY(-8px)' }]]),
    chap: (a, b) => seq([[0, { opacity: 0, transform: 'translateY(22px)', filter: 'blur(6px)' }], [a, { opacity: 0, transform: 'translateY(22px)', filter: 'blur(6px)' }], [a + 0.05, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], [b - 0.03, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], [b, { opacity: 0, transform: 'translateY(-14px)', filter: 'blur(6px)' }], [1, { opacity: 0, transform: 'translateY(-14px)', filter: 'blur(6px)' }]]),
    growY: (a, b) => seq([[0, { transform: 'scaleY(0)' }], [a, { transform: 'scaleY(0)' }], [a + 0.1, { transform: 'scaleY(1)' }], [b, { transform: 'scaleY(1)' }], [b + 0.05, { transform: 'scaleY(0)' }], [1, { transform: 'scaleY(0)' }]]),
    growX: (a, b) => seq([[0, { transform: 'scaleX(0)' }], [a, { transform: 'scaleX(0)' }], [a + 0.18, { transform: 'scaleX(1)' }], [b, { transform: 'scaleX(1)' }], [b + 0.04, { transform: 'scaleX(0)' }], [1, { transform: 'scaleX(0)' }]]),
    bar: (a, b) => seq([[0, { transform: 'scaleX(0)' }], [a, { transform: 'scaleX(0)' }], [b, { transform: 'scaleX(1)' }], [0.995, { transform: 'scaleX(1)' }], [1, { transform: 'scaleX(0)' }]]).map((k) => ({ ...k, easing: 'linear' })),
    draw: (a, b) => seq([[0, { strokeDashoffset: 1, opacity: 1 }], [a, { strokeDashoffset: 1, opacity: 1 }], [a + 0.2, { strokeDashoffset: 0, opacity: 1 }], [b, { strokeDashoffset: 0, opacity: 1 }], [b + 0.04, { strokeDashoffset: 0, opacity: 0 }], [1, { strokeDashoffset: 1, opacity: 0 }]]),
    type: (a, b) => seq([[0, { clipPath: 'inset(0 100% 0 0)' }], [a, { clipPath: 'inset(0 100% 0 0)' }], [a + 0.2, { clipPath: 'inset(0 0% 0 0)' }], [b, { clipPath: 'inset(0 0% 0 0)' }], [b + 0.03, { clipPath: 'inset(0 100% 0 0)' }], [1, { clipPath: 'inset(0 100% 0 0)' }]]),
    press: (a) => seq([[0, { transform: 'scale(1)' }], [a, { transform: 'scale(1)' }], [a + 0.02, { transform: 'scale(.9)' }], [a + 0.06, { transform: 'scale(1)' }], [1, { transform: 'scale(1)' }]]),
    blink: () => [{ opacity: 1 }, { opacity: 1, offset: 0.49 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }],
    zoom: () => [{ transform: 'scale(1.02)' }, { transform: 'scale(1.1) translate(-1.5%,-1%)', offset: 0.5 }, { transform: 'scale(1.02)' }],
    travel: (a, b, el) => { const tx = el.dataset.tx || 0, ty = el.dataset.ty || 0, u = +(el.dataset.u || 0.15); return seq([[0, { transform: 'translate(0,0)', opacity: 0 }], [a, { transform: 'translate(0,0)', opacity: 0 }], [a + 0.01, { transform: 'translate(0,0)', opacity: 1 }], [a + u, { transform: `translate(${tx}px,${ty}px)`, opacity: 1 }], [a + u + 0.01, { transform: `translate(${tx}px,${ty}px)`, opacity: 0 }], [1, { transform: `translate(${tx}px,${ty}px)`, opacity: 0 }]]); },
    move: (a, b, el) => { const [x1, y1] = (el.dataset.from || '0,0').split(','), [x2, y2] = (el.dataset.to || '0,0').split(','), u = +(el.dataset.u || 0.15); return seq([[0, { left: x1 + '%', top: y1 + '%' }], [a, { left: x1 + '%', top: y1 + '%' }], [a + u, { left: x2 + '%', top: y2 + '%' }], [b, { left: x2 + '%', top: y2 + '%' }], [b + 0.06, { left: x1 + '%', top: y1 + '%' }], [1, { left: x1 + '%', top: y1 + '%' }]]); },
    // one state giving way to the next: `show` fades in at a and out at b; `hide` is its opposite
    show: (a, b) => seq([[0, { opacity: 0 }], [a, { opacity: 0 }], [a + 0.04, { opacity: 1 }], [b, { opacity: 1 }], [b + 0.03, { opacity: 0 }], [1, { opacity: 0 }]]),
    hide: (a, b) => seq([[0, { opacity: 1 }], [a, { opacity: 1 }], [a + 0.04, { opacity: 0 }], [b, { opacity: 0 }], [b + 0.03, { opacity: 1 }], [1, { opacity: 1 }]]),
    // in from an offset (data-dx / data-dy), like a notification dropping in
    slide: (a, b, el) => { const off = `translate(${el.dataset.dx || '0px'},${el.dataset.dy || '-24px'})`; return seq([[0, { opacity: 0, transform: off }], [a, { opacity: 0, transform: off }], [a + 0.07, { opacity: 1, transform: 'none' }], [b, { opacity: 1, transform: 'none' }], [b + 0.04, { opacity: 0, transform: off }], [1, { opacity: 0, transform: off }]]); },
    // a click's ripple
    ping: (a) => seq([[0, { opacity: 0, transform: 'scale(.3)' }], [a, { opacity: 0, transform: 'scale(.3)' }], [a + 0.004, { opacity: 0.9, transform: 'scale(.4)' }], [a + 0.07, { opacity: 0, transform: 'scale(2)' }], [1, { opacity: 0, transform: 'scale(2)' }]]),
    // a pointer (or a selection box) through its waypoints, "t:x,y[,w,h];…" in seconds and % of its parent; it shows
    // from the first waypoint until b
    path: (a, b, el, C) => {
      const pts = el.dataset.path.split(';').map((s) => { const [t, v] = s.split(':'); const n = v.split(',').map(Number); return [clamp(+t / C), { left: n[0] + '%', top: n[1] + '%', ...(n.length > 2 ? { width: n[2] + '%', height: n[3] + '%' } : {}) }]; });
      const first = pts[0][1], last = pts[pts.length - 1][1];
      return seq([[0, { ...first, opacity: 0 }], [pts[0][0], { ...first, opacity: 0 }], [pts[0][0] + 0.03, { ...first, opacity: 1 }], ...pts.slice(1).map(([o, p]) => [o, { ...p, opacity: 1 }]), [b, { ...last, opacity: 1 }], [b + 0.03, { ...last, opacity: 0 }], [1, { ...last, opacity: 0 }]]);
    },
    // a camera move on a whole shot: "t:scale,x,y;…" (seconds, then the scale and the shift in px), eased in and out
    cam: (a, b, el, C) => {
      const k = el.dataset.cam.split(';').map((s) => { const [t, v] = s.split(':'); const [sc, x, y] = v.split(',').map(Number); return { offset: clamp(+t / C), easing: 'cubic-bezier(.65,0,.35,1)', transform: `translate(${x}px,${y}px) scale(${sc})` }; });
      if (k[0].offset > 0) k.unshift({ ...k[0], offset: 0 });
      if (k[k.length - 1].offset < 1) k.push({ ...k[k.length - 1], offset: 1 });
      return k;
    },
  };
  const hosts = new Map(); // host -> { anims, seen }
  const active = (host) => {
    const st = host.closest('.jstage');
    if (st && !flatJourney.matches && !st.classList.contains('is-on')) return false;
    const pn = host.closest('.svc__demo');
    return !(pn && !pn.classList.contains('is-on'));
  };
  const sync = (host) => {
    const h = hosts.get(host);
    if (!h) return;
    const run = h.seen && active(host);
    h.anims.forEach((a) => (run ? a.play() : a.pause()));
  };
  const restart = (host) => {
    const h = hosts.get(host);
    if (!h) return;
    h.anims.forEach((a) => { a.currentTime = 0; });
    sync(host);
  };
  if (motion) {
    const loopIO = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((en) => {
      const h = hosts.get(en.target);
      if (h) { h.seen = en.isIntersecting; sync(en.target); }
    }), { rootMargin: '10% 10%' }) : null;
    $$('[data-cycle]').forEach((host) => {
      const C = +host.dataset.cycle || 6;
      const anims = [];
      $$('[data-kf]', host).forEach((el) => safe(() => {
        const k = KF[el.dataset.kf];
        if (!k) return;
        const a = +(el.dataset.d || 0) / C, b = +(el.dataset.e || C - 0.5) / C;
        const dur = el.dataset.kf === 'blink' ? 1000 : el.dataset.kf === 'zoom' ? 14000 : C * 1000;
        const anim = el.animate(k(a, b, el, C), { duration: dur, iterations: Infinity });
        anim.pause();
        anims.push(anim);
      }));
      hosts.set(host, { anims, seen: !loopIO });
      if (loopIO) loopIO.observe(host); else sync(host);
    });
  }

  /* ---------- scenes and demos are drawn at one size and scaled to their frame ---------- */
  if ('ResizeObserver' in window) {
    const fit = new ResizeObserver((es) => es.forEach((en) => {
      const box = en.target, art = box.firstElementChild;
      if (!art || !art.offsetWidth) return;
      box.style.setProperty('--s', Math.min(box.clientWidth / art.offsetWidth, box.clientHeight / art.offsetHeight).toFixed(4));
    }));
    $$('[data-fit]').forEach((el) => fit.observe(el));
  }

  /* ---------- drifting doodles and the running tape ---------- */
  if (motion) {
    $$('[data-drift]').forEach((el, i) => {
      const r = (n) => { const x = Math.sin(i * 97 + n * 13.7) * 10000; return x - Math.floor(x); };
      el.animate([{ transform: 'translate(0,0) rotate(0deg)' }, { transform: `translate(${(r(1) - 0.5) * 60}px,${(r(2) - 0.5) * 80}px) rotate(${(r(3) - 0.5) * 40}deg)` }], { duration: 9000 + r(4) * 7000, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
    });
    $$('[data-marquee]').forEach((el) => el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: +(el.dataset.marquee || 40) * 1000, iterations: Infinity, direction: el.dataset.marqueeDir === '-1' ? 'reverse' : 'normal' }));
  }

  /* ---------- the footer's route as a field of dots: the route (content in data-route, the footer SVG's own
     620 x 100 drawing) is snapped to the grid; a head runs along it lighting the dots it passes (white, then brand
     blue behind it), each stop ripples in its colour as the head reaches it, and dots near the pointer brighten. It
     runs only while on screen; with reduced motion it is drawn once, finished. ---------- */
  $$('[data-matrix]').forEach((host) => safe(() => {
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    if (!ctx) return;
    host.prepend(cv);
    host.classList.add('is-live');
    const css = getComputedStyle(root), col = (n) => css.getPropertyValue('--' + n).trim() || '#fff';
    const stops = JSON.parse(host.dataset.stops).map(([x, y, c, t, side]) => ({ x, y, c: col(c), t: t.toUpperCase(), side, hit: -1e9 }));
    const pts = host.dataset.route.match(/[MHV][^MHV]*/g).reduce((a, seg) => {
      const n = seg.slice(1).trim().split(/[ ,]+/).map(Number), last = a[a.length - 1] || [0, 0];
      a.push(seg[0] === 'M' ? n : seg[0] === 'H' ? [n[0], last[1]] : [last[0], n[0]]);
      return a;
    }, []);
    const blue = col('blue');
    let W = 0, H = 0, P = 12, cols = 0, rows = 0, cells = [], onRoute = new Map(), sIdx = [], ptr = null;
    const lay = () => {
      W = host.clientWidth;
      P = W < 600 ? 9 : 12;
      cols = Math.floor(W / P); rows = W < 600 ? 15 : 13;
      H = rows * P + 34;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gx = (x) => Math.round(((x + 10) / 620) * (cols - 1)), gy = (y) => Math.round(((y + 6) / 100) * (rows - 1));
      cells = [];
      for (let i = 1; i < pts.length; i++) {
        let [x, y] = [gx(pts[i - 1][0]), gy(pts[i - 1][1])];
        const [x2, y2] = [gx(pts[i][0]), gy(pts[i][1])];
        if (i === 1) cells.push([x, y]);
        while (x !== x2 || y !== y2) { x += Math.sign(x2 - x); y += Math.sign(y2 - y); cells.push([x, y]); }
      }
      onRoute = new Map(cells.map(([x, y], i) => [x + ',' + y, i]));
      sIdx = stops.map((s) => { const k = gx(s.x) + ',' + gy(s.y); return onRoute.has(k) ? onRoute.get(k) : 0; });
    };
    const start = performance.now(), mark = host.parentElement.querySelector('.footer__word svg');
    let before = 0;
    const SPEED = 26, TRAIL = 16, REST = 1.4; // cells a second, cells of fading trail, seconds at the end
    const draw = (now) => {
      const t = (now - start) / 1000, loop = cells.length / SPEED + REST;
      const head = motion ? ((t % loop) * SPEED) : cells.length + TRAIL;
      // arriving at the end of the route: the name's chevron takes a step forward
      if (mark && before < cells.length && head >= cells.length) mark.animate([{ transform: 'none' }, { transform: 'translateX(14%)' }, { transform: 'none' }], { duration: 700, easing: E });
      before = head;
      ctx.clearRect(0, 0, W, H);
      const off = 17; // room above for the labels
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const cx = x * P + P / 2, cy = off + y * P + P / 2, i = onRoute.get(x + ',' + y);
        let a = 0.09, r = 1.2, c = '#f4f1ea';
        if (i !== undefined) {
          const d = head - i;
          if (d >= 0 && d < TRAIL) { const k = 1 - d / TRAIL; a = 0.55 + 0.45 * k; r = 1.8 + 1.6 * k; c = k > 0.7 ? '#ffffff' : blue; }
          else if (d >= TRAIL) { a = 0.9; r = 2; c = blue; }
          else { a = 0.24; r = 1.6; }
        }
        // the ripples out of the stops the head has passed this lap
        stops.forEach((s, k) => {
          if (head < sIdx[k] || !motion) return;
          const age = (head - sIdx[k]) / SPEED, [sx, sy] = cells[sIdx[k]], dist = Math.hypot(x - sx, y - sy) - age * 7;
          if (age < 0.7 && Math.abs(dist) < 0.7) { a = Math.max(a, 0.7 * (1 - age / 0.7)); c = s.c; r = Math.max(r, 1.8); }
        });
        if (ptr) { const dd = Math.hypot(cx - ptr.x, cy - ptr.y); if (dd < 80) { const k = 1 - dd / 80; a = Math.min(1, a + 0.4 * k); r += 0.8 * k; } }
        ctx.globalAlpha = a; ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
      }
      // the stops: a block of dots in their colour, the label above or below
      ctx.font = '600 11.5px Figtree, system-ui, sans-serif';
      ctx.textAlign = 'center';
      stops.forEach((s, k) => {
        const [sx, sy] = cells[sIdx[k]] || [0, 0], cx = sx * P + P / 2, cy = off + sy * P + P / 2, lit = head >= sIdx[k];
        ctx.globalAlpha = lit ? 1 : 0.45; ctx.fillStyle = s.c;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { ctx.beginPath(); ctx.arc(cx + dx * P * 0.5, cy + dy * P * 0.5, lit ? 2.6 : 2, 0, 6.2832); ctx.fill(); }
        ctx.globalAlpha = lit ? 1 : 0.5; ctx.fillStyle = '#f4f1ea';
        if ('letterSpacing' in ctx) ctx.letterSpacing = '1.5px';
        ctx.fillText(s.t, cx, s.side < 0 ? cy - P * 1.4 : cy + P * 1.4 + 9);
      });
      ctx.globalAlpha = 1;
    };
    let seen = false, raf = 0;
    const frame = (now) => { raf = 0; draw(now); if (motion && seen && !document.hidden) raf = requestAnimationFrame(frame); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    lay();
    if ('ResizeObserver' in window) new ResizeObserver(() => { lay(); kick(); }).observe(host);
    if (document.fonts) document.fonts.ready.then(kick);
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) kick(); }).observe(host);
    if (motion && fine) {
      host.addEventListener('pointermove', (e) => { const b = cv.getBoundingClientRect(); ptr = { x: e.clientX - b.left, y: e.clientY - b.top }; });
      host.addEventListener('pointerleave', () => { ptr = null; });
    }
    kick();
  }));

  /* ---------- the mazes: the walls draw in and the route is worked out from the entrance. At each pitfall's turning
     the head tries the dead end, runs into the pitfall, rules it out (callout, cross, legend) and backs out leaving a
     dotted trace, then carries on to the exit. Then the walls erase and it starts over. A maze off screen waits;
     a maze with [data-maze-wait] first waits for its cue (home's start card: the route arriving from the studio). ---------- */
  const tween = (ms, f, ease = (k) => k) => new Promise((res) => {
    const t0 = performance.now();
    const step = (t) => { const k = clamp((t - t0) / ms); f(ease(k)); if (k < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
  const inOut = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
  $$('[data-maze]').forEach((mz) => safe(() => {
    const walls = $('[data-walls]', mz), route = $('[data-route]', mz), head = $('[data-head]', mz), end = $('[data-end]', mz);
    const probes = $$('[data-probe]', mz), traces = $$('[data-trace]', mz), pits = $$('[data-pit]', mz);
    const calls = $$('[data-call]', mz), legs = $$('[data-leg]', mz), status = $('[data-maze-status]', mz), count = $('[data-maze-n]', mz);
    const len = route.getTotalLength();
    const plen = probes.map((p) => p.getTotalLength());
    const at = (path, l) => { const p = path.getPointAtLength(l); head.setAttribute('cx', p.x); head.setAttribute('cy', p.y); };
    if (!motion) { at(route, len); return; }
    mz.classList.add('is-live');
    route.style.strokeDasharray = len;
    probes.forEach((p, i) => { p.style.strokeDasharray = plen[i]; });
    let seen = false, wake = null;
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; if (seen && wake) { wake(); wake = null; } }, { threshold: 0.35 }).observe(mz);
    const onScreen = () => (seen ? Promise.resolve() : new Promise((r) => { wake = r; }));
    const cue = mz.hasAttribute('data-maze-wait') ? new Promise((r) => mz.addEventListener('maze:go', r, { once: true })) : Promise.resolve();
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const V = 0.42; // user units per millisecond
    const reset = () => {
      [walls, route, head, end, ...pits, ...traces, ...calls].forEach((el) => el && el.getAnimations().forEach((a) => a.cancel()));
      route.style.strokeDashoffset = len; route.style.opacity = 1;
      probes.forEach((p, i) => { p.style.strokeDashoffset = plen[i]; p.style.opacity = 0; });
      traces.forEach((t) => { t.style.opacity = 0; });
      pits.forEach((p) => p.classList.remove('is-out'));
      legs.forEach((l) => l.classList.remove('is-out', 'is-hit'));
      if (status) status.classList.remove('is-done');
      if (count) count.textContent = 0;
      if (end) end.style.opacity = 0;
      head.style.opacity = 0; at(route, 0);
    };
    const run = async () => {
      await onScreen();
      reset();
      walls.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1600, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      pits.forEach((p, i) => p.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500, delay: 700 + i * 110, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'both' }));
      await wait(1500);
      head.style.opacity = 1;
      head.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      await wait(250);
      let pos = 0, n = 0;
      const along = (to) => { const from = pos; pos = to; return tween(Math.max(120, (to - from) / V), (k) => { const l = from + (to - from) * k; route.style.strokeDashoffset = len - l; at(route, l); }, inOut); };
      for (let i = 0; i < probes.length; i++) {
        const pr = probes[i], pl = plen[i];
        await along(+pr.dataset.s);
        pr.style.opacity = 1;
        await tween(pl / (V * 0.8), (k) => { pr.style.strokeDashoffset = pl * (1 - k); at(pr, pl * k); }, inOut);
        // the hit: the pitfall shakes and is crossed out, its callout says so, the legend ticks it off
        pits[i].animate([{ transform: 'none' }, { transform: 'translateX(-3px) rotate(-6deg)' }, { transform: 'translateX(3px) rotate(5deg)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 420, easing: 'ease-out' });
        pits[i].classList.add('is-out');
        if (calls[i]) { const tx = calls[i].dataset.tx; calls[i].animate([{ opacity: 0, transform: `translate(${tx}, calc(-100% + 8px)) scale(.9)` }, { opacity: 1, transform: `translate(${tx}, -100%)`, offset: 0.14 }, { opacity: 1, transform: `translate(${tx}, -100%)`, offset: 0.86 }, { opacity: 0, transform: `translate(${tx}, calc(-100% - 4px))` }], { duration: 1500, easing: E }); }
        if (legs[i]) { legs[i].classList.add('is-out', 'is-hit'); setTimeout(() => legs[i].classList.remove('is-hit'), 900); }
        if (count) count.textContent = ++n;
        await wait(380);
        traces[i].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: 'forwards' });
        await tween(pl / V, (k) => { pr.style.strokeDashoffset = pl * k; at(pr, pl * (1 - k)); }, inOut);
        pr.style.opacity = 0;
      }
      await along(len);
      if (end) {
        end.style.opacity = '';
        end.animate([{ opacity: 0, transform: 'translateX(-10px) scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
      }
      head.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' }], { duration: 600, easing: E });
      if (status) status.classList.add('is-done');
      await wait(4800);
      [route, head, ...traces].forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }));
      if (end) end.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
      pits.forEach((p) => p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }));
      walls.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }], { duration: 1200, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      await wait(1300);
      run();
    };
    reset();
    cue.then(run);
  }));

  /* ---------- services: the list picks the demo (scroll does it while pinned; a click scrolls there) ---------- */
  const svcPin = $('[data-svcpin]');
  const svcItems = $$('[data-svc]');
  const sbars = $$('[data-sbar]');
  let svcOn = 0;
  const setSvc = (i) => {
    if (i === svcOn && svcItems[i] && svcItems[i].classList.contains('is-on')) return;
    svcOn = i;
    svcItems.forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-pressed', j === i); });
    $$('[data-svc-panel]').forEach((p) => p.classList.toggle('is-on', +p.dataset.svcPanel === i));
    if (svcPin && svcItems[i]) svcPin.style.setProperty('--room', svcItems[i].dataset.room);
    $$(`.svc__demo[data-svc-panel] [data-cycle]`).forEach((h) => (+h.closest('[data-svc-panel]').dataset.svcPanel === i ? restart(h) : sync(h)));
  };
  svcItems.forEach((b, i) => b.addEventListener('click', () => {
    if (svcPin && !flatPins.matches) {
      const top = svcPin.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + ((i + 0.5) / 4) * (svcPin.offsetHeight - innerHeight), behavior: motion ? 'smooth' : 'auto' });
    } else setSvc(i);
  }));

  /* ---------- scroll: everything that follows the scroll position, in one frame ---------- */
  const progress = $('[data-progress]');
  const journey = $('[data-journey]');
  const stages = $$('.jstage');
  const jroute = $('[data-jroute]'), jdot = $('[data-jdot]'), jnum = $('[data-stage-num]');
  const jsvg = $('[data-jsvg]'), jtrack = $('[data-jtrack]'), jstops = $$('[data-jstop]');
  // The route is drawn in the SVG's own pixels, one stop above each stage's label (the labels sit in four equal
  // columns), in straight runs with rounded steps between; jat holds each stop's distance along it.
  let jlen = 0, jat = [];
  const buildRoute = () => {
    if (!jsvg || !jsvg.clientWidth) return;
    const W = jsvg.clientWidth, H = jsvg.clientHeight, r = Math.min(12, H / 4);
    const ys = [0.72, 0.28, 0.72, 0.28].map((f) => Math.round(H * f));
    const xs = jstops.map((_, i) => Math.round((i * W) / 4 + 5));
    let d = `M${xs[0]} ${ys[0]}`;
    for (let i = 0; i < 4; i++) {
      const x1 = xs[i], y1 = ys[i], x2 = i < 3 ? xs[i + 1] : W, y2 = i < 3 ? ys[i + 1] : ys[i];
      if (y2 === y1) { d += `H${x2}`; continue; }
      const m = Math.round((x1 + x2) / 2), sg = Math.sign(y2 - y1);
      d += `H${m - r}Q${m} ${y1} ${m} ${y1 + sg * r}V${y2 - sg * r}Q${m} ${y2} ${m + r} ${y2}H${x2}`;
    }
    jsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    jroute.setAttribute('d', d);
    jtrack.setAttribute('d', d);
    jlen = jroute.getTotalLength();
    jroute.style.strokeDasharray = `${jlen} ${jlen + 1}`;
    // each stop's distance along the route: walk it and take the nearest point to the stop
    jat = xs.map((x, i) => { let best = 0, bd = Infinity; for (let l = 0; l <= jlen; l += 2) { const p = jroute.getPointAtLength(l), dd = Math.hypot(p.x - x, p.y - ys[i]); if (dd < bd) { bd = dd; best = l; } } return best; });
    jat.push(jlen);
    jstops.forEach((c, i) => { c.setAttribute('cx', xs[i]); c.setAttribute('cy', ys[i]); });
  };
  safe(buildRoute);
  if (jsvg && 'ResizeObserver' in window) new ResizeObserver(() => { safe(buildRoute); queue(); }).observe(jsvg);
  let stageOn = -1;
  const setStage = (s) => {
    if (s === stageOn) return;
    stageOn = s;
    stages.forEach((st, i) => { st.classList.toggle('is-on', i === s); st.classList.toggle('is-before', i < s); });
    $$('[data-jlabel]').forEach((l, i) => l.classList.toggle('is-lit', i <= s));
    if (jnum) jnum.textContent = pad(s + 1);
    stages.forEach((st, i) => $$('[data-cycle]', st).forEach((h) => (i === s ? restart(h) : sync(h))));
  };
  const hs = $('[data-hscroll]');
  const track = $('[data-htrack]');
  const hcards = $$('[data-hcard]');
  const hbar = $('[data-hbar]'), hnum = $('[data-work-num]'), hname = $('[data-work-name]');
  const showN = hcards.length - 1;
  let workOn = -1;
  const setWork = (i) => {
    if (i === workOn || !hcards[i]) return;
    workOn = i;
    if (hnum) hnum.textContent = pad(Math.min(i + 1, showN));
    if (hname) hname.textContent = hcards[i].dataset.name;
  };
  // The bridge: the route from the studio into the start card, laid out in the section's own pixels (from under the
  // studio, a step across, then down onto the maze's entrance; on one column it lands on the card's top edge). It
  // draws with the scroll, its head at about two-thirds down the screen; once it arrives it tells the maze to go and a
  // pulse keeps running along it.
  const bridge = $('[data-bridge]');
  let bgeo = null, bdone = false;
  const bline = bridge && $('[data-bridge-line]', bridge), bhead = bridge && $('[data-bridge-head]', bridge);
  const layBridge = () => {
    bgeo = null;
    const wrap = bridge && bridge.parentElement, from = $('[data-bridge-from]'), card = wrap && $('.start', wrap);
    if (!bridge || !from || !card) return;
    const w = wrap.getBoundingClientRect(), f = from.getBoundingClientRect(), c = card.getBoundingClientRect();
    const origin = $('[data-origin]', card), mazeEl = $('[data-maze]', card);
    const one = matchMedia('(max-width: 959px)').matches;
    const o = origin && !one ? origin.getBoundingClientRect() : null;
    // from the studio's port when it has one (the capsule on its bottom edge), else from under the studio
    const port = $('[data-bridge-port]'), pr = port && port.getBoundingClientRect();
    const ax = pr ? pr.left + pr.width / 2 - w.left : f.left - w.left + f.width * (one ? 0.5 : 0.45), ay = pr ? pr.bottom - w.top : f.bottom - w.top + 36;
    const bx = o ? o.left + o.width / 2 - w.left : c.left - w.left + Math.min(80, c.width * 0.1), by = o ? o.top + o.height / 2 - w.top : c.top - w.top + 26;
    const ym = Math.round((ay + (c.top - w.top)) / 2), r = Math.min(18, Math.abs(bx - ax) / 2, (by - ay) / 4), sg = Math.sign(bx - ax);
    const d = !sg || r < 1 ? `M${ax} ${ay}V${ym}H${bx}V${by}` : `M${ax} ${ay}V${ym - r}Q${ax} ${ym} ${ax + sg * r} ${ym}H${bx - sg * r}Q${bx} ${ym} ${bx} ${ym + r}V${by}`;
    $$('path', bridge).forEach((p) => p.setAttribute('d', d));
    const len = bline.getTotalLength();
    bline.style.strokeDasharray = `${len} ${len + 1}`;
    bgeo = { ay, by, len, mazeEl };
  };
  const quote = $('[data-quote]');
  const qwords = quote ? $$('[data-qw]', quote) : [];
  const aura = $('[data-aura]');
  const rooms = $$('[data-room]');
  const lights = $$('[data-light], .case__outcome, .brief'); // light panels the glass capsule firms up over
  const span = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };

  // Each frame reads every position it needs first, then writes: a read after a write makes the browser lay the page
  // out again mid-frame. The selected work's card centres are measured once (per resize) without the track's shift,
  // then placed by arithmetic as the track moves.
  let hmids = null, hmax = 0, htx = 0;
  const measureWork = () => {
    hmax = Math.max(0, track.scrollWidth - innerWidth);
    hmids = hcards.map((c) => { const b = c.getBoundingClientRect(); return b.left + b.width / 2 - htx; });
  };
  const tick = () => {
    // reads
    const vh = innerHeight, sy = scrollY, H = root.scrollHeight - vh;
    const jp = journey && stages.length && !flatJourney.matches ? span(journey) : null;
    const pinWork = hs && track && !flatPins.matches;
    if (pinWork && !hmids) measureWork();
    const hp = pinWork ? span(hs) : null;
    const sp = svcPin && !flatPins.matches ? span(svcPin) : null;
    const qr = quote && motion ? quote.getBoundingClientRect() : null;
    const bw = bgeo ? bridge.parentElement.getBoundingClientRect().top : null;
    let col = null;
    const light = lights.some((el) => { const r = el.getBoundingClientRect(); return r.top < 70 && r.bottom > 14; });
    if (aura) for (const s of rooms) { const r = s.getBoundingClientRect(); if (r.top < vh * 0.55 && r.bottom > vh * 0.45) col = s.dataset.room; }

    // writes
    if (progress) progress.style.transform = `scaleX(${H > 0 ? sy / H : 0})`;
    if (nav) { nav.classList.toggle('is-scrolled', sy > 40); nav.classList.toggle('is-light', light); }

    if (journey && stages.length) {
      if (jp === null) setStage(0);
      else {
        const st = Math.min(3, Math.floor(jp * 4 + 0.0001));
        const local = clamp(jp * 4 - st);
        if (jroute && jlen) {
          // the head reaches each stage's stop as that stage begins, and the route's end as the section ends
          const l = jat[st] + (jat[st + 1] - jat[st]) * local;
          jroute.style.strokeDashoffset = jlen - l;
          jstops.forEach((c, i) => c.classList.toggle('is-lit', l >= jat[i] - 1));
          if (jdot) { const pt = jroute.getPointAtLength(l); jdot.style.transform = `translate(${pt.x}px, ${pt.y}px)`; }
        }
        setStage(st);
        $$('li[data-step]', stages[st]).forEach((li) => li.classList.toggle('is-on', local > (+li.dataset.step + 0.6) / (+li.dataset.n + 0.6)));
      }
    }

    if (hs && track) {
      if (hp === null) {
        track.style.transform = '';
        htx = 0;
        hcards.forEach((c) => { c.style.transform = ''; c.style.opacity = ''; });
      } else {
        const cx = innerWidth / 2;
        htx = -hp * hmax;
        track.style.transform = `translate3d(${htx.toFixed(1)}px,0,0)`;
        if (motion) hcards.forEach((c, i) => {
          const off = hmids[i] + htx - cx, d = Math.min(1, Math.abs(off) / innerWidth);
          c.style.transform = `scale(${(1 - d * 0.12).toFixed(3)}) rotate(${(off / innerWidth * 3).toFixed(2)}deg)`;
          c.style.opacity = (1 - d * 0.55).toFixed(3);
        });
        if (hbar) hbar.style.transform = `scaleX(${hp})`;
        setWork(Math.min(hcards.length - 1, Math.round(hp * (hcards.length - 1))));
      }
    }

    if (sp !== null) {
      const i = Math.min(3, Math.floor(sp * 4 + 0.0001));
      setSvc(i);
      sbars.forEach((b, j) => { b.style.transform = `scaleX(${j < i ? 1 : j > i ? 0 : clamp(sp * 4 - i).toFixed(3)})`; });
    }

    if (bgeo) {
      const p = motion ? clamp((vh * 0.68 - (bw + bgeo.ay)) / Math.max(1, bgeo.by - bgeo.ay)) : 1, l = bgeo.len * p;
      bline.style.strokeDashoffset = bgeo.len - l;
      const pt = bline.getPointAtLength(l);
      bhead.setAttribute('cx', pt.x); bhead.setAttribute('cy', pt.y);
      bhead.style.opacity = p > 0 && p < 1 ? 1 : 0;
      if (p >= 1 && !bdone) { bdone = true; bridge.classList.add('is-done'); if (bgeo.mazeEl) bgeo.mazeEl.dispatchEvent(new Event('maze:go')); }
    }

    if (qr) {
      const q = clamp((vh * 0.8 - qr.top) / (qr.height + vh * 0.25)), lit = Math.round(q * qwords.length * 1.15);
      qwords.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    }

    if (col && aura.style.color !== col) aura.style.color = col;
  };
  let raf = 0;
  const queue = () => { raf ||= requestAnimationFrame(() => { raf = 0; safe(tick); }); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', () => { hmids = null; safe(layBridge); queue(); placePill(); });
  if (bridge) {
    safe(layBridge);
    if ('ResizeObserver' in window) new ResizeObserver(() => { safe(layBridge); queue(); }).observe(bridge.parentElement);
    if (document.fonts) document.fonts.ready.then(() => { safe(layBridge); queue(); });
    addEventListener('load', () => { safe(layBridge); queue(); });
  }
  [flatJourney, flatPins].forEach((m) => m.addEventListener && m.addEventListener('change', () => { stageOn = -1; hmids = null; queue(); }));
  safe(tick);
  // on phones the selected work scrolls sideways by swipe: the counter follows the card nearest the middle
  const hview = $('.hwork__viewport');
  if (hview) hview.addEventListener('scroll', () => {
    if (!flatPins.matches) return;
    const cx = innerWidth / 2;
    let best = 0, bd = Infinity;
    hcards.forEach((c, i) => { const b = c.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - cx); if (d < bd) { bd = d; best = i; } });
    setWork(best);
  }, { passive: true });

  /* ---------- pointer: buttons lean toward the cursor, cards tilt under it ---------- */
  if (motion && fine) {
    const magnets = $$('[data-magnet]');
    const tilts = $$('[data-tilt]');
    let pe = null, praf = 0;
    const frame = () => {
      praf = 0;
      const e = pe;
      magnets.forEach((el) => {
        const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const inside = Math.abs(dx) < r.width / 2 + 30 && Math.abs(dy) < r.height / 2 + 30;
        el.style.translate = inside ? `${(dx * 0.28).toFixed(1)}px ${(dy * 0.35).toFixed(1)}px` : '';
      });
      tilts.forEach((el) => {
        const r = el.getBoundingClientRect(), inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom, amt = +(el.dataset.tilt || 6);
        if (inside) {
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(1100px) rotateX(${(-y * amt).toFixed(2)}deg) rotateY(${(x * amt).toFixed(2)}deg)`;
        } else if (el.__in) el.style.transform = '';
        el.__in = inside;
      });
    };
    addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; pe = e; praf ||= requestAnimationFrame(frame); }, { passive: true });
  }

  /* ---------- projects: the filter ---------- */
  const filters = $$('[data-filter]');
  const status = $('[data-filter-status]');
  filters.forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.filter;
    filters.forEach((x) => x.setAttribute('aria-pressed', x === b));
    let n = 0;
    $$('.pcard').forEach((c) => {
      const on = id === 'all' || c.dataset.svcs.split(' ').includes(id);
      c.classList.toggle('is-out', !on);
      if (on) { n++; if (motion) c.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: Math.min(n, 8) * 40, easing: E, fill: 'backwards' }); }
    });
    b.closest('.projects')?.toggleAttribute('data-filtered', id !== 'all');
    if (status) status.textContent = `Showing ${n} project${n === 1 ? '' : 's'}`;
  }));

  /* ---------- services page: tabs (the tools map, the industries), the wires of the tools map, the industries'
     own pace, and the service cards stacking as you scroll ---------- */
  // Tabs: roving tabindex and arrow keys; picking one shows its panel and tells its box ('tabchange').
  $$('[data-tabs]').forEach((box) => {
    const tabs = $$('[role=tab]', box);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        const was = panel.hidden;
        panel.hidden = !on;
        if (on && was && motion) $$('li, h3', panel).forEach((el, k) => el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: k * 20, easing: E, fill: 'backwards' }));
        if (on) box.dispatchEvent(new CustomEvent('tabchange', { detail: panel }));
      });
      if (focus) tab.focus();
      // a sideways strip of tabs (industries on tablets and phones) keeps the chosen one in view, without moving the page
      const strip = tab.parentElement;
      if (strip.scrollWidth > strip.clientWidth + 2) strip.scrollTo({ left: tab.offsetLeft - strip.offsetLeft - 16, behavior: motion ? 'smooth' : 'auto' });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });

  // The tools map: the stack wired to its six discipline cards, and the chosen card to each of its tools. Wires run like
  // the maze's route, in straight runs with rounded corners. Picking a discipline (resting a mouse on it picks it too)
  // pulls its layer out of the stack, colours the stage and draws its lines to its tools.
  $$('[data-kmap-stage]').forEach((stage) => safe(() => {
    const svg = $('[data-kmap-wires]', stage);
    const cats = $$('[data-kmap-cat]', stage);
    const plates = [];
    $$('[data-kmap-plate]', stage).forEach((p) => { plates[+p.dataset.kmapPlate] = p; });
    const ports = $$('[data-kmap-port]', stage);
    const NS = 'http://www.w3.org/2000/svg';
    const wide = matchMedia('(min-width: 1025px)');
    const route = (x1, y1, x2, y2, bend = (x1 + x2) / 2) => {
      const dy = y2 - y1, r = Math.min(10, Math.abs(dy) / 2, Math.abs(bend - x1), Math.abs(x2 - bend)), sg = Math.sign(dy);
      if (!sg || r < 1) return `M${x1} ${y1}H${bend}V${y2}H${x2}`;
      return `M${x1} ${y1}H${bend - r}Q${bend} ${y1} ${bend} ${y1 + sg * r}V${y2 - sg * r}Q${bend} ${y2} ${bend + r} ${y2}H${x2}`;
    };
    const path = (d, cls, unit = true) => {
      const el = document.createElementNS(NS, 'path');
      el.setAttribute('d', d);
      el.setAttribute('class', cls);
      if (unit) el.setAttribute('pathLength', '1');
      return el;
    };
    const draw = (animate) => {
      const on = Math.max(0, cats.findIndex((c) => c.getAttribute('aria-selected') === 'true'));
      stage.style.setProperty('--mk', cats[on].style.getPropertyValue('--mk'));
      plates.forEach((p, i) => p.classList.toggle('is-on', i === on));
      ports.forEach((p, i) => p.classList.toggle('is-on', i === on));
      if (!wide.matches) { svg.replaceChildren(); return; }
      const box = stage.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const at = (el, side) => { const r = el.getBoundingClientRect(); return [(side === 'l' ? r.left : side === 'r' ? r.right : r.left + r.width / 2) - box.left, r.top + r.height / 2 - box.top]; };
      const first = at(cats[0], 'l')[0];
      const paths = [];
      cats.forEach((c, i) => {
        const [x1, y1] = at(ports[i], 'c'), [x2, y2] = at(c, 'l');
        const d = route(x1 + 4, y1, x2, y2, x1 + (first - x1) * (0.25 + i * 0.1));
        if (i === on) paths.push(path(d, 'kmap__wire is-on'), path(d, 'kmap__pulse'));
        else paths.unshift(path(d, 'kmap__wire', false));
      });
      const panel = document.getElementById(cats[on].getAttribute('aria-controls'));
      const [ax, ay] = at(cats[on], 'r');
      $$('[data-kmap-dot]', panel).forEach((dot, i) => {
        const [x, y] = at(dot, 'l');
        const p = path(route(ax, ay, x - 1, y, ax + (x - ax) * 0.45), 'kmap__fan' + (animate ? ' is-drawing' : ''));
        p.style.animationDelay = i * 28 + 'ms';
        paths.push(p);
      });
      svg.replaceChildren(...paths);
    };
    stage.addEventListener('tabchange', () => requestAnimationFrame(() => draw(true)));
    if (fine) {
      let t = 0;
      const rest = (c) => { clearTimeout(t); t = setTimeout(() => c.getAttribute('aria-selected') !== 'true' && c.click(), 180); };
      cats.forEach((c) => { c.addEventListener('pointerenter', () => rest(c)); c.addEventListener('pointerleave', () => clearTimeout(t)); });
    }
    if ('ResizeObserver' in window) new ResizeObserver(() => draw(false)).observe(stage);
    if (document.fonts) document.fonts.ready.then(() => draw(false));
    draw(false);
  }));

  // Industries: while the section is on screen the index moves on by itself, the current tile's bar saying when.
  // Picking an industry, or touching the section at all, stops it for good.
  $$('[data-ind]').forEach((box) => {
    const tabs = $$('[role=tab]', box);
    let stopped = !motion, auto = false;
    const stop = () => { stopped = true; box.classList.remove('is-auto'); };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => box.classList.toggle('is-auto', e.isIntersecting && !stopped), { threshold: 0.35 }).observe(box);
    box.addEventListener('animationend', (e) => {
      if (e.animationName !== 'ind-timer' || stopped) return;
      const next = tabs[(tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true') + 1) % tabs.length];
      auto = true; next.click(); auto = false;
    });
    tabs.forEach((t) => t.addEventListener('click', () => { if (!auto) stop(); }));
    box.addEventListener('pointerdown', stop);
    box.addEventListener('keydown', stop);
  });

  // About, what drives us: the route draws down the values with the scroll, its head at 60% of the screen; each value
  // lights as the head reaches its picture, and the count beside the heading follows. Reads first, then writes.
  $$('[data-drives]').forEach((list) => {
    const line = $('[data-drives-line]', list), items = $$('[data-drive]', list), num = $('[data-drives-n]');
    if (!motion) { items.forEach((it) => it.classList.add('is-lit')); list.classList.add('is-done'); return; }
    let raf = 0;
    const draw = () => {
      raf = 0;
      const lr = line.parentElement.getBoundingClientRect(), head = innerHeight * 0.6;
      const p = clamp((head - lr.top) / Math.max(1, lr.height));
      const lit = items.map((it) => { const a = it.firstElementChild.getBoundingClientRect(); return a.top + a.height / 2 <= Math.max(head, lr.top + 1); });
      line.style.setProperty('--p', p.toFixed(4));
      items.forEach((it, i) => it.classList.toggle('is-lit', lit[i]));
      list.classList.toggle('is-done', p >= 1);
      if (num) num.textContent = pad(Math.max(1, lit.lastIndexOf(true) + 1));
    };
    const queueDraw = () => { raf ||= requestAnimationFrame(draw); };
    addEventListener('scroll', queueDraw, { passive: true });
    addEventListener('resize', queueDraw);
    draw();
  });

  // Services page: each card sticks as the next slides up over it; the one underneath settles back and dims.
  const stackCards = $$('[data-stack-card]');
  const stackWide = matchMedia('(min-width: 960px) and (min-height: 820px)');
  let stackRaf = 0;
  const stackTick = () => {
    stackRaf = 0;
    const live = stackWide.matches && motion;
    const boxes = live ? stackCards.map((c) => c.getBoundingClientRect()) : []; // (all reads, then all writes)
    stackCards.forEach((c, i) => {
      if (!live || !stackCards[i + 1]) { c.style.transform = ''; c.style.filter = ''; return; }
      const a = boxes[i], b = boxes[i + 1];
      const p = clamp(1 - (b.top - a.top) / Math.max(1, a.height));
      c.style.transform = p ? `scale(${(1 - p * 0.06).toFixed(4)})` : '';
      c.style.filter = p ? `brightness(${(1 - p * 0.45).toFixed(3)})` : '';
    });
  };
  if (stackCards.length) { addEventListener('scroll', () => { stackRaf ||= requestAnimationFrame(stackTick); }, { passive: true }); stackTick(); }

  /* ---------- the brief: checks the fields, sends it to /api/contact, keeps an unsent draft in the browser ---------- */
  $$('[data-form]').forEach((form) => {
    const KEY = 'demaze-brief';
    const note = $('[data-form-note]', form), noteText = note.innerHTML;
    const done = $('[data-form-done]', form.parentElement);
    const submit = $('button[type="submit"]', form);
    const RULES = {
      name: (v) => (v.trim().length >= 2 ? '' : 'Tell us who to reply to.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'That email doesn’t look right.'),
      message: (v) => (v.trim().length >= 12 ? '' : 'A sentence or two about the problem helps us prepare.'),
    };
    let tried = false;
    const check = (n) => {
      const f = form.elements[n], msg = RULES[n](f.value), err = $(`[data-err="${n}"]`, form);
      if (err) err.textContent = msg;
      f.setAttribute('aria-invalid', !!msg);
      return !msg;
    };
    const data = () => {
      const fd = new FormData(form);
      return { name: fd.get('name') || '', email: fd.get('email') || '', company: fd.get('company') || '', stage: fd.get('stage') || '', subject: fd.getAll('need').join(', '), message: fd.get('message') || '', website: fd.get('website') || '' };
    };
    const save = () => { try { const d = data(); delete d.website; d.need = new FormData(form).getAll('need'); localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d) {
        ['name', 'email', 'company', 'message'].forEach((n) => { if (d[n]) form.elements[n].value = d[n]; });
        $$('input[name="need"]', form).forEach((x) => { x.checked = (d.need || []).includes(x.value); });
        $$('input[name="stage"]', form).forEach((x) => { x.checked = x.value === d.stage; });
      }
    } catch {}
    form.addEventListener('input', (e) => { save(); if (tried && RULES[e.target.name]) check(e.target.name); });
    form.addEventListener('change', save);
    const say = (html) => { note.innerHTML = html; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      tried = true;
      const bad = Object.keys(RULES).filter((n) => !check(n));
      if (bad.length) { say(bad.length === 1 ? 'One thing to fix above.' : `${bad.length} things to fix above.`); form.elements[bad[0]].focus(); return; }
      const d = data();
      submit.disabled = true;
      say('Sending your brief…');
      try {
        const res = await fetch(form.getAttribute('action') || '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d), credentials: 'same-origin' });
        if (res.ok) {
          try { localStorage.removeItem(KEY); } catch {}
          $('[data-form-done-title]', done).textContent = `Thanks, ${d.name.trim().split(/\s+/)[0]}. The brief is on its way.`;
          $('[data-form-done-lead]', done).textContent = `We’ll reply to ${d.email.trim()}. If it’s urgent, book a call and we’ll talk it through.`;
          form.hidden = true;
          done.hidden = false;
          done.focus({ preventScroll: true });
          done.parentElement.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
          $$('[data-done-draw]', done).forEach((p, i) => { p.style.strokeDashoffset = motion ? 1 : 0; if (motion) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: i ? 600 : 900, delay: i ? 600 : 0, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }); });
          return;
        }
        if (res.status === 429) { say('Too many messages from here just now. Please wait a few minutes and try again.'); return; }
        if (res.status === 400) { say('Something in the brief didn’t go through. Please check it and try again.'); return; }
        throw new Error('delivery failed');
      } catch {
        // Delivery is down (or this is a preview without it): the brief is kept, and email is one click away.
        const body = `${d.message}\n\nNeeds: ${d.subject || '-'}\nStage: ${d.stage || '-'}\nCompany: ${d.company || '-'}\n\nFrom ${d.name} (${d.email})`;
        const href = `mailto:contact@demazetech.com?subject=${encodeURIComponent(`Project brief | ${d.name}`)}&body=${encodeURIComponent(body)}`;
        say(`We couldn’t send that just now. Your brief is saved here: try again, or <a href="${href}">email it to us instead</a>.`);
      } finally {
        submit.disabled = false;
      }
    });
    $('[data-form-again]', done).addEventListener('click', () => {
      form.reset();
      tried = false;
      $$('[data-err]', form).forEach((x) => { x.textContent = ''; });
      $$('[aria-invalid]', form).forEach((x) => x.removeAttribute('aria-invalid'));
      say(noteText);
      done.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  });

  /* ---------- the 3D crew (crew3d.js, in the crew band) and the studio (office3d.js, home's "who we are") ---------- */
  // Both are loaded once the page has settled, never on Save-Data. Building the studio is one long job, so it is done
  // in a quiet moment after the crew, or as soon as the section comes near (on low-memory devices, only then).
  const crewSrc = document.body.dataset.crewSrc;
  const url = (src) => new URL(src, document.baseURI).href;
  const settled = (f) => { if (document.readyState === 'complete') f(); else addEventListener('load', f, { once: true }); };
  if (crewSrc && !navigator.connection?.saveData) {
    if ($('[data-crew]')) settled(() => {
      const load = () => import(url(crewSrc)).then((m) => m.start()).catch(() => {});
      if (window.requestIdleCallback) requestIdleCallback(load, { timeout: 2500 }); else setTimeout(load, 400);
    });
    const office = $('[data-office]');
    if (office && 'IntersectionObserver' in window) {
      let began = false, lastScroll = -1e9;
      addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
      const build = () => {
        if (began) return;
        began = true;
        io.disconnect();
        Promise.all([import(url(crewSrc)), import(url(office.dataset.src))]).then(([kit, room]) => room.start($('.office__stage', office), kit)).catch(() => {});
      };
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) build(); }, { rootMargin: '1800px 0px' });
      io.observe(office);
      if (!(navigator.deviceMemory && navigator.deviceMemory <= 2)) settled(() => setTimeout(function quiet() {
        if (began) return;
        if (performance.now() - lastScroll < 400) { setTimeout(quiet, 400); return; }
        if (window.requestIdleCallback) requestIdleCallback(build, { timeout: 3000 }); else build();
      }, 3500));
    }
  }
})();
