// The maze scene (src/templates/journey.js). Each maze draws itself in when it first comes into view (CSS). With
// motion, the scene's section becomes a tall track with a sticky stage, and the scroll position plays it: the hero
// copy hands over to the heading (home), the walls and the pitfalls in them fall away, the route straightens into one line, the four stops
// appear and a signal walks the stages to the chevron. Scrolling back plays it backwards. Without motion, or on a
// screen too short to hold the stage, the section stays plain content with the solved maze.
(() => {
  'use strict';
  const root = document.documentElement;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const seen = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-seen');
    seen.unobserve(e.target);
    // once the route has drawn itself, a small signal keeps travelling it until the visitor scrolls
    if (root.classList.contains('motion')) setTimeout(() => { e.target.classList.add('is-live'); e.target.querySelector('animateMotion')?.beginElement(); }, 3400);
  }), { threshold: 0.3 });
  $$('.maze').forEach((m) => seen.observe(m));

  if (!root.classList.contains('motion') || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Stage scenes (src/templates/stages.js). The markup is the finished picture; each timeline builds it up from its
  // parts, holds it, fades the parts and starts again. `rest` is where the finished picture holds, which is what a
  // scene shows while another stage is the current one.
  const SCENES = {
    discover(tl, $) {
      const lens = $('.ja-lens');
      tl.from($('.ja-doc'), { opacity: 0, x: 10, duration: 0.5 }, 0.3)
        .from($('.ja-note'), { opacity: 0, scale: 0.55, rotation: -10, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.2, ease: 'back.out(2)' }, 0.2)
        .set(lens, { opacity: 0 }, 0)
        .fromTo(lens, { x: -8, y: -10, opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 0.3, immediateRender: false }, 1.1)
        // the lens reads each note in turn, then leaves toward the brief
        .to(lens, { keyframes: [{ x: 37, y: -13, duration: 0.45 }, { x: -4, y: 34, duration: 0.55 }, { x: 41, y: 32, duration: 0.45 }, { x: 88, y: 24, opacity: 0, duration: 0.45 }], ease: 'power2.inOut' }, 1.4)
        .fromTo($('.ja-arrow'), { strokeDashoffset: 1.005 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 3.1)
        .from($('.ja-arrow-head'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.25 }, 3.55)
        .from($('.ja-goal'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4 }, 3.6)
        .from($('.ja-check'), { scale: 0, transformOrigin: '50% 50%', duration: 0.3, stagger: 0.32, ease: 'back.out(3)' }, 3.9)
        .from($('.ja-stamp'), { opacity: 0, scale: 1.9, rotation: -14, transformOrigin: '50% 50%', duration: 0.3, ease: 'power4.in' }, 5)
        .to($('.ja-note, .ja-doc, .ja-arrow, .ja-arrow-head, .ja-lens'), { opacity: 0, duration: 0.35 }, 7.4);
      return 6.6;
    },
    design(tl, $) {
      const wire = $('.ja-wire'), btn = $('.ja-btn'), cursor = $('.ja-cursor');
      tl.from($('.ja-window'), { opacity: 0, y: 6, duration: 0.45 }, 0.1)
        .from($('.ja-phone'), { opacity: 0, y: 10, duration: 0.5 }, 0.35)
        .set(wire, { opacity: 1 }, 0)
        .from($('.ja-wire > *'), { opacity: 0, duration: 0.2, stagger: 0.09 }, 0.4)
        // the wireframe is painted into the real interface, left to right
        .fromTo($('.ja-paint'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power2.inOut' }, 1.4)
        .from($('.ja-screen-a'), { opacity: 0, duration: 0.5 }, 1.9)
        .to(wire, { opacity: 0, duration: 0.3 }, 2.4)
        // the cursor comes in, clicks the button, and the prototype moves on
        .from(cursor, { x: 104, y: -50, opacity: 0, duration: 0.9, ease: 'power3.out' }, 2.6)
        .to(cursor, { scale: 0.86, transformOrigin: '0% 0%', duration: 0.09, yoyo: true, repeat: 1 }, 3.55)
        .to(btn, { scale: 0.93, transformOrigin: '50% 50%', duration: 0.09, yoyo: true, repeat: 1 }, 3.58)
        .fromTo($('.ja-ripple'), { opacity: 0.9, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 0, scale: 1.7, duration: 0.6, ease: 'power2.out' }, 3.6)
        .to($('.ja-screen-a'), { x: -24, duration: 0.5, ease: 'power3.inOut' }, 3.8)
        .from($('.ja-screen-b'), { x: 58, duration: 0.5, ease: 'power3.inOut' }, 3.8)
        .from($('.ja-screen-b circle, .ja-screen-b .jart__tick'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.08, ease: 'back.out(2.5)' }, 4.2)
        .to($('.ja-window, .ja-paint, .ja-phone, .ja-cursor'), { opacity: 0, duration: 0.35 }, 6.6);
      return 5.8;
    },
    build(tl, $) {
      tl.from($('.ja-editor'), { opacity: 0, y: 6, duration: 0.45 }, 0.1)
        .set($('.ja-node'), { opacity: 0.35 }, 0)
        .set($('.ja-running'), { opacity: 1 }, 0).set($('.ja-passed'), { opacity: 0 }, 0)
        .to($('.jart__spin'), { rotation: 900, transformOrigin: '50% 50%', duration: 3.2, ease: 'none' }, 0.2);
      // typed a token at a time, line by line
      $('.ja-code').forEach((line, i) => tl.from(line.children, { scaleX: 0, transformOrigin: '0% 50%', duration: 0.2, stagger: 0.14, ease: 'none' }, 0.45 + i * 0.4));
      // each service answers as data runs down its wire
      $('.ja-packet').forEach((p, i) => {
        const at = 1.3 + i * 0.35;
        tl.set(p, { opacity: 1 }, at)
          .fromTo(p, { strokeDashoffset: 0.12 }, { strokeDashoffset: -1, duration: 0.65, ease: 'power1.inOut', repeat: 2, repeatDelay: 0.3 }, at)
          .set(p, { opacity: 0 }, at + 2.6)
          .to($('.ja-node')[i], { opacity: 1, duration: 0.25 }, at + 0.5)
          .fromTo($('.ja-led')[i], { scale: 1 }, { scale: 1.7, transformOrigin: '50% 50%', duration: 0.14, yoyo: true, repeat: 1 }, at + 0.55);
      });
      tl.to($('.ja-running'), { opacity: 0, duration: 0.2 }, 3.5)
        .to($('.ja-passed'), { opacity: 1, duration: 0.3 }, 3.6)
        .from($('.ja-passed circle'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)' }, 3.6)
        .to($('.ja-editor, .ja-node'), { opacity: 0, duration: 0.35 }, 6.2);
      return 5.4;
    },
    launch(tl, $) {
      const count = $('.ja-count')[0], n = { v: 1.2 };
      tl.from($('.ja-chart'), { opacity: 0, y: 6, duration: 0.45 }, 0.1)
        .from($('.ja-live'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2)' }, 0.35)
        .to($('.ja-live-dot'), { opacity: 0.2, duration: 0.45, yoyo: true, repeat: 9, ease: 'sine.inOut' }, 0.7)
        .fromTo($('.ja-line'), { strokeDashoffset: 1.005 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.5)
        .from($('.ja-area'), { opacity: 0, duration: 0.8 }, 1.2)
        .fromTo(n, { v: 1.2 }, { v: 24.8, duration: 1.8, ease: 'power2.inOut', onUpdate: () => { count.textContent = n.v.toFixed(1); } }, 0.5)
        .from($('.ja-peak'), { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' }, 2.25)
        .fromTo($('.jart__halo'), { scale: 1, opacity: 0.9 }, { scale: 2.3, opacity: 0, transformOrigin: '50% 50%', duration: 1, repeat: 2 }, 2.4)
        .from($('.ja-growth'), { opacity: 0, scale: 0.5, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2.5)' }, 2.3)
        // servers are added as the users arrive
        .from($('.ja-server'), { opacity: 0, x: 10, duration: 0.4, stagger: 0.55, ease: 'power3.out' }, 0.4)
        .to($('.ja-server .ja-led'), { opacity: 0.25, duration: 0.3, yoyo: true, repeat: 5, stagger: 0.17 }, 2.8)
        .to($('.ja-chart, .ja-server'), { opacity: 0, duration: 0.35 }, 6.2);
      return 5.4;
    },
  };
  const scenes = $$('.jart').map((svg) => {
    const $ = (s) => $$(s, svg);
    const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'power3.out' } });
    const rest = SCENES[svg.dataset.scene] ? SCENES[svg.dataset.scene](tl, $) : 0;
    const hold = () => { tl.pause(); tl.seek(rest, false); };
    hold();
    return { svg, play: () => tl.restart(), hold, playing: false };
  });
  const playScenes = (list) => scenes.forEach((s) => {
    const on = list.includes(s.svg);
    if (on && !s.playing) s.play(); else if (!on && s.playing) s.hold();
    s.playing = on;
  });
  // Outside the scroll scene (a short screen, or its plain layout), every scene on screen plays.
  const inView = new Set();
  const plainIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
    if (!document.querySelector('.journey.is-live')) playScenes([...inView]);
  }, { threshold: 0.4 });
  scenes.forEach((s) => plainIO.observe(s.svg));

  const clamp = (v) => Math.min(1, Math.max(0, v));
  const span = (p, [a, b]) => clamp((p - a) / (b - a));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const N = 240; // points the route is resampled into for the straightening

  // N points spread evenly along a polyline.
  const resample = (pts) => {
    const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = segs.reduce((a, b) => a + b, 0);
    const out = [];
    let seg = 0, before = 0;
    for (let i = 0; i < N; i++) {
      const d = (total * i) / (N - 1);
      while (seg < segs.length - 1 && before + segs[seg] < d) before += segs[seg++];
      const t = segs[seg] ? (d - before) / segs[seg] : 0;
      const [a, b] = [pts[seg], pts[seg + 1]];
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
    return out;
  };
  const toD = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');

  // One drawing (wide or narrow) and how to put it in a given state.
  const drawing = (svg) => {
    const g = JSON.parse(svg.dataset.geo);
    const route = resample(g.pts);
    const x0 = g.pts[0][0], x1 = g.pts[g.pts.length - 1][0];
    const line = route.map((_, i) => [x0 + ((x1 - x0) * i) / (N - 1), g.y]);
    const q = (s) => svg.querySelector(s);
    const els = { walls: q('.maze__wallset'), line: q('.maze__line'), trail: q('.maze__trail'), mark: q('.maze__markset'), traveler: q('.maze__traveler'), stops: $$('.maze__stop', svg), glow: q('.maze__glow'), pits: $$('.maze__pit', svg) };
    const glowAt = els.glow ? parseFloat(getComputedStyle(els.glow).opacity) || 0 : 0; // its resting strength (site.css)
    const end = g.mark[0] - g.C * 0.62; // the signal comes to rest against the chevron
    // where each stage is reached, as a fraction of the walk
    const at = g.stops.map((x) => (x - g.stops[0]) / (end - g.stops[0]));
    let last = '';
    const render = (s) => {
      const key = [s.walls, s.morph, s.stops, s.travel].map((v) => v.toFixed(4)).join();
      if (key === last) return;
      last = key;
      els.walls.style.opacity = (1 - s.walls).toFixed(3);
      // the route's glow fades with the walls, and the pitfalls drop out of the picture one after another
      if (els.glow) els.glow.style.opacity = (glowAt * (1 - s.walls)).toFixed(3);
      els.pits.forEach((p, i) => {
        const k = clamp(s.walls * 1.9 - i * 0.13), f = k * k;
        p.style.opacity = (1 - k).toFixed(3);
        p.style.transform = k ? `translate(0, ${(f * 90).toFixed(1)}px) rotate(${(f * (i % 2 ? 28 : -24)).toFixed(1)}deg)` : '';
      });
      svg.classList.toggle('is-moving', s.walls > 0 || s.morph > 0);
      svg.classList.toggle('is-morphing', s.morph > 0);
      const e = ease(s.morph);
      if (s.morph > 0) els.line.setAttribute('d', toD(route.map(([x, y], i) => [x + (line[i][0] - x) * e, y + (line[i][1] - y) * e])));
      els.mark.setAttribute('transform', `translate(0 ${((g.y - g.mark[1]) * e).toFixed(2)})`);
      svg.classList.toggle('is-straight', s.stops > 0);
      els.stops.forEach((c, i) => { const k = clamp(s.stops * 4 - i); c.style.opacity = k; c.style.transform = `scale(${0.3 + 0.7 * k})`; });
      const x = g.stops[0] + (end - g.stops[0]) * s.travel;
      svg.classList.toggle('is-travelling', s.stops >= 1);
      els.traveler.setAttribute('cx', x.toFixed(1));
      els.trail.setAttribute('d', s.stops >= 1 ? `M${x0} ${g.y}L${x.toFixed(1)} ${g.y}` : 'M0 0');
      els.stops.forEach((c, i) => c.classList.toggle('is-on', s.stops >= 1 && s.travel >= at[i] - 0.001));
      svg.classList.toggle('is-arrived', s.travel >= 1);
    };
    return { svg, at, render };
  };

  $$('[data-journey]').forEach((sec) => {
    const home = sec.classList.contains('journey--home');
    const track = sec.querySelector('.journey__track');
    const sticky = sec.querySelector('.journey__sticky');
    const stage = sec.querySelector('.journey__stage');
    const intro = sec.querySelector('.journey__intro');
    const caption = sec.querySelector('.journey__caption');
    const capTitle = caption.querySelector('.h2');
    const stepsBox = sec.querySelector('.journey__steps');
    const steps = $$('[data-step]', sec);
    const drawings = $$('.maze', sec).map(drawing);
    const compact = matchMedia('(max-width: 860px)'); // the stages share the heading's slot (site.css)
    // The scene's beats, as fractions of the track. Home starts as the hero, so it hands over first.
    const P = home
      ? { intro: [0.02, 0.12], caption: [0.12, 0.22], walls: [0.1, 0.28], morph: [0.2, 0.46], stops: [0.44, 0.52], travel: [0.55, 0.95] }
      : { walls: [0, 0.16], morph: [0.06, 0.34], stops: [0.32, 0.4], travel: [0.43, 0.93] };
    // About one and a half screens of scroll, not three; on phones, where the stages take turns in one slot, a little
    // over half a screen less (every beat is a fraction of the track, so the story keeps its shape).
    const setTrack = () => sec.style.setProperty('--track', compact.matches ? (home ? '160svh' : '140svh') : (home ? '220svh' : '180svh'));
    setTrack();
    compact.addEventListener('change', () => { setTrack(); ScrollTrigger.refresh(); });

    // Live only if the stage fits the screen. A stage up to a fifth too tall (most laptops, for the home page) is scaled
    // down to fit (--fit, site.css); a screen shorter than that keeps the plain version. (offsetHeight ignores the
    // scale, so this measures the stage at full size.)
    const fit = () => {
      sec.classList.add('is-live');
      sec.style.removeProperty('--fit');
      const room = sticky.clientHeight - parseFloat(getComputedStyle(sticky).paddingTop) - 8;
      const k = room / stage.offsetHeight;
      const ok = k >= 0.8;
      sec.style.setProperty('--fit', Math.min(1, k).toFixed(4));
      sec.classList.toggle('is-roomy', k >= 1 && room - stage.offsetHeight > 160); // tall screens: centre the stage
      if (!ok) {
        sec.classList.remove('is-live');
        [intro, caption, stepsBox].forEach((el) => el && (el.style.opacity = el.style.transform = '', el.inert = false));
        drawings.forEach((d) => d.render({ walls: 0, morph: 0, stops: 0, travel: 0 }));
      }
      return ok;
    };

    const update = (p) => {
      if (!sec.classList.contains('is-live')) return;
      if (home) {
        const k = span(p, P.intro), c = span(p, P.caption);
        intro.style.opacity = (1 - k).toFixed(3);
        intro.style.transform = `translateY(${(-36 * k).toFixed(1)}px)`;
        intro.inert = k > 0.5;
        caption.style.opacity = c.toFixed(3);
        caption.style.transform = `translateY(${(24 * (1 - c)).toFixed(1)}px)`;
        caption.inert = c < 0.5;
        // the headline's marker swipe and doodle play as the heading takes over from the hero
        capTitle?.classList.toggle('is-in', c > 0.6);
      }
      const s = { walls: span(p, P.walls), morph: span(p, P.morph), stops: span(p, P.stops), travel: span(p, P.travel) };
      if (compact.matches) {
        // the heading makes way for the stages
        const c = home ? span(p, P.caption) : 1;
        caption.style.opacity = (c * (1 - s.stops)).toFixed(3);
        caption.inert = c * (1 - s.stops) < 0.5;
      } else if (!home) { caption.style.opacity = ''; caption.inert = false; }
      stepsBox.style.opacity = s.stops.toFixed(3);
      stepsBox.style.transform = `translateY(${(16 * (1 - s.stops)).toFixed(1)}px)`;
      const shown = drawings.filter((d) => d.svg.getBoundingClientRect().width > 0);
      shown.forEach((d) => d.render(s));
      const at = (shown[0] || drawings[0]).at;
      const active = at.reduce((n, a, i) => (s.travel >= a - 0.001 ? i : n), 0);
      steps.forEach((el, i) => { el.classList.toggle('is-active', i === active); el.classList.toggle('is-done', i < active); });
      current = active;
      staged = s.stops > 0.5;
      syncScenes();
    };
    let onScreen = false, current = 0, staged = false;
    const syncScenes = () => {
      if (!sec.classList.contains('is-live')) { playScenes([...inView]); return; }
      const art = onScreen && staged ? steps[current].querySelector('.jart') : null;
      playScenes(art ? [art] : []);
    };

    const st = ScrollTrigger.create({ trigger: track, start: 'top top', end: 'bottom bottom', onUpdate: (self) => update(self.progress), onRefresh: (self) => update(self.progress) });
    // The current stage's scene plays while the scene is on screen and the stages are showing.
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; syncScenes(); }).observe(sec);
    fit();
    ScrollTrigger.refresh();
    let t = 0;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { fit(); ScrollTrigger.refresh(); }, 150); });

    // "See how we work" lands where the four stages are laid out, not at the top of the track.
    caption.scrollTarget = () => (sec.classList.contains('is-live') ? st.start + (st.end - st.start) * (P.stops[1] + 0.02) : caption);
  });
})();
