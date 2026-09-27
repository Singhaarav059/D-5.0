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
        if (on && motion) gsap.fromTo(panel.querySelectorAll('li, h3'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.02, ease: 'power3.out', overwrite: true });
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
        ctx.globalAlpha = 0.06 + f * f * 0.7;
        ctx.fillStyle = '#151514';
        ctx.beginPath(); ctx.arc(S / 2 + X * R, S / 2 - Y * R, 1.4 + f * 2.6, 0, 6.283); ctx.fill();
      }
    };
    const loop = () => { spin += 0.004; paint(); raf = seen ? requestAnimationFrame(loop) : 0; };
    paint();
    if (motion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !raf) raf = requestAnimationFrame(loop); }).observe(core);
    }
  });

  // Projects page: card opens a modal with the full case study (native <dialog>: Esc, focus trap, top layer).
  // The arrows (and the left/right keys) step to the neighbouring case without closing.
  const dlg = $('[data-pdlg]');
  if (dlg) {
    const body = $('[data-pdlg-body]', dlg);
    const total = $$('[data-proj-tpl]').length;
    let current = 0;
    const show = (i, dir = 0) => {
      $('[data-tour]', body)?.tour?.destroy();
      current = (i + total) % total;
      body.replaceChildren($(`[data-proj-tpl="${current}"]`).content.cloneNode(true));
      dlg.setAttribute('aria-labelledby', `pdlg-title-${current}`);
      body.scrollTop = 0;
      $('.pdlg__body', body).scrollTop = 0;
      if (dir && motion) { body.style.setProperty('--dir', dir); body.classList.remove('is-swapping'); void body.offsetWidth; body.classList.add('is-swapping'); }
      // the case's product tour plays large in the dialog (tour.js; absent with reduced motion or no JS)
      const media = $('[data-tour]', body);
      if (media && window.Tour) window.Tour.mount(media);
    };
    $$('[data-proj]').forEach((b) => b.addEventListener('click', () => { show(+b.dataset.proj); dlg.showModal(); }));
    $$('[data-pdlg-step]', dlg).forEach((b) => b.addEventListener('click', () => show(current + +b.dataset.pdlgStep, +b.dataset.pdlgStep)));
    dlg.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d && !e.target.closest('input, textarea, select')) { e.preventDefault(); show(current + d, d); }
    });
    dlg.addEventListener('close', () => { $('[data-tour]', body)?.tour?.destroy(); body.classList.remove('is-swapping'); });
    $('[data-pdlg-close]', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // backdrop click
  }

  if (!motion) return;

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
    const words = split($('[data-split=hero]', hero), 'w');
    gsap.timeline({ defaults: { ease: EASE } })
      .from(words, { yPercent: 105, duration: 1, stagger: 0.045 }, 0.1)
      .fromTo($$('[data-hero-fade]', hero), { opacity: 0, y: RISE }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.35);
  }

  // Everything else enters the same way: a short rise and fade, once.
  $$('[data-reveal]').forEach((el) => gsap.fromTo(el, { opacity: 0, y: RISE }, {
    opacity: 1, y: 0, duration: 0.8, ease: EASE, scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  }));
  $$('[data-stagger]').forEach((g) => gsap.fromTo(g.children, { opacity: 0, y: RISE }, {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: EASE, scrollTrigger: { trigger: g, start: 'top 88%', once: true },
  }));

  // Scrubbed word reveal (the "who we are" statement): words brighten as you read down.
  $$('[data-scrub-words]').forEach((p) => {
    const words = split(p, 'sw');
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });
  });

  // Founder photo drifts against the quote as it passes (depth, not decoration on every image).
  $$('.quote__photo').forEach((img) => gsap.fromTo(img, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));

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
