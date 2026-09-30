// The little animated scenes: one for each "How we work" stage (home) and one demo for each service (home and the
// services page). Each is a short loop on a sheet: [data-cycle] is its length in seconds, and each part inside
// carries [data-kf] (how it moves: pop, rise, draw, type, growX, growY, press, move, travel, blink) and [data-d]
// (when, in seconds). site.js builds the keyframes and plays the loop while the scene is on screen; with reduced
// motion it rests on the finished frame. Charts are drawn in SVG so their bars, lines, axes and labels line up.
// Every name, figure and chart here is sample data for the picture (each scene and demo says it is illustrative),
// never client data.
'use strict';

const kf = (type, d, more = '') => `data-kf="${type}" data-d="${d}"${more ? ` ${more}` : ''}`;
const tag = () => '<span class="illus">Illustrative · sample data</span>';
const r1 = (n) => +n.toFixed(1);

// A bar chart in SVG: y gridlines with labels, bars growing from the axis (value above each), x labels under them.
// `bars`: [{ v, label, cls, d }]; `max` is the top of the scale; `ticks` the gridline values; `fmt` formats a value.
const barChart = ({ w, h, bars, max, ticks, fmt, gap = 0.34, left = 34, bottom = 22, top = 16, valueLabels = true }) => {
  const iw = w - left - 6, ih = h - top - bottom, bw = iw / bars.length;
  const y = (v) => top + ih - (v / max) * ih;
  return `<svg class="chart" viewBox="0 0 ${w} ${h}">
    ${ticks.map((t) => `<path class="chart__grid" d="M${left} ${r1(y(t))}H${w - 6}"/><text class="chart__tick" x="${left - 6}" y="${r1(y(t) + 3.5)}">${fmt(t)}</text>`).join('')}
    ${bars.map((b, i) => {
      const x = left + i * bw + (bw * gap) / 2, bh = (b.v / max) * ih, by = y(b.v);
      return `<g class="chart__bar ${b.cls || ''}" ${kf('growY', b.d)} style="transform-origin:0 ${r1(top + ih)}px"><rect x="${r1(x)}" y="${r1(by)}" width="${r1(bw * (1 - gap))}" height="${r1(bh)}" rx="4"/>${valueLabels ? `<text class="chart__val" x="${r1(x + (bw * (1 - gap)) / 2)}" y="${r1(by - 5)}">${fmt(b.v)}</text>` : ''}</g>
        <text class="chart__x" x="${r1(x + (bw * (1 - gap)) / 2)}" y="${h - 6}">${b.label}</text>`;
    }).join('')}
  </svg>`;
};

// ---------- How we work: the four stages ----------

const note = (color, tilt, d, title, body) => `<div class="note" style="--c:${color};--tilt:${tilt}deg" ${kf('pop', d)}><i class="note__pin"></i><span class="note__title">${title}</span>${body}</div>`;
const rise = (d, html, cls = 'note__line') => `<span class="${cls}" ${kf('rise', d)}>${html}</span>`;

const idea = () => `<div class="scene scene--idea" data-cycle="7">
  ${note('var(--sun)', -2, 0.1, 'Who is it for?', [['var(--pink)', 'D', 'Dealership owners'], ['var(--sky)', 'S', 'Sales team'], ['var(--mint)', 'B', 'Car buyers']].map(([c, l, t], i) => rise(0.3 + i * 0.15, `<b class="note__who" style="background:${c}">${l}</b>${t}`)).join(''))}
  ${note('var(--pink)', 1.5, 0.4, 'What hurts today?', ['Manual valuations', 'Slow quotes', 'Data in five tools'].map((t, i) => rise(0.6 + i * 0.15, `<b class="note__bang">!</b>${t}<i class="note__strike" ${kf('growX', (2 + i * 0.2).toFixed(1))}></i>`, 'note__line note__line--pain')).join(''))}
  ${note('var(--sky)', 1, 0.7, 'What must v1 do?', ['Value a trade-in', 'Quote an EMI', 'Track refurbishment'].map((t, i) => rise(0.9 + i * 0.15, `<b class="note__box"><i ${kf('pop', (1.8 + i * 0.2).toFixed(1))}>✓</i></b>${t}`)).join(''))}
  ${note('var(--mint)', -1.5, 1, 'How do we measure it?', `<div class="note__chart"><svg viewBox="0 0 220 96" preserveAspectRatio="none">
      <path class="axis" d="M22 84H216M22 8V84"/>
      <text class="lbl" x="18" y="16">4d</text><text class="lbl" x="18" y="84">0</text>
      <path class="ink" ${kf('draw', 1.4)} pathLength="1" d="M26 14L70 26L114 50L158 70L210 80"/>
      ${[[26, 14], [70, 26], [114, 50], [158, 70], [210, 80]].map(([x, y], i) => `<circle class="pt" cx="${x}" cy="${y}" r="3.5" ${kf('pop', (1.5 + i * 0.12).toFixed(2))}/>`).join('')}
      <text class="lbl lbl--x" x="26" y="95">Today</text><text class="lbl lbl--x lbl--end" x="212" y="95">v1</text>
    </svg></div>${rise(2.2, 'Goal: quote time, <b>days → minutes</b>')}`)}
  ${tag()}
</div>`;

// A dealer's valuation app: a labelled wireframe becoming the finished screen.
const CAR = '<svg class="car" viewBox="0 0 120 50" aria-hidden="true"><path class="car__body" d="M6 36c0-5 3-8 8-9l14-3 12-10c3-2 6-3 10-3h26c4 0 7 1 10 4l10 9 12 2c5 1 8 4 8 9v4c0 2-1 3-3 3H9c-2 0-3-1-3-3z"/><path class="car__glass" d="M44 15h14v10H33zM62 15h14c2 0 4 1 5 2l7 8H62z"/><circle class="car__wheel" cx="30" cy="42" r="7"/><circle class="car__wheel" cx="92" cy="42" r="7"/><circle class="car__hub" cx="30" cy="42" r="2.5"/><circle class="car__hub" cx="92" cy="42" r="2.5"/></svg>';
const design = () => `<div class="scene scene--design" data-cycle="7">
  <div class="design__row">
    <div class="wire" ${kf('rise', 0.1)}>
      <small>Wireframe</small>
      <div class="wire__bar"><i></i><span>Logo</span><span>☰</span></div>
      <div class="wire__img"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 0L100 60M100 0L0 60"/></svg><span>Car photo</span></div>
      <span class="wire__label">Model · year · km</span><i class="wire__l"></i>
      <span class="wire__label">Estimated value</span><i class="wire__l is-big"></i>
      <div class="wire__range"><i></i><i></i><i></i></div>
      <span class="wire__btn">Primary action</span>
    </div>
    <svg class="design__arrow" viewBox="0 0 60 20"><path ${kf('draw', 0.6)} pathLength="1" d="M2 10C20 2 36 18 54 10M46 4L55 10L46 16"/></svg>
    <div class="phone-ui" ${kf('pop', 0.9)}>
      <div class="phone-ui__top"><b>Valuation</b><i>DS</i></div>
      <div class="phone-ui__car">${CAR}</div>
      <b class="phone-ui__model">Mercedes GLS · 2021</b>
      <small>32,000 km · Diesel · 1 owner</small>
      <span class="phone-ui__label">Estimated value</span>
      <b class="phone-ui__big" ${kf('rise', 1.4)}>₹ 52–56 L</b>
      <div class="range" ${kf('rise', 1.6)}><span class="range__bar"><i class="range__fill" ${kf('growX', 1.7)}></i><i class="range__dot"></i></span><span class="range__lbls"><span>Low</span><span>Fair</span><span>High</span></span></div>
      <span class="phone-ui__cta" ${kf('press', 2.6)}>Send quote</span>
      <span class="cursor" ${kf('move', 1.9, 'data-u="0.1" data-from="85,20" data-to="55,90"')}></span>
    </div>
  </div>
  <div class="design__foot">
    <div class="swatches">${[['var(--blue)', 'Primary'], ['var(--lilac)', 'Accent'], ['var(--sun)', 'Alert'], ['var(--ink)', 'Ink']].map(([c, n], i) => `<span ${kf('pop', (1.1 + i * 0.1).toFixed(1))}><i style="background:${c}"></i>${n}</span>`).join('')}<span class="swatches__type" ${kf('pop', 1.6)}>Aa <small>Figtree</small></span></div>
    <span class="badge badge--ink" ${kf('pop', 2.9)}>✓ Prototype v2 approved</span>
  </div>
  ${tag()}
</div>`;

const build = () => `<div class="scene scene--build" data-cycle="6">
  <div class="code">
    <div class="code__dots"><i></i><i></i><i></i><span>valuation.service.ts</span></div>
    ${[['lilac', 0, 0.2, 'const route = await plan(brief)'], ['sky', 1, 0.6, 'for (const sprint of route) {'], ['paper', 2, 1.0, 'ship(sprint); await feedback()'], ['sky', 1, 1.4, '}'], ['mint', 0, 1.7, 'integrate(api, crm, payments)']]
      .map(([c, ind, d, t], i) => `<span class="code__line is-${c}" style="--ind:${ind}"><em>${i + 1}</em><span ${kf('type', d)}>${t}</span></span>`).join('')}
  </div>
  <div class="chips">${[['var(--sky-tint)', '⇄ REST API', 2.1], ['var(--lilac-tint)', '⇄ CRM', 2.25], ['var(--sun-tint)', '⇄ Payments', 2.4]].map(([c, t, d]) => `<span class="chip" style="background:${c}" ${kf('pop', d)}>${t}</span>`).join('')}<span class="chips__note">Sprint 04 of 06 · agile</span></div>
  <div class="pipeline">${['Lint', 'Tests', 'Build', 'Deploy'].map((t, i) => `<span class="pipeline__step" ${kf('pop', (0.4 + i * 0.5).toFixed(1))}><i>✓</i>${t}</span>${i < 3 ? `<i class="pipeline__line" ${kf('growX', (0.6 + i * 0.5).toFixed(1))}></i>` : ''}`).join('')}<span class="chip" style="background:var(--mint)" ${kf('pop', 2.5)}>Build passing</span></div>
  ${tag()}
</div>`;

const launch = () => `<div class="scene scene--launch" data-cycle="6">
  <div class="launch__top"><div><span class="launch__k">Weekly active users</span><b class="launch__big">7.4k <em>+45% this week</em></b></div><span class="chip chip--live" ${kf('pop', 0.2)}>● Live</span></div>
  ${barChart({ w: 568, h: 250, max: 8000, ticks: [0, 2000, 4000, 6000, 8000], fmt: (v) => (v ? `${r1(v / 1000)}k` : '0'),
    bars: [[1200, 'W1'], [1900, 'W2'], [2600, 'W3'], [3800, 'W4'], [5100, 'W5'], [7400, 'W6']].map(([v, label], i) => ({ v, label, d: (0.3 + i * 0.12).toFixed(2), cls: i > 2 ? `is-hot is-${i}` : '' })) })}
  <div class="chips">${[['var(--mint-tint)', '✓ Tests passed', 1.4], ['var(--mint-tint)', '✓ Deployed', 1.6], ['var(--mint-tint)', '✓ Monitoring on', 1.8], ['var(--tomato-tint)', '↻ Weekly iterations', 2]].map(([c, t, d]) => `<span class="chip" style="background:${c}" ${kf('pop', d)}>${t}</span>`).join('')}</div>
  ${tag()}
</div>`;

const stageScenes = [idea, design, build, launch];

// ---------- Services: a small working product for each ----------

// Orders per month: four months of actuals, then two forecast months with their range, and the forecast line
// running on from the last actual.
const forecast = () => {
  const w = 300, h = 212, left = 34, top = 14, bottom = 22, ih = h - top - bottom, max = 2000;
  const data = [[820, 'Jan'], [1040, 'Feb'], [960, 'Mar'], [1310, 'Apr'], [1520, 'May', [1380, 1660]], [1780, 'Jun', [1560, 2000]]];
  const bw = (w - left - 6) / data.length, y = (v) => top + ih - (v / max) * ih, cx = (i) => left + i * bw + bw / 2;
  const line = data.slice(3).map(([v], k) => `${k ? 'L' : 'M'}${r1(cx(k + 3))} ${r1(y(v))}`).join('');
  return `<svg class="chart chart--forecast" viewBox="0 0 ${w} ${h}">
    <defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#a58bff"/><rect width="3" height="6" fill="#8a6ef0"/></pattern></defs>
    ${[0, 500, 1000, 1500, 2000].map((t) => `<path class="chart__grid" d="M${left} ${r1(y(t))}H${w - 6}"/><text class="chart__tick" x="${left - 6}" y="${r1(y(t) + 3.5)}">${t ? `${t / 1000}k` : '0'}</text>`).join('')}
    <rect class="chart__future" x="${r1(left + 4 * bw)}" y="${top}" width="${r1(2 * bw)}" height="${ih}"/>
    ${data.map(([v, m, range], i) => {
      const x = left + i * bw + bw * 0.18, bh = (v / max) * ih;
      return `<g class="chart__bar${range ? ' is-forecast' : ''}" ${kf('growY', (0.9 + i * 0.1).toFixed(1))} style="transform-origin:0 ${top + ih}px"><rect x="${r1(x)}" y="${r1(y(v))}" width="${r1(bw * 0.64)}" height="${r1(bh)}" rx="3"${range ? ' fill="url(#hatch)"' : ''}/></g>
        ${range ? `<path class="chart__range" ${kf('pop', (1.9 + i * 0.1).toFixed(1))} d="M${r1(cx(i))} ${r1(y(range[1]))}V${r1(y(range[0]))}M${r1(cx(i) - 5)} ${r1(y(range[1]))}h10M${r1(cx(i) - 5)} ${r1(y(range[0]))}h10"/>` : ''}
        <text class="chart__x${range ? ' is-next' : ''}" x="${r1(cx(i))}" y="${h - 6}">${m}</text>`;
    }).join('')}
    <path class="chart__trend" ${kf('draw', 2.1)} pathLength="1" d="${line}"/>
    ${data.slice(3).map(([v], k) => `<circle class="chart__pt" cx="${r1(cx(k + 3))}" cy="${r1(y(v))}" r="3.5" ${kf('pop', (2.2 + k * 0.15).toFixed(2))}/>`).join('')}
    <text class="chart__note" x="${r1(left + 4 * bw + 4)}" y="${top + 10}">Forecast</text>
  </svg>`;
};
const ai = () => `<div class="demo demo--ai" data-cycle="7">
  <div class="demo__head"><span><i style="background:var(--lilac)"></i>Demand forecast · orders per month</span><span class="demo__dim">Model · v3</span></div>
  <div class="ask"><b>Ask</b><span ${kf('type', 0.1)}>Forecast orders for the next two months</span><i class="caret" data-kf="blink"></i></div>
  <div class="ai__grid">
    <div class="forecast">${forecast()}<span class="legend"><span><i></i>Actual</span><span><i class="is-hatch"></i>Forecast</span><span><i class="is-range"></i>Range</span></span></div>
    <div class="insight" ${kf('pop', 2.4)}>
      <span class="insight__label">✦ Insight</span>
      <span class="insight__big" ${kf('rise', 2.6)}>June demand up <b>36%</b> on April.</span>
      <span class="insight__row" ${kf('rise', 2.8)}><span>Confidence</span><b>87%</b></span>
      <span class="insight__row" ${kf('rise', 3)}><span>Sources</span><b>Sales · stock · seasons</b></span>
      <span class="insight__row" ${kf('rise', 3.2)}><span>Action</span><b>Restock 2 SKUs</b></span>
      <span class="insight__go" ${kf('rise', 3.4)}>Restock plan ready →</span>
    </div>
  </div>
</div>`;

const kpi = (label, value, delta, tint, d) => `<div class="kpi" style="background:${tint}" ${kf('pop', d)}><span>${label}</span><b>${value}</b><em>${delta}</em></div>`;
const signups = () => {
  const pts = [22, 30, 27, 38, 44, 41, 56], w = 300, h = 120, left = 26, top = 8, bottom = 18, ih = h - top - bottom, max = 60;
  const x = (i) => left + (i * (w - left - 8)) / (pts.length - 1), y = (v) => top + ih - (v / max) * ih;
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${r1(x(i))} ${r1(y(v))}`).join('');
  return `<svg class="chart chart--line" viewBox="0 0 ${w} ${h}">
    ${[0, 20, 40, 60].map((t) => `<path class="chart__grid" d="M${left} ${r1(y(t))}H${w - 8}"/><text class="chart__tick" x="${left - 5}" y="${r1(y(t) + 3.5)}">${t}</text>`).join('')}
    <path class="chart__area" ${kf('rise', 1.6)} d="${d}L${r1(x(pts.length - 1))} ${top + ih}L${left} ${top + ih}Z"/>
    <path class="chart__lineb" ${kf('draw', 1.2)} pathLength="1" d="${d}"/>
    <circle class="chart__pt" cx="${r1(x(6))}" cy="${r1(y(56))}" r="4" ${kf('pop', 2)}/>
    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((t, i) => `<text class="chart__x" x="${r1(x(i))}" y="${h - 4}">${t}</text>`).join('')}
  </svg>`;
};
const web = () => `<div class="demo demo--web" data-cycle="7">
  <div class="browser">
    <div class="browser__bar"><i></i><i></i><i></i><span>app.yourproduct.com/dashboard</span></div>
    <div class="browser__body">
      <div class="browser__side"><b>▲ SaaS</b>${['Dashboard', 'Customers', 'Billing', 'Settings'].map((t, i) => `<span${i === 0 ? ' class="is-on"' : ''} ${kf('rise', (0.2 + i * 0.08).toFixed(2))}>${t}</span>`).join('')}</div>
      <div class="browser__main">
        <div class="kpis">${kpi('Users', '8.4k', '↑ 12%', 'var(--sky-tint)', 0.5)}${kpi('Revenue', '$42k', '↑ 8%', 'var(--mint-tint)', 0.65)}${kpi('Uptime', '99.9%', '30 days', 'var(--sun-tint)', 0.8)}</div>
        <div class="browser__chart"><span class="browser__k">Sign-ups this week</span>${signups()}</div>
      </div>
    </div>
  </div>
  <div class="mobile" ${kf('rise', 1.3)}>
    <i class="mobile__notch"></i>
    <div class="mobile__screen"><b>Orders</b>${[['#2289', 'Shipped', 1.7], ['#2290', 'Packed', 1.85], ['#2291', 'New', 2]].map(([n, s, d]) => `<span class="mobile__row" ${kf('rise', d)}><span>${n}</span><b>${s}</b></span>`).join('')}<span class="mobile__total" ${kf('rise', 2.2)}><span>Today</span><b>24 orders</b></span></div>
    <span class="mobile__push" ${kf('pop', 2.6)}>🔔 New order #2291</span>
  </div>
</div>`;

// The shop's products, drawn: a long coat, a folded silk scarf, a canvas tote.
const GOODS = {
  coat: '<svg class="good" viewBox="0 0 60 80"><path class="good__fill" style="fill:#e8c9a4" d="M22 6h16l8 6 8 20-6 3-4-10v49H16V25l-4 10-6-3 8-20z"/><path class="good__ink" d="M22 6h16l8 6 8 20-6 3-4-10v49H16V25l-4 10-6-3 8-20zM22 6l8 14 8-14M30 20v54M24 44h4M24 54h4"/><circle class="good__btn" cx="33" cy="36" r="1.6"/><circle class="good__btn" cx="33" cy="48" r="1.6"/><circle class="good__btn" cx="33" cy="60" r="1.6"/></svg>',
  scarf: '<svg class="good" viewBox="0 0 60 80"><path class="good__fill" style="fill:#b9a4ff" d="M14 10c10-4 22-4 32 0v18c-10 4-22 4-32 0z"/><path class="good__fill" style="fill:#a58bff" d="M18 28l6 44h10l-4-44zM34 28l8 38h8l-8-40z"/><path class="good__ink" d="M14 10c10-4 22-4 32 0v18c-10 4-22 4-32 0zM18 28l6 44h10l-4-44M34 28l8 38h8l-8-40M24 72l-1 5M28 72v5M32 72l1 5M42 66l-1 5M46 66v5M50 66l1 5"/><path class="good__ink good__pattern" d="M20 16c4 2 8 2 12 0s8-2 12 0M20 22c4 2 8 2 12 0s8-2 12 0"/></svg>',
  tote: '<svg class="good" viewBox="0 0 60 80"><path class="good__fill" style="fill:#9fe3cb" d="M10 30h40l-3 44H13z"/><path class="good__ink" d="M10 30h40l-3 44H13zM20 30c0-14 20-14 20 0M24 30c0-9 12-9 12 0"/><rect class="good__label" x="22" y="46" width="16" height="12" rx="2"/><path class="good__ink" d="M26 52h8"/></svg>',
};
const product = (name, price, tint, good, d, hot = false) => `<div class="product${hot ? ' is-hot' : ''}" ${kf('rise', d)}><div class="product__img" style="background:${tint}">${GOODS[good]}</div><b>${name}</b><span>${price}</span>${hot ? `<span class="product__add" ${kf('press', 1.2)}>Add to bag</span>` : '<span class="product__stars">★★★★☆</span>'}</div>`;
const ecom = () => `<div class="demo demo--ecom" data-cycle="7">
  <div class="store">
    <div class="store__top"><b>Storefront</b><span class="store__search">Search coats, bags…</span><span class="bag"><i></i><b ${kf('pop', 1.4)}>1</b></span></div>
    <div class="store__grid">${product('Linen coat', '$180', 'var(--tomato-tint)', 'coat', 0.2, true)}${product('Silk scarf', '$95', 'var(--lilac-tint)', 'scarf', 0.3)}${product('Tote bag', '$140', 'var(--mint-tint)', 'tote', 0.4)}</div>
    <div class="store__reco" ${kf('rise', 1.8)}><b>✦ For you</b><span class="reco">${GOODS.scarf}</span><span class="reco">${GOODS.tote}</span><span class="reco-t">Pairs with the coat: scarf, tote</span></div>
  </div>
  <div class="checkout">
    <div class="checkout__card" ${kf('rise', 1.6)}>
      <b>Checkout</b>
      <span class="checkout__item"><span class="checkout__thumb">${GOODS.coat}</span><span>Linen coat<small>Size M · Sand</small></span><b>$180</b></span>
      ${[['Shipping', 'Free', 1.9], ['Payment', 'Card ✓', 2.1], ['Fraud check', 'Passed ✓', 2.3]].map(([t, v, d]) => `<span class="checkout__row" ${kf('rise', d)}><span>${t}</span><b>${v}</b></span>`).join('')}
      <span class="checkout__total" ${kf('rise', 2.5)}><span>Total</span><b>$180.00</b></span>
      <span class="checkout__bar"><i ${kf('growX', 2)}></i></span>
    </div>
    <span class="checkout__done" ${kf('pop', 3.1)}>✓ Order placed · #4521</span>
  </div>
</div>`;

const region = (y, name, state, ms, d) => `<g class="region" ${kf('pop', d)}><rect x="322" y="${y}" width="74" height="40" rx="9"/><text x="359" y="${y + 14}">${name}</text><text class="is-ok" x="359" y="${y + 26}">● ${state}</text><text class="is-ms" x="359" y="${y + 36}">${ms}</text></g>`;
const cloud = () => {
  const lat = [120, 132, 118, 126, 64, 52, 49, 48], w = 300, h = 84, left = 30, top = 10, bottom = 16, ih = h - top - bottom, max = 150;
  const x = (i) => left + (i * (w - left - 8)) / (lat.length - 1), y = (v) => top + ih - (v / max) * ih;
  return `<div class="demo demo--cloud" data-cycle="7">
  <div class="demo__head"><span><i style="background:var(--mint)"></i>Cloud migration · live traffic</span><span class="demo__dim">3 regions</span></div>
  <svg class="cloud__map" viewBox="0 0 400 180">
    <rect class="onprem" x="6" y="44" width="96" height="94" rx="12"/><text class="label" x="54" y="36">On-prem</text>
    ${[['App server', 60], ['Database', 84], ['File store', 108]].map(([t, y]) => `<rect class="rack" x="16" y="${y}" width="76" height="18" rx="4"/><text class="rack__t" x="54" y="${y + 12.5}">${t}</text>`).join('')}
    <path class="migrate" ${kf('draw', 0.3)} pathLength="1" d="M110 91C140 91 150 91 176 91M166 82L178 91L166 100"/>
    <text class="label is-mint" x="143" y="78">migrate</text>
    <path class="links" ${kf('draw', 0.8)} pathLength="1" d="M236 91L322 32M236 91L322 91M236 91L322 150"/>
    ${[[1.4, -59, 'sun'], [1.6, 0, 'sun'], [1.8, 59, 'sun'], [2.6, -59, 'sky'], [2.9, 59, 'sky']].map(([d, ty, c]) => `<circle class="packet is-${c}" cx="236" cy="91" r="4.5" ${kf('travel', d, `data-u="0.08" data-tx="86" data-ty="${ty}"`)}/>`).join('')}
    <rect class="gateway" x="182" y="70" width="58" height="42" rx="10"/><text class="gateway__t" x="211" y="89">Gateway</text><text class="gateway__s" x="211" y="101">load balanced</text>
    ${region(12, 'eu-west', 'healthy', '48 ms', 1)}${region(71, 'ap-south', 'healthy', '31 ms', 1.15)}${region(130, 'backup', 'replicated', 'RPO 5 min', 1.3)}
  </svg>
  <div class="cloud__foot">
    <div class="latency"><span>Latency p95 · before → after</span><svg class="chart" viewBox="0 0 ${w} ${h}">
      ${[0, 50, 100, 150].map((t) => `<path class="chart__grid" d="M${left} ${r1(y(t))}H${w - 8}"/><text class="chart__tick" x="${left - 5}" y="${r1(y(t) + 3.5)}">${t}</text>`).join('')}
      <path class="chart__cut" d="M${r1((x(3) + x(4)) / 2)} ${top}V${top + ih}"/>
      <path class="chart__lines" ${kf('draw', 1.8)} pathLength="1" d="${lat.map((v, i) => `${i ? 'L' : 'M'}${r1(x(i))} ${r1(y(v))}`).join('')}"/>
      <text class="chart__x" x="${r1(x(1.5))}" y="${h - 3}">on-prem</text><text class="chart__x is-mint" x="${r1(x(5.5))}" y="${h - 3}">cloud</text>
    </svg></div>
    <div class="scaled" ${kf('pop', 2.6)}><b>Auto-scaled 2 → 6 nodes</b><span>for the traffic spike, then back down</span><em>Latency −60%</em></div>
  </div>
</div>`;
};

const demos = { ai, web, ecom, cloud };

module.exports = { stageScenes, demos };
