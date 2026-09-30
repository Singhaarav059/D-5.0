// The little animated scenes: one for each "How we work" stage (home) and one demo for each service (home's
// services and the services page). Each is a short loop on a sheet: [data-cycle] is its length in seconds, and each
// part inside carries [data-kf] (how it moves: pop, rise, draw, type, growX, growY, press, move, travel, blink) and
// [data-d] (when, in seconds). site.js builds the keyframes and plays the loop while the scene is on screen; with
// reduced motion it rests on the finished frame. Every name, chart and status here is illustrative (each scene says
// so), never client data.
'use strict';

const kf = (type, d, more = '') => `data-kf="${type}" data-d="${d}"${more ? ` ${more}` : ''}`;
const tag = (tone = '') => `<span class="illus${tone ? ` illus--${tone}` : ''}">Illustrative</span>`;

// ---------- How we work: the four stages ----------

const note = (color, tilt, d, title, body) => `<div class="note" style="--c:${color};--tilt:${tilt}deg" ${kf('pop', d)}><i class="note__pin"></i><span class="note__title">${title}</span>${body}</div>`;
const rise = (d, html, cls = 'note__line') => `<span class="${cls}" ${kf('rise', d)}>${html}</span>`;

const idea = () => `<div class="scene scene--idea" data-cycle="7">
  ${note('var(--sun)', -2, 0.2, 'Who is it for?', [['var(--pink)', 'D', 'Dealership owners'], ['var(--sky)', 'S', 'Sales team'], ['var(--mint)', 'B', 'Car buyers']].map(([c, l, t], i) => rise(0.5 + i * 0.2, `<b class="note__who" style="background:${c}">${l}</b>${t}`)).join(''))}
  ${note('var(--pink)', 1.5, 0.6, 'What hurts today?', ['Manual valuations', 'Slow quotes', 'Data in five tools'].map((t, i) => rise(0.9 + i * 0.2, `<b class="note__bang">!</b>${t}<i class="note__strike" ${kf('growX', (2.5 + i * 0.2).toFixed(1))}></i>`, 'note__line note__line--pain')).join(''))}
  ${note('var(--sky)', 1, 1, 'What must v1 do?', ['Value a trade-in', 'Quote an EMI', 'Track refurbishment'].map((t, i) => rise(1.3 + i * 0.2, `<b class="note__box"><i ${kf('pop', (2.1 + i * 0.2).toFixed(1))}>✓</i></b>${t}`)).join(''))}
  ${note('var(--mint)', -1.5, 1.4, 'How do we measure it?', `<div class="note__chart"><svg viewBox="0 0 120 50" preserveAspectRatio="none"><path class="axis" d="M0 49H120"/><path class="ink" ${kf('draw', 2)} pathLength="1" d="M2 8L28 14L52 26L78 36L118 44"/></svg></div>${rise(2.4, 'Goal: quote time, days → minutes')}`)}
  ${tag()}
</div>`;

const design = () => `<div class="scene scene--design" data-cycle="7">
  <div class="design__row">
    <div class="wire" ${kf('rise', 0.2)}><small>Wireframe</small><i class="wire__h"></i><i class="wire__img"></i><i class="wire__l"></i><i class="wire__l is-short"></i><i class="wire__btn"></i></div>
    <svg class="design__arrow" viewBox="0 0 60 20"><path ${kf('draw', 0.8)} pathLength="1" d="M2 10C20 2 36 18 54 10M46 4L55 10L46 16"/></svg>
    <div class="phone-ui" ${kf('pop', 1.2)}>
      <div class="phone-ui__top"><b>Valuation</b><i></i></div>
      <div class="phone-ui__chart">${[40, 65, 52, 88].map((h, i) => `<i style="height:${h}%" ${kf('growY', (1.6 + i * 0.1).toFixed(1))}${i === 3 ? ' class="is-hi"' : ''}></i>`).join('')}</div>
      <b class="phone-ui__big">Valuation ready</b><small>AI estimate · illustrative</small>
      <span class="phone-ui__cta" ${kf('press', 2.6)}>Send quote</span>
      <span class="cursor" ${kf('move', 1.8, 'data-u="0.1" data-from="85,20" data-to="55,88"')}></span>
    </div>
  </div>
  <div class="design__foot">
    <div class="swatches">${['var(--blue)', 'var(--lilac)', 'var(--sun)', 'var(--ink)'].map((c, i) => `<i style="background:${c}" ${kf('pop', (1.4 + i * 0.1).toFixed(1))}></i>`).join('')}<span ${kf('pop', 1.8)}>Aa</span></div>
    <span class="badge badge--ink" ${kf('pop', 3)}>✓ Prototype v2 approved</span>
  </div>
  ${tag()}
</div>`;

const build = () => `<div class="scene scene--build" data-cycle="6">
  <div class="code">
    <div class="code__dots"><i></i><i></i><i></i></div>
    ${[['lilac', 0, 0.2, 'const route = await plan(brief)'], ['sky', 1, 0.8, 'for (const sprint of route) {'], ['paper', 2, 1.4, 'ship(sprint); await feedback()'], ['sky', 1, 2.0, '}'], ['mint', 0, 2.4, 'integrate(api, crm, payments)']]
      .map(([c, ind, d, t]) => `<span class="code__line is-${c}" style="--ind:${ind}" ${kf('type', d)}>${t}</span>`).join('')}
  </div>
  <div class="chips">${[['var(--sky-tint)', '⇄ REST API', 2.6], ['var(--lilac-tint)', '⇄ CRM', 2.8], ['var(--sun-tint)', '⇄ Payments', 3]].map(([c, t, d]) => `<span class="chip" style="background:${c}" ${kf('pop', d)}>${t}</span>`).join('')}<span class="chips__note">Sprint 04 · agile</span></div>
  <div class="pipeline">${[0.4, 1.2, 2.0].map((d) => `<i class="pipeline__node" ${kf('pop', d)}></i><i class="pipeline__line" ${kf('growX', (d + 0.2).toFixed(1))}></i>`).join('')}<span class="chip" style="background:var(--mint)" ${kf('pop', 2.9)}>Build passing</span></div>
  ${tag()}
</div>`;

const launch = () => `<div class="scene scene--launch" data-cycle="6">
  <div class="launch__top"><span>Active users</span><span class="chip chip--live" ${kf('pop', 0.3)}>● Live</span></div>
  <div class="bars">${[[22, 'var(--paper-3)'], [34, 'var(--paper-3)'], [46, 'var(--paper-3)'], [61, 'var(--sun)', 1], [78, 'var(--tomato)', 1], [96, 'var(--blue)', 1]]
    .map(([h, c, ink], i) => `<i style="height:${h}%;background:${c}"${ink ? ' class="is-ink"' : ''} ${kf('growY', (0.6 + i * 0.15).toFixed(2))}></i>`).join('')}</div>
  <div class="chips">${[['var(--mint-tint)', '✓ Tests passed', 1.8], ['var(--mint-tint)', '✓ Deployed', 2.1], ['var(--mint-tint)', '✓ Monitoring on', 2.4], ['var(--tomato-tint)', '↻ Weekly iterations', 2.7]].map(([c, t, d]) => `<span class="chip" style="background:${c}" ${kf('pop', d)}>${t}</span>`).join('')}</div>
  ${tag()}
</div>`;

const stageScenes = [idea, design, build, launch];

// ---------- Services: a small working product for each ----------

const ai = () => `<div class="demo demo--ai" data-cycle="7">
  <div class="demo__head"><span><i style="background:var(--lilac)"></i>Demand forecast</span><span class="demo__dim">Model · v3</span></div>
  <div class="ask"><b>Ask</b><span ${kf('type', 0.1)}>Forecast orders for the next six months</span><i class="caret" data-kf="blink"></i></div>
  <div class="ai__grid">
    <div class="forecast">
      ${[38, 50, 44, 60].map((h, i) => `<i style="height:${h}%" ${kf('growY', (1.1 + i * 0.1).toFixed(1))}></i>`).join('')}
      <i class="is-future" style="height:72%" ${kf('growY', 1.7)}></i><i class="is-future" style="height:90%" ${kf('growY', 1.85)}></i>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path ${kf('draw', 2.3)} pathLength="1" d="M8 64L25 52L42 58L58 42L75 30L92 12"/></svg>
      <span class="forecast__axis"><span>Jan</span><span>Mar</span><span>May</span><span class="is-next">Forecast →</span></span>
    </div>
    <div class="insight" ${kf('pop', 2.6)}>
      <span class="insight__label">✦ Insight</span>
      <span class="insight__big" ${kf('rise', 2.9)}>Demand rises toward the end of the season.</span>
      <span class="insight__row" ${kf('rise', 3.2)}><span>Confidence</span><b>High</b></span>
      <span class="insight__row" ${kf('rise', 3.4)}><span>Sources</span><b>Sales · stock · seasons</b></span>
      <span class="insight__go" ${kf('rise', 3.6)}>Restock plan ready →</span>
    </div>
  </div>
</div>`;

const kpi = (label, tint, d) => `<div class="kpi" style="background:${tint}" ${kf('pop', d)}>${label}<span class="kpi__spark"><i></i><i></i><i></i><i></i></span></div>`;
const web = () => `<div class="demo demo--web" data-cycle="7">
  <div class="browser">
    <div class="browser__bar"><i></i><i></i><i></i><span>app.yourproduct.com</span></div>
    <div class="browser__body">
      <div class="browser__side"><b>▲ SaaS</b>${[0.3, 0.4, 0.5, 0.6].map((d, i) => `<i${i === 0 ? ' class="is-on"' : ''} ${kf('rise', d)}></i>`).join('')}</div>
      <div class="browser__main">
        <div class="kpis">${kpi('Users', 'var(--sky-tint)', 0.7)}${kpi('Revenue', 'var(--mint-tint)', 0.85)}<div class="kpi" style="background:var(--sun-tint)" ${kf('pop', 1)}>Uptime<b>OK</b></div></div>
        <div class="browser__chart"><svg viewBox="0 0 100 40" preserveAspectRatio="none"><path ${kf('draw', 1.2)} pathLength="1" d="M0 34L16 30L32 31L48 22L64 20L80 11L100 6"/></svg></div>
      </div>
    </div>
  </div>
  <div class="mobile" ${kf('rise', 1.5)}>
    <i class="mobile__notch"></i>
    <div class="mobile__screen"><b>Orders</b>${[['#2289', 'Shipped', 1.9], ['#2290', 'Packed', 2.05], ['#2291', 'New', 2.2]].map(([n, s, d]) => `<span class="mobile__row" ${kf('rise', d)}><span>${n}</span><b>${s}</b></span>`).join('')}</div>
    <span class="mobile__push" ${kf('pop', 2.8)}>🔔 New order #2291</span>
  </div>
</div>`;

const product = (name, price, tint, shape, d, hot = false) => `<div class="product${hot ? ' is-hot' : ''}" ${kf('rise', d)}><div class="product__img" style="background:${tint}"><i class="shape shape--${shape}"></i></div><b>${name}</b><span>${price}</span>${hot ? `<span class="product__add" ${kf('press', 1.4)}>Add to bag</span>` : ''}</div>`;
const ecom = () => `<div class="demo demo--ecom" data-cycle="7">
  <div class="store">
    <div class="store__top"><b>Storefront</b><span class="bag"><i></i><b ${kf('pop', 1.7)}>1</b></span></div>
    <div class="store__grid">${product('Linen coat', '$180', 'var(--tomato-tint)', 'round', 0.2, true)}${product('Silk scarf', '$95', 'var(--lilac-tint)', 'tall', 0.35)}${product('Tote bag', '$140', 'var(--mint-tint)', 'wide', 0.5)}</div>
    <div class="store__reco" ${kf('rise', 2.2)}><b>✦ For you</b><i style="background:var(--sun-tint)"></i><i style="background:var(--sky-tint)"></i><i style="background:var(--pink-tint)"></i><span>Pairs with the coat</span></div>
  </div>
  <div class="checkout">
    <div class="checkout__card" ${kf('rise', 1.9)}>
      <b>Checkout</b>
      ${[['Shipping', 2.4], ['Payment', 2.7], ['Fraud check', 3]].map(([t, d]) => `<span class="checkout__row" ${kf('rise', d)}><span>${t}</span><b>✓</b></span>`).join('')}
      <span class="checkout__bar"><i ${kf('growX', 2.3)}></i></span>
    </div>
    <span class="checkout__done" ${kf('pop', 3.7)}>✓ Order placed</span>
  </div>
</div>`;

const region = (y, name, state, d) => `<g class="region" ${kf('pop', d)}><rect x="330" y="${y}" width="64" height="36" rx="9"/><text x="362" y="${y + 15}">${name}</text><text class="is-ok" x="362" y="${y + 28}">● ${state}</text></g>`;
const cloud = () => `<div class="demo demo--cloud" data-cycle="7">
  <svg class="cloud__map" viewBox="0 0 400 190">
    <rect class="onprem" x="6" y="50" width="96" height="90" rx="12"/><text class="label" x="54" y="42">On-prem</text>
    ${[66, 88, 110].map((y) => `<rect class="rack" x="22" y="${y}" width="64" height="14" rx="4"/>`).join('')}
    <path class="migrate" ${kf('draw', 0.3)} pathLength="1" d="M110 95C140 95 150 95 176 95M166 86L178 95L166 104"/>
    <text class="label is-mint" x="143" y="82">migrate</text>
    <path class="links" ${kf('draw', 0.9)} pathLength="1" d="M236 95L330 30M236 95L330 95M236 95L330 160"/>
    ${[[1.6, -65, 'sun'], [1.9, 0, 'sun'], [2.2, 65, 'sun'], [3.1, -65, 'sky'], [3.4, 65, 'sky']].map(([d, ty, c]) => `<circle class="packet is-${c}" cx="236" cy="95" r="4.5" ${kf('travel', d, `data-u="0.08" data-tx="94" data-ty="${ty}"`)}/>`).join('')}
    <rect class="gateway" x="186" y="74" width="54" height="42" rx="10"/><text class="gateway__t" x="213" y="99">Gateway</text>
    ${region(12, 'eu-west', 'healthy', 1.1)}${region(77, 'ap-south', 'healthy', 1.25)}${region(142, 'backup', 'replicated', 1.4)}
  </svg>
  <div class="cloud__foot">
    <div class="latency"><span>Latency · p95</span><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path ${kf('draw', 2)} pathLength="1" d="M0 12L10 16L20 10L30 18L40 14L50 20L60 22L70 21L80 24L90 23L100 25"/></svg></div>
    <div class="scaled" ${kf('pop', 2.8)}><b>Auto-scaled</b><span>for the traffic spike</span></div>
  </div>
</div>`;

const demos = { ai, web, ecom, cloud };

module.exports = { stageScenes, demos };
