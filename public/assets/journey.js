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
    const end = g.mark[0] - g.C * 0.62; // the signal comes to rest against the chevron
    // where each stage is reached, as a fraction of the walk
    const at = g.stops.map((x) => (x - g.stops[0]) / (end - g.stops[0]));
    let last = '';
    const render = (s) => {
      const key = [s.walls, s.morph, s.stops, s.travel].map((v) => v.toFixed(4)).join();
      if (key === last) return;
      last = key;
      els.walls.style.opacity = (1 - s.walls).toFixed(3);
      // the highlighter fades with the walls, and the pitfalls drop out of the picture one after another
      if (els.glow) els.glow.style.opacity = (0.55 * (1 - s.walls)).toFixed(3);
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
    sec.style.setProperty('--track', home ? '330svh' : '300svh');

    // Live only if the stage fits the screen; a short screen keeps the plain version.
    const fit = () => {
      sec.classList.add('is-live');
      const room = sticky.clientHeight - parseFloat(getComputedStyle(sticky).paddingTop) - 8;
      const ok = stage.offsetHeight <= room;
      sec.classList.toggle('is-roomy', ok && room - stage.offsetHeight > 160); // tall screens: centre the stage
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
    };

    const st = ScrollTrigger.create({ trigger: track, start: 'top top', end: 'bottom bottom', onUpdate: (self) => update(self.progress), onRefresh: (self) => update(self.progress) });
    fit();
    ScrollTrigger.refresh();
    let t = 0;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { fit(); ScrollTrigger.refresh(); }, 150); });

    // "See how we work" lands where the four stages are laid out, not at the top of the track.
    caption.scrollTarget = () => (sec.classList.contains('is-live') ? st.start + (st.end - st.start) * (P.stops[1] + 0.02) : caption);
  });
})();
