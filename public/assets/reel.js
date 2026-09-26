/* Project reels: a short motion story over each project card's image (projects page).
   The card's [data-reel] JSON comes from `reel` in src/content.js and plays as chapters:
   title → the brief → the product (hero) → one chapter per capability → the outcome → sign-off.
   Directed after launch films on whatships.com (Muse for Marketing, X Ticker, Hypit): a pale studio canvas with thin
   orbit rings, heavy black headlines with one accent word, and camera moves instead of fades. Every chapter is
   pulled back into (it lands from slightly too close), pushes in slowly while it plays, then punches in and cuts.
   A small counter names the chapter; the headline above the stage says what is happening, word by word.
   Heroes: cars are studio renders of two SUVs (public/assets/img/reel/suv-*.webp); everything else is a 3D model built
   in code (reel3d.js) with a Fluent illustration underneath until WebGL has drawn a frame.
   The image stays underneath as the fallback: with JavaScript off, reduced motion or no GSAP, nothing here runs.
   A full loop runs 30-60 seconds depending on the number of chapters. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('motion') || !window.gsap || !window.ReelKit || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Scenes have optional parts (a toast, a sub-line); tweens aimed at a part a scene doesn't have are simply skipped.
  gsap.config({ nullTargetWarn: false });

  // The page links the 3D module with its own content hash (see layout.js), so a deploy never serves a stale one.
  const MODULE = document.querySelector('link[data-reel3d]')?.href || new URL('reel3d.js', document.currentScript.src).href;
  let three; // the reel3d module, loaded once when the first reel nears the viewport
  const load3d = () => (three ||= import(MODULE));

  const W = 640, H = 440; // logical stage size; scaled to fit the card
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (n, f) => (f === 'inr' ? Math.round(n).toLocaleString('en-IN') : Math.round(n).toLocaleString('en'));
  const { TYPES, art, words } = window.ReelKit;

  const TITLE = 3.2, HERO = 4.8, CAR = 7.2, OUTRO = 3, OUT = 0.4; // OUT: how long the cut away takes
  const IN = 0.65; // how long a chapter takes to land
  // The SUV renders: where things sit on each shot, as fractions of the image (measured on the renders). `lamps` are
  // the near and far headlamps on the front three-quarter; `side` marks the profile, `tail` is its brake light.
  const CARS = {
    gls: { lamps: [[0.715, 0.47], [0.955, 0.45]], side: { head: [0.07, 0.47], front: [0.17, 0.72], body: [0.47, 0.45], rear: [0.7, 0.72], roof: [0.5, 0.1] }, tail: [0.855, 0.37] },
    rrs: { lamps: [[0.695, 0.44], [0.965, 0.43]], side: { head: [0.07, 0.44], front: [0.17, 0.71], body: [0.47, 0.5], rear: [0.71, 0.71], roof: [0.5, 0.1] }, tail: [0.845, 0.37] },
  };
  // How each look moves between chapters (reel.css draws the looks): the old scene leaves, the new one lands, and
  // a slow move carries it until its own cut. push: punch in and cut (Muse); slide: a whip pan sideways (X Ticker);
  // cut: a hard cut on a white flash; wipe: the new scene is revealed across the old one.
  const MOVES = {
    push: { out: { opacity: 0, scale: 1.2, ease: 'power2.in' }, from: { opacity: 0, scale: 1.14 }, hold: { scale: 1.035 } },
    slide: { out: { opacity: 0, x: -120, ease: 'power3.in' }, from: { opacity: 0, x: 140 }, hold: { x: -10 } },
    cut: { out: { opacity: 0, duration: 0.05, ease: 'none' }, from: { opacity: 1, scale: 1.07 }, hold: { scale: 1.02 }, flash: true },
    wipe: { out: { opacity: 0, x: -30, ease: 'power2.in' }, from: { opacity: 1, clipPath: 'inset(0% 0% 0% 100%)' }, to: { clipPath: 'inset(0% 0% 0% 0%)' }, hold: { scale: 1.025 } },
  };
  const FALLBACK = { phone: 'phone', laptop: 'laptop', bag: 'handbag', gift: 'gift', globe: 'earth', chart: 'chart', folders: 'folder', vr: 'vr', clapper: 'clap', shield: 'shield' };

  // Thin concentric rings behind every chapter (the X Ticker backdrop).
  const RINGS = `<svg class="reel__rings" viewBox="0 0 640 440" aria-hidden="true">${[92, 164, 244, 330].map((r) => `<circle cx="320" cy="250" r="${r}"/>`).join('')}</svg>`;

  // Art circling the name on the title and sign-off: the brief's own icons on an elliptical orbit, kept above and below
  // the name (never level with it) so they frame it without covering it.
  const SLOTS = [-142, -38, 38, 142, -90, 90];
  const orbit = (arts, cls) => `<div class="reel__orbit ${cls}">${arts.map((a, i) => { const ang = (SLOTS[i] * Math.PI) / 180; return `<i class="reel__sat" style="left:${(50 + 47 * Math.cos(ang)).toFixed(1)}%;top:${(50 + 47 * Math.sin(ang)).toFixed(1)}%">${art(a)}</i>`; }).join('')}</div>`;

  function heroMarkup(h) {
    if (h.kind === 'car') {
      const m = h.model in CARS ? h.model : 'gls', car = CARS[m], p = `./assets/img/reel/suv-${m}`;
      const pin = ([x, y], cls, extra = '') => `<i class="${cls}" style="left:${x * 100}%;top:${y * 100}%">${extra}</i>`;
      const marks = (h.marks || []).map(([label, at, status]) => { const [x, y] = car.side[at] || car.side.body; return `<div class="reel__mark"${x < 0.25 ? ' data-edge="l"' : x > 0.75 ? ' data-edge="r"' : ''} style="left:${x * 100}%;top:${y * 100}%"><i></i><span>${esc(label)}${status ? `<em class="${/due|check/i.test(status) ? 'is-due' : ''}">${esc(status)}</em>` : ''}</span></div>`; }).join('');
      const side = `<div class="reel__shot reel__shot--side"><div class="reel__car"><img src="${p}-side.webp" alt="">${pin(car.tail, 'reel__brake')}${pin(car.side.head, 'reel__lamp reel__lamp--side')}</div>${marks}<i class="reel__scan"></i></div>`;
      if (h.story === 'service') {
        // Car Service: the car drives into the bay, brakes, is scanned, and its customer record opens beside it
        return `<section class="reel__scene reel__hero reel__hero--car reel__hero--service"><div class="reel__inner">
          <div class="reel__bay">${side}
            <div class="reel__ticket"><small>${esc(h.ticketTitle || 'Service ticket')}</small>${(h.ticket || []).map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div></div>
          <ul class="reel__tags">${h.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></section>`;
      }
      // Carzup: a dark showroom; the car starts, its lamps come on, it rolls forward and brakes, then is valued
      return `<section class="reel__scene reel__hero reel__hero--car reel__hero--showroom"><div class="reel__inner">
        <div class="reel__cars"><i class="reel__spot"></i>
          <div class="reel__shot reel__shot--front"><div class="reel__car"><img class="reel__shot--off" src="${p}-front-off.webp" alt=""><img class="reel__shot--on" src="${p}-front-on.webp" alt="">
            ${car.lamps.map((l, i) => pin(l, `reel__lamp${i ? ' reel__lamp--far' : ''}`, '<b></b>')).join('')}</div></div>
          ${side}
        ${h.value ? `<div class="reel__price"><small>${esc(h.value.label || 'Valuation')}</small><b>${esc(h.value.prefix || '')}<span data-r="val">0</span>${esc(h.value.suffix || '')}</b></div>` : ''}</div>
        <ul class="reel__tags">${h.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></section>`;
    }
    return `<section class="reel__scene reel__hero reel__hero--side"><div class="reel__inner">
      <div class="reel__view"><div class="reel__fallback">${art(FALLBACK[h.kind] || 'sparkle')}</div><canvas class="reel__gl"></canvas></div>
      <div class="reel__spec"><b class="reel__spec-title">${esc(h.title || 'The product')}</b><ul class="reel__tags">${h.tags.map((t) => `<li><i></i>${esc(t)}</li>`).join('')}</ul></div></div></section>`;
  }

  function markup(d, plan) {
    const size = Math.min(112, Math.round(560 / (d.name.length * 0.56)));
    const sats = (d.brief?.items || []).map((it) => it.art).concat(['sparkle', 'star']).slice(0, 6);
    const scenes = d.scenes.map((sc) => `<section class="reel__scene rk rk--${sc.type}"><div class="reel__inner">${TYPES[sc.type].html(sc)}</div></section>`).join('');
    return `<div class="reel__bg">${RINGS}</div><i class="reel__flash"></i>
    <div class="reel__stage">
      <header class="reel__head"><span class="reel__chap"><b data-r="num">01</b><em>/ ${pad(plan.length)}</em><span data-r="chap">${esc(plan[0].label)}</span></span><span class="reel__name">${esc(d.name)}</span></header>
      <div class="reel__progress"><em></em></div>
      <div class="reel__caps">${plan.map((p) => `<h4 class="reel__cap">${p.cap ? words(p.cap, p.accent) : ''}</h4>`).join('')}</div>

      <section class="reel__scene reel__title">${orbit(sats, 'reel__orbit--title')}<div class="reel__inner">
        <small class="reel__case">Case study ${esc(d.num)}</small>
        <h3 style="font-size:${size}px">${[...d.name].map((c) => `<span><b>${c === ' ' ? '&nbsp;' : esc(c)}</b></span>`).join('')}</h3>
        <div class="reel__tagline">${words(d.tagline, 1)}</div>
        ${d.client ? `<small class="reel__client">${esc(d.client)}</small>` : ''}
      </div></section>
      ${d.brief ? `<section class="reel__scene rk rk--brief"><div class="reel__inner">${TYPES.brief.html(d.brief)}</div></section>` : ''}
      ${heroMarkup(d.hero)}
      ${scenes}
      ${d.outcome ? `<section class="reel__scene rk rk--outcome"><div class="reel__inner">${TYPES.outcome.html(d.outcome)}</div></section>` : ''}

      <section class="reel__scene reel__outro">${orbit(sats, 'reel__orbit--outro')}<div class="reel__inner">
        <div class="reel__kicker">${esc(d.outro)}</div>
        <h3>${esc(d.name)}</h3>
        <div class="reel__sign">Designed &amp; built by <b>Demaze</b></div>
      </div></section>
    </div>`;
  }

  function build(host) {
    const d = JSON.parse(host.dataset.reel);
    // Chapter list, in play order, with each chapter's headline and scene data.
    const plan = [{ kind: 'title', label: 'Case study', cap: '' }];
    if (d.brief) plan.push({ kind: 'brief', label: 'The brief', cap: '', sc: d.brief });
    plan.push({ kind: 'hero', label: d.hero.chapter || 'The product', cap: d.hero.cap, accent: d.hero.accent });
    d.scenes.forEach((sc) => plan.push({ kind: sc.type, label: sc.chapter || '', cap: sc.cap, accent: sc.accent, sc }));
    if (d.outcome) plan.push({ kind: 'outcome', label: 'The outcome', cap: '', sc: d.outcome });
    plan.push({ kind: 'outro', label: 'Demaze', cap: '' });

    const look = d.look || 'studio', mv = MOVES[d.move] || MOVES.push;
    const el = document.createElement('div');
    el.className = `reel reel--${look}${d.align === 'left' ? ' reel--left' : ''}`;
    el.style.setProperty('--brand', d.accent || '#3d5afe');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = markup(d, plan);
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'reel__toggle';
    toggle.setAttribute('aria-label', 'Pause animation');
    host.append(el, toggle);

    const q = (s) => el.querySelector(s);
    const qa = (s) => [...el.querySelectorAll(s)];
    const r = (k) => q(`[data-r="${k}"]`);
    const stage = q('.reel__stage');
    const scenes = qa('.reel__scene');
    const inners = scenes.map((s) => s.querySelector('.reel__inner'));
    const caps = qa('.reel__cap');
    const num = r('num'), chap = r('chap');
    const bar = q('.reel__progress em');
    const rings = q('.reel__rings');
    const view = q('.reel__view');
    const gl = q('.reel__gl');
    const ctx = gl?.getContext('2d');
    let scale = 1;

    const sizeCanvas = () => {
      if (!gl) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      gl.width = Math.round(view.offsetWidth * scale * dpr);
      gl.height = Math.round(view.offsetHeight * scale * dpr);
    };
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      scale = Math.min(width / W, height / H);
      stage.style.setProperty('--s', scale);
      el.classList.toggle('is-compact', scale < 0.66); // phones: larger type, fewer small labels
      sizeCanvas();
    });
    ro.observe(el);

    // The 3D hero's animated inputs; GSAP tweens these, reel3d reads them each frame.
    const st = { enter: 0, pitch: 0, lights: 0, open: 0, orbit: 0, focus: 0 };
    let hero = null;

    const find = (sec) => (x) => [...sec.querySelectorAll(x)]; // queries inside one scene
    const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power3.out' } });
    const labels = [];
    let heroFrom = 0, heroTo = 0;

    gsap.context(() => {
      const capWords = caps.map((c) => [...c.querySelectorAll('b')]);

      const flash = q('.reel__flash');
      // Chapter hand-over at time t, in this reel's move (MOVES): the old chapter leaves, the new one lands, then a
      // slow move carries it until its own cut. The headline words drop out and the new ones rise.
      const handOver = (t, from, to, i) => {
        const o = mv.out;
        tl.to(inners[from], { ...o, duration: o.duration || OUT }, t - (o.duration || OUT))
          .set(scenes[from], { autoAlpha: 0 }, t)
          .set(scenes[to], { autoAlpha: 1 }, t)
          .fromTo(inners[to], { x: 0, scale: 1, ...mv.from }, { opacity: 1, x: 0, scale: 1, ...(mv.to || {}), duration: IN, ease: mv.to ? 'power3.inOut' : 'expo.out', immediateRender: false }, t);
        if (mv.flash) tl.fromTo(flash, { opacity: 0.85 }, { opacity: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, t);
        // counter: number and chapter name roll over
        tl.to([num, chap], { yPercent: -100, opacity: 0, duration: 0.22, ease: 'power2.in', stagger: 0.04 }, t - 0.3)
          .call(() => { num.textContent = pad(i + 1); chap.textContent = plan[i].label; }, null, t - 0.08)
          .call(() => { num.textContent = pad(i); chap.textContent = plan[i - 1].label; }, null, t - 0.09)
          .fromTo([num, chap], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.05, immediateRender: false }, t - 0.05);
        // headline: the old words fall away with the cut, the new ones rise one by one once the scene has landed
        if (capWords[from].length) tl.to(capWords[from], { yPercent: 110, duration: 0.3, stagger: 0.015, ease: 'power2.in' }, t - OUT);
        if (capWords[to].length) tl.fromTo(capWords[to], { yPercent: -110 }, { yPercent: 0, duration: 0.55, stagger: 0.045, ease: 'expo.out', immediateRender: false }, t + 0.2);
      };

      // Loop start: everything back to the first frame.
      tl.set(scenes, { autoAlpha: 0 }, 0).set(scenes[0], { autoAlpha: 1 }, 0).set(inners, { opacity: 1, scale: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)' }, 0).set(flash, { opacity: 0 }, 0)
        .set(capWords.flat(), { yPercent: -110 }, 0).set([num, chap], { yPercent: 0, opacity: 1 }, 0).set(bar, { scaleX: 0 }, 0)
        .call(() => { num.textContent = '01'; chap.textContent = plan[0].label; }, null, 0.001)
        .set(st, { enter: 0, pitch: 0, lights: 0, open: 0, orbit: 0, focus: 0 }, 0)
        .set('.reel__title h3 b', { yPercent: 110 }, 0)
        .set('.reel__title .reel__tagline b', { yPercent: 110 }, 0)
        .set('.reel__title .reel__inner > small', { opacity: 0, y: 10 }, 0)
        .set('.reel__outro .reel__inner > *', { opacity: 0, y: 24 }, 0);

      let t = 0, idx = 0;
      const chapter = (dur, fn) => {
        const at = t;
        if (idx > 0) handOver(at, idx - 1, idx, idx);
        // the slow move between the landing and the cut
        const hold = dur - (idx > 0 ? IN : 0) - OUT;
        if (hold > 0.2) tl.fromTo(inners[idx], { scale: 1, x: 0 }, { ...mv.hold, duration: hold, ease: 'none', immediateRender: false }, at + (idx > 0 ? IN : 0));
        labels.push([plan[idx].kind, at]);
        fn(at, at + dur);
        t += dur; idx += 1;
      };

      // Title: the brief's icons circle in on a ring, the name lands on the beat, then what it is and who it was for.
      chapter(TITLE, (s, e) => {
        const $ = find(scenes[idx]);
        const ring = $('.reel__orbit')[0], sats = $('.reel__sat');
        tl.fromTo(ring, { scale: 0.7, rotation: -10 }, { scale: 1.1, rotation: 6, duration: e - s, ease: 'power1.out', immediateRender: false }, s)
          .fromTo(sats, { rotation: 10 }, { rotation: -6, duration: e - s, ease: 'power1.out', immediateRender: false }, s);
        pop(tl, sats, s + 0.05, 0.07, { opacity: 0, scale: 0.2 });
        tl.to('.reel__title h3 b', { yPercent: 0, duration: 0.8, stagger: 0.035, ease: 'expo.out' }, s + 0.2)
          .to('.reel__title .reel__tagline b', { yPercent: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out' }, s + 0.75)
          .to('.reel__title .reel__inner > small', { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 }, s + 0.6);
      });

      if (d.brief) chapter(d.brief.dur || TYPES.brief.dur, (s, e) => TYPES.brief.run(tl, s, find(scenes[idx]), d.brief, e - OUT));

      // Hero.
      const h = d.hero;
      if (h.kind === 'car' && h.story === 'service') {
        // Car Service: the car rolls into the bay and brakes (nose dips, brake lights), a diagnostic scan runs along
        // it, each checkpoint reports, the lamps are tested, and the customer's record opens beside it.
        chapter(h.dur || CAR, (s, e) => {
          const $ = find(scenes[idx]);
          const car = $('.reel__car')[0], brake = $('.reel__brake')[0], lamp = $('.reel__lamp--side')[0], scan = $('.reel__scan')[0];
          tl.set(car, { x: 0, rotation: 0 }, 0).set([brake, lamp], { opacity: 0 }, 0).set(scan, { left: '0%', opacity: 0 }, 0)
            .fromTo(car, { x: 460 }, { x: 0, duration: 1.5, ease: 'power3.out', immediateRender: false }, s)
            .to(brake, { opacity: 1, duration: 0.1 }, s + 0.7).to(brake, { opacity: 0.35, duration: 0.6 }, s + 1.7)
            // the nose dips as it stops, then settles back on its springs
            .to(car, { rotation: -0.9, transformOrigin: '18% 90%', duration: 0.18, ease: 'power2.out' }, s + 1.35)
            .to(car, { rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, s + 1.53)
            .to(scan, { opacity: 1, duration: 0.1 }, s + 1.9).to(scan, { left: '100%', duration: 1.1, ease: 'power2.inOut' }, s + 1.9).to(scan, { opacity: 0, duration: 0.15 }, s + 3)
            // headlamp test: two flicks, then on
            .to(lamp, { opacity: 1, duration: 0.06, repeat: 3, yoyo: true, ease: 'steps(1)' }, s + 2.4).to(lamp, { opacity: 1, duration: 0.2 }, s + 2.7);
          $('.reel__mark').forEach((mk, i) => pop(tl, [mk], s + 2.1 + i * 0.35, 0, { opacity: 0, scale: 0.6 }));
          pop(tl, $('.reel__ticket'), s + 3.1, 0, { opacity: 0, x: 30 });
          pop(tl, $('.reel__ticket > div'), s + 3.3, 0.12, { opacity: 0, x: 12 });
          pop(tl, $('.reel__tags li'), s + 3.8, 0.1, { opacity: 0, y: 12 });
          tl.fromTo(car, { y: 0 }, { y: -2, duration: 0.5, yoyo: true, repeat: Math.max(1, Math.floor((e - s - 4) / 0.5)), ease: 'sine.inOut', immediateRender: false }, s + 3.6);
        });
      } else if (h.kind === 'car') {
        // Carzup: a dark showroom. The engine starts (the body shivers), the headlamps flick on and glow, the car
        // rolls forward and brakes, the showroom lights come up, then a cut to the profile for the valuation.
        chapter(h.dur || CAR, (s, e) => {
          const $ = find(scenes[idx]);
          const front = $('.reel__shot--front')[0], car = front.querySelector('.reel__car'), on = $('.reel__shot--on')[0], side = $('.reel__shot--side')[0];
          const lamps = $('.reel__lamp:not(.reel__lamp--side)'), spot = $('.reel__spot')[0];
          tl.set(front, { opacity: 1 }, 0).set(car, { x: 0, y: 0, scale: 0.9, rotation: 0, filter: 'brightness(0.32)' }, 0).set(on, { opacity: 0 }, 0)
            .set(lamps, { opacity: 0, scale: 0.4 }, 0).set(spot, { opacity: 0 }, 0).set(side, { opacity: 0, x: 0, scale: 1 }, 0)
            // ignition: a fine shiver through the body
            .fromTo(car, { x: -1.2 }, { x: 1.2, duration: 0.045, repeat: 11, yoyo: true, ease: 'none', immediateRender: false }, s + 0.35)
            .set(car, { x: 0 }, s + 0.9)
            // lamps: flick, a beat of dark, then on and glowing
            .to([on, ...lamps], { opacity: 1, duration: 0.05 }, s + 0.6).to([on, ...lamps], { opacity: 0, duration: 0.05 }, s + 0.7)
            .to([on, ...lamps], { opacity: 1, duration: 0.12 }, s + 0.95).to(lamps, { scale: 1, duration: 0.6, ease: 'expo.out' }, s + 0.95)
            .to(car, { filter: 'brightness(0.62)', duration: 0.4 }, s + 0.95)
            // it rolls towards the camera and brakes: the nose dips and springs back
            .to(car, { scale: 1.02, x: 26, y: 8, duration: 1.2, ease: 'power2.inOut' }, s + 1.3)
            .to(car, { rotation: 1.1, transformOrigin: '75% 95%', duration: 0.16, ease: 'power2.out' }, s + 2.42)
            .to(car, { rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, s + 2.58)
            // the showroom lights come up
            .to(car, { filter: 'brightness(1)', duration: 0.6 }, s + 2.8).to(spot, { opacity: 1, duration: 0.8 }, s + 2.8)
            .to(lamps, { opacity: 0.55, duration: 0.6 }, s + 2.9)
            // hard cut to the profile, which drifts while it is inspected
            .set(front, { opacity: 0 }, s + 3.7)
            .fromTo(side, { opacity: 0, scale: 1.08, x: 30 }, { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: 'expo.out', immediateRender: false }, s + 3.7)
            .fromTo(side, { x: 0 }, { x: -10, duration: e - s - 4.4, ease: 'none', immediateRender: false }, s + 4.3);
          pop(tl, $('.reel__mark'), s + 4.2, 0.25);
          pop(tl, $('.reel__tags li'), s + 3.9, 0.1, { opacity: 0, y: 12 });
          if (h.value) {
            const v = r('val');
            pop(tl, $('.reel__price'), s + 4, 0, { opacity: 0, y: 12, scale: 0.9 });
            tl.fromTo({ v: 0 }, { v: 0 }, { v: h.value.to, duration: 1.6, ease: 'expo.out', onUpdate() { v.textContent = fmt(this.targets()[0].v, h.value.format); } }, s + 4.1);
          }
        });
      } else {
        chapter(h.dur || HERO, (s, e) => {
          heroFrom = s - OUT; heroTo = e;
          tl.to(st, { enter: 1, duration: 1.4, ease: 'power3.out' }, s)
            .to(st, { orbit: 1, duration: e - s, ease: 'none' }, s)
            .to(st, { open: 1, duration: 1.3, ease: 'power2.inOut' }, s + 1.1)
            .to(st, { lights: 1, duration: 0.4 }, s + 1.6);
          const $ = find(scenes[idx]);
          // the camera rides in on the product for the last beat, cropping it against the frame
          if (h.kind !== 'gift') tl.fromTo(view, { scale: 1 }, { scale: 1.2, duration: e - s - 2.2, ease: 'power2.inOut', immediateRender: false }, s + 1.9).set(view, { scale: 1 }, 0);
          pop(tl, $('.reel__spec-title'), s + 1, 0, { opacity: 0, x: 16 });
          pop(tl, $('.reel__tags li'), s + 1.3, 0.18, { opacity: 0, x: 16 });
        });
      }

      // One chapter per capability.
      d.scenes.forEach((sc) => {
        const type = TYPES[sc.type];
        const dur = sc.dur || (typeof type.dur === 'function' ? type.dur(sc) : type.dur);
        chapter(dur, (s, e) => type.run(tl, s, find(scenes[idx]), sc, e - OUT));
      });

      if (d.outcome) chapter(d.outcome.dur || TYPES.outcome.dur, (s, e) => TYPES.outcome.run(tl, s, find(scenes[idx]), d.outcome, e - OUT));

      // Sign-off: the icons fall inward to the name, then everything fades so the loop restarts from a clean frame.
      chapter(OUTRO, (s, e) => {
        const $ = find(scenes[idx]);
        const ring = $('.reel__orbit')[0], sats = $('.reel__sat');
        tl.set(sats, { opacity: 1, scale: 1 }, 0)
          .fromTo(ring, { scale: 1.25, rotation: 30 }, { scale: 0.2, rotation: -40, duration: 1.1, ease: 'expo.in', immediateRender: false }, s)
          .to(sats, { opacity: 0, duration: 0.2 }, s + 0.95)
          .to('.reel__outro .reel__inner > *', { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'expo.out' }, s + 0.9)
          .to(inners[inners.length - 1], { opacity: 0, duration: 0.4 }, e - 0.45)
          .set({}, {}, e);
      });

      // One hairline for the whole loop, and the rings turning slowly behind everything.
      tl.to(bar, { scaleX: 1, duration: t, ease: 'none' }, 0)
        .fromTo(rings, { rotation: 0 }, { rotation: 40, duration: t, ease: 'none', svgOrigin: '320 250', immediateRender: false }, 0);
    }, el);

    function pop(tlx, els, at, stagger, from = { opacity: 0, y: 16 }) {
      tlx.set(els, from, 0).to(els, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.55, stagger, ease: 'back.out(1.5)' }, at);
    }

    const drawHero = () => {
      if (!hero) return;
      if (!gl.width) sizeCanvas(); // the card was hidden when the model arrived
      hero.draw(st, tl.time(), ctx, gl.width, gl.height);
    };
    tl.eventCallback('onUpdate', () => {
      const t = tl.time();
      if (t >= heroFrom && t <= heroTo) drawHero();
    });

    let userPaused = false, visible = false;
    const sync = () => {
      const run = visible && !userPaused && !document.hidden;
      run ? tl.play() : tl.pause();
      el.classList.toggle('is-paused', !run);
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userPaused = !userPaused;
      toggle.setAttribute('aria-label', userPaused ? 'Play animation' : 'Pause animation');
      toggle.classList.toggle('is-paused', userPaused);
      sync();
    });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.35 });
    io.observe(host);
    document.addEventListener('visibilitychange', sync);
    let io3d;
    host.classList.add('has-reel');

    // Build the 3D hero once the card is close; the Fluent illustration stays if WebGL is unavailable.
    if (gl) {
      io3d = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io3d.disconnect();
        load3d().then((m) => {
          const o = { ...(d.hero.opts || {}) };
          if (o.screen) o.screen = (o.screen.web ? m.webScreen : m.appScreen)(o.screen);
          hero = m.createHero(d.hero.kind, o);
          view.classList.add('is-3d');
          sizeCanvas();
          drawHero();
        }).catch((err) => console.warn('reel 3D:', err));
      }, { rootMargin: '400px' });
      io3d.observe(host);
    }

    // Handle for inspecting a reel from the console: host.reel.tl.seek(t), host.reel.starts.
    // Handle for inspecting a reel from the console (host.reel.tl.seek(t), host.reel.starts), and for taking it down
    // again (the project dialog mounts a reel each time it opens).
    host.reel = {
      tl, st, starts: labels, draw: drawHero,
      destroy() {
        tl.kill(); ro.disconnect(); io.disconnect(); io3d?.disconnect();
        document.removeEventListener('visibilitychange', sync);
        el.remove(); toggle.remove(); host.classList.remove('has-reel'); delete host.reel;
      },
    };
    return host.reel;
  }

  // Reels on the page (projects grid, home deck); other scripts mount more with window.Reel.mount(figure).
  window.Reel = { mount: (host) => host.reel || build(host) };
  document.querySelectorAll('[data-reel]').forEach((h) => { if (!h.closest('template')) build(h); });
})();
