// The home hero's maze and "How we work" (src/templates/journey.js). Each maze draws itself in when it first comes
// into view (CSS), and falls away as the hero scrolls off. "How we work" is four rows with the Demaze route running through them: the route is drawn from the
// rows' positions (so it follows the layout at every width) and, with motion, draws itself as the rows scroll by,
// lighting each stage's stop as it arrives. Each stage's scene of the work plays while it is on screen.
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

  const motion = root.classList.contains('motion') && window.gsap && window.ScrollTrigger;

  // Leaving the hero, the maze is taken away: its pitfalls drop out one after another and the walls fade, until only
  // the route is left, which "How we work" below picks up. Tied to the scroll, so scrolling back builds it again.
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    $$('.journey--home .maze').forEach((svg) => {
      const walls = svg.querySelector('.maze__wallset');
      const pits = $$('.maze__pit', svg);
      const clamp = (v) => Math.min(1, Math.max(0, v));
      ScrollTrigger.create({
        // from when the maze passes the middle of the screen (never before the first scroll, since on wide screens it
        // sits in the first one), over half a screen
        start: () => Math.max(1, svg.getBoundingClientRect().top + scrollY + svg.clientHeight / 2 - innerHeight * 0.32),
        end: (self) => self.start + innerHeight * 0.5, invalidateOnRefresh: true,
        onUpdate: ({ progress: p }) => {
          walls.style.opacity = (1 - clamp(p * 1.6)).toFixed(3);
          pits.forEach((pit, i) => {
            const k = clamp(p * 1.9 - i * 0.12), f = k * k;
            pit.style.opacity = (1 - k).toFixed(3);
            pit.style.transform = k ? `translate(0, ${(f * 90).toFixed(1)}px) rotate(${(f * (i % 2 ? 28 : -24)).toFixed(1)}deg)` : '';
          });
        },
      });
    });
  }

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
  const scenes = motion ? $$('.jart').map((svg) => {
    const $ = (s) => $$(s, svg);
    const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: 'power3.out' } });
    const rest = SCENES[svg.dataset.scene] ? SCENES[svg.dataset.scene](tl, $) : 0;
    tl.seek(rest, false);
    return { svg, tl, rest, playing: false };
  }) : [];
  // a scene plays while it is on screen, and holds its finished picture otherwise
  const sceneIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    const s = scenes.find((x) => x.svg === e.target);
    if (e.isIntersecting && !s.playing) s.tl.restart();
    else if (!e.isIntersecting && s.playing) { s.tl.pause(); s.tl.seek(s.rest, false); }
    s.playing = e.isIntersecting;
  }), { threshold: 0.4 });
  scenes.forEach((s) => sceneIO.observe(s.svg));

  // The route through "How we work": from the idea, down into each stage's scene (entering at its stop), across to the
  // next one in the gap between rows, and out to the launch chevron. Right angles with rounded corners, as in the maze.
  const R = 26;
  const rounded = (pts) => {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [p, c, n] = [pts[i - 1], pts[i], pts[i + 1]];
      const a = Math.hypot(c[0] - p[0], c[1] - p[1]), b = Math.hypot(n[0] - c[0], n[1] - c[1]);
      const r = Math.min(R, a / 2, b / 2);
      const p1 = [c[0] + ((p[0] - c[0]) / a) * r, c[1] + ((p[1] - c[1]) / a) * r];
      const p2 = [c[0] + ((n[0] - c[0]) / b) * r, c[1] + ((n[1] - c[1]) / b) * r];
      d += `L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    const e = pts[pts.length - 1];
    return d + `L${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
  };
  // drop repeated points and the middle of straight runs, so every remaining point is a turn
  const turns = (pts) => pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 0.5)
    .filter((p, i, a) => i === 0 || i === a.length - 1 || !((a[i - 1][0] === p[0] && p[0] === a[i + 1][0]) || (a[i - 1][1] === p[1] && p[1] === a[i + 1][1])));

  $$('[data-process]').forEach((sec) => {
    const body = sec.querySelector('.process__body');
    const svg = body.querySelector('.process__route');
    const [line, ink] = svg.querySelectorAll('path');
    const rows = $$('[data-stage]', body);
    const start = body.querySelector('.process__bulb'), end = body.querySelector('.process__chevron');
    let length = 0, reach = [], progress = motion ? 0 : 1;

    const paint = () => {
      ink.style.strokeDashoffset = (length * (1 - progress)).toFixed(1);
      rows.forEach((r, i) => r.classList.toggle('is-reached', progress * length >= reach[i] - 1));
      sec.classList.toggle('is-arrived', progress >= 0.999);
    };
    const layout = () => {
      const o = body.getBoundingClientRect();
      const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left - o.left + r.width / 2, top: r.top - o.top, bottom: r.bottom - o.top, y: r.top - o.top + r.height / 2, left: r.left - o.left }; };
      const s = box(start), e = box(end);
      const arts = rows.map((r) => box(r.querySelector('.process__art')));
      // side by side, the route drops into each scene through the middle of its top edge; stacked (one column), it
      // runs down the gutter beside the rows, clear of the words, and enters each scene at the middle of its left edge
      const stacked = arts.every((a) => Math.abs(a.x - arts[0].x) < 2);
      const X = Math.round(arts[0].left) - 14;
      const pts = [[s.x, s.bottom + 6]];
      const marks = [];
      arts.forEach((a, i) => {
        const prevBottom = i ? arts[i - 1].bottom : s.bottom;
        const mid = (prevBottom + a.top) / 2;
        const art = rows[i].querySelector('.process__art');
        if (stacked) {
          if (!i) pts.push([s.x, mid], [X, mid]);
          pts.push([X, a.y]);
          art.style.setProperty('--stop-x', `${X - a.left}px`);
          art.style.setProperty('--stop-y', '50%');
        } else {
          pts.push([pts[pts.length - 1][0], mid], [a.x, mid], [a.x, a.top]);
          art.style.removeProperty('--stop-x');
          art.style.removeProperty('--stop-y');
        }
        marks.push(pts.length - 1);
        if (!stacked) pts.push([a.x, a.y]);
      });
      const last = arts[arts.length - 1];
      if (stacked) pts.push([X, e.y], [e.left + 4, e.y]);
      else pts.push([last.x, last.bottom], [last.x, e.y], [e.left + 4, e.y]);
      const clean = turns(pts.map(([x, y]) => [Math.round(x), Math.round(y)]));
      svg.setAttribute('viewBox', `0 0 ${Math.round(o.width)} ${Math.round(o.height)}`);
      const d = rounded(clean);
      line.setAttribute('d', d); ink.setAttribute('d', d);
      length = ink.getTotalLength();
      ink.style.strokeDasharray = `${length.toFixed(1)} ${length.toFixed(1)}`;
      // how far along the route each stop is (the corner rounding shortens it a little: measured on the raw points)
      const raw = (k) => pts.slice(1, k + 1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
      const total = raw(pts.length - 1);
      reach = marks.map((k) => (raw(k) / total) * length);
      body.classList.add('has-route');
      paint();
    };
    layout();
    let t = 0;
    new ResizeObserver(() => { clearTimeout(t); t = setTimeout(layout, 80); }).observe(body);
    if (motion) {
      // the tip of the line keeps pace a little below the middle of the screen, and reaches the chevron while it is
      // still in view
      ScrollTrigger.create({ trigger: body, start: 'top 62%', end: 'bottom 85%', onUpdate: (self) => { progress = self.progress; paint(); }, onRefresh: (self) => { progress = self.progress; paint(); } });
    }
  });
})();
