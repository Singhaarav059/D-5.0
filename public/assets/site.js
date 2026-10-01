// Demaze — interactions + motion. GSAP/ScrollTrigger/Lenis are optional: without them
// (or with reduced motion) every element is already in its final, visible state.
(() => {
  const root = document.documentElement;
  const motion = root.classList.contains('motion') && window.gsap && window.ScrollTrigger;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- the opening (first page of a visit; boot.js decides) ----------
  // The chevron draws itself and fills, the name rises beside it and the line under it fades in; then the sheet folds
  // into the nav bar while the logo flies to its place there. A click, key, wheel or touch skips straight to the fold.
  // window.dmzOpening resolves as the page is uncovered: home's globe opening (cine.js) waits for it.
  window.dmzOpening = new Promise((uncovered) => {
    const el = $('[data-intro]');
    if (!el || !root.classList.contains('intro-on') || !el.animate) { if (el) el.remove(); root.classList.remove('intro-on'); uncovered(); return; }
    const EZ = 'cubic-bezier(.76,0,.24,1)', OUT = 'cubic-bezier(.22,1,.36,1)';
    let folded = false, gone = false;
    const timers = [], skipOn = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const end = () => { if (gone) return; gone = true; timers.forEach(clearTimeout); root.classList.remove('intro-on'); el.remove(); uncovered(); };
    const fold = (fast) => {
      if (folded) return;
      folded = true;
      skipOn.forEach((ev) => removeEventListener(ev, skip));
      try {
        if (fast) el.getAnimations({ subtree: true }).forEach((a) => a.finish());
        const bar = $('.nav__bar'), mark = $('.brand img'), lock = $('[data-ilock]', el), chev = $('[data-ic]', el);
        const D = fast ? 480 : 820;
        $('[data-itag]', el).animate([{ opacity: 1 }, { opacity: 0 }], { duration: D * 0.4, easing: 'ease', fill: 'forwards' });
        const L = lock.getBoundingClientRect(), c = chev.getBoundingClientRect(), mk = mark.getBoundingClientRect(), r = bar.getBoundingClientRect();
        lock.style.transformOrigin = `${c.left + c.width / 2 - L.left}px ${c.top + c.height / 2 - L.top}px`;
        lock.animate([{ transform: 'none' }, { transform: `translate(${mk.left + mk.width / 2 - (c.left + c.width / 2)}px, ${mk.top + mk.height / 2 - (c.top + c.height / 2)}px) scale(${mk.width / c.width})` }], { duration: D, easing: EZ, fill: 'forwards' });
        el.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 999px)` }], { duration: D, easing: EZ, fill: 'forwards' });
        el.animate([{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: D + 200, fill: 'forwards' }).onfinish = end;
        timers.push(setTimeout(uncovered, D * 0.4), setTimeout(end, D + 800));
      } catch (e) { end(); }
    };
    const skip = () => fold(true);
    skipOn.forEach((ev) => addEventListener(ev, skip, { passive: true }));
    try {
      $('[data-icl]', el).animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      $('[data-icf]', el).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 560, easing: 'ease', fill: 'forwards' });
      $$('[data-it] > span > span', el).forEach((ch, i) => ch.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 640, delay: 520 + i * 45, easing: OUT, fill: 'forwards' }));
      $('[data-itag]', el).animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 860, easing: OUT, fill: 'forwards' });
      timers.push(setTimeout(() => fold(false), 1650));
    } catch (e) { end(); }
  });

  // ---------- the curtain between pages ----------
  // Following a link to another page, frosted blue glass unfolds out of the nav bar with that page's name; the next
  // page opens under it (boot.js keeps it up from the first paint) and it folds back into the bar there.
  const curtain = $('[data-curtain]');
  const LABELS = { '': 'Home', projects: 'Projects', services: 'Services', 'about-us': 'About us', contact: 'Contact' };
  const labelOf = (url) => {
    const p = url.pathname.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
    if (p in LABELS) return LABELS[p];
    return p.startsWith('projects/') ? 'Case study' : 'Demaze';
  };
  // the nav bar as a clip-path (the sheet's smallest shape); a small pill at the top if the bar is out of view
  const barClip = () => {
    const b = $('.nav__bar');
    const r = b && b.getBoundingClientRect();
    if (!r || r.bottom <= 0) return 'inset(14px calc(50% - 70px) calc(100% - 58px) calc(50% - 70px) round 999px)';
    return `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 999px)`;
  };
  const FULL = 'inset(0px 0px 0px 0px round 0px)';
  const CZ = 'cubic-bezier(.76,0,.24,1)';
  if (curtain && root.classList.contains('curtain-in') && curtain.animate) {
    const inner = $('.curtain__inner', curtain);
    $('[data-curtain-label]', curtain).textContent = JSON.parse(getComputedStyle(root).getPropertyValue('--curtain-label') || '""');
    curtain.classList.add('is-open');
    root.classList.remove('curtain-in');
    inner.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.94) translateY(-24px)' }], { duration: 380, delay: 160, easing: CZ, fill: 'both' });
    curtain.animate([{ clipPath: FULL, opacity: 1 }, { clipPath: barClip(), opacity: 1, offset: 0.85 }, { clipPath: barClip(), opacity: 0 }], { duration: 820, delay: 200, easing: CZ, fill: 'both' })
      .onfinish = () => { curtain.classList.remove('is-open'); curtain.getAnimations().concat(inner.getAnimations()).forEach((a) => a.cancel()); };
  } else root.classList.remove('curtain-in');
  let leaving = false;
  if (curtain && curtain.animate && root.classList.contains('motion')) document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // (a link within this page)
    e.preventDefault();
    leaving = true;
    const label = labelOf(url);
    try { sessionStorage.setItem('dmz-curtain', label); } catch (err) { /* no storage: the next page simply opens */ }
    $('[data-curtain-label]', curtain).textContent = label;
    curtain.classList.add('is-open');
    curtain.animate([{ clipPath: barClip(), opacity: 0 }, { clipPath: barClip(), opacity: 1, offset: 0.12 }, { clipPath: FULL, opacity: 1 }], { duration: 700, easing: CZ, fill: 'forwards' });
    $('.curtain__inner', curtain).animate([{ transform: 'scale(0.92) translateY(-30px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 620, delay: 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
    setTimeout(() => { location.href = url.href; }, 860);
  });
  // back to a page kept in memory: the curtain it left under must not still cover it
  addEventListener('pageshow', (e) => {
    if (!e.persisted || !curtain) return;
    leaving = false;
    curtain.getAnimations().concat($('.curtain__inner', curtain).getAnimations()).forEach((a) => a.cancel());
    curtain.classList.remove('is-open');
  });

  // ---------- UI that works regardless of motion ----------
  const nav = $('[data-nav]');
  const toggle = $('.nav__toggle');
  const menu = $('#menu');
  const scrim = $('[data-nav-scrim]');
  let lenis = null;
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = scrim.hidden = !open;
    root.classList.toggle('menu-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => e.matches && setMenu(false));

  // Desktop links: a single pill glides to the hovered/focused link and rests on the current page.
  const links = $('[data-nav-links]');
  if (links) {
    const pill = $('.nav__pill', links);
    const current = $('a[aria-current]', links);
    const moveTo = (a) => {
      links.classList.toggle('has-pill', !!a);
      $$('a', links).forEach((l) => l.classList.toggle('is-pill', l === a));
      if (a) { pill.style.setProperty('--x', a.offsetLeft + 'px'); pill.style.setProperty('--w', a.offsetWidth + 'px'); }
    };
    links.addEventListener('pointerover', (e) => { const a = e.target.closest('a'); if (a) moveTo(a); });
    links.addEventListener('focusin', (e) => moveTo(e.target.closest('a')));
    links.addEventListener('pointerleave', () => moveTo(current));
    links.addEventListener('focusout', () => moveTo(current));
    // Place it without animating on load, once the web font has set link widths.
    const place = () => { pill.style.transition = 'none'; moveTo(current); pill.offsetWidth; pill.style.transition = ''; };
    place();
    document.fonts && document.fonts.ready.then(place);
  }

  // Tabs (industries, tools): roving tabindex + arrow keys.
  $$('[data-tabs]').forEach((box) => {
    const tabs = $$('[role=tab]', box);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on && motion) gsap.fromTo(panel.querySelectorAll('li, h3'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out', overwrite: true });
        if (on) box.dispatchEvent(new CustomEvent('tabchange', { bubbles: true, detail: panel }));
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  // FAQ accordion.
  $$('[data-acc]').forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open);
    document.getElementById(b.getAttribute('aria-controls')).classList.toggle('is-open', open);
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 450);
  }));

  // The brief (contact page): check it, send it to /api/contact, then swap in the thank-you. If delivery is down the
  // brief stays as typed, with a link that opens it as an email instead.
  const form = $('[data-form]');
  const done = $('[data-form-done]');
  if (form && done) {
    const note = $('[data-form-note]', form);
    const submit = $('button[type=submit]', form);
    const say = (html) => { note.innerHTML = html; };
    const checks = {
      name: (v) => (v.length >= 2 ? '' : 'Please add your name.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please add an email we can reply to.'),
      message: (v) => (v.length >= 10 ? '' : 'A line or two about the project, please (10 characters or more).'),
    };
    let tried = false;
    const validate = () => {
      let first = null;
      Object.entries(checks).forEach(([n, check]) => {
        const f = form.elements[n];
        const msg = check(f.value.trim());
        f.setAttribute('aria-invalid', msg ? 'true' : 'false');
        $(`[data-err="${n}"]`, form).textContent = msg;
        if (msg && !first) first = f;
      });
      return first;
    };
    form.addEventListener('input', () => { if (tried) validate(); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      tried = true;
      const bad = validate();
      if (bad) { say('Please check the highlighted fields.'); bad.focus(); return; }
      const f = new FormData(form);
      const d = {
        name: f.get('name').trim(), email: f.get('email').trim(), company: (f.get('company') || '').trim(),
        subject: f.getAll('need').join(', ').slice(0, 160) || 'General enquiry', stage: f.get('stage') || '',
        message: f.get('message').trim(), website: f.get('website') || '',
      };
      submit.disabled = true;
      say('Sending your brief…');
      try {
        const res = await fetch(form.action || '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(d),
          credentials: 'same-origin',
        });
        if (res.ok) {
          form.hidden = true;
          done.hidden = false;
          done.focus({ preventScroll: true });
          done.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' });
          return;
        }
        if (res.status === 429) { say('Too many messages from here just now. Please wait a few minutes and try again.'); return; }
        if (res.status === 400) { say('Something in the brief didn’t go through. Please check it and try again.'); return; }
        throw new Error('delivery failed');
      } catch {
        const body = `${d.message}\n\nNeeds: ${d.subject}\nStage: ${d.stage || '-'}\nCompany: ${d.company || '-'}\n\nFrom ${d.name} (${d.email})`;
        const href = `mailto:contact@demazetech.com?subject=${encodeURIComponent(`Project brief | ${d.name}`)}&body=${encodeURIComponent(body)}`;
        say(`We couldn’t send that just now. Your brief is still here: try again, or <a class="link" href="${href}">email it to us instead</a>.`);
      } finally {
        submit.disabled = false;
      }
    });
    $('[data-form-again]', done).addEventListener('click', () => {
      form.reset();
      tried = false;
      $$('[data-err]', form).forEach((el) => { el.textContent = ''; });
      $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
      say('We only use your details to reply to you.');
      done.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }

  // Segmented controls ([data-seg]): a glass pill glides to the chosen option (aria-pressed), however the row wraps or
  // scrolls; it is measured, so it follows resizes and font loading too.
  $$('[data-seg]').forEach((box) => {
    const thumb = document.createElement('i');
    thumb.className = 'seg__thumb';
    thumb.setAttribute('aria-hidden', 'true');
    box.prepend(thumb);
    const place = () => {
      const on = $('[aria-pressed="true"]', box);
      box.classList.toggle('has-thumb', !!on);
      if (on) thumb.style.cssText = `width:${on.offsetWidth}px;height:${on.offsetHeight}px;transform:translate(${on.offsetLeft}px,${on.offsetTop}px)`;
    };
    new MutationObserver(place).observe(box, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] });
    new ResizeObserver(place).observe(box);
    place();
    requestAnimationFrame(() => box.classList.add('seg--ready')); // glide from now on, not on the first placement
  });

  // Projects: show all work, or the projects under one service. Cards that stay fade back in, in order.
  const filters = $$('[data-filter]');
  const filterStatus = $('[data-filter-status]');
  filters.forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.filter;
    filters.forEach((x) => x.setAttribute('aria-pressed', x === b));
    b.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'nearest', inline: 'nearest' }); // (the row scrolls on phones)
    let n = 0;
    $$('.pcard[data-svcs]').forEach((c) => {
      const on = id === 'all' || c.dataset.svcs.split(' ').includes(id);
      c.hidden = !on;
      if (on && motion) c.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: Math.min(n, 8) * 40, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
      if (on) n++;
    });
    b.closest('.projects').toggleAttribute('data-filtered', id !== 'all');
    filterStatus.textContent = `Showing ${n} project${n === 1 ? '' : 's'}`;
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  // Each service's "what's included" list starts folded on phones (open without JS, and on wider screens).
  if (matchMedia('(max-width: 860px)').matches) $$('[data-fold]').forEach((d) => { d.open = false; });

  // Services list buttons (also used when motion is off).
  const svcBtns = $$('[data-svc-btn]');
  const svcPanels = $$('[data-svc-panel]');
  const setSvc = (i, p = 1) => {
    svcBtns.forEach((b, j) => { b.classList.toggle('is-active', j === i); b.style.setProperty('--p', j === i ? p : 0); });
    svcPanels.forEach((pn, j) => pn.classList.toggle('is-active', j === i));
  };

  // Split text into words for staggered/scrubbed reveals. The parent keeps an accessible label.
  const split = (el, cls) => {
    const walk = (node) => [...node.childNodes].flatMap((n) => {
      if (n.nodeType === 3) {
        return n.textContent.split(/(\s+)/).filter(Boolean).map((t) => {
          if (/^\s+$/.test(t)) return document.createTextNode(' ');
          const w = document.createElement('span');
          w.className = cls;
          if (cls === 'w') { const s = document.createElement('span'); s.textContent = t; w.append(s); } else w.textContent = t;
          return w;
        });
      }
      const clone = n.cloneNode(false);
      clone.append(...walk(n));
      return [clone];
    });
    el.setAttribute('aria-label', el.textContent.trim());
    const parts = walk(el);
    el.replaceChildren(...parts);
    [...el.children].forEach((c) => c.setAttribute('aria-hidden', 'true'));
    return cls === 'w' ? $$('.w > span', el) : $$('.' + cls, el);
  };

  // Services click works without motion; with motion it scrolls to the pinned step (below).
  svcBtns.forEach((b, i) => b.addEventListener('click', () => setSvc(i)));

  // Knowledge map: wires from the Demaze sphere to every discipline card, and a fan from the active card
  // to each of its tools. Hovering a card (fine pointers) selects it like a click; the tab code above
  // swaps the panel and fires 'tabchange', after which the fan is redrawn and drawn in.
  $$('[data-kmap-stage]').forEach((stage) => {
    const svg = $('[data-kmap-wires]', stage);
    const core = $('.kmap__sphere', stage);
    const cats = $$('[data-kmap-cat]', stage);
    const NS = 'http://www.w3.org/2000/svg';
    const wide = matchMedia('(min-width: 961px)');
    const wire = (x1, y1, x2, y2, cls) => {
      const p = document.createElementNS(NS, 'path');
      const dx = (x2 - x1) * 0.55;
      p.setAttribute('d', `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`);
      p.setAttribute('class', cls);
      p.setAttribute('pathLength', '1');
      return p;
    };
    const draw = (animate) => {
      if (!wide.matches) { svg.replaceChildren(); return; }
      const box = stage.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const at = (el, side) => { const r = el.getBoundingClientRect(); return [(side === 'l' ? r.left : side === 'r' ? r.right : r.left + r.width / 2) - box.left, r.top + r.height / 2 - box.top]; };
      const [cx, cy] = at(core, 'c');
      const cr = core.getBoundingClientRect().width / 2;
      const active = cats.find((c) => c.getAttribute('aria-selected') === 'true');
      const paths = cats.map((c) => { const [x, y] = at(c, 'l'); return wire(cx + cr * 0.92, cy, x, y, 'kmap__wire' + (c === active ? ' is-on' : '')); });
      const panel = active && document.getElementById(active.getAttribute('aria-controls'));
      if (panel) {
        const [ax, ay] = at(active, 'r');
        $$('[data-kmap-dot]', panel).forEach((d, i) => {
          const [x, y] = at(d, 'c');
          const p = wire(ax, ay, x, y, 'kmap__fan' + (animate ? ' is-drawing' : ''));
          p.style.animationDelay = i * 22 + 'ms';
          paths.push(p);
        });
      }
      svg.replaceChildren(...paths);
    };
    stage.addEventListener('tabchange', () => requestAnimationFrame(() => draw(true)));
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let t = 0;
      cats.forEach((c) => c.addEventListener('pointerenter', () => { clearTimeout(t); t = setTimeout(() => c.getAttribute('aria-selected') !== 'true' && c.click(), 90); }));
      stage.addEventListener('pointerleave', () => clearTimeout(t));
    }
    new ResizeObserver(() => draw(false)).observe(stage);
    wide.addEventListener('change', () => draw(false));
    if (document.fonts) document.fonts.ready.then(() => draw(false));

    // The sphere: a few hundred dots on a slowly turning ball, drawn in 2D (no WebGL needed here).
    const ctx = core.getContext('2d');
    const DOTS = 420;
    const pts = Array.from({ length: DOTS }, (_, i) => {
      const y = 1 - (i + 0.5) / DOTS * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    let spin = 0.6, raf = 0, seen = false;
    const paint = () => {
      const S = core.width, R = S * 0.4, c = Math.cos(spin), s = Math.sin(spin);
      ctx.clearRect(0, 0, S, S);
      for (const [x, y, z] of pts) {
        const X = x * c + z * s, Z = -x * s + z * c;
        const Y = y * 0.96 + Z * 0.28, Z2 = Z * 0.96 - y * 0.28; // slight tilt toward the viewer
        const f = (Z2 + 1) / 2;
        ctx.globalAlpha = 0.08 + f * f * 0.85;
        ctx.fillStyle = '#a9b8ff';
        ctx.beginPath(); ctx.arc(S / 2 + X * R, S / 2 - Y * R, 1.4 + f * 2.6, 0, 6.283); ctx.fill();
      }
    };
    const loop = () => { spin += 0.004; paint(); raf = seen ? requestAnimationFrame(loop) : 0; };
    paint();
    if (motion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !raf) raf = requestAnimationFrame(loop); }).observe(core);
    }
  });

  // Card spotlight: feed the pointer position to CSS (delegated, fine pointers only).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', (e) => {
      const c = e.target.closest && e.target.closest('.drive, .pcard');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    }, { passive: true });
  }

  // Home hero opening (cine.js reads the decision): it plays once per session and only with motion on.
  const cine = $('[data-cine]');
  let introDelay = 0;
  if (cine) {
    let seen = true;
    try { seen = sessionStorage.getItem('demaze-intro') === '1'; sessionStorage.setItem('demaze-intro', '1'); } catch (e) { /* storage blocked: skip the intro */ }
    cine.dataset.intro = motion && !seen ? 'play' : 'rest';
    if (cine.dataset.intro === 'play') introDelay = 4.4;
  }

  if (!motion) return;

  // ---------- motion ----------
  gsap.registerPlugin(ScrollTrigger);
  lenis = window.Lenis ? new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }) : null;
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const t = a.getAttribute('href') === '#main' && a.hasAttribute('data-top') ? 0 : $(a.getAttribute('href'));
      if (t === null) return;
      e.preventDefault();
      lenis.scrollTo(t, { offset: -90 });
    }));
  }
  const EASE = 'expo.out';

  // Nav: tint after hero, hide on fast downward scroll, show on up.
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (st) => {
      const y = st.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', y > 400 && y > lastY && menu.hidden);
      lastY = y;
    },
  });
  nav.classList.toggle('is-scrolled', scrollY > 40); // reload mid-page

  // Hero intro: title words rise out of their clip, then supporting copy, then the card fan.
  const hero = $('[data-hero]');
  if (hero) {
    const words = split($('[data-split=hero]', hero), 'w');
    const tl = gsap.timeline({ defaults: { ease: EASE }, paused: !!introDelay });
    tl.from(words, { yPercent: 140, rotate: 4, duration: 1.3, stagger: 0.055 }, 0.1)
      .to($$('[data-hero-fade]', hero), { opacity: 1, duration: 1 }, 0.35)
      .from($$('[data-hero-fade]', hero), { y: 24, duration: 1.2, stagger: 0.08 }, 0.35);
    const proof = $('[data-hero-proof]', hero);
    if (proof) tl.fromTo(proof, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.4 }, 0.6);
    // Underline draws under the emphasised phrase after its words land.
    const em = $('.hero__title em', hero);
    if (em) tl.to(em, { backgroundSize: '100% 0.07em', duration: 1.1, ease: 'power3.inOut' }, 0.9);
    // During the opening the copy waits in its hidden start state, then plays as the globe settles.
    // Under the brand opening the headline waits until the sheet has folded away.
    if (!introDelay && root.classList.contains('intro-on')) { tl.pause(); window.dmzOpening.then(() => tl.play()); }
    if (introDelay) {
      tl.progress(0);
      let started = false;
      const go = () => { if (!started) { started = true; tl.play(); } };
      cine.addEventListener('cine:rest', go, { once: true });
      gsap.delayedCall(introDelay + 3, go); // safety net if the opening never reports in
    }
    gsap.to($('.hero__content, .phero__content', hero), {
      yPercent: -18, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    // Pointer glow: damped follow (lerp) so it has weight instead of snapping to the cursor.
    const glow = $('[data-glow]', hero);
    const panel = glow && glow.closest('.hero__panel, .phero__panel');
    if (glow && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const qx = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power3.out' });
      const qy = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power3.out' });
      panel.addEventListener('pointermove', (e) => { const r = panel.getBoundingClientRect(); qx(e.clientX - r.left); qy(e.clientY - r.top); });
    }
  }

  // Section headings: word rise on enter.
  $$('[data-split]:not([data-split=hero])').forEach((h) => {
    const words = split(h, 'w');
    gsap.from(words, { yPercent: 110, duration: 1.1, stagger: 0.045, ease: EASE, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });

  // Generic reveals.
  $$('[data-reveal]').forEach((el) => gsap.fromTo(el, { opacity: 0, y: 40 }, {
    opacity: 1, y: 0, duration: 1.1, ease: EASE, scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  }));
  $$('[data-stagger]').forEach((g) => gsap.fromTo(g.children, { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: EASE, scrollTrigger: { trigger: g, start: 'top 85%', once: true },
  }));

  // Scrubbed word reveal (manifesto, founder quote): words brighten as you read down.
  $$('[data-scrub-words]').forEach((p) => {
    const words = split(p, 'sw');
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });
  });

  // Founder photo drifts against the quote as it passes (depth, not decoration on every image).
  $$('.quote__photo').forEach((img) => gsap.fromTo(img, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));

  // Footer wordmark: letters rise out of the baseline in sequence when the footer arrives.
  $$('[data-word]').forEach((w) => gsap.from(w.children, {
    yPercent: 100, duration: 1.2, stagger: 0.06, ease: EASE, scrollTrigger: { trigger: w, start: 'top 95%', once: true },
  }));


  // Count-up metrics.
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    el.textContent = '0';
    // Hero stats sit at the very bottom of the first screen, so they count up with the intro instead.
    const inHero = el.closest('[data-hero]');
    gsap.to(o, { v: end, duration: 2, delay: inHero ? 0.8 : 0, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: inHero ? null : { trigger: el, start: 'top 90%', once: true } });
  });

  // Industries: while in view, cycle through the tabs. The chip's CSS progress fill sets the pace;
  // when it ends we advance. Hover pauses; any real click or key press hands control to the visitor.
  $$('[data-ind-auto]').forEach((box) => {
    const tabs = $$('[role=tab]', box);
    let stopped = false;
    const stop = (e) => { if (e.isTrusted) { stopped = true; box.classList.remove('is-auto'); } };
    $('[role=tablist]', box).addEventListener('click', stop);
    $('[role=tablist]', box).addEventListener('keydown', stop);
    box.addEventListener('pointerenter', () => box.classList.add('is-paused'));
    box.addEventListener('pointerleave', () => box.classList.remove('is-paused'));
    box.addEventListener('animationend', (e) => {
      if (e.animationName !== 'indprog' || stopped) return;
      const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      tabs[(i + 1) % tabs.length].click();
    });
    ScrollTrigger.create({ trigger: box, start: 'top 70%', end: 'bottom 30%', onToggle: (st) => box.classList.toggle('is-auto', st.isActive && !stopped) });
  });

  // Project deck (desktop): the section pins for one screen and each card slides up over the last.
  const deck = $('[data-deck]');
  if (deck) {
    ScrollTrigger.matchMedia({
      '(min-width: 861px)': () => {
        const cards = $$('[data-stack-card]', deck);
        deck.classList.add('is-deck');
        const tl = gsap.timeline({
          // On short screens the section is taller than the viewport, so pin by its bottom edge to keep the cards whole.
          scrollTrigger: {
            trigger: deck.closest('section'), pin: true, scrub: 0.6, invalidateOnRefresh: true,
            start: () => (deck.closest('section').offsetHeight > innerHeight ? 'bottom bottom' : 'top top'),
            end: () => '+=' + innerHeight * 0.75 * (cards.length - 1),
          },
        });
        cards.forEach((c, i) => {
          if (!i) return;
          tl.fromTo(c, { yPercent: 108 }, { yPercent: 0, ease: 'none' }, i - 1)
            .to($('.stack-card__inner', cards[i - 1]), { scale: 0.94, ease: 'none' }, i - 1)
            .to($('.stack-card__shade', cards[i - 1]), { opacity: 0.3, ease: 'none' }, i - 1);
        });
        return () => {
          deck.classList.remove('is-deck');
          gsap.set([...cards, ...$$('.stack-card__inner, .stack-card__shade', deck)], { clearProps: 'all' });
        };
      },
    });
  }

  // Services: pin on desktop, scroll drives the active service.
  const svc = $('[data-services]');
  if (svc) {
    ScrollTrigger.matchMedia({
      '(min-width: 1025px)': () => {
        const n = svcPanels.length;
        const st = ScrollTrigger.create({
          trigger: svc, pin: $('.services__pin', svc), start: 'top top', end: () => '+=' + innerHeight * n * 0.55,
          onUpdate: (s) => {
            const f = Math.min(s.progress * n, n - 0.001);
            setSvc(Math.floor(f), f % 1);
          },
        });
        svcBtns.forEach((b, i) => b.addEventListener('click', () => {
          const y = st.start + ((st.end - st.start) * (i + 0.5)) / n;
          lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: 'smooth' });
        }));
        return () => setSvc(0);
      },
    });
  }

  // Pins (projects deck, services) add scroll distance; triggers below them must be measured after them.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  // Recompute after fonts/images change layout.
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
