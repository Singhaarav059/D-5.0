// Demaze — interactions + motion. GSAP/ScrollTrigger/Lenis are optional: without them
// (or with reduced motion) every element is already in its final, visible state.
(() => {
  const root = document.documentElement;
  const motion = root.classList.contains('motion') && window.gsap && window.ScrollTrigger;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

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

  // Desktop links: a glass pill glides to the hovered/focused link (or open menu) and rests on the current page.
  const links = $('[data-nav-links]');
  let openDrop = null;
  if (links) {
    const pill = $('.nav__pill', links);
    const current = $('a[aria-current]', links);
    const rest = () => openDrop || current;
    const moveTo = (a) => {
      links.classList.toggle('has-pill', !!a);
      $$('a, button', links).forEach((l) => l.classList.toggle('is-pill', l === a));
      if (a) { pill.style.setProperty('--x', a.offsetLeft + 'px'); pill.style.setProperty('--w', a.offsetWidth + 'px'); }
    };
    links.addEventListener('pointerover', (e) => { const a = e.target.closest('a, button'); if (a) moveTo(a); });
    links.addEventListener('focusin', (e) => moveTo(e.target.closest('a, button')));
    links.addEventListener('pointerleave', () => moveTo(rest()));
    links.addEventListener('focusout', () => moveTo(rest()));

    // The menus under the bar (Projects, Services): the labels are links to their pages. A mouse opens the menu on hover
    // (with a short grace period so the pointer can travel into it) and a click follows the link; a touch opens it on
    // the first tap and follows on the second; the keyboard opens it with ArrowDown (Enter follows). Escape, a click
    // elsewhere, focus leaving or the bar hiding on scroll closes them.
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const triggers = $$('[data-drop]', links);
    let closing = 0;
    const setDrop = (btn) => {
      clearTimeout(closing);
      openDrop = btn;
      triggers.forEach((t) => {
        const on = t === btn;
        t.setAttribute('aria-expanded', on);
        document.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-open', on);
      });
      nav.classList.toggle('has-drop', !!btn);
      moveTo(btn || current);
    };
    const later = () => { clearTimeout(closing); closing = setTimeout(() => setDrop(null), 220); };
    triggers.forEach((t) => {
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      t.addEventListener('click', (e) => { if (!fine && openDrop !== t) { e.preventDefault(); setDrop(t); } });
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown') return;
        e.preventDefault();
        setDrop(t);
        const first = panel.querySelector('a, button');
        if (first) first.focus();
      });
      t.addEventListener('focusout', (e) => { if (openDrop === t && !panel.contains(e.relatedTarget)) setDrop(null); });
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
    new MutationObserver(() => { if (nav.classList.contains('is-hidden') && openDrop) setDrop(null); }).observe(nav, { attributes: true, attributeFilter: ['class'] });
    // Place it without animating on load, once the web font has set link widths.
    const place = () => { pill.style.transition = 'none'; moveTo(current); pill.offsetWidth; pill.style.transition = ''; };
    place();
    document.fonts && document.fonts.ready.then(place);
  }

  // Segmented controls ([data-seg]): a raised glass thumb glides to the chosen option (aria-pressed, aria-selected or
  // .is-active), however the row wraps or scrolls; it is measured, so it follows resizes and font loading too.
  $$('[data-seg]').forEach((box) => {
    const thumb = document.createElement('i');
    thumb.className = 'seg__thumb';
    thumb.setAttribute('aria-hidden', 'true');
    box.prepend(thumb);
    const place = () => {
      const on = box.querySelector('[aria-pressed="true"], [aria-selected="true"], .is-active');
      box.classList.toggle('has-thumb', !!on);
      if (!on) return;
      thumb.style.cssText = `width:${on.offsetWidth}px;height:${on.offsetHeight}px;transform:translate(${on.offsetLeft}px,${on.offsetTop}px)`;
    };
    new MutationObserver(place).observe(box, { subtree: true, attributes: true, attributeFilter: ['aria-pressed', 'aria-selected', 'class'] });
    new ResizeObserver(place).observe(box);
    place();
    requestAnimationFrame(() => box.classList.add('seg--ready')); // glide from now on, not on the first placement
  });

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
        if (on && motion) gsap.fromTo(panel.querySelectorAll('li, h3'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.02, ease: 'power3.out', overwrite: true });
        if (on) box.dispatchEvent(new CustomEvent('tabchange', { bubbles: true, detail: panel }));
      });
      if (focus) tab.focus();
      // a sideways strip of tabs (tablet, phone) keeps the picked one in view, without moving the page
      const strip = tab.parentElement;
      if (strip.scrollWidth > strip.clientWidth) {
        const x = tab.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
        strip.scrollTo({ left: x - 16, behavior: motion ? 'smooth' : 'auto' });
      }
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

  // Contact form: use the protected API when configured, with mail fallback for local preview.
  $$('[data-form]').forEach((form) => form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = $('[data-form-note]', form);
    let bad = null;
    ['name', 'email', 'message'].forEach((n) => {
      const f = form.elements[n];
      const ok = f.value.trim() && (n !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
      f.setAttribute('aria-invalid', !ok);
      if (!ok && !bad) bad = f;
    });
    if (bad) { note.textContent = 'Please fill in your name, a valid email and a message.'; bad.focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    const body = `${d.message}\n\nFrom ${d.name} (${d.email})`;
    const submit = $('button[type=submit]', form);
    submit.disabled = true;
    note.textContent = 'Sending your message…';
    try {
      const response = await fetch(form.action || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(d),
        credentials: 'same-origin',
      });
      if (response.ok) {
        form.reset();
        note.textContent = 'Thanks — your message was sent successfully.';
        return;
      }
      if (response.status === 400) {
        note.textContent = 'Please check the form fields and try again.';
        return;
      }
      if (response.status === 429) {
        note.textContent = 'Too many attempts. Please wait a few minutes and try again.';
        return;
      }
      throw new Error('contact delivery failed');
    } catch (error) {
      // A local preview or an unconfigured deployment can still open the visitor's mail app.
      location.href = `mailto:contact@demazetech.com?subject=${encodeURIComponent(d.subject + ' | ' + d.name)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Your email app should open with the message ready to send.';
    } finally {
      submit.disabled = false;
    }
  }));

  // Services list buttons (also used when motion is off). `onSvc` lets the demos (below) follow the active panel.
  const svcBtns = $$('[data-svc-btn]');
  const svcPanels = $$('[data-svc-panel]');
  let onSvc = () => {};
  const setSvc = (i, p = 1) => {
    svcBtns.forEach((b, j) => { b.classList.toggle('is-active', j === i); b.style.setProperty('--p', j === i ? p : 0); });
    svcPanels.forEach((pn, j) => pn.classList.toggle('is-active', j === i));
    onSvc();
  };

  // Service demos (templates/demos.js) are drawn on a 520 x 240 canvas and scaled to their panel. A narrow panel
  // (phones) shows the demo's main window alone, larger, rather than the whole canvas too small to read.
  const DEMO_MAIN = { ai: 244, web: 392, ecom: 318, cloud: 318 };
  $$('[data-demo]').forEach((el) => new ResizeObserver(([e]) => {
    const { width: w, height: h } = e.contentRect;
    const narrow = w < 470;
    el.parentElement.classList.toggle('is-narrow', narrow);
    el.style.setProperty('--s', Math.min((w - 24) / (narrow ? DEMO_MAIN[el.dataset.demo] : 520), (h - 20) / 240).toFixed(4));
  }).observe(el.parentElement));

  // About: hovering a value's card lights its station on the drawing beside it, and hovering a station its card.
  const valueParts = $$('.drive[data-v], .values__stop');
  const lightValue = (v) => valueParts.forEach((el) => el.classList.toggle('is-lit', el.dataset.v === v));
  valueParts.forEach((el) => { el.addEventListener('pointerenter', () => lightValue(el.dataset.v)); el.addEventListener('pointerleave', () => lightValue(null)); });

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

  // Tools map: the Demaze stack wired to its six discipline cards, and the active card to each of its tools. Wires run
  // like the maze's route, in straight runs with rounded corners. Picking a discipline (hovering a card, with a fine
  // pointer, selects it like a click) pulls its layer out of the stack, colours the stage (--mk) and draws its lines
  // to its tools in; the tab code above swaps the panel and fires 'tabchange'.
  $$('[data-kmap-stage]').forEach((stage) => {
    const svg = $('[data-kmap-wires]', stage);
    const cats = $$('[data-kmap-cat]', stage);
    const plates = []; // by layer (the pile is drawn bottom up, so page order is reversed)
    $$('[data-kmap-plate]', stage).forEach((p) => { plates[+p.dataset.kmapPlate] = p; });
    const ports = $$('[data-kmap-port]', stage);
    const NS = 'http://www.w3.org/2000/svg';
    const wide = matchMedia('(min-width: 1025px)');
    // a route from (x1, y1) to (x2, y2): across to `bend`, up or down, across again, corners rounded
    const route = (x1, y1, x2, y2, bend = (x1 + x2) / 2) => {
      const dy = y2 - y1, r = Math.min(10, Math.abs(dy) / 2, Math.abs(bend - x1), Math.abs(x2 - bend)), s = Math.sign(dy);
      if (!s || r < 1) return `M${x1} ${y1}H${bend}V${y2}H${x2}`;
      return `M${x1} ${y1}H${bend - r}Q${bend} ${y1} ${bend} ${y1 + s * r}V${y2 - s * r}Q${bend} ${y2} ${bend + r} ${y2}H${x2}`;
    };
    // (`unit`: measure the path as 1, for lines that draw on or carry a pulse; dotted wires keep real lengths)
    const path = (d, cls, unit = true) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', cls);
      if (unit) p.setAttribute('pathLength', '1');
      return p;
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
      // each layer's wire bends at its own distance, so the six runs never lie on top of each other
      const first = at(cats[0], 'l')[0];
      const paths = [];
      cats.forEach((c, i) => {
        const [x1, y1] = at(ports[i], 'c'), [x2, y2] = at(c, 'l');
        const d = route(x1 + 4, y1, x2, y2, x1 + (first - x1) * (0.25 + i * 0.1));
        if (i === on) paths.push(path(d, 'kmap__wire is-on'), path(d, 'kmap__pulse'));
        else paths.unshift(path(d, 'kmap__wire', false));
      });
      // the active card's line to each of its tools: one run out of the card, then a branch to each
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
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let t = 0;
      cats.forEach((c) => c.addEventListener('pointerenter', () => { clearTimeout(t); t = setTimeout(() => c.getAttribute('aria-selected') !== 'true' && c.click(), 90); }));
      stage.addEventListener('pointerleave', () => clearTimeout(t));
    }
    new ResizeObserver(() => draw(false)).observe(stage);
    wide.addEventListener('change', () => draw(false));
    if (document.fonts) document.fonts.ready.then(() => draw(false));
  });

  // Projects page: filter the cards by service (?filter=<id> preselects). Cards that come and go glide into place
  // with a same-page view transition where the browser has them.
  const grid = $('[data-pgrid]');
  if (grid) {
    const btns = $$('[data-filter]');
    const setFilter = (f, animate) => {
      const apply = () => {
        grid.dataset.filter = f;
        btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.filter === f));
        $$('.pcard', grid).forEach((c) => { c.hidden = f !== 'all' && !c.dataset.services.split(' ').includes(f); });
      };
      const done = () => { root.classList.remove('is-filtering'); if (window.ScrollTrigger) ScrollTrigger.refresh(); };
      if (animate && motion && document.startViewTransition) {
        root.classList.add('is-filtering');
        document.startViewTransition(apply).finished.then(done, done);
      } else { apply(); done(); }
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      setFilter(b.dataset.filter, true);
      const u = new URL(location.href);
      if (b.dataset.filter === 'all') u.searchParams.delete('filter'); else u.searchParams.set('filter', b.dataset.filter);
      history.replaceState(null, '', u);
    }));
    const q = new URLSearchParams(location.search).get('filter');
    if (q && btns.some((b) => b.dataset.filter === q)) setFilter(q, false);
  }

  // Projects page: card opens a modal with the full case study (native <dialog>: Esc, focus trap, top layer).
  // The arrows (and the left/right keys) step to the neighbouring case without closing. Every case has its own
  // address (#<project>): opening one updates it, and arriving on it opens the case.
  const dlg = $('[data-pdlg]');
  if (dlg) {
    const body = $('[data-pdlg-body]', dlg);
    const total = $$('[data-proj-tpl]').length;
    const cards = $$('[data-proj]').map((b) => b.closest('.pcard'));
    let current = 0;
    const show = (i, dir = 0) => {
      $('[data-reel]', body)?.reel?.destroy();
      current = (i + total) % total;
      body.replaceChildren($(`[data-proj-tpl="${current}"]`).content.cloneNode(true));
      dlg.setAttribute('aria-labelledby', `pdlg-title-${current}`);
      body.scrollTop = 0;
      $('.pdlg__body', body).scrollTop = 0;
      if (dir && motion) { body.style.setProperty('--dir', dir); body.classList.remove('is-swapping'); void body.offsetWidth; body.classList.add('is-swapping'); }
      // the case's motion reel plays large in the dialog (reel.js; absent with reduced motion or no JS)
      const media = $('[data-reel]', body);
      if (media && window.Reel) window.Reel.mount(media);
      history.replaceState(null, '', '#' + cards[current].id);
    };
    $$('[data-proj]').forEach((b) => b.addEventListener('click', () => { show(+b.dataset.proj); dlg.showModal(); }));
    $$('[data-pdlg-step]', dlg).forEach((b) => b.addEventListener('click', () => show(current + +b.dataset.pdlgStep, +b.dataset.pdlgStep)));
    dlg.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d && !e.target.closest('input, textarea, select')) { e.preventDefault(); show(current + d, d); }
    });
    dlg.addEventListener('close', () => {
      $('[data-reel]', body)?.reel?.destroy();
      body.classList.remove('is-swapping');
      history.replaceState(null, '', location.pathname + location.search);
    });
    // after every deferred script (the reels) has run
    const fromHash = () => {
      const i = cards.findIndex((c) => c.id === decodeURIComponent(location.hash.slice(1)));
      if (i >= 0 && !dlg.open) { show(i); dlg.showModal(); }
    };
    addEventListener('DOMContentLoaded', fromHash);
    addEventListener('hashchange', fromHash);
    $('[data-pdlg-close]', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // backdrop click
  }

  if (!motion) {
    // without motion the nav still turns to frosted paper once the page moves, so it never sits bare over the text
    const tint = () => nav.classList.toggle('is-scrolled', scrollY > 40);
    addEventListener('scroll', tint, { passive: true });
    tint();
    return;
  }

  // ---------- motion ----------
  gsap.registerPlugin(ScrollTrigger);
  lenis = window.Lenis ? new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }) : null;
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // Freeze the page behind the project modal; the modal itself scrolls natively (data-lenis-prevent).
    if (dlg) {
      new MutationObserver(() => (dlg.open ? lenis.stop() : lenis.start())).observe(dlg, { attributes: true, attributeFilter: ['open'] });
    }
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const t = a.getAttribute('href') === '#main' && a.hasAttribute('data-top') ? 0 : $(a.getAttribute('href'));
      if (t === null) return;
      e.preventDefault();
      // a target inside a scroll scene (journey.js) says where in the scene to land
      const y = t && t.scrollTarget ? t.scrollTarget() : t;
      lenis.scrollTo(y, { offset: typeof y === 'number' ? 0 : -90 });
    }));
  }
  // One curve and one travel distance for everything that enters: short, quiet, never bouncing.
  const EASE = 'power3.out';
  const RISE = 16;

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

  // Hero intro: the headline's words rise out of their clip, then the supporting copy settles in.
  // (The home maze below it is journey.js.)
  const hero = $('[data-hero]');
  if (hero) {
    const title = $('[data-split=hero]', hero);
    const words = split(title, 'w');
    gsap.timeline({ defaults: { ease: EASE } })
      .call(() => title.classList.add('is-in'), null, 0.7)
      .from(words, { yPercent: 105, duration: 1, stagger: 0.045 }, 0.1)
      .fromTo($$('[data-hero-fade]', hero), { opacity: 0, y: RISE }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.35);
  }

  // Everything else enters the same way: a short rise and fade, once.
  // (.is-in lets CSS finish the entrance: the headline's marker swipe and its doodle drawing on)
  $$('[data-reveal]').forEach((el) => gsap.fromTo(el, { opacity: 0, y: RISE }, {
    opacity: 1, y: 0, duration: 0.8, ease: EASE, onStart: () => el.classList.add('is-in'), scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  }));
  $$('[data-stagger]').forEach((g) => gsap.fromTo(g.children, { opacity: 0, y: RISE }, {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: EASE, scrollTrigger: { trigger: g, start: 'top 88%', once: true },
  }));

  // Dark sheets settle into place as they arrive: a small lift and scale, tied to the scroll.
  $$('.section.sheet').forEach((el) => gsap.fromTo(el, { y: 48, scale: 0.965 }, {
    y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: true },
  }));

  // The footer's route draws itself into the chevron when the footer arrives.
  $$('[data-draw]').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 94%', once: true, onEnter: () => el.classList.add('is-drawn') }));

  // Scrubbed word reveal (the "who we are" statement): words brighten as you read down.
  $$('[data-scrub-words]').forEach((p) => {
    const words = split(p, 'sw');
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });
  });

  // The founder's print drifts against the quote as it passes (depth, not decoration on every image).
  $$('.quote__print').forEach((el) => gsap.fromTo(el, { yPercent: 7 }, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));

  // Count-up metrics.
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    el.textContent = '0';
    // Hero stats sit at the very bottom of the first screen, so they count up with the intro instead.
    const inHero = el.closest('[data-hero]');
    gsap.to(o, { v: end, duration: 1.6, delay: inHero ? 0.6 : 0, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: inHero ? null : { trigger: el, start: 'top 90%', once: true } });
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
            end: () => '+=' + innerHeight * 0.45 * (cards.length - 1), // a short hold per card: the work, not the scroll
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

  // Service demos: the active panel's demo builds up and loops while the services are on screen; the others hold their
  // finished picture (the markup). Figures count up, the cursor finds its button wherever layout put it.
  const INK = '#151514', MINT_INK = '#0b7f5b';
  const spot = (el, box, fx = 0.5, fy = 0.55) => { // an element's point in its window's coordinates
    let x = el.offsetWidth * fx, y = el.offsetHeight * fy;
    for (let n = el; n && n !== box; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y };
  };
  const click = (tl, cursor, target, at) => tl.to(cursor, { scale: 0.84, transformOrigin: '0% 0%', duration: 0.08, yoyo: true, repeat: 1 }, at)
    .to(target, { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1 }, at + 0.02);
  const DEMOS = {
    ai(tl, $) {
      tl.from($('.sd-chat'), { opacity: 0, y: 10, duration: 0.5 }, 0)
        .from($('.sd-vision'), { opacity: 0, y: 10, duration: 0.5 }, 0.15)
        .from($('.sd-msg--me'), { opacity: 0, y: 8, scale: 0.96, transformOrigin: '100% 100%', duration: 0.4 }, 0.5)
        .set($('.sd-msg--ai'), { opacity: 0 }, 0)
        .fromTo($('.sd-typing'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1)
        .to($('.sd-typing i'), { opacity: 1, y: -2, duration: 0.22, stagger: 0.11, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1)
        .to($('.sd-typing'), { opacity: 0, duration: 0.15 }, 2)
        .to($('.sd-msg--ai'), { opacity: 1, duration: 0.2 }, 2.05)
        .from($('.sd-stream span'), { opacity: 0, duration: 0.12, stagger: 0.09 }, 2.1)
        .from($('.sd-forecast'), { opacity: 0, y: 6, duration: 0.35 }, 2.7)
        .fromTo($('.sd-actual'), { strokeDashoffset: 1.005 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 2.8)
        .from($('.sd-now'), { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' }, 3.6)
        .fromTo($('.sd-predict'), { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.9, ease: 'power2.inOut' }, 3.7)
        .from($('.sd-band'), { opacity: 0, duration: 0.6 }, 3.9)
        .from($('.sd-conf'), { opacity: 0, scale: 0.7, transformOrigin: '0% 50%', duration: 0.3, ease: 'back.out(2)' }, 4.5)
        // the vision model scans the car, then marks what it found
        .from($('.sd-shot img'), { opacity: 0, duration: 0.5 }, 0.6)
        .set($('.sd-scan'), { opacity: 1 }, 1.1)
        .fromTo($('.sd-scan'), { top: '0%' }, { top: '100%', duration: 1.2, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 1.1)
        .set($('.sd-scan'), { opacity: 0 }, 3.5)
        .from($('.sd-box'), { opacity: 0, scale: 1.18, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.4 }, 1.7)
        .from($('.sd-score em'), { scaleX: 0, duration: 0.9, ease: 'power2.out' }, 3.1)
        .from($('.sd-findings > *'), { opacity: 0, y: 6, duration: 0.3, stagger: 0.22 }, 3.5)
        .to($('.sd-chat, .sd-vision'), { opacity: 0, duration: 0.4 }, 8.4);
      return 7;
    },
    web(tl, $) {
      const cursor = $('.sd-cursor')[0], btn = $('.sd-publish')[0], box = $('.sd-browser')[0], to = spot(btn, box, 0.55, 0.6);
      tl.from(box, { opacity: 0, y: 10, duration: 0.5 }, 0)
        .from($('.sd-phone'), { opacity: 0, y: 14, duration: 0.5 }, 0.2)
        .from($('.sd-nav > *'), { opacity: 0, x: -6, duration: 0.3, stagger: 0.06 }, 0.4)
        .set($('.sd-publish__a'), { opacity: 1 }, 0).set($('.sd-publish__b'), { opacity: 0 }, 0).set(btn, { backgroundColor: INK }, 0)
        .from($('.sd-kpis > div'), { opacity: 0, y: 8, duration: 0.35, stagger: 0.1 }, 0.6);
      $('.sd-kpis [data-to]').forEach((el, i) => {
        const end = +el.dataset.to, dec = +(el.dataset.dec || 0), n = { v: 0 };
        tl.fromTo(n, { v: 0 }, { v: end, duration: 1.1, ease: 'power2.out', onUpdate: () => { el.textContent = dec ? n.v.toFixed(dec) : Math.round(n.v).toLocaleString('en-IN'); } }, 0.7 + i * 0.1);
      });
      tl.from($('.sd-chart'), { opacity: 0, duration: 0.3 }, 0.9)
        .from($('.sd-browser .sd-bars i'), { scaleY: 0, duration: 0.5, stagger: 0.07 }, 1)
        .from($('.sd-phone__kpi, .sd-phone__row'), { opacity: 0, y: 6, duration: 0.3, stagger: 0.1 }, 1.1)
        .from($('.sd-phone .sd-bars i'), { scaleY: 0, duration: 0.5, stagger: 0.06 }, 1.3)
        // the release is published from the web app and lands on the phone
        .set(cursor, { opacity: 1 }, 2.3)
        .fromTo(cursor, { x: to.x - 150, y: to.y + 130 }, { x: to.x, y: to.y, duration: 0.8, ease: 'power3.inOut' }, 2.3);
      click(tl, cursor, btn, 3.15)
        .to($('.sd-publish__a'), { opacity: 0, duration: 0.15 }, 3.3)
        .to($('.sd-publish__b'), { opacity: 1, duration: 0.2 }, 3.35)
        .to(btn, { backgroundColor: MINT_INK, duration: 0.3 }, 3.3)
        .to(cursor, { opacity: 0, duration: 0.3 }, 4.2)
        .from($('.sd-toast'), { opacity: 0, y: 16, duration: 0.45, ease: 'back.out(1.8)' }, 3.6)
        .to($('.sd-browser, .sd-phone'), { opacity: 0, duration: 0.4 }, 7.8);
      return 6.6;
    },
    ecom(tl, $) {
      const box = $('.sd-store')[0], cursor = $('.sd-cursor')[0], add = $('.sd-add')[0], fly = $('.sd-fly')[0], badge = $('.sd-badge')[0];
      const to = spot(add, box, 0.6, 0.6), from = spot(add, box, 0.5, 0.5), cart = spot($('.sd-cart')[0], box, 0.5, 0.45);
      tl.from(box, { opacity: 0, y: 10, duration: 0.5 }, 0)
        .from($('.sd-pdp__img img'), { opacity: 0, scale: 0.85, y: 10, duration: 0.6, ease: 'back.out(1.6)' }, 0.3)
        .from($('.sd-pdp__info > *'), { opacity: 0, x: 8, duration: 0.3, stagger: 0.06 }, 0.45)
        .set(badge, { scale: 0 }, 0)
        .set(cursor, { opacity: 1 }, 1.3)
        .fromTo(cursor, { x: to.x + 60, y: to.y + 120 }, { x: to.x, y: to.y, duration: 0.8, ease: 'power3.inOut' }, 1.3);
      click(tl, cursor, add, 2.15)
        .to($('.sd-add__a'), { opacity: 0, duration: 0.15 }, 2.3).to($('.sd-add__b'), { opacity: 1, duration: 0.15 }, 2.32)
        // the item arcs into the cart
        .set(fly, { opacity: 1, x: from.x, y: from.y, scale: 1 }, 2.3)
        .to(fly, { keyframes: [{ x: (from.x + cart.x) / 2, y: Math.min(from.y, cart.y) - 30, duration: 0.35, ease: 'power1.out' }, { x: cart.x, y: cart.y, scale: 0.5, duration: 0.35, ease: 'power1.in' }] }, 2.3)
        .set(fly, { opacity: 0 }, 3)
        .to(badge, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, 3)
        .to(cursor, { opacity: 0, duration: 0.3 }, 3.1)
        .to($('.sd-add__b'), { opacity: 0, duration: 0.2 }, 3.7).to($('.sd-add__a'), { opacity: 1, duration: 0.2 }, 3.75)
        // and the store recommends what goes with it, then the order goes through
        .from($('.sd-recs'), { opacity: 0, y: 10, duration: 0.4 }, 3.1)
        .from($('.sd-rec'), { opacity: 0, y: 10, duration: 0.35, stagger: 0.12 }, 3.3)
        .from($('.sd-ai'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(2.5)' }, 3.6)
        .from($('.sd-order'), { opacity: 0, y: 10, duration: 0.4 }, 4.4)
        .from($('.sd-order__icon'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 4.6)
        .from($('.sd-fraud'), { opacity: 0, y: 6, duration: 0.3 }, 5)
        .to($('.sd-store, .sd-recs, .sd-order, .sd-fraud'), { opacity: 0, duration: 0.4 }, 8.2);
      return 7;
    },
    cloud(tl, $) {
      tl.from($('.sd-topo'), { opacity: 0, y: 10, duration: 0.5 }, 0)
        .from($('.sd-node:not(.sd-scale)'), { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.1 }, 0.3)
        .from($('.sd-edges > path:not(.sd-scale-edge)'), { opacity: 0, duration: 0.4 }, 0.7)
        .from($('.sd-group, .sd-group__t'), { opacity: 0, duration: 0.4 }, 0.9)
        .from($('.sd-pipe'), { opacity: 0, y: 10, duration: 0.4 }, 0.2)
        .set($('.sd-pipe__a'), { opacity: 1 }, 0).set($('.sd-pipe__b'), { opacity: 0 }, 0)
        .fromTo($('.sd-progress em'), { scaleX: 0 }, { scaleX: 1, duration: 2.4, ease: 'power1.inOut' }, 0.6)
        .from($('.sd-step'), { scale: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.8, ease: 'back.out(3)' }, 1.2)
        .to($('.sd-pipe__a'), { opacity: 0, duration: 0.2 }, 3).to($('.sd-pipe__b'), { opacity: 1, duration: 0.2 }, 3.05)
        // load grows: a third server joins the group
        .from($('.sd-scale'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, 2.7)
        .from($('.sd-scale-edge'), { opacity: 0, duration: 0.3 }, 2.8)
        .from($('.sd-metrics'), { opacity: 0, y: 10, duration: 0.4 }, 0.5)
        .fromTo($('.sd-spark'), { strokeDashoffset: 1.005 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, 0.8)
        .from($('.sd-backup'), { opacity: 0, y: 6, duration: 0.3 }, 3.5)
        .to($('.sd-led'), { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 9, stagger: 0.15 }, 1);
      // requests run through the edges, again and again
      $('.sd-flows path').forEach((p, i) => {
        const at = 1.1 + i * 0.16 + (p.classList.contains('sd-scale-flow') ? 1.8 : 0);
        tl.set(p, { opacity: 1 }, at).fromTo(p, { strokeDashoffset: 0.16 }, { strokeDashoffset: -1, duration: 0.7, ease: 'none', repeat: 5, repeatDelay: 0.3 }, at).set(p, { opacity: 0 }, at + 6);
      });
      tl.to($('.sd-topo, .sd-pipe, .sd-metrics, .sd-backup'), { opacity: 0, duration: 0.4 }, 8.3);
      return 7;
    },
  };
  const demos = $$('[data-demo]').map((el) => {
    const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'power3.out' } });
    const rest = DEMOS[el.dataset.demo] ? DEMOS[el.dataset.demo](tl, (q) => $$(q, el)) : 0;
    tl.seek(rest, false);
    return { el, panel: el.closest('[data-svc-panel]'), tl, rest, on: false };
  });
  let svcSeen = false;
  onSvc = () => demos.forEach((d) => {
    const on = svcSeen && d.panel.classList.contains('is-active');
    if (on && !d.on) d.tl.restart();
    else if (!on && d.on) { d.tl.pause(); d.tl.seek(d.rest, false); }
    d.on = on;
  });
  if (demos.length) new IntersectionObserver(([e]) => { svcSeen = e.isIntersecting; onSvc(); }, { threshold: 0.25 }).observe(demos[0].el.closest('[data-services]'));

  // Industries: while the section is on screen the index moves on by itself, the current tile's bar (site.css) saying
  // when. Picking an industry (a click or the arrow keys) stops it for good.
  $$('[data-ind]').forEach((box) => {
    const strip = $('[role=tablist]', box);
    const tabs = $$('[role=tab]', box);
    let stopped = false, auto = false;
    const stop = () => { stopped = true; box.classList.remove('is-auto'); };
    new IntersectionObserver(([e]) => box.classList.toggle('is-auto', e.isIntersecting && !stopped), { threshold: 0.35 }).observe(box);
    box.addEventListener('animationend', (e) => {
      if (e.animationName !== 'ind-timer' || stopped) return;
      const next = tabs[(tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true') + 1) % tabs.length];
      auto = true; next.click(); auto = false;
    });
    tabs.forEach((t) => t.addEventListener('click', () => { if (!auto) stop(); }));
    strip.addEventListener('keydown', stop);
  });

  // Services: pin on desktop, scroll drives the active service.
  const svc = $('[data-services]');
  if (svc) {
    ScrollTrigger.matchMedia({
      '(min-width: 1025px)': () => {
        const n = svcPanels.length;
        const st = ScrollTrigger.create({
          trigger: svc, pin: $('.services__pin', svc), start: 'top top', end: () => '+=' + innerHeight * n * 0.3,
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

  // The moving band runs faster while the page scrolls, and backwards when it scrolls up, then eases back.
  $$('.band__track').forEach((track) => {
    const run = track.getAnimations()[0];
    if (!run) return;
    ScrollTrigger.create({
      trigger: track, start: 'top bottom', end: 'bottom top',
      onUpdate: (st) => {
        run.playbackRate = gsap.utils.clamp(-6, 6, 1 + st.getVelocity() / 300);
        gsap.to(run, { playbackRate: 1, duration: 0.8, ease: 'power2.out', overwrite: true });
      },
    });
  });

  // Pins (projects deck, services) add scroll distance; triggers below them must be measured after them.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  // Recompute after fonts/images change layout.
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
