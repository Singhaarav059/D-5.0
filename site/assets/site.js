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

  // Contact form: no backend exists, so compose the email in the visitor's mail app.
  $$('[data-form]').forEach((form) => form.addEventListener('submit', (e) => {
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
    location.href = `mailto:contact@demazetech.com?subject=${encodeURIComponent(d.subject + ' | ' + d.name)}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Your email app should open with the message ready to send.';
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

  // Engineering stack: the orbit mirrors the active tab; hovering a list item or node highlights its twin.
  // orbitNodes() matches the server-side version in build.js (inner ring = half, max 7).
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const orbitNodes = (items) => {
    const inner = Math.min(7, Math.ceil(items.length / 2));
    return items.map((t, i) => {
      const ring = i < inner ? 1 : 0;
      const count = ring ? inner : items.length - inner;
      const k = ring ? i : i - inner;
      const a = ((-90 + (360 / count) * k + (ring ? 0 : 180 / count)) * Math.PI) / 180;
      const r = ring ? 28 : 46;
      const mark = t.logo ? `<img src="${t.logo}" alt="" width="26" height="26">` : `<b>${esc(t.name.slice(0, 2))}</b>`;
      return `<div class="orbit__node${ring ? '' : ' is-outer'}" data-tech="${esc(t.name)}" style="left:${(50 + Math.cos(a) * r).toFixed(2)}%;top:${(50 + Math.sin(a) * r).toFixed(2)}%"><span>${mark}</span></div>`;
    }).join('');
  };
  $$('[data-stackx]').forEach((box) => {
    const track = $('[data-orbit]', box);
    const focus = (id) => {
      box.classList.toggle('has-focus', !!id);
      $$('[data-tech]', box).forEach((p) => p.classList.toggle('is-active', p.dataset.tech === id));
    };
    // Delegated so rebuilt nodes keep working.
    box.addEventListener('pointerover', (e) => { const p = e.target.closest('[data-tech]'); focus(p && p.dataset.tech); });
    box.addEventListener('pointerleave', () => focus(null));
    box.addEventListener('tabchange', (e) => {
      const items = $$('.stackx__item', e.detail).map((li) => ({ name: li.dataset.tech, logo: li.querySelector('img') && li.querySelector('img').src }));
      track.innerHTML = orbitNodes(items);
      if (window.gsap && motion) gsap.fromTo(track.children, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.025, ease: 'back.out(1.6)' });
    });
  });

  // Card spotlight: feed the pointer position to CSS (delegated, fine pointers only).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', (e) => {
      const c = e.target.closest && e.target.closest('.why-card, .drive, .step, .pcard');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    }, { passive: true });
  }

  // Projects page: card opens a modal with the full case study (native <dialog>: Esc, focus trap, top layer).
  const dlg = $('[data-pdlg]');
  if (dlg) {
    const body = $('[data-pdlg-body]', dlg);
    $$('[data-proj]').forEach((b) => b.addEventListener('click', () => {
      body.replaceChildren($(`[data-proj-tpl="${b.dataset.proj}"]`).content.cloneNode(true));
      dlg.showModal();
      body.scrollTop = 0;
    }));
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
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.from(words, { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.055 }, 0.1)
      .to($$('[data-hero-fade]', hero), { opacity: 1, duration: 1 }, 0.35)
      .from($$('[data-hero-fade]', hero), { y: 24, duration: 1.2, stagger: 0.08 }, 0.35);
    const proof = $('[data-hero-proof]', hero);
    if (proof) tl.fromTo(proof, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.4 }, 0.6);
    // Underline draws under the emphasised phrase after its words land.
    const em = $('.hero__title em', hero);
    if (em) tl.to(em, { backgroundSize: '100% 0.07em', duration: 1.1, ease: 'power3.inOut' }, 0.9);
    // Floaters: pop in, then drift with the pointer (by depth) and slide apart as the hero scrolls away.
    const floaters = $$('[data-floater]', hero);
    if (floaters.length) {
      tl.fromTo(floaters, { opacity: 0, scale: 0.8, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.12, ease: 'back.out(1.4)' }, 0.8);
      floaters.forEach((f, i) => gsap.to(f, {
        yPercent: -120 * f.dataset.floater, xPercent: (i < 2 ? -30 : 30) * f.dataset.floater, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      }));
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const q = floaters.map((f) => [gsap.quickTo(f, 'x', { duration: 1.2, ease: 'power3.out' }), gsap.quickTo(f, 'y', { duration: 1.2, ease: 'power3.out' })]);
        hero.addEventListener('pointermove', (e) => {
          const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
          floaters.forEach((f, i) => { q[i][0](nx * -36 * f.dataset.floater); q[i][1](ny * -28 * f.dataset.floater); });
        });
      }
    }
    // Sky: settles in from a slight zoom, then the liquid simulation takes over on pointer move.
    const skyImg = $('[data-sky]', hero);
    if (skyImg) {
      gsap.fromTo(skyImg.parentElement, { scale: 1.08 }, { scale: 1, duration: 2.2, ease: 'expo.out' });
      if (window.initLiquid) window.initLiquid(skyImg.parentElement, skyImg.currentSrc || skyImg.src);
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

  // Footer wordmark: letters rise out of the baseline in sequence when the footer arrives.
  $$('[data-word]').forEach((w) => gsap.from(w.children, {
    yPercent: 100, duration: 1.2, stagger: 0.06, ease: EASE, scrollTrigger: { trigger: w, start: 'top 95%', once: true },
  }));

  // Keyword strip: rows loop on their own; scrolling boosts them (and flips direction when scrolling up).
  $$('[data-words]').forEach((strip) => {
    strip.classList.add('is-driven');
    const loops = $$('.marquee', strip).map((m, i) => {
      const tracks = $$('.marquee__track', m);
      return i % 2 ? gsap.fromTo(tracks, { xPercent: -100 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 })
        : gsap.to(tracks, { xPercent: -100, duration: 40, ease: 'none', repeat: -1 });
    });
    const skew = gsap.quickTo($$('.marquee__track', strip), 'skewX', { duration: 0.6, ease: 'power3.out' });
    let dir = 1;
    ScrollTrigger.create({
      trigger: strip, start: 'top bottom', end: 'bottom top',
      onToggle: (st) => loops.forEach((l) => (st.isActive ? l.resume() : l.pause())),
      onUpdate: (st) => {
        const v = st.getVelocity();
        dir = st.direction;
        const boost = dir * (1 + Math.min(Math.abs(v) / 250, 5));
        loops.forEach((l) => gsap.to(l, { timeScale: boost, duration: 0.25, overwrite: true, onComplete: () => gsap.to(l, { timeScale: dir, duration: 1.2, ease: 'power2.out' }) }));
        skew(gsap.utils.clamp(-6, 6, v / -400));
        clearTimeout(strip._t); strip._t = setTimeout(() => skew(0), 120);
      },
    });
  });

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

  // Process: progress line fills with scroll, steps light up as they cross the middle.
  const proc = $('[data-process]');
  if (proc) {
    gsap.to($('[data-process-line]', proc), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: $('.steps', proc), start: 'top 85%', end: 'bottom 55%', scrub: true } });
    $$('[data-step]', proc).forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'max', toggleClass: 'is-on' }));
    gsap.fromTo($$('[data-step]', proc), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, stagger: 0.12, ease: EASE, scrollTrigger: { trigger: proc, start: 'top 75%', once: true } });
  }

  // Pins (projects deck, services) add scroll distance; triggers below them must be measured after them.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  // Recompute after fonts/images change layout.
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
