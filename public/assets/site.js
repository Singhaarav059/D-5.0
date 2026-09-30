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
  const lift = () => {
    if (!curtain || !root.classList.contains('curtain-in')) return;
    const lbl = $('[data-curtain-label]', curtain);
    lbl.textContent = JSON.parse(getComputedStyle(root).getPropertyValue('--curtain-label') || '""');
    curtain.style.visibility = 'visible';
    root.classList.remove('curtain-in');
    curtain.animate([{ clipPath: 'inset(0 0 0 0 round 0px)' }, { clipPath: 'inset(0 0 100% 0 round 0 0 40px 40px)' }], { duration: 720, delay: 160, easing: EZ, fill: 'both' })
      .onfinish = () => { curtain.style.visibility = ''; curtain.getAnimations().forEach((a) => a.cancel()); };
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
    curtain.animate([{ clipPath: 'inset(100% 0 0 0 round 40px 40px 0 0)' }, { clipPath: 'inset(0 0 0 0 round 0px)' }], { duration: 640, easing: EZ, fill: 'forwards' });
    $('.curtain__inner', curtain).animate([{ transform: 'translateY(60px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, delay: 180, easing: E, fill: 'both' });
    setTimeout(() => { location.href = url.href; }, 660);
  });
  // back to a page kept in memory: the curtain it left with must not still cover it
  addEventListener('pageshow', (e) => {
    if (!e.persisted || !curtain) return;
    leaving = false;
    curtain.getAnimations().forEach((a) => a.cancel());
    curtain.style.visibility = '';
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

  /* ---------- reveals: fade-ups, headlines rising word by word, counters, lines drawing themselves ---------- */
  const reveal = (el) => {
    const d = +(el.dataset.delay || 0) * 1000;
    if (el.hasAttribute('data-reveal')) {
      const a = el.animate([{ opacity: 0, transform: 'translateY(36px)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }], { duration: 1100, delay: d, easing: E, fill: 'both' });
      a.onfinish = () => { el.style.opacity = ''; a.cancel(); };
    }
    if (el.hasAttribute('data-words')) $$('[data-w]', el).forEach((w, i) => {
      const a = w.animate([{ transform: 'translateY(108%) rotate(4deg)' }, { transform: 'none' }], { duration: 1200, delay: d + i * 75, easing: E, fill: 'both' });
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
      io.observe(el);
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
        const anim = el.animate(k(a, b, el), { duration: dur, iterations: Infinity });
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
  } else {
    $$('.footer__route').forEach((svg) => svg.pauseAnimations && svg.pauseAnimations());
  }

  /* ---------- the mazes: walls draw in, pitfalls pop in, the route is solved (each pitfall dropping away as it is
     passed), the exit lights up; then the walls erase and it starts over. A maze off screen waits. ---------- */
  $$('[data-maze]').forEach((mz) => safe(() => {
    const walls = $('[data-walls]', mz), route = $('[data-route]', mz), head = $('[data-head]', mz), end = $('[data-end]', mz);
    const pits = $$('[data-pit]', mz);
    const len = route.getTotalLength();
    route.style.strokeDasharray = len;
    const place = (t) => { const p = route.getPointAtLength(len * t); head.setAttribute('cx', p.x); head.setAttribute('cy', p.y); };
    if (!motion) { route.style.strokeDashoffset = 0; place(1); head.style.opacity = 1; pits.forEach((p) => { p.style.opacity = 0.3; }); return; }
    mz.classList.add('is-live');
    let seen = false, wake = null;
    new IntersectionObserver(([en]) => { seen = en.isIntersecting; if (seen && wake) { wake(); wake = null; } }).observe(mz);
    const onScreen = () => (seen ? Promise.resolve() : new Promise((r) => { wake = r; }));
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const run = async () => {
      await onScreen();
      route.style.strokeDashoffset = len; route.style.opacity = 1; head.style.opacity = 0; place(0);
      [route, head, walls, end, ...pits].forEach((el) => el && el.getAnimations().forEach((a) => a.cancel()));
      walls.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 2400, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      pits.forEach((p, i) => p.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 600, delay: 900 + i * 160, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'both' }));
      await wait(2000);
      head.animate([{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, fill: 'forwards' });
      const passed = new Set(), D = 4200, t0 = performance.now();
      await new Promise((res) => {
        const step = (t) => {
          const k = clamp((t - t0) / D), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          route.style.strokeDashoffset = len * (1 - e);
          place(e);
          pits.forEach((p, i) => {
            if (passed.has(i) || e < +p.dataset.at) return;
            passed.add(i);
            p.getAnimations().forEach((a) => a.cancel());
            p.animate([{ opacity: 1, transform: 'scale(1.25)' }, { opacity: 0.22, transform: 'scale(.85) translateY(6px)' }], { duration: 700, easing: E, fill: 'forwards' });
          });
          if (k < 1) requestAnimationFrame(step); else res();
        };
        requestAnimationFrame(step);
      });
      if (end) end.animate([{ opacity: 0, transform: 'scale(.4) rotate(-20deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }], { duration: 700, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' });
      head.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.8)' }, { transform: 'scale(1)' }], { duration: 700, easing: E });
      await wait(5200);
      [route, head].forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' }));
      if (end) end.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
      pits.forEach((p) => p.animate([{ opacity: 0.22 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }));
      walls.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }], { duration: 1400, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      await wait(1500);
      run();
    };
    run();
  }));

  /* ---------- services: the list picks the demo (scroll does it while pinned; a click scrolls there) ---------- */
  const svcPin = $('[data-svcpin]');
  const svcItems = $$('[data-svc]');
  let svcOn = 0;
  const setSvc = (i) => {
    if (i === svcOn && svcItems[i] && svcItems[i].classList.contains('is-on')) return;
    svcOn = i;
    svcItems.forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-pressed', j === i); });
    $$('[data-svc-panel]').forEach((p) => p.classList.toggle('is-on', +p.dataset.svcPanel === i));
    const bar = $('[data-sbar]');
    if (bar && svcItems[i]) bar.style.setProperty('--c', svcItems[i].style.getPropertyValue('--c'));
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
  const jroute = $('[data-jroute]'), jdot = $('[data-jdot]'), jbar = $('[data-jbar]'), jnum = $('[data-stage-num]');
  const jlen = jroute ? jroute.getTotalLength() : 0;
  if (jroute) jroute.style.strokeDasharray = jlen;
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
  const quote = $('[data-quote]');
  const qwords = quote ? $$('[data-qw]', quote) : [];
  const aura = $('[data-aura]');
  const rooms = $$('[data-room]');
  const span = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };

  const tick = () => {
    const vh = innerHeight, sy = scrollY, H = root.scrollHeight - vh;
    if (progress) progress.style.transform = `scaleX(${H > 0 ? sy / H : 0})`;
    if (nav) nav.classList.toggle('is-scrolled', sy > 40);

    if (journey && stages.length) {
      if (flatJourney.matches) setStage(0);
      else {
        const p = span(journey);
        if (jroute) {
          jroute.style.strokeDashoffset = jlen * (1 - p);
          if (jdot) { const pt = jroute.getPointAtLength(jlen * p); jdot.style.left = pt.x / 10 + '%'; jdot.style.top = pt.y / 0.8 + '%'; }
        }
        const s = Math.min(3, Math.floor(p * 4 + 0.0001));
        setStage(s);
        const local = clamp(p * 4 - s);
        if (jbar) jbar.style.transform = `scaleX(${local})`;
        $$('li[data-step]', stages[s]).forEach((li) => li.classList.toggle('is-on', local > (+li.dataset.step + 0.6) / (+li.dataset.n + 0.6)));
      }
    }

    if (hs && track) {
      if (flatPins.matches) {
        track.style.transform = '';
        hcards.forEach((c) => { c.style.transform = ''; c.style.opacity = ''; });
      } else {
        const p = span(hs), max = Math.max(0, track.scrollWidth - innerWidth), cx = innerWidth / 2;
        track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
        if (motion) hcards.forEach((c) => {
          const b = c.getBoundingClientRect(), off = b.left + b.width / 2 - cx, d = Math.min(1, Math.abs(off) / innerWidth);
          c.style.transform = `scale(${(1 - d * 0.12).toFixed(3)}) rotate(${(off / innerWidth * 3).toFixed(2)}deg)`;
          c.style.opacity = (1 - d * 0.55).toFixed(3);
        });
        if (hbar) hbar.style.transform = `scaleX(${p})`;
        setWork(Math.min(hcards.length - 1, Math.round(p * (hcards.length - 1))));
      }
    }

    if (svcPin && !flatPins.matches) {
      const p = span(svcPin), i = Math.min(3, Math.floor(p * 4 + 0.0001));
      setSvc(i);
      const bar = $('[data-sbar]');
      if (bar) bar.style.transform = `scaleX(${clamp(p * 4 - i)})`;
    }

    if (quote && motion) {
      const r = quote.getBoundingClientRect(), q = clamp((vh * 0.8 - r.top) / (r.height + vh * 0.25)), lit = Math.round(q * qwords.length * 1.15);
      qwords.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    }

    if (aura) {
      let col = null;
      for (const s of rooms) { const r = s.getBoundingClientRect(); if (r.top < vh * 0.55 && r.bottom > vh * 0.45) col = s.dataset.room; }
      if (col && aura.style.color !== col) aura.style.color = col;
    }
  };
  let raf = 0;
  const queue = () => { raf ||= requestAnimationFrame(() => { raf = 0; safe(tick); }); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', () => { queue(); placePill(); });
  [flatJourney, flatPins].forEach((m) => m.addEventListener && m.addEventListener('change', () => { stageOn = -1; queue(); }));
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

  // About: the values route draws itself when it arrives; hovering a value's card lights its station, and back.
  $$('[data-values]').forEach((v) => {
    if (!motion || !('IntersectionObserver' in window)) { v.classList.add('is-in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { v.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(v);
  });
  const valueParts = $$('.drive[data-v], .values__stop');
  const lightValue = (v) => valueParts.forEach((el) => el.classList.toggle('is-lit', el.dataset.v === v));
  valueParts.forEach((el) => { el.addEventListener('pointerenter', () => lightValue(el.dataset.v)); el.addEventListener('pointerleave', () => lightValue(null)); });

  // Services page: each card sticks as the next slides up over it; the one underneath settles back and dims.
  const stackCards = $$('[data-stack-card]');
  const stackWide = matchMedia('(min-width: 960px) and (min-height: 820px)');
  const stackTick = () => stackCards.forEach((c, i) => {
    const next = stackCards[i + 1];
    if (!next || !stackWide.matches || !motion) { c.style.transform = ''; c.style.filter = ''; return; }
    const a = c.getBoundingClientRect(), b = next.getBoundingClientRect();
    const p = clamp(1 - (b.top - a.top) / Math.max(1, a.height));
    c.style.transform = p ? `scale(${(1 - p * 0.06).toFixed(4)})` : '';
    c.style.filter = p ? `brightness(${(1 - p * 0.45).toFixed(3)})` : '';
  });
  if (stackCards.length) { addEventListener('scroll', () => requestAnimationFrame(stackTick), { passive: true }); stackTick(); }

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
