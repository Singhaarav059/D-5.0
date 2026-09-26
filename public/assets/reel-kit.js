/* Project reels, part 1 of 2: the kit reel.js builds from.
   ART:   objects and people are Microsoft Fluent 3D renders (MIT, public/assets/img/reel/*.webp); a few UI glyphs
          (QR code, swap arrows, file badges, blockchain block, rupee coin) are drawn here as SVG.
   TYPES: scene types. Each has html(sc) and run(tl, t, $, sc, end): tweens added from time t, $ queries inside
          the scene only, `end` is when the scene cuts away. `dur` is the default length; a scene in content.js
          can set its own. Every scene keeps something moving until its cut, so no frame sits still.
   Look: a pale studio canvas (see the reel section of site.css), so surfaces are white cards on hairlines, idle states are
   ink at low opacity and the active state is solid ink or the project colour.
   Nothing here runs by itself; reel.js reads window.ReelKit. */
(() => {
  'use strict';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  /* ---------- illustrations ---------- */
  // Fluent 3D renders shipped as 256px WebP; the name is the file name.
  const IMG = new Set(('dress blazer kimono scarf handbag purse heel sneaker watch sunglasses ring gem tag box bagshop apple milk ' +
    'bread carrot basket cheese scooter store car suv wrench tools palette oil sparkle gear key person person2 ' +
    'person3 senior senior2 office office2 mechanic detective teacher student phone laptop desktop doc clipboard ' +
    'folder dividers chart growth calendar bell chat mail heart star lock shield check coin card moneybag banknote ' +
    'bank link gift truck factory pin photo camera video film mic headphone ball dance trophy book books vr search ' +
    'cloud brief ai clap sun house tree health umbrella fire hands megaphone recycle bolt pen memo receipt ledger ' +
    'earth takeout').split(' '));
  const G = {
    qr: '<rect x="4" y="4" width="56" height="56" rx="6" fill="#fff"/><path fill="#15161a" d="M10 10h16v16H10zM38 10h16v16H38zM10 38h16v16H10z"/><path fill="#fff" d="M14 14h8v8h-8zM42 14h8v8h-8zM14 42h8v8h-8z"/><path fill="#15161a" d="M32 10h4v8h-4zM32 22h4v10h-4zM38 32h6v4h-6zM48 32h6v10h-6zM32 38h8v4h-8zM38 46h4v8h-4zM46 48h8v6h-8zM28 46h6v4h-6z"/>',
    swap: '<circle cx="32" cy="32" r="27" fill="var(--brand)"/><path d="M18 26h26l-7-7M46 38H20l7 7" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    pdf: '<path fill="#fff" d="M14 4h26l12 12v44H14z"/><path fill="#d3d8e2" d="M40 4v12h12z"/><rect x="8" y="30" width="34" height="16" rx="3" fill="#e5484d"/><text x="25" y="42" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">PDF</text>',
    xls: '<path fill="#fff" d="M14 4h26l12 12v44H14z"/><path fill="#d3d8e2" d="M40 4v12h12z"/><rect x="8" y="30" width="34" height="16" rx="3" fill="#1f9d55"/><text x="25" y="42" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">XLS</text>',
    block: '<path d="M32 6l24 12v28L32 58 8 46V18z" fill="color-mix(in srgb, var(--brand) 55%, #fff)"/><path d="M32 30v28L8 46V18z" fill="var(--brand)"/><path d="M32 30v28l24-12V18z" fill="color-mix(in srgb, var(--brand) 62%, #000)"/>',
    rupee: '<circle cx="32" cy="32" r="26" fill="#ffc94a"/><circle cx="32" cy="32" r="20" fill="none" stroke="#c9961f" stroke-width="2.5"/><text x="32" y="41" text-anchor="middle" font-size="24" font-weight="800" fill="#9a6d0c" font-family="system-ui,sans-serif">₹</text>',
  };
  const art = (name, cls = '') => (IMG.has(name)
    ? `<img class="art ${cls}" src="./assets/img/reel/${name}.webp" alt="" decoding="async">`
    : `<svg class="art ${cls}" viewBox="0 0 64 64" aria-hidden="true">${G[name] || G.block}</svg>`);

  /* ---------- helpers ---------- */
  const tick = '<svg viewBox="0 0 24 24" class="ic"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const glass = '<svg viewBox="0 0 24 24" class="ic"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>';
  const item = (x) => (typeof x === 'string' ? { label: x } : x);
  // A headline split into masked words (reel.js and the stacks below animate the <b>s); the last `accent` words
  // (by default two in a long line, one in a short one) take the project colour.
  const words = (text, accent) => {
    const w = String(text ?? '').split(/\s+/).filter(Boolean);
    const k = accent ?? (w.length >= 5 ? 2 : 1);
    return w.map((x, i) => `<span class="w${i >= w.length - k ? ' is-accent' : ''}"><b>${esc(x)}</b></span>`).join(' ');
  };
  // The project colour as a value GSAP can tween to (CSS variables cannot be tweened).
  const brand = (el) => getComputedStyle(el).getPropertyValue('--brand').trim() || '#3d5afe';
  const drawOn = (tl, paths, t, dur = 0.8, stagger = 0.08) => {
    paths.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = l; tl.set(p, { strokeDashoffset: l }, 0); });
    if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: dur, stagger, ease: 'power2.inOut' }, t);
  };
  // Entrance: settle into place with a little overshoot. Elements start hidden from the top of the loop.
  const pop = (tl, els, t, stagger = 0.1, from = { opacity: 0, y: 22, scale: 0.94 }) => {
    tl.set(els, from, 0).to(els, { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0, rotationX: 0, duration: 0.6, stagger, ease: 'back.out(1.4)' }, t);
  };
  const counter = (tl, el, to, t, dur = 1.6, dec = 0, fmt) => {
    tl.fromTo({ v: 0 }, { v: 0 }, { v: to, duration: dur, ease: 'expo.out', onUpdate() { const v = this.targets()[0].v; el.textContent = fmt ? fmt(v) : v.toFixed(dec); } }, t);
  };
  // A slow idle drift that fills the rest of a scene after its main beat (so nothing freezes before the cut).
  const drift = (tl, els, t, end, vars = { y: -6 }) => {
    const d = end - t - 0.6;
    if (els.length && d > 0.4) tl.fromTo(els, { y: 0 }, { ...vars, duration: d, ease: 'sine.inOut', immediateRender: false }, t);
  };

  // The reel's theme colours for things that sit on the backdrop (reel.css sets them per look): text, an idle fill,
  // and the text colour that reads on a solid `fg` fill. GSAP needs real values, not CSS variables.
  const pal = (el) => { const c = getComputedStyle(el); const v = (k, d) => c.getPropertyValue(k).trim() || d; return { fg: v('--fg', '#0e0f12'), idle: v('--idle', 'rgba(14,15,18,0.05)'), bar: v('--idle-strong', 'rgba(14,15,18,0.12)'), inv: v('--inv', '#ffffff') }; };

  // Figures: "₹38.4L", "1,284", "4.7★", "98.2%" count up from zero keeping their prefix, suffix, decimals and grouping.
  const countTo = (tl, el, t, dur = 1) => {
    const m = /^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(el.dataset.num || el.textContent);
    if (!m) return;
    const [, pre, num, suf] = m, to = parseFloat(num.replace(/,/g, '')), dec = (num.split('.')[1] || '').length;
    const loc = /\d,\d\d,\d{3}/.test(num) ? 'en-IN' : 'en', grouped = num.includes(',');
    const show = (x) => pre + (grouped ? x.toLocaleString(loc, { minimumFractionDigits: dec, maximumFractionDigits: dec }) : x.toFixed(dec)) + suf;
    tl.fromTo({ v: 0 }, { v: 0 }, { v: to, duration: dur, ease: 'expo.out', immediateRender: false, onUpdate() { el.textContent = show(this.targets()[0].v); } }, t);
  };
  // Axis and bar values: fmt is [prefix, suffix, decimals].
  const fmtv = (x, f = ['', '', 0]) => `${f[0] || ''}${f[2] ? x.toFixed(f[2]) : Math.round(x).toLocaleString(f[0] === '₹' ? 'en-IN' : 'en')}${f[1] || ''}`;

  // One dashboard screen's body, by kind.
  const viewBody = (v) => {
    if (v.kind === 'table') {
      return `<div class="rk-table2">${v.rows.map(([a, b, st, next]) => `<div class="rk-tr"><span>${esc(a)}</span><span>${esc(b)}</span><b class="rk-pill rk-pill--${next ? 'wait' : 'ok'}" data-next="${esc(next || '')}">${esc(st)}</b></div>`).join('')}</div>`;
    }
    if (v.kind === 'bars') {
      const max = Math.max(...v.values);
      return `<div class="rk-vbars">${v.values.map((x, i) => `<div><em>${esc((v.display || [])[i] ?? fmtv(x, v.fmt))}</em><i style="--h:${(x / max).toFixed(3)}"></i><span>${esc(v.labels[i])}</span></div>`).join('')}</div>`;
    }
    if (v.kind === 'donut') {
      const tot = v.parts.reduce((a, [, p]) => a + p, 0);
      let acc = 0;
      const segs = v.parts.map(([, p], i) => { const pct = (p / tot) * 100, off = 25 - acc; acc += pct; return `<circle class="rk-seg" cx="21" cy="21" r="15.9155" style="--c:${SEG[i % SEG.length]}" stroke-dasharray="${(pct - 0.8).toFixed(2)} ${(100 - pct + 0.8).toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" data-pct="${pct.toFixed(2)}"/>`; }).join('');
      return `<div class="rk-split"><div class="rk-split__ring"><svg viewBox="0 0 42 42"><circle class="rk-seg__bg" cx="21" cy="21" r="15.9155"/>${segs}</svg><b>${esc(v.center || `${v.parts.length} types`)}</b></div>
        <ul class="rk-legend">${v.parts.map(([l, p], i) => `<li style="--c:${SEG[i % SEG.length]}"><i></i><span>${esc(l)}</span><b>${Math.round((p / tot) * 100)}%</b></li>`).join('')}</ul></div>`;
    }
    // line: a trend on labelled axes, a reading dot with its value
    const max = v.max || niceMax(Math.max(...v.values)), n = v.values.length;
    const pts = v.values.map((x, i) => [(i / (n - 1)) * 200, 76 - (x / max) * 68]);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
    return `<div class="rk-linechart" data-max="${max}" data-fmt='${esc(JSON.stringify(v.fmt || ['', '', 0]))}' data-vals="${v.values.join(',')}">
      <div class="rk-yaxis">${[1, 0.5, 0].map((k) => `<span>${esc(fmtv(max * k, v.fmt))}</span>`).join('')}</div>
      <div class="rk-plot"><svg class="rk-line" viewBox="0 0 200 80" preserveAspectRatio="none"><path class="rk-grid" d="M0 8H200M0 42H200M0 76H200"/><path class="rk-line__area" d="${d} L200 80 L0 80z"/><path class="rk-line__path" d="${d}"/></svg><i class="rk-line__dot"></i><b class="rk-tip">${esc(fmtv(v.values[n - 1], v.fmt))}</b></div>
      <div class="rk-xaxis">${v.labels.map((l) => `<span>${esc(l)}</span>`).join('')}</div></div>`;
  };
  const SEG = ['var(--brand)', 'color-mix(in srgb, var(--brand) 62%, #fff)', 'color-mix(in srgb, var(--brand) 34%, #fff)', 'color-mix(in srgb, var(--brand) 40%, #1b1c22)'];
  const niceMax = (x) => { const e = 10 ** Math.floor(Math.log10(x)), m = x / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * e; };

  const animateBody = (tl, v, t, span, on) => {
    const q = (s) => [...v.querySelectorAll(s)];
    const kind = v.dataset.kind;
    if (kind === 'table') {
      tl.set(q('.rk-tr'), { opacity: 0, x: -16 }, 0).to(q('.rk-tr'), { opacity: 1, x: 0, duration: 0.35, stagger: 0.08, ease: 'expo.out' }, t);
      const pills = q('.rk-pill--wait');
      pills.forEach((p) => { p.dataset.w = p.textContent; });
      tl.set(pills, { backgroundColor: '#fff4dc', color: '#b7791f' }, 0);
      pills.forEach((p, i) => tl.to(p, { backgroundColor: '#dff5ea', color: '#1f9d55', duration: 0.25 }, t + 0.55 + i * 0.25)
        .call(() => { p.textContent = p.dataset.next; }, null, t + 0.55 + i * 0.25).call(() => { p.textContent = p.dataset.w; }, null, t + 0.54 + i * 0.25));
    } else if (kind === 'bars') {
      const bars = q('.rk-vbars i');
      tl.set(bars, { scaleY: 0 }, 0).to(bars, { scaleY: 1, duration: 0.55, stagger: 0.06, ease: 'back.out(1.3)' }, t)
        .set(q('.rk-vbars em'), { opacity: 0, y: 6 }, 0).to(q('.rk-vbars em'), { opacity: 1, y: 0, duration: 0.3, stagger: 0.06 }, t + 0.25);
      const vals = bars.map((b) => +b.style.getPropertyValue('--h')), top = bars[vals.indexOf(Math.max(...vals))];
      tl.set(top, { backgroundColor: '' }, 0).to(top, { backgroundColor: on, duration: 0.25 }, t + 0.6);
    } else if (kind === 'donut') {
      q('.rk-seg').forEach((sg, i) => { const pct = +sg.dataset.pct; tl.fromTo(sg, { attr: { 'stroke-dasharray': '0 100' } }, { attr: { 'stroke-dasharray': `${(pct - 0.8).toFixed(2)} ${(100.8 - pct).toFixed(2)}` }, duration: 0.5, ease: 'power2.out', immediateRender: false }, t + i * 0.12).set(sg, { attr: { 'stroke-dasharray': '0 100' } }, 0); });
      tl.set(q('.rk-legend li'), { opacity: 0, x: 12 }, 0).to(q('.rk-legend li'), { opacity: 1, x: 0, duration: 0.3, stagger: 0.07 }, t + 0.2);
    } else {
      const lc = q('.rk-linechart')[0], path = q('.rk-line__path')[0], dot = q('.rk-line__dot')[0], tip = q('.rk-tip')[0];
      const vals = lc.dataset.vals.split(',').map(Number), f = JSON.parse(lc.dataset.fmt), n = vals.length;
      drawOn(tl, [path], t, 0.7);
      tl.set(q('.rk-line__area'), { opacity: 0 }, 0).to(q('.rk-line__area'), { opacity: 1, duration: 0.4 }, t + 0.45)
        .set([dot, tip], { opacity: 0 }, 0).to([dot, tip], { opacity: 1, duration: 0.2 }, t + 0.6)
        .fromTo({ k: 0.5 }, { k: 0.5 }, { k: 1, duration: Math.max(0.4, span - 0.7), ease: 'sine.inOut', immediateRender: false, onUpdate() {
          const k = this.targets()[0].k, L = path.getTotalLength(), p = path.getPointAtLength(L * k);
          dot.style.left = tip.style.left = `${(p.x / 200) * 100}%`; dot.style.top = tip.style.top = `${(p.y / 80) * 100}%`;
          tip.textContent = fmtv(vals[Math.round(k * (n - 1))], f);
        } }, t + 0.6);
    }
  };

  // A dressing-room avatar (drawn here so the clothes can actually go on it) and the garments it tries on.
  const AVATAR = `<svg class="rk-avatar" viewBox="0 0 120 220" aria-hidden="true">
    <ellipse cx="60" cy="214" rx="34" ry="4" fill="rgba(0,0,0,0.12)"/>
    <path d="M47 150h10l-2 58h-8zM63 150h10l-1 58h-8z" fill="#e2b48f"/><path d="M44 206h14v6H42zM63 206h14l2 6H63z" fill="#2b2d3a"/>
    <path class="rk-arm" d="M39 64c-7 4-9 22-10 42-1 12 1 26 3 34l6-1c-1-12-1-24 1-36 1-10 3-18 6-24z" fill="#e2b48f"/>
    <path class="rk-arm" d="M81 64c7 4 9 22 10 42 1 12-1 26-3 34l-6-1c1-12 1-24-1-36-1-10-3-18-6-24z" fill="#e2b48f"/>
    <path d="M42 60c6-5 30-5 36 0l3 38-3 30 1 24H41l1-24-3-30z" fill="#ece6dc"/><path d="M41 150h38l1 6H40z" fill="#2b2d3a"/>
    <rect x="54" y="42" width="12" height="16" rx="5" fill="#dcaa85"/>
    <ellipse cx="60" cy="32" rx="15" ry="17" fill="#e8bb96"/>
    <path d="M45 30c0-14 9-20 16-20s16 5 15 20c-3-7-9-10-16-10s-12 4-15 10z" fill="#3a2a24"/><circle cx="60" cy="10" r="7" fill="#3a2a24"/>
  </svg>`;
  const GARMENT = {
    dress: (c) => `<path d="M46 58h6l2 8h12l2-8h6l1 8 4 26-2 8 12 58H29l12-58-2-8 4-26z" fill="${c}"/><path d="M41 98h38l-1 6H42z" fill="rgba(0,0,0,0.18)"/>`,
    blazer: (c) => `<path d="M40 60c6-5 34-5 40 0l12 20-2 50-8 2-2-54-2 92H42l-2-92-2 54-8-2-2-50z" fill="${c}"/><path d="M54 60l6 30 6-30-2 110h-8z" fill="#ece6dc"/><path d="M54 60l6 30-8-6-4-18zM66 60l-6 30 8-6 4-18z" fill="rgba(0,0,0,0.16)"/>`,
    kimono: (c) => `<path d="M42 60c6-4 30-4 36 0l26 28-10 18-12-10v76H38V96l-12 10-10-18z" fill="${c}"/><path d="M52 60l8 24 8-24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="3"/><rect x="38" y="104" width="44" height="12" fill="rgba(0,0,0,0.35)"/>
      ${[[50, 130], [70, 140], [58, 158], [30, 92], [92, 92], [66, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="rgba(255,255,255,0.55)"/>`).join('')}`,
  };

  const TYPES = {
    /* the brief: the jobs it covers stacked as one-word beats ("Valuations. EMIs. Refurbishment. Sales."), each landing
       hard with its icon, the last in the project colour; the client's sentence underneath */
    brief: {
      dur: 4.4,
      html: (sc) => `<div class="rk-brief"><b class="rk-kicker">${esc(sc.kicker || 'The brief')}</b>
        <div class="rk-stack">${sc.items.map((it, i) => `<div class="rk-line${i === sc.items.length - 1 ? ' is-accent' : ''}"><i class="rk-line__art">${art(it.art)}</i><span class="w"><b>${esc(it.label)}.</b></span></div>`).join('')}</div>
        <p>${esc(sc.text)}</p></div>`,
      run(tl, t, $, sc) {
        pop(tl, $('.rk-kicker'), t, 0, { opacity: 0, y: 10 });
        const lines = $('.rk-line'), gap = Math.min(0.45, 1.9 / lines.length);
        tl.set($('.rk-line b'), { yPercent: 110 }, 0).set($('.rk-line__art'), { scale: 0, rotation: -30 }, 0);
        lines.forEach((l, i) => tl.to(l.querySelector('b'), { yPercent: 0, duration: 0.5, ease: 'expo.out' }, t + 0.3 + i * gap)
          .to(l.querySelector('.rk-line__art'), { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)' }, t + 0.36 + i * gap));
        pop(tl, $('.rk-brief p'), t + 0.5 + lines.length * gap, 0, { opacity: 0, y: 10 });
      },
    },

    /* the outcome: the results stacked as ticked beats, the last in the project colour, optionally one real figure,
       with the closing sentence underneath */
    outcome: {
      dur: 4.2,
      html: (sc) => `<div class="rk-outcome"><b class="rk-kicker">${esc(sc.kicker || 'The outcome')}</b>
        ${sc.stat ? `<div class="rk-bigstat"><b><span>0</span>${esc(sc.stat.suffix || '')}</b><small>${esc(sc.stat.label)}</small></div>` : ''}
        <div class="rk-stack rk-stack--results">${sc.items.map((it, i) => `<div class="rk-line${i === sc.items.length - 1 ? ' is-accent' : ''}"><i class="rk-tick">${tick}</i><span class="w"><b>${esc(it)}.</b></span></div>`).join('')}</div>
        <p>${esc(sc.text)}</p></div>`,
      run(tl, t, $, sc) {
        pop(tl, $('.rk-kicker'), t, 0, { opacity: 0, y: 10 });
        let s = t + 0.25;
        if (sc.stat) { pop(tl, $('.rk-bigstat'), t + 0.2, 0, { opacity: 0, scale: 0.9 }); counter(tl, $('.rk-bigstat span')[0], sc.stat.to, t + 0.3, 1.6, sc.stat.dec || 0); s += 0.5; }
        const lines = $('.rk-line');
        tl.set($('.rk-line b'), { yPercent: 110 }, 0).set($('.rk-tick'), { scale: 0 }, 0);
        lines.forEach((l, i) => tl.to(l.querySelector('b'), { yPercent: 0, duration: 0.5, ease: 'expo.out' }, s + i * 0.42)
          .to(l.querySelector('.rk-tick'), { scale: 1, duration: 0.4, ease: 'back.out(3)' }, s + 0.1 + i * 0.42));
        pop(tl, $('.rk-outcome p'), s + 0.3 + lines.length * 0.42, 0, { opacity: 0, y: 10 });
      },
    },

    /* product/result cards, optionally found by a typed search; one is picked */
    products: {
      dur: 4,
      html: (sc) => `${sc.query ? `<div class="rk-searchbar">${glass}<span></span><i class="rk-caret"></i>${sc.ai ? '<b class="rk-chip">AI</b>' : ''}</div>` : ''}
        <div class="rk-products">${sc.items.map((it, i) => `<div class="rk-product${i === sc.pick ? ' is-pick' : ''}"><div class="rk-product__art">${art(it.art)}</div>
          <strong>${esc(it.label)}</strong>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}${i === sc.pick ? `<b class="rk-badge">${esc(sc.badge || 'Picked')}</b>` : ''}</div>`).join('')}</div>`,
      run(tl, t, $, sc, end) {
        let s = t + 0.1;
        if (sc.query) {
          const q = $('.rk-searchbar span')[0];
          pop(tl, $('.rk-searchbar'), t);
          tl.call(() => { q.textContent = ''; }, null, 0.01)
            .fromTo({ n: 0 }, { n: 0 }, { n: sc.query.length, duration: 0.9, ease: 'none', onUpdate() { q.textContent = sc.query.slice(0, Math.round(this.targets()[0].n)); } }, t + 0.3);
          s = t + 1.3;
        }
        pop(tl, $('.rk-product'), s, 0.12);
        const pick = $('.rk-product.is-pick');
        tl.set($('.rk-badge'), { scale: 0, opacity: 0 }, 0).set(pick, { boxShadow: '0 0 0 0px var(--brand)' }, 0)
          .to(pick, { y: -10, boxShadow: '0 0 0 3px var(--brand)', duration: 0.45, ease: 'power3.out' }, s + 1)
          .to($('.rk-badge'), { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)' }, s + 1.1);
        drift(tl, pick.map((p) => p.querySelector('.art')), s + 1.2, end, { y: -5, rotation: 4 });
      },
    },

    /* virtual try-on: an avatar in the mirror is dressed in each look in turn (the garment drops over the shoulders
       and settles), picked from the list beside it */
    tryon: {
      dur: 4.6,
      html: (sc) => `<div class="rk-tryon"><div class="rk-mirror"><div class="rk-mirror__stage">${AVATAR.replace('</svg>', `${sc.looks.map((l, i) => `<g class="rk-garment" data-i="${i}">${(GARMENT[l.art] || GARMENT.dress)(l.color || ['#2f7a5d', '#cfa982', '#3b6fd8'][i % 3])}</g>`).join('')}</svg>`)}</div>
        <i class="rk-mirror__scan"></i><b class="rk-chip rk-mirror__tag">${esc(sc.label || 'AI stylist')}</b></div>
        <div class="rk-looklist">${sc.looks.map((l) => `<div class="rk-lookrow"><div class="rk-lookrow__art" style="--hue:${l.hue || 0}deg">${art(l.art)}</div><span>${esc(l.label)}</span></div>`).join('')}</div></div>`,
      run(tl, t, $, sc) {
        const P = pal($('.rk-tryon')[0]);
        const gs = $('.rk-garment'), rows = $('.rk-lookrow'), scan = $('.rk-mirror__scan')[0], av = $('.rk-avatar')[0];
        pop(tl, $('.rk-mirror'), t, 0, { opacity: 0, scale: 0.94, y: 12 });
        pop(tl, rows, t + 0.25, 0.1, { opacity: 0, x: 24 });
        tl.set(gs, { opacity: 0, y: -46, scaleY: 0.7, transformOrigin: '50% 0%' }, 0).set(rows, { backgroundColor: P.idle, color: P.fg }, 0)
          .set(scan, { top: '0%', opacity: 0 }, 0)
          .fromTo(av, { rotation: -1.5, transformOrigin: '50% 100%' }, { rotation: 1.5, duration: 0.9, yoyo: true, repeat: 4, ease: 'sine.inOut', immediateRender: false }, t);
        const step = 3.4 / gs.length;
        gs.forEach((g, i) => {
          const s = t + 0.6 + i * step;
          tl.to(rows[i], { backgroundColor: P.fg, color: P.inv, duration: 0.25 }, s)
            // the garment comes down over the head and settles on the shoulders
            .to(g, { opacity: 1, y: 0, scaleY: 1, duration: 0.6, ease: 'back.out(1.4)' }, s + 0.1)
            .to(scan, { opacity: 1, duration: 0.1 }, s + 0.55).fromTo(scan, { top: '0%' }, { top: '100%', duration: 0.5, ease: 'power2.inOut', immediateRender: false }, s + 0.55)
            .to(scan, { opacity: 0, duration: 0.1 }, s + 1.05);
          if (i < gs.length - 1) tl.to(g, { opacity: 0, y: -30, duration: 0.3, ease: 'power2.in' }, s + step - 0.3).to(rows[i], { backgroundColor: P.idle, color: P.fg, duration: 0.2 }, s + step - 0.2);
        });
      },
    },

    /* a curated row ("Picked for you") that steps along, one card at a time, inside a soft-edged window */
    carousel: {
      dur: 4,
      html: (sc) => `<div class="rk-carousel"><b class="rk-chip">${esc(sc.title)}</b><div class="rk-railwin"><div class="rk-rail">${[...sc.items, ...sc.items].map((it) => `<div class="rk-product rk-product--sm"><div class="rk-product__art">${art(it.art)}</div><strong>${esc(it.label)}</strong></div>`).join('')}</div></div></div>`,
      run(tl, t, $) {
        pop(tl, $('.rk-chip'), t);
        const cards = $('.rk-product'), stepX = 158;
        tl.set($('.rk-rail'), { x: 0 }, 0);
        pop(tl, cards.slice(0, 5), t + 0.1, 0.08, { opacity: 0, y: 30 });
        [0, 1, 2].forEach((k) => tl.to($('.rk-rail'), { x: -stepX * (k + 1), duration: 0.6, ease: 'power3.inOut' }, t + 1.1 + k * 0.85));
      },
    },

    /* one item, three ways to own it (buy / rent / resell), each lit in turn with its price */
    pricing: {
      dur: 3.8,
      html: (sc) => `<div class="rk-pricing"><div class="rk-product rk-product--hero"><div class="rk-product__art">${art(sc.art)}</div><strong>${esc(sc.label)}</strong></div>
        <div class="rk-options">${sc.options.map(([a, b, price]) => `<div class="rk-option"><span><strong>${esc(a)}</strong><small>${esc(b)}</small></span>${price ? `<b class="rk-option__price">${esc(price)}</b>` : ''}</div>`).join('')}</div></div>`,
      run(tl, t, $, sc, end) {
        const P = pal($('.rk-pricing')[0]);
        pop(tl, $('.rk-product--hero'), t, 0, { opacity: 0, scale: 0.85, y: 20 });
        const opts = $('.rk-option');
        pop(tl, opts, t + 0.4, 0.12, { opacity: 0, x: 30 });
        tl.set(opts, { backgroundColor: P.idle, color: P.fg }, 0);
        opts.forEach((o, i) => {
          const s = t + 1.1 + i * 0.75;
          tl.to(o, { backgroundColor: P.fg, color: P.inv, x: -8, duration: 0.25 }, s);
          if (i < opts.length - 1) tl.to(o, { backgroundColor: P.idle, color: P.fg, x: 0, duration: 0.25 }, s + 0.65);
        });
        drift(tl, $('.rk-product--hero .art'), t + 0.8, end, { y: -6, rotation: -3 });
      },
    },

    /* an admin panel that is actually used: the cursor clicks through the sidebar and each tab opens its own screen
       (a table with live statuses, bars with values, a trend on real axes, or a split donut), its figures counting up */
    dashboard: {
      dur: (sc) => 1.1 + (sc.views || [0]).length * 1.45,
      html(sc) {
        const views = sc.views || [{ kind: sc.kind || 'line', kpis: sc.kpis }];
        const nav = sc.nav || views.map((_, i) => `View ${i + 1}`);
        return `<div class="rk-window rk-dash"><div class="rk-window__bar"><i></i><i></i><i></i><span>${esc(sc.title || 'Dashboard')}</span></div>
          <div class="rk-dash__side">${nav.map((n) => `<i>${esc(n)}</i>`).join('')}</div>
          <div class="rk-dash__main">${views.map((v, i) => `<div class="rk-view" data-kind="${esc(v.kind)}"><b class="rk-view__title">${esc(nav[i] || '')}</b>
            <div class="rk-kpis">${(v.kpis || []).map(([val, label, sub]) => `<div class="rk-kpi"><small>${esc(label)}</small><strong data-num="${esc(val)}">${esc(val)}</strong>${sub ? `<em>${esc(sub)}</em>` : ''}</div>`).join('')}</div>
            <div class="rk-view__body">${viewBody(v)}</div></div>`).join('')}</div>
          <svg class="rk-cursor" viewBox="0 0 24 24"><path d="M4 2l16 10-7 1-3 7z"/></svg></div>`;
      },
      run(tl, t, $, sc) {
        const views = $('.rk-view'), nav = $('.rk-dash__side i'), cur = $('.rk-cursor')[0], win = $('.rk-window')[0];
        const on = brand(win), n = views.length, step = 1.45;
        pop(tl, win, t, 0, { opacity: 0, y: 30, scale: 0.96 });
        tl.set(views, { autoAlpha: 0, y: 0 }, 0).set(nav, { backgroundColor: 'rgba(255,255,255,0.06)', color: '#aeb2bf' }, 0).set(cur, { opacity: 0, x: 60, y: 200 }, 0);
        views.forEach((v, i) => {
          const s = t + 0.35 + i * step;
          if (i > 0) {
            // the cursor travels to the tab and clicks it
            tl.to(cur, { opacity: 1, x: () => nav[i].offsetLeft + 62, y: () => nav[i].offsetTop + 6, duration: 0.4, ease: 'power2.inOut' }, s - 0.5)
              .to(cur, { scale: 0.8, duration: 0.08, yoyo: true, repeat: 1 }, s - 0.1)
              .to(nav[i - 1], { backgroundColor: 'rgba(255,255,255,0.06)', color: '#aeb2bf', duration: 0.15 }, s - 0.05)
              .to(views[i - 1], { autoAlpha: 0, y: -10, duration: 0.2, ease: 'power2.in' }, s - 0.05);
          }
          tl.to(nav[i], { backgroundColor: on, color: '#ffffff', duration: 0.15 }, s - 0.05)
            .fromTo(v, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'expo.out', immediateRender: false }, s);
          $(`.rk-view:nth-child(${i + 1}) .rk-kpi strong`).forEach((k, j) => countTo(tl, k, s + 0.05 + j * 0.06, 0.9));
          animateBody(tl, v, s + 0.15, step - 0.3, on);
        });
        tl.to(cur, { opacity: 0, duration: 0.2 }, t + 0.35 + (n - 1) * step + 0.4);
      },
    },

    /* drag-and-drop page builder: blocks fly from a palette into the page */
    cms: {
      dur: 4,
      html: (sc) => `<div class="rk-cms"><div class="rk-palette">${sc.blocks.map((b) => `<div class="rk-block">${esc(b)}</div>`).join('')}</div>
        <div class="rk-window rk-page"><div class="rk-window__bar"><i></i><i></i><i></i><span>${esc(sc.title || 'Page')}</span></div>${sc.blocks.map((b, i) => `<div class="rk-slot rk-slot--${i}"><div class="rk-placed">${esc(b)}</div></div>`).join('')}</div>
        <svg class="rk-cursor" viewBox="0 0 24 24"><path d="M4 2l16 10-7 1-3 7z"/></svg></div>`,
      run(tl, t, $) {
        const placed = $('.rk-placed'), blocks = $('.rk-block'), cur = $('.rk-cursor')[0];
        pop(tl, $('.rk-palette'), t, 0, { opacity: 0, x: -30 });
        pop(tl, $('.rk-page'), t + 0.1, 0, { opacity: 0, x: 30 });
        tl.set(placed, { opacity: 0, scale: 0.6 }, 0).set(cur, { opacity: 0, x: 0, y: 0 }, 0).to(cur, { opacity: 1, duration: 0.2 }, t + 0.5);
        const step = 2.8 / placed.length;
        placed.forEach((p, i) => {
          const s = t + 0.6 + i * step, b = blocks[i];
          tl.to(cur, { x: () => b.offsetLeft + 40, y: () => b.offsetTop + 18, duration: 0.3, ease: 'power2.out' }, s)
            .to(b, { scale: 0.94, duration: 0.1 }, s + 0.3)
            .to(cur, { x: () => p.parentNode.offsetLeft + p.parentNode.offsetParent.offsetLeft + 80, y: () => p.parentNode.offsetTop + p.parentNode.offsetParent.offsetTop + 20, duration: 0.45, ease: 'power2.inOut' }, s + 0.35)
            .to(b, { scale: 1, opacity: 0.45, duration: 0.2 }, s + 0.45)
            .to(p, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, s + 0.75);
        });
        tl.set(blocks, { opacity: 1 }, 0);
      },
    },

    /* live selling: a phone streaming, LIVE badge, a viewer count ticking up, a pinned product being bought */
    live: {
      dur: 4,
      html: (sc) => `<div class="rk-live"><div class="rk-phone"><div class="rk-phone__screen rk-live__video"><div class="rk-live__host">${art(sc.host || 'person2')}</div>
        <b class="rk-live__badge">LIVE</b><b class="rk-live__viewers">${glass.replace('class="ic"', 'class="ic ic--eye"')}<span>0</span></b>
        <div class="rk-live__pinned">${art(sc.art)}<span>${esc(sc.label)}</span><b>${esc(sc.cta || 'Buy')}</b></div>
        ${Array.from({ length: 6 }, (_, i) => `<i class="rk-heart" style="--x:${(i % 3) * 16 - 16}px">${art('heart')}</i>`).join('')}</div></div>
        <div class="rk-live__feed">${(sc.feed || ['Is it available in green?', 'Just bought one!', 'Love this']).map((m) => `<p>${esc(m)}</p>`).join('')}</div></div>`,
      run(tl, t, $) {
        pop(tl, $('.rk-phone'), t, 0, { opacity: 0, y: 40 });
        counter(tl, $('.rk-live__viewers span')[0], 1284, t + 0.4, 2.8, 0, (v) => Math.round(v).toLocaleString('en'));
        pop(tl, $('.rk-live__pinned'), t + 0.9, 0, { opacity: 0, y: 20 });
        pop(tl, $('.rk-live__feed p'), t + 1, 0.7, { opacity: 0, x: -20 });
        tl.to($('.rk-live__pinned b'), { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, t + 2.6);
        $('.rk-heart').forEach((h, i) => {
          tl.set(h, { opacity: 0, y: 0, x: 0, scale: 0.5 }, 0)
            .to(h, { opacity: 1, scale: 1, duration: 0.2 }, t + 0.8 + i * 0.4)
            .to(h, { y: -150, x: `+=${(i % 2 ? 1 : -1) * 18}`, opacity: 0, duration: 1.6, ease: 'power1.out' }, t + 0.9 + i * 0.4);
        });
      },
    },

    /* authenticity: the product, its digital passport QR being scanned, a verified certificate */
    passport: {
      dur: 3.8,
      html: (sc) => `<div class="rk-passport"><div class="rk-product rk-product--hero"><div class="rk-product__art">${art(sc.art)}</div><strong>${esc(sc.label)}</strong></div>
        <div class="rk-qr">${art('qr')}<i class="rk-qr__scan"></i></div>
        <div class="rk-verified">${art('check')}<div><strong>${esc(sc.result || 'Authenticated')}</strong><small>${esc(sc.sub || 'Digital passport')}</small></div></div></div>`,
      run(tl, t, $, sc, end) {
        pop(tl, $('.rk-product--hero'), t, 0, { opacity: 0, x: -30 });
        pop(tl, $('.rk-qr'), t + 0.35, 0, { opacity: 0, scale: 0.7 });
        tl.set($('.rk-qr__scan'), { top: '0%', opacity: 0 }, 0).to($('.rk-qr__scan'), { opacity: 1, duration: 0.1 }, t + 0.8)
          .to($('.rk-qr__scan'), { top: '100%', duration: 0.6, repeat: 1, yoyo: true, ease: 'sine.inOut' }, t + 0.8)
          .to($('.rk-qr__scan'), { opacity: 0, duration: 0.1 }, t + 2);
        pop(tl, $('.rk-verified'), t + 2, 0, { opacity: 0, scale: 0.7 });
        drift(tl, $('.rk-product--hero .art'), t + 0.8, end, { y: -5 });
      },
    },

    /* stock on shelves: items slide in with their stock levels, one runs low and is restocked, an order leaves */
    inventory: {
      dur: 4.2,
      html: (sc) => `<div class="rk-inventory"><div class="rk-shelf">${sc.items.map((it, i) => `<div class="rk-bin"><div class="rk-bin__art">${art(it.art)}</div><strong>${esc(it.label)}</strong><i class="rk-stock"><em></em></i><small>${i === 1 ? 'Low stock' : 'In stock'}</small></div>`).join('')}</div>
        <div class="rk-belt"><i class="rk-belt__box">${art('box')}</i><span>${esc(sc.order || 'Order packed')}</span><b>${tick}</b></div></div>`,
      run(tl, t, $) {
        const levels = [0.9, 0.18, 0.75, 0.55];
        pop(tl, $('.rk-bin'), t, 0.1);
        const bars = $('.rk-stock em'), notes = $('.rk-bin small');
        tl.set(bars, { scaleX: 0, backgroundColor: '#3cc98a' }, 0).to(bars, { scaleX: (i) => levels[i % 4], duration: 1, stagger: 0.1, ease: 'expo.out' }, t + 0.5)
          .set(bars[1], { backgroundColor: '#e5484d' }, 0).set(notes[1], { color: '#e5484d' }, 0)
          .call(() => { notes[1].textContent = 'Low stock'; }, null, t + 0.01)
          // the low item is restocked automatically
          .to(bars[1], { scaleX: 0.85, backgroundColor: '#3cc98a', duration: 0.7, ease: 'expo.out' }, t + 2)
          .to(notes[1], { color: '#1f9d55', duration: 0.2 }, t + 2).call(() => { notes[1].textContent = 'Restocked'; }, null, t + 2);
        pop(tl, $('.rk-belt'), t + 1.2, 0, { opacity: 0, y: 20 });
        tl.fromTo($('.rk-belt__box'), { x: -10 }, { x: 250, duration: 2.2, ease: 'power1.inOut', immediateRender: false }, t + 1.4);
        pop(tl, $('.rk-belt b'), t + 3.3, 0, { opacity: 0, scale: 0 });
      },
    },

    /* steps joined by wires, a packet travelling; each step lights up as it arrives */
    flow: {
      dur: 3.8,
      // the middle step is the product: a glowing tile the first step beams into (after Hypit's launch film)
      html: (sc) => { const core = Math.floor(sc.steps.length / 2); return `<div class="rk-flow">${sc.steps.map((s, i) => { const it = item(s); return `${i ? `<i class="rk-wire${i === core ? ' rk-wire--beam' : ''}"><em></em><b></b></i>` : ''}<div class="rk-step${i === core ? ' is-core' : ''}"><div class="rk-step__art">${art(it.art || 'sparkle')}</div><span>${esc(it.label)}</span>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</div>`; }).join('')}</div>`; },
      run(tl, t, $, sc, end) {
        const steps = $('.rk-step'), wires = $('.rk-wire em'), pkts = $('.rk-wire b'), arts = $('.rk-step__art');
        pop(tl, steps, t + 0.05, 0.12);
        tl.set(wires, { scaleX: 0 }, 0).set(pkts, { left: '0%', opacity: 0 }, 0).set(arts, { boxShadow: '0 0 0 0px var(--brand)' }, 0)
          .to(arts[0], { boxShadow: '0 0 0 4px var(--brand)', duration: 0.25 }, t + 0.5);
        const seg = 2.2 / Math.max(1, wires.length);
        wires.forEach((w, i) => {
          const s = t + 0.7 + i * seg;
          tl.to(pkts[i], { opacity: 1, duration: 0.05 }, s).to(pkts[i], { left: '100%', duration: seg * 0.8, ease: 'power2.inOut' }, s)
            .to(w, { scaleX: 1, duration: seg * 0.8, ease: 'power2.inOut' }, s).to(pkts[i], { opacity: 0, duration: 0.1 }, s + seg * 0.8)
            .to(arts[i + 1], { boxShadow: '0 0 0 4px var(--brand)', scale: 1.06, duration: 0.3, ease: 'back.out(3)' }, s + seg * 0.8);
        });
        if ($('.rk-wire--beam').length) tl.fromTo($('.rk-wire--beam'), { '--beam': 0 }, { '--beam': 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, t + 0.6).set($('.rk-wire--beam'), { '--beam': 0 }, 0);
        drift(tl, arts.map((a) => a.querySelector('.art')), t + 3, end, { y: -4 });
      },
    },

    /* a centre joined to people or parts; messages pulse out along the links */
    hub: {
      dur: 4,
      html(sc) {
        const n = sc.nodes.length, W = 568, H = 264;
        const pos = sc.nodes.map((_, i) => { const a = ((-90 + (360 / n) * i) * Math.PI) / 180; return [Math.cos(a) * 214, Math.sin(a) * 104]; });
        // the nodes sit on an orbit (X Ticker); links curve out to them like Hypit's connectors
        return `<div class="rk-hubwrap"><svg class="rk-links" viewBox="0 0 ${W} ${H}"><ellipse class="rk-orb" cx="${W / 2}" cy="${H / 2}" rx="214" ry="104"/><ellipse class="rk-orb" cx="${W / 2}" cy="${H / 2}" rx="132" ry="64"/>
          ${pos.map(([x, y]) => `<path d="M${W / 2} ${H / 2} Q${(W / 2 + x * 0.55 - y * 0.35).toFixed(1)} ${(H / 2 + y * 0.55 + x * 0.12).toFixed(1)} ${(W / 2 + x).toFixed(1)} ${(H / 2 + y).toFixed(1)}"/>`).join('')}</svg>
          ${pos.map(() => '<i class="rk-pulse"></i>').join('')}
          <div class="rk-hub">${sc.centerArt ? art(sc.centerArt) : ''}<span>${esc(sc.center)}</span></div>
          ${sc.nodes.map((node, i) => { const it = item(node); return `<div class="rk-node" data-x="${pos[i][0].toFixed(1)}" data-y="${pos[i][1].toFixed(1)}">${art(it.art || 'person')}<span>${esc(it.label)}</span></div>`; }).join('')}</div>`;
      },
      run(tl, t, $, sc, end) {
        $('.rk-links path').forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = `${l}`; tl.set(p, { strokeDashoffset: l }, 0); });
        tl.fromTo($('.rk-orb'), { scale: 0.6, opacity: 0, svgOrigin: '284 132' }, { scale: 1, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out', immediateRender: false }, t);
        // side nodes hang inward from their link's end so long labels never run past the frame
        tl.set($('.rk-hub'), { scale: 0 }, 0).set($('.rk-node'), { xPercent: (i, n) => (+n.dataset.x > 120 ? -86 : +n.dataset.x < -120 ? -14 : -50), yPercent: -50, x: 0, y: 0, scale: 0.3, opacity: 0 }, 0)
          .to($('.rk-hub'), { scale: 1, duration: 0.5, ease: 'back.out(2)' }, t + 0.1)
          .to($('.rk-links path'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, t + 0.4);
        $('.rk-node').forEach((c, i) => tl.to(c, { x: +c.dataset.x, y: +c.dataset.y, scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out' }, t + 0.5 + i * 0.12));
        // pulses travel out to each node in turn, and the node answers
        const pulses = $('.rk-pulse'), nodes = $('.rk-node');
        tl.set(pulses, { x: 0, y: 0, opacity: 0, xPercent: -50, yPercent: -50 }, 0);
        const span = Math.max(1, end - t - 2.2) / nodes.length;
        nodes.forEach((nd, i) => {
          const s = t + 1.6 + i * span;
          tl.to(pulses[i], { opacity: 1, duration: 0.1 }, s).to(pulses[i], { x: +nd.dataset.x, y: +nd.dataset.y, duration: 0.5, ease: 'power2.in' }, s)
            .to(pulses[i], { opacity: 0, duration: 0.1 }, s + 0.5).to(nd, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, s + 0.5);
        });
      },
    },

    /* a conversation with avatars and a typing indicator */
    chat: {
      dur: 4.2,
      html: (sc) => `<div class="rk-chat"><div class="rk-chat__head">${art(sc.people?.[0] || 'person')}<div><strong>${esc(sc.title || 'Chat')}</strong><small>${esc(sc.status || 'Online')}</small></div></div>
        ${sc.messages.map(([side, text], i) => `<div class="rk-msg rk-msg--${side === 'out' ? 'out' : 'in'}" style="order:${i * 2 + 2}">${art(side === 'out' ? sc.people?.[1] || 'person3' : sc.people?.[0] || 'person')}<span>${esc(text)}</span></div>`).join('')}
        <div class="rk-typing"><i></i><i></i><i></i></div></div>`,
      run(tl, t, $) {
        const msgs = $('.rk-msg'), typing = $('.rk-typing')[0];
        pop(tl, $('.rk-chat'), t, 0, { opacity: 0, y: 30 });
        tl.set(msgs, { opacity: 0, scale: 0.7, y: 10 }, 0).set(typing, { opacity: 0, display: 'none' }, 0);
        const gap = 3.2 / msgs.length;
        msgs.forEach((m, i) => {
          const s = t + 0.3 + i * gap, out = m.classList.contains('rk-msg--out');
          tl.set(typing, { display: 'flex', order: i * 2 + 1, alignSelf: out ? 'flex-end' : 'flex-start' }, s)
            .to(typing, { opacity: 1, duration: 0.12 }, s).to(typing, { opacity: 0, duration: 0.1 }, s + gap * 0.42).set(typing, { display: 'none' }, s + gap * 0.48)
            .to(m, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, s + gap * 0.48);
        });
        tl.fromTo($('.rk-typing i'), { y: 0 }, { y: -4, duration: 0.25, stagger: 0.1, repeat: 13, yoyo: true, ease: 'sine.inOut', immediateRender: false }, t + 0.3);
      },
    },

    /* a board of stage columns with work in each; one tracked card moves across, the counts update */
    pipeline: {
      dur: 4.2,
      html: (sc) => `<div class="rk-pipe">${sc.stages.map((s, i) => `<div class="rk-col"><div class="rk-col__head"><b>${esc(s)}</b><em>${(sc.counts || [4, 3, 2, 5])[i]}</em></div>
          ${Array.from({ length: [2, 2, 1, 2][i % 4] }, (_, k) => `<div class="rk-ghost">${art((sc.ghosts || [sc.card.art])[(i + k) % (sc.ghosts || [sc.card.art]).length])}<span><i></i><i></i></span></div>`).join('')}</div>`).join('')}
        <div class="rk-card">${art(sc.card.art || 'person')}<span>${esc(sc.card.label)}</span></div></div>`,
      run(tl, t, $, sc) {
        const n = sc.stages.length, card = $('.rk-card')[0], cols = $('.rk-col'), heads = $('.rk-col__head'), counts = $('.rk-col__head em');
        pop(tl, cols, t + 0.05, 0.08);
        pop(tl, $('.rk-ghost'), t + 0.3, 0.04, { opacity: 0, y: 10 });
        const base = sc.counts || [4, 3, 2, 5];
        counts.forEach((c, i) => tl.call(() => { c.textContent = base[i]; }, null, t + 0.01));
        tl.set(card, { opacity: 0, x: 0, scale: 0.8 }, 0).set(heads, { opacity: 0.55 }, 0)
          .to(card, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, t + 0.6).to(heads[0], { opacity: 1, duration: 0.2 }, t + 0.6);
        for (let i = 1; i < n; i++) {
          const s = t + 1.1 + (i - 1) * (2.4 / (n - 1));
          tl.to(card, { x: () => cols[i].offsetLeft - cols[0].offsetLeft, duration: 0.5, ease: 'expo.inOut' }, s)
            .to(card, { rotation: 4, duration: 0.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, s)
            .to(heads[i - 1], { opacity: 0.55, duration: 0.2 }, s + 0.2).to(heads[i], { opacity: 1, duration: 0.2 }, s + 0.3)
            .call(() => { counts[i - 1].textContent = base[i - 1] - 1; counts[i].textContent = base[i] + 1; }, null, s + 0.3)
            .call(() => { counts[i - 1].textContent = base[i - 1]; counts[i].textContent = base[i]; }, null, s + 0.29);
        }
        tl.fromTo(card, { boxShadow: '0 0 0 0px rgba(60,201,138,0)' }, { boxShadow: '0 0 0 4px rgba(60,201,138,1)', duration: 0.3, immediateRender: false }, t + 3.6);
      },
    },

    /* a ring filling to 100% while steps tick off, with an illustration in the ring */
    checklist: {
      dur: 3.8,
      html: (sc) => `<div class="rk-check"><div class="rk-ringbox"><svg class="rk-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle class="rk-arc" cx="60" cy="60" r="52"/></svg>
        <div class="rk-ringbox__in">${sc.art ? art(sc.art) : ''}<b><span>0</span>%</b></div></div>
        <ul class="rk-steps">${sc.items.map((s) => { const it = item(s); return `<li>${it.art ? art(it.art) : ''}<i>${tick}</i><span>${esc(it.label)}</span></li>`; }).join('')}</ul></div>`,
      run(tl, t, $, sc, end) {
        const pct = $('.rk-ringbox b span')[0], lis = $('.rk-steps li');
        pop(tl, $('.rk-ringbox'), t, 0, { opacity: 0, scale: 0.85 });
        const fill = Math.min(2.6, end - t - 0.9);
        tl.set($('.rk-arc'), { strokeDashoffset: 327 }, 0).to($('.rk-arc'), { strokeDashoffset: 0, duration: fill, ease: 'power2.inOut' }, t + 0.2);
        counter(tl, pct, 100, t + 0.2, fill);
        pop(tl, lis, t + 0.2, 0.12, { opacity: 0, x: 20 });
        tl.set($('.rk-steps li > i'), { scale: 0.5, backgroundColor: 'rgba(21,22,26,0.1)' }, 0).set(lis, { opacity: 1 }, 0);
        $('.rk-steps li > i').forEach((b, i, all) => tl.to(b, { scale: 1, backgroundColor: '#3cc98a', duration: 0.35, ease: 'back.out(2.5)' }, t + 0.7 + i * ((fill - 0.4) / all.length)));
      },
    },

    /* notifications stacking in, each with its own icon */
    notify: {
      dur: 3.8,
      html: (sc) => `<div class="rk-notes">${sc.items.map((n) => `<div class="rk-note">${art(n.art || 'bell')}<div><strong>${esc(n.title)}</strong><small>${esc(n.sub)}</small></div><em>${esc(n.time || 'now')}</em></div>`).join('')}</div>`,
      run(tl, t, $, sc, end) {
        const notes = $('.rk-note');
        notes.forEach((m, i) => {
          const s = t + 0.2 + i * 0.8;
          tl.set(m, { opacity: 0, y: -30, scale: 0.95 }, 0).to(m, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, s)
            .fromTo(m.querySelector('.art'), { rotation: 0 }, { rotation: 12, duration: 0.08, repeat: 5, yoyo: true, ease: 'sine.inOut', immediateRender: false }, s + 0.1);
        });
        // the first one is opened and marked read
        tl.to(notes[0], { x: 10, backgroundColor: '#eef7f2', duration: 0.3 }, t + 2.8).set(notes[0], { backgroundColor: '#ffffff', x: 0 }, 0);
      },
    },

    /* a city map: delivery areas, a route drawn from A to B, a vehicle driving it the whole scene, then arrived */
    map: {
      dur: 4.4,
      html: (sc) => `<div class="rk-map"><svg class="rk-map__city" viewBox="0 0 520 290">
        ${[[20, 20, 150, 60], [190, 20, 140, 60], [350, 20, 150, 60], [20, 100, 150, 70], [350, 100, 150, 70], [20, 190, 150, 80], [190, 190, 140, 80], [350, 190, 150, 80]].map(([x, y, w, h]) => `<rect class="rk-lot" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`).join('')}
        <rect class="rk-park" x="190" y="100" width="140" height="70" rx="8"/>
        ${(sc.zones ? [[110, 170, 110], [400, 110, 90]] : []).map(([x, y, r]) => `<circle class="rk-zone" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
        <path class="rk-route" d="M60 235 H180 V180 H340 V90 H460"/></svg>
        <div class="rk-map__pin rk-map__pin--a">${art(sc.from.art)}<span>${esc(sc.from.label)}</span></div>
        <div class="rk-map__pin rk-map__pin--b">${art(sc.to.art)}<span>${esc(sc.to.label)}</span></div>
        <div class="rk-map__vehicle">${art(sc.vehicle || 'scooter')}</div>${sc.eta ? `<b class="rk-chip rk-map__eta"><span>${esc(sc.eta)}</span></b>` : ''}</div>`,
      run(tl, t, $, sc, end) {
        const route = $('.rk-route')[0], v = $('.rk-map__vehicle')[0], L = route.getTotalLength();
        route.style.strokeDasharray = L;
        pop(tl, $('.rk-map'), t, 0, { opacity: 0, scale: 0.97 });
        pop(tl, $('.rk-map__pin'), t + 0.3, 0.2, { opacity: 0, y: -20, scale: 0.7, xPercent: -50, yPercent: -100 });
        tl.set(route, { strokeDashoffset: L }, 0).to(route, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, t + 0.5);
        if ($('.rk-zone').length) tl.fromTo($('.rk-zone'), { scale: 0.6, opacity: 0, transformOrigin: 'center' }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'expo.out', immediateRender: false }, t + 0.3);
        const place = (k) => { const p = route.getPointAtLength(L * k), q = route.getPointAtLength(Math.min(L, L * k + 1)); v.style.left = `${(p.x / 520) * 100}%`; v.style.top = `${(p.y / 290) * 100}%`; v.style.transform = `translate(-50%, -78%) scaleX(${q.x < p.x ? 1 : -1})`; };
        const drive = Math.max(1.6, end - t - 2);
        tl.set(v, { opacity: 0 }, 0).call(() => place(0), null, 0.01).to(v, { opacity: 1, duration: 0.2 }, t + 1.2)
          .fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: drive, ease: 'power1.inOut', onUpdate() { place(this.targets()[0].k); } }, t + 1.2);
        if ($('.rk-map__eta').length) {
          const eta = $('.rk-map__eta span')[0];
          pop(tl, $('.rk-map__eta'), t + 1.3, 0, { opacity: 0, scale: 0.7 });
          tl.call(() => { eta.textContent = sc.eta; }, null, t + 1.2).call(() => { eta.textContent = sc.arrived || 'Delivered'; }, null, t + 1.2 + drive)
            .to($('.rk-map__eta'), { backgroundColor: '#3cc98a', color: '#fff', duration: 0.25 }, t + 1.2 + drive).set($('.rk-map__eta'), { backgroundColor: '#fff', color: '#15161a' }, 0);
        }
      },
    },

    /* a video call: two tiles, speaking rings, call controls */
    call: {
      dur: 4,
      html: (sc) => `<div class="rk-call">${sc.people.map((p) => `<div class="rk-tile">${art(p.art)}<span>${esc(p.label)}</span><i class="rk-speak"></i></div>`).join('')}
        <div class="rk-controls"><i></i><i></i><i class="is-end"></i><em>00:00</em></div>${sc.note ? `<b class="rk-chip rk-call__note">${esc(sc.note)}</b>` : ''}</div>`,
      run(tl, t, $, sc, end) {
        pop(tl, $('.rk-tile'), t, 0.15, { opacity: 0, scale: 0.9, y: 20 });
        pop(tl, $('.rk-controls'), t + 0.4, 0, { opacity: 0, y: 20 });
        const sp = $('.rk-speak'), clock = $('.rk-controls em')[0];
        tl.set(sp, { opacity: 0 }, 0);
        [0, 1, 0, 1, 0].forEach((k, i) => tl.to(sp[k], { opacity: 1, duration: 0.2 }, t + 0.8 + i * 0.6).to(sp[k], { opacity: 0, duration: 0.2 }, t + 1.3 + i * 0.6));
        counter(tl, clock, end - t, t + 0.4, end - t - 0.4, 0, (v) => `00:${String(Math.floor(v)).padStart(2, '0')}`);
        tl.set(clock, { ease: 'none' }, 0);
        if ($('.rk-call__note').length) pop(tl, $('.rk-call__note'), t + 1.2, 0, { opacity: 0, scale: 0.7 });
      },
    },

    /* a month calendar, a date circled, an event card and a ringing reminder */
    calendar: {
      dur: 3.8,
      html: (sc) => `<div class="rk-cal"><div class="rk-cal__month"><b>${esc(sc.month || 'This month')}</b><div class="rk-cal__grid">${Array.from({ length: 28 }, (_, i) => `<i class="${i + 1 === (sc.day || 18) ? 'is-day' : ''}">${i + 1}</i>`).join('')}</div></div>
        <div class="rk-cal__event">${art(sc.art || 'bell')}<div><strong>${esc(sc.event)}</strong><small>${esc(sc.sub)}</small></div></div></div>`,
      run(tl, t, $, sc, end) {
        pop(tl, $('.rk-cal__month'), t, 0, { opacity: 0, x: -30 });
        pop(tl, $('.rk-cal__grid i'), t + 0.2, 0.012, { opacity: 0, scale: 0.5 });
        tl.set($('.is-day'), { className: 'is-day', scale: 1 }, 0).set($('.is-day'), { className: 'is-day is-on' }, t + 1.1).to($('.is-day'), { scale: 1.15, duration: 0.35, ease: 'back.out(3)' }, t + 1.1);
        pop(tl, $('.rk-cal__event'), t + 1.5, 0, { opacity: 0, x: 40 });
        tl.fromTo($('.rk-cal__event .art'), { rotation: 0 }, { rotation: 14, duration: 0.08, repeat: 7, yoyo: true, immediateRender: false }, t + 1.9);
        drift(tl, $('.rk-cal__event'), t + 2.6, end, { y: -5 });
      },
    },

    /* a document filling itself in (real fields, or a real table), signed, stamped, then exported or sent */
    document: {
      dur: 4,
      html: (sc) => `<div class="rk-docwrap"><div class="rk-paper${sc.fields || sc.grid ? ' rk-paper--filled' : ''}"><b>${esc(sc.title)}</b>
        ${sc.fields ? `<dl class="rk-fields">${sc.fields.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`
          : sc.grid ? `<div class="rk-grid2" style="--cols:${sc.grid[0].length}">${sc.grid.map((r, i) => r.map((c) => `<span class="${i ? '' : 'is-head'}">${esc(c)}</span>`).join('')).join('')}</div>`
          : (sc.lines || [1, 0.8, 0.95, 0.6, 0.85, 0.5]).map((w) => `<i style="--w:${w}"></i>`).join('')}
        ${sc.table && !sc.grid ? `<div class="rk-table">${Array.from({ length: 12 }, () => '<i></i>').join('')}</div>` : ''}<svg class="rk-sign" viewBox="0 0 120 30"><path d="M4 22c10-14 16-16 18-6s6 10 12-2 10-12 12 0 8 10 16 2 14-10 20-4 12 6 30 2"/></svg><em class="rk-stamp">${esc(sc.stamp || 'Done')}</em></div>
        ${(sc.exports || []).map((e) => `<div class="rk-export">${art(e)}</div>`).join('')}${sc.sent ? `<b class="rk-chip rk-doc__sent">${tick}${esc(sc.sent)}</b>` : ''}</div>`,
      run(tl, t, $) {
        pop(tl, $('.rk-paper'), t, 0, { opacity: 0, y: 30, rotation: -2 });
        tl.set($('.rk-paper > i'), { scaleX: 0 }, 0).to($('.rk-paper > i'), { scaleX: 1, duration: 0.35, stagger: 0.16, ease: 'power2.out' }, t + 0.4);
        // fields and cells type in, row by row
        const rows = $('.rk-fields > div, .rk-grid2 > span');
        if (rows.length) tl.set(rows, { clipPath: 'inset(0 100% 0 0)' }, 0).to(rows, { clipPath: 'inset(0 0% 0 0)', duration: 0.3, stagger: Math.min(0.16, 1.3 / rows.length), ease: 'none' }, t + 0.35);
        if ($('.rk-table i').length) pop(tl, $('.rk-table i'), t + 1, 0.04, { opacity: 0, scale: 0.5 });
        drawOn(tl, $('.rk-sign path'), t + 1.8, 0.5);
        tl.set($('.rk-stamp'), { opacity: 0, scale: 2.2, rotation: -18 }, 0).to($('.rk-stamp'), { opacity: 1, scale: 1, rotation: -10, duration: 0.3, ease: 'power4.in' }, t + 2.3);
        $('.rk-export').forEach((e, i) => { tl.set(e, { opacity: 0, x: -80, scale: 0.5 }, 0).to(e, { opacity: 1, x: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t + 2.6 + i * 0.25); });
        if ($('.rk-doc__sent').length) pop(tl, $('.rk-doc__sent'), t + 2.8, 0, { opacity: 0, x: -20 });
      },
    },

    /* money moving: two parties, a coin arcing across, the receiver confirms */
    transfer: {
      dur: 4,
      html: (sc) => `<div class="rk-transfer"><div class="rk-wallet">${art(sc.from.art || 'purse')}<strong>${esc(sc.from.label)}</strong><small>${esc(sc.from.sub)}</small></div>
        <svg class="rk-arc2" viewBox="0 0 200 80"><path d="M10 70 Q100 -20 190 70"/></svg><div class="rk-token">${art(sc.token || 'coin')}</div>
        <div class="rk-wallet">${art(sc.to.art || 'purse')}<strong>${esc(sc.to.label)}</strong><small>${esc(sc.to.sub)}</small><i class="rk-ok">${art('check')}</i></div>${sc.note ? `<b class="rk-chip rk-transfer__note">${esc(sc.note)}</b>` : ''}</div>`,
      run(tl, t, $) {
        pop(tl, $('.rk-wallet'), t, 0.15, { opacity: 0, y: 30 });
        drawOn(tl, $('.rk-arc2 path'), t + 0.4, 0.6);
        const tok = $('.rk-token')[0], arc = $('.rk-arc2 path')[0];
        const place = (k) => { const L = arc.getTotalLength(), p = arc.getPointAtLength(L * k); tok.style.left = `calc(50% - 100px + ${p.x}px)`; tok.style.top = `calc(50% - 60px + ${p.y}px)`; };
        tl.set(tok, { opacity: 0, rotationY: 0, scale: 1 }, 0).call(() => place(0), null, 0.01).to(tok, { opacity: 1, duration: 0.15 }, t + 0.9)
          .fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: 1.4, ease: 'power2.inOut', onUpdate() { place(this.targets()[0].k); } }, t + 0.9)
          .to(tok, { rotationY: 720, duration: 1.4, ease: 'none' }, t + 0.9).to(tok, { opacity: 0, scale: 0.4, duration: 0.2 }, t + 2.3);
        pop(tl, $('.rk-ok'), t + 2.35, 0, { opacity: 0, scale: 0 });
        tl.to($('.rk-wallet')[1], { y: -8, duration: 0.2, yoyo: true, repeat: 1 }, t + 2.3);
        if ($('.rk-transfer__note').length) pop(tl, $('.rk-transfer__note'), t + 2.6, 0, { opacity: 0, y: 10 });
      },
    },

    /* blockchain: blocks drop in and link up, then each is confirmed */
    chain: {
      dur: 3.8,
      html: (sc) => `<div class="rk-chain">${sc.blocks.map((b, i) => `${i ? '<i class="rk-link"></i>' : ''}<div class="rk-blk">${art('block')}<span>${esc(b)}</span><small>#${(4096 + i * 1373).toString(16)}</small><i class="rk-blk__ok">${tick}</i></div>`).join('')}</div>`,
      run(tl, t, $) {
        const blks = $('.rk-blk'), links = $('.rk-link'), oks = $('.rk-blk__ok');
        tl.set(links, { scaleX: 0 }, 0).set(oks, { scale: 0 }, 0);
        blks.forEach((b, i) => {
          tl.set(b, { opacity: 0, y: -50 }, 0).to(b, { opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.6)' }, t + 0.2 + i * 0.5);
          if (links[i - 1]) tl.to(links[i - 1], { scaleX: 1, duration: 0.3, ease: 'power2.out' }, t + 0.45 + i * 0.5);
        });
        tl.to(oks, { scale: 1, duration: 0.35, stagger: 0.2, ease: 'back.out(3)' }, t + 0.5 + blks.length * 0.5);
      },
    },

    /* an investigator's board: pinned evidence joined by red string, a magnifier sweeping */
    board: {
      dur: 4.2,
      html: (sc) => {
        const P = [[80, 72], [270, 56], [460, 80], [140, 214], [340, 204], [480, 222]];
        return `<div class="rk-board"><svg class="rk-strings" viewBox="0 0 560 300">${[[0, 1], [1, 2], [1, 4], [3, 4], [4, 5], [0, 3]].map(([a, b]) => `<path d="M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]}"/>`).join('')}</svg>
          ${sc.items.slice(0, 6).map((it, i) => `<div class="rk-evidence" style="left:${P[i][0]}px;top:${P[i][1]}px;--r:${(i % 2 ? 1 : -1) * (2 + i)}deg"><i class="rk-tack"></i>${art(it.art)}<span>${esc(it.label)}</span></div>`).join('')}
          <div class="rk-lens">${art('search')}</div></div>`;
      },
      run(tl, t, $, sc, end) {
        pop(tl, $('.rk-evidence'), t + 0.1, 0.14, { opacity: 0, scale: 1.3, y: -10 });
        drawOn(tl, $('.rk-strings path'), t + 1, 0.4, 0.15);
        tl.set($('.rk-lens'), { opacity: 0, x: 40, y: 40 }, 0).to($('.rk-lens'), { opacity: 1, duration: 0.2 }, t + 1.6)
          .to($('.rk-lens'), { x: 430, y: 60, duration: 1.1, ease: 'sine.inOut' }, t + 1.6).to($('.rk-lens'), { x: 260, y: 170, duration: Math.max(0.8, end - t - 3.1), ease: 'sine.inOut' }, t + 2.7);
      },
    },

    /* storyboard: the script types on the left, frames fill in on the right */
    frames: {
      dur: 4.4,
      html: (sc) => `<div class="rk-frames"><div class="rk-script"><b>${esc(sc.title || 'SCENE 1')}</b>${sc.script.map((l) => `<p><span>${esc(l)}</span></p>`).join('')}</div>
        <div class="rk-grid">${sc.frames.map((f, i) => `<div class="rk-frame" style="--sky:${f.sky || '#9fc6ff'}"><i class="rk-frame__ground"></i>${art(f.art)}${f.art2 ? art(f.art2, 'rk-frame__b') : ''}<small>${i + 1}</small></div>`).join('')}</div></div>`,
      run(tl, t, $) {
        pop(tl, $('.rk-script'), t, 0, { opacity: 0, x: -30 });
        tl.set($('.rk-script p span'), { clipPath: 'inset(0 100% 0 0)' }, 0).to($('.rk-script p span'), { clipPath: 'inset(0 0% 0 0)', duration: 0.5, stagger: 0.35, ease: 'none' }, t + 0.3);
        pop(tl, $('.rk-frame'), t + 1, 0.24, { opacity: 0, scale: 0.7 });
        tl.fromTo($('.rk-frame .art'), { y: 8 }, { y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(2)', immediateRender: false }, t + 1.1);
      },
    },

    /* up to three real figures counting up in rings */
    stats: {
      dur: 3.6,
      html: (sc) => `<div class="rk-stats">${sc.items.map((s) => `<div class="rk-stat"><svg class="rk-ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle class="rk-arc" cx="60" cy="60" r="52"/></svg>
        <div class="rk-stat__v"><b><span>0</span>${esc(s.suffix || '')}</b><small>${esc(s.label)}</small></div></div>`).join('')}</div>`,
      run(tl, t, $, sc) {
        pop(tl, $('.rk-stat'), t, 0.15, { opacity: 0, scale: 0.8 });
        $('.rk-arc').forEach((a, i) => { tl.set(a, { strokeDashoffset: 327 }, 0).to(a, { strokeDashoffset: 327 * (1 - (sc.items[i].ring ?? 1)), duration: 2, ease: 'expo.out' }, t + 0.3 + i * 0.15); });
        $('.rk-stat__v span').forEach((el, i) => counter(tl, el, sc.items[i].to, t + 0.3 + i * 0.15, 2, sc.items[i].dec || 0));
      },
    },

    /* leaderboard: plinths rise, people take their places, points tick up */
    podium: {
      dur: 3.8,
      html: (sc) => `<div class="rk-podium">${[1, 0, 2].map((k) => `<div class="rk-place rk-place--${k + 1}">${art(sc.people[k])}<span>${esc(sc.labels?.[k] || '')}</span><div class="rk-plinth">${k === 0 ? art('trophy') : `<b>${k + 1}</b>`}<em>${[980, 860, 790][k]} pts</em></div></div>`).join('')}</div>`,
      run(tl, t, $) {
        tl.set($('.rk-plinth'), { scaleY: 0 }, 0).to($('.rk-plinth'), { scaleY: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.4)' }, t + 0.1);
        pop(tl, $('.rk-place > .art'), t + 0.6, 0.2, { opacity: 0, y: -40, scale: 0.7 });
        pop(tl, $('.rk-place > span'), t + 1, 0.2, { opacity: 0, y: 8 });
        tl.fromTo($('.rk-place--1 .rk-plinth .art'), { rotation: -8 }, { rotation: 8, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, t + 1.4);
      },
    },

    /* several apps side by side (user / seller / rider), each doing its own job: rows arrive and are ticked off,
       then a status lands on the screen */
    apps: {
      dur: 4,
      html: (sc) => `<div class="rk-apps">${sc.items.map((a) => `<div class="rk-phone rk-phone--sm" style="--k:${a.color || 'var(--brand)'}"><div class="rk-phone__screen"><div class="rk-phone__head"><span>${esc(a.label)}</span></div>${art(a.art)}<strong>${esc(a.job || a.label)}</strong>
        <ul class="rk-approws">${(a.rows || []).map((r) => `<li><i>${tick}</i><span>${esc(r)}</span></li>`).join('')}</ul>${a.done ? `<b class="rk-apptoast">${esc(a.done)}</b>` : ''}</div></div>`).join('')}</div>`,
      run(tl, t, $, sc, end) {
        const phones = $('.rk-phone');
        pop(tl, phones, t, 0.18, { opacity: 0, y: 60 });
        phones.forEach((p, i) => {
          const s = t + 0.7 + i * 0.35, rows = [...p.querySelectorAll('.rk-approws li')], ticks = [...p.querySelectorAll('.rk-approws i')];
          tl.set(rows, { opacity: 0, x: -10 }, 0).to(rows, { opacity: 1, x: 0, duration: 0.3, stagger: 0.22, ease: 'expo.out' }, s)
            .set(ticks, { scale: 0 }, 0).to(ticks, { scale: 1, duration: 0.3, stagger: 0.22, ease: 'back.out(3)' }, s + 0.9)
            .to(p, { y: -12, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, s + 0.9 + rows.length * 0.22);
          const toast = p.querySelector('.rk-apptoast');
          if (toast) tl.set(toast, { opacity: 0, y: 16 }, 0).to(toast, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }, s + 1.3 + rows.length * 0.22);
        });
        drift(tl, phones.map((p) => p.querySelector('.art')), t + 1, end, { y: -5 });
      },
    },

    /* the same product on laptop, tablet and phone, kept in sync, behind a lock */
    devices: {
      dur: 3.8,
      html: (sc) => `<div class="rk-devices"><div class="rk-dev rk-dev--laptop">${art('laptop')}</div><div class="rk-dev rk-dev--desk">${art('desktop')}</div><div class="rk-dev rk-dev--phone">${art('phone')}</div>
        <svg class="rk-sync" viewBox="0 0 480 280"><path d="M150 190 Q240 250 330 170"/><path d="M110 180 Q150 90 240 120"/></svg><i class="rk-syncdot"></i><i class="rk-syncdot"></i>
        <div class="rk-lockbadge">${art(sc.art || 'lock')}<span>${esc(sc.label)}</span></div></div>`,
      run(tl, t, $, sc, end) {
        pop(tl, $('.rk-dev'), t, 0.15, { opacity: 0, y: 40, scale: 0.85 });
        drawOn(tl, $('.rk-sync path'), t + 0.7, 0.6, 0.2);
        const paths = $('.rk-sync path'), dots = $('.rk-syncdot');
        dots.forEach((d, i) => {
          const p = paths[i], L = p.getTotalLength();
          tl.set(d, { opacity: 0 }, 0).to(d, { opacity: 1, duration: 0.1 }, t + 1.3)
            .fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: 1.1, repeat: Math.max(0, Math.floor((end - t - 1.8) / 1.1) - 1), ease: 'sine.inOut', onUpdate() {
              const q = p.getPointAtLength(L * this.targets()[0].k); d.style.left = `${(q.x / 480) * 100}%`; d.style.top = `${(q.y / 280) * 100}%`;
            } }, t + 1.3 + i * 0.3);
        });
        pop(tl, $('.rk-lockbadge'), t + 1.1, 0, { opacity: 0, scale: 0.5 });
        tl.fromTo($('.rk-lockbadge .art'), { rotation: -12 }, { rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)', immediateRender: false }, t + 1.2);
      },
    },

    /* drop auction: an item, the price stepping down on a countdown, then won */
    auction: {
      dur: 4,
      html: (sc) => `<div class="rk-auction"><div class="rk-product rk-product--hero"><div class="rk-product__art">${art(sc.art)}</div><strong>${esc(sc.label)}</strong><em class="rk-stamp rk-stamp--sold">${esc(sc.stamp || 'Won')}</em></div>
        <div class="rk-drop"><b class="rk-chip">${esc(sc.title || 'Drop auction')}</b><div class="rk-price"><span>${esc(sc.currency || '$')}</span><b>${sc.from || 240}</b></div><div class="rk-steps2">${[1, 0.8, 0.62, 0.46, 0.34].map((h) => `<i style="--h:${h}"></i>`).join('')}</div><div class="rk-timer"><em></em></div></div></div>`,
      run(tl, t, $, sc) {
        pop(tl, $('.rk-product--hero'), t, 0, { opacity: 0, scale: 0.85 });
        pop(tl, $('.rk-drop'), t + 0.2, 0, { opacity: 0, x: 30 });
        const from = sc.from || 240, to = sc.to || 129;
        counter(tl, $('.rk-price b')[0], from, t, 0.01);
        tl.fromTo({ v: from }, { v: from }, { v: to, duration: 2.2, ease: 'steps(5)', onUpdate() { $('.rk-price b')[0].textContent = Math.round(this.targets()[0].v); } }, t + 0.5);
        tl.set($('.rk-steps2 i'), { scaleY: 0, backgroundColor: pal($('.rk-drop')[0]).bar }, 0).to($('.rk-steps2 i'), { scaleY: 1, duration: 0.3, stagger: 0.44, ease: 'back.out(2)' }, t + 0.5)
          .to($('.rk-steps2 i:last-child'), { backgroundColor: brand($('.rk-drop')[0]), duration: 0.2 }, t + 2.4)
          .set($('.rk-timer em'), { scaleX: 1 }, 0).to($('.rk-timer em'), { scaleX: 0, duration: 2.4, ease: 'none' }, t + 0.4)
          .set($('.rk-stamp--sold'), { opacity: 0, scale: 2.2, rotation: -18 }, 0).to($('.rk-stamp--sold'), { opacity: 1, scale: 1, rotation: -10, duration: 0.3, ease: 'power4.in' }, t + 2.9);
      },
    },

    /* a fan of cards (policies, job posts, articles); the middle one is chosen */
    cards: {
      dur: 3.8,
      html: (sc) => `<div class="rk-cards">${sc.items.map((c, i) => `<div class="rk-bigcard" style="--i:${i};--n:${sc.items.length};--k:${c.color || 'var(--brand)'}">${art(c.art)}<strong>${esc(c.title)}</strong><small>${esc(c.sub)}</small>${c.chip ? `<b class="rk-chip rk-chip--dark">${esc(c.chip)}</b>` : ''}</div>`).join('')}</div>`,
      run(tl, t, $, sc, end) {
        const cs = $('.rk-bigcard'), n = cs.length, mid = Math.floor(n / 2);
        tl.set(cs, { opacity: 0, y: 60, x: 0, rotation: 0 }, 0).to(cs, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out' }, t + 0.1);
        cs.forEach((c, i) => tl.to(c, { x: (i - (n - 1) / 2) * 176, rotation: (i - (n - 1) / 2) * 4, duration: 0.7, ease: 'back.out(1.3)' }, t + 0.8));
        tl.to(cs[mid], { y: -18, scale: 1.04, duration: 0.4, ease: 'power3.out' }, t + 2);
        drift(tl, cs[mid].querySelector('.art') ? [cs[mid].querySelector('.art')] : [], t + 2.2, end, { y: -5, rotation: 5 });
      },
    },

    /* currency converter: an amount typed in one currency, converted live into the other */
    currency: {
      dur: 3.8,
      html: (sc) => `<div class="rk-currency"><div class="rk-cur"><small>${esc(sc.fromLabel || '')}</small><b>${esc(sc.from)}</b><span>0</span></div>${art('swap', 'rk-swap')}<div class="rk-cur"><small>${esc(sc.toLabel || '')}</small><b>${esc(sc.to)}</b><span>0</span></div></div>`,
      run(tl, t, $, sc) {
        const [a, b] = $('.rk-cur span'), amt = sc.amount || 120, rate = sc.rate || 1.09;
        pop(tl, $('.rk-cur'), t, 0.2, { opacity: 0, scale: 0.85 });
        pop(tl, $('.rk-swap'), t + 0.3, 0, { opacity: 0, scale: 0 });
        counter(tl, a, amt, t + 0.5, 1, 2);
        tl.to($('.rk-swap'), { rotation: 180, duration: 0.6, ease: 'power2.inOut' }, t + 1.4);
        counter(tl, b, amt * rate, t + 1.7, 1.2, 2);
        tl.to($('.rk-cur')[1], { y: -8, duration: 0.25, yoyo: true, repeat: 1 }, t + 2.9);
      },
    },

    /* bars with their values and a stepping slider (EMI by tenure, hours per day); the readout follows the slider */
    bars: {
      dur: 3.8,
      html: (sc) => `<div class="rk-barsbox">${sc.art ? `<div class="rk-barsbox__art">${art(sc.art)}${sc.artLabel ? `<span>${esc(sc.artLabel)}</span>` : ''}${sc.readout ? `<b class="rk-readout">${esc(sc.readout[0])}</b>` : ''}${sc.sub ? `<small class="rk-readout__sub">${esc(sc.sub[0])}</small>` : ''}</div>` : ''}<div><div class="rk-bars">${sc.labels.map((l, i) => `<div><em>${esc((sc.display || [])[i] ?? '')}</em><i style="--h:${sc.values[i]}"></i><span>${esc(l)}</span></div>`).join('')}</div>
        <div class="rk-track"><i class="rk-fill"></i><i class="rk-knob"></i></div></div></div>`,
      run(tl, t, $, sc, end) {
        const P = pal($('.rk-barsbox')[0]), on = brand($('.rk-bars')[0]);
        const n = sc.labels.length, span = Math.min(2.4, end - t - 1.3), step = span / (n - 1);
        if ($('.rk-barsbox__art').length) pop(tl, $('.rk-barsbox__art'), t, 0, { opacity: 0, x: -30 });
        tl.set($('.rk-bars i'), { scaleY: 0, backgroundColor: P.bar }, 0).set($('.rk-bars span, .rk-bars em'), { opacity: 0 }, 0).set($('.rk-knob'), { left: '0%' }, 0).set($('.rk-fill'), { scaleX: 0 }, 0)
          .to($('.rk-bars i'), { scaleY: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.6)' }, t + 0.1).to($('.rk-bars span, .rk-bars em'), { opacity: 1, duration: 0.3, stagger: 0.04 }, t + 0.3)
          .to($('.rk-knob'), { left: '100%', duration: span, ease: `steps(${n - 1})` }, t + 0.8).to($('.rk-fill'), { scaleX: 1, duration: span, ease: `steps(${n - 1})` }, t + 0.8);
        const ro = $('.rk-readout')[0], sub = $('.rk-readout__sub')[0], ems = $('.rk-bars em');
        $('.rk-bars i').forEach((b, i) => {
          tl.to(b, { backgroundColor: on, duration: 0.15 }, t + 0.8 + i * step).to(ems[i], { scale: 1.15, color: on, duration: 0.15 }, t + 0.8 + i * step);
          if (i < n - 1) tl.to(b, { backgroundColor: P.bar, duration: 0.3 }, t + 0.8 + (i + 1) * step).to(ems[i], { scale: 1, color: P.fg, duration: 0.2 }, t + 0.8 + (i + 1) * step);
          const setTo = (k) => () => { if (ro) ro.textContent = sc.readout[k]; if (sub) sub.textContent = sc.sub[k]; };
          if (ro || sub) tl.call(setTo(i), null, t + 0.8 + i * step).call(setTo(Math.max(0, i - 1)), null, t + 0.79 + i * step);
        });
        tl.set(ems, { scale: 1, color: P.fg }, 0);
      },
    },

    /* feature tiles, each with an illustration; each is spotlighted in turn until the cut */
    tiles: {
      dur: 3.8,
      html: (sc) => `<div class="rk-tiles">${sc.items.map((it) => `<div class="rk-tile2">${art(it.art || 'sparkle')}<strong>${esc(it.label)}</strong><small>${esc(it.sub || '')}</small></div>`).join('')}</div>`,
      run(tl, t, $, sc, end) {
        const tiles = $('.rk-tile2');
        pop(tl, tiles, t + 0.1, 0.14, { opacity: 0, y: 30, rotationX: -30 });
        tl.fromTo($('.rk-tile2 .art'), { scale: 0.6 }, { scale: 1, duration: 0.6, stagger: 0.14, ease: 'back.out(2)', immediateRender: false }, t + 0.3);
        const span = Math.max(0.6, (end - t - 1.6) / tiles.length);
        tl.set(tiles, { boxShadow: '0 0 0 0px var(--brand)' }, 0);
        tiles.forEach((tile, i) => tl.to(tile, { y: -10, boxShadow: '0 0 0 3px var(--brand)', duration: 0.3, ease: 'power3.out' }, t + 1.2 + i * span)
          .to(tile, { y: 0, boxShadow: '0 0 0 0px var(--brand)', duration: 0.3 }, t + 1.2 + (i + 1) * span - 0.1));
      },
    },
  };

  window.ReelKit = { TYPES, art, words };
})();
