// The animated scenes: one for each "How we work" stage (home) and one demo for each service (home and the services
// page). Each is drawn as the real tool or product it stands for (a workshop board, a design file, an editor with its
// pull request, a launch dashboard; an AI copilot, a SaaS app with its phone app, a store with its checkout, a cloud
// console), at a fixed size and scaled to its frame (site.js, [data-fit]).
//
// Each plays as a short film on a loop: [data-cycle] is its length in seconds, and each part carries [data-kf] (how it
// moves) and [data-d] (when, in seconds; [data-e] when it leaves, by default just before the loop ends). The moves
// (site.js KF): pop, rise, slide (from data-dx/dy), show and hide (swap one state for the next), draw (an SVG line
// drawing itself), type, growX, growY, press, ping (a click's ripple), path (a cursor or selection moving through
// data-path "t:x,y[,w,h];…", in seconds and % of its parent), cam (a camera move on the whole shot: data-cam
// "t:scale,x,y;…"), travel and blink. With reduced motion everything rests on the finished frame.
//
// Every name, figure and chart here is sample data for the picture (each scene and demo says it is illustrative),
// never client data. The photographs of goods, cars and people are the reels' own illustrations (img/reel).
'use strict';

const kf = (type, d, more = '') => `data-kf="${type}" data-d="${d}"${more ? ` ${more}` : ''}`;
const tag = () => '<span class="illus">Illustrative · sample data</span>';
const r1 = (n) => +n.toFixed(1);
const img = (name, cls = '', w = 224, h = 224) => `<img${cls ? ` class="${cls}"` : ''} src="./assets/img/reel/${name}.webp" alt="" width="${w}" height="${h}" loading="lazy" decoding="async">`;

// A smooth line through points (Catmull-Rom as cubic Béziers), for charts that read like a real product's.
const smooth = (pts) => pts.reduce((d, p, i, a) => {
  if (!i) return `M${r1(p[0])} ${r1(p[1])}`;
  const p0 = a[i - 2] || a[i - 1], p1 = a[i - 1], p3 = a[i + 1] || p;
  const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6], c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
  return `${d}C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p[0])} ${r1(p[1])}`;
}, '');

// Interface icons (24 x 24, drawn as lines).
const ICONS = {
  move: 'M5 3l13 7-6 1.6L9.4 18z',
  frame: 'M8 3v18M16 3v18M3 8h18M3 16h18',
  pen: 'M4 20l3.5-1L19 7.5 16.5 5 5 16.5zM14.5 7l2.5 2.5',
  text: 'M5 6V4h14v2M12 4v16M9 20h6',
  play: 'M8 5l11 7-11 7z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  bag: 'M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  home: 'M4 11l8-7 8 7v9H4z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 3a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3',
  card: 'M3 6h18v12H3zM3 10h18',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  files: 'M6 3h8l4 4v14H6zM14 3v4h4',
  git: 'M6 3v12M18 9a3 3 0 1 0 0-.1M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9c0 5-6 4-12 6',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  plus: 'M12 5v14M5 12h14',
  send: 'M4 12l16-8-6 16-2.5-6.5z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  check: 'M5 12.5l4.5 4.5L19 7',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  db: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
};
const ic = (name, cls = '') => `<svg class="ic${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

// A pointer: the plain arrow, or a teammate's (Figma-style: coloured, with their name). It moves along `path`; each of
// `clicks` (seconds) shows a click's ripple.
const cursor = (path, { name = '', color = 'var(--ink)', clicks = [], d = 0 } = {}) => `<span class="cur${name ? ' cur--named' : ''}" style="--c:${color}" ${kf('path', d, `data-path="${path}"`)}>
  <svg viewBox="0 0 16 22"><path d="M1.5 1.5v16.2l4.1-3.8 2.8 6.3 2.9-1.3-2.7-6.2 5.6-.3z"/></svg>${clicks.map((t) => `<i class="cur__ping" ${kf('ping', t)}></i>`).join('')}${name ? `<b>${name}</b>` : ''}
</span>`;

// A phone's status bar and island.
const statusBar = () => `<div class="sbar"><b>9:41</b><i class="sbar__island"></i><span><svg viewBox="0 0 18 12"><path d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V4H9zM13 11h2V1h-2z"/></svg><svg viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" fill="none"/><rect x="2" y="2" width="16" height="8" rx="2"/><path d="M24 4v4"/></svg></span></div>`;

// ---------- How we work: the four stages ----------

// 01 Discover: the workshop board. Who it is for, what hurts, what v1 must do, how we will know; the team votes, the
// must-haves are framed as the v1 scope, the rest parked for later, and the brief goes out.
const sticky = (color, text, by, d, votes = '') => `<div class="stk" style="--c:${color}" ${kf('rise', d)}><span>${text}</span><em>${by}</em>${votes}</div>`;
const vote = (color, d) => `<i class="stk__vote" style="--v:${color}" ${kf('pop', d)}></i>`;
const idea = () => `<div class="scene scene--idea" data-cycle="9">
  <div class="appbar">
    <span class="appbar__logo"><svg viewBox="0 0 10 10"><path d="M0 0L10 5L0 10L3 5Z"/></svg></span>
    <b>Discovery workshop</b><span class="appbar__path">/ Dealer valuation app</span>
    <span class="appbar__chip">${ic('clock')}24:00 left</span>
    <span class="faces"><i style="--c:var(--blue)">PL</i><i style="--c:var(--pink)">Y</i><i style="--c:var(--mint)">DS</i><em>+2</em></span>
  </div>
  <div class="wb">
    <div class="wb__cols">
      <div class="wb__col"><span class="wb__h"><i style="background:var(--sky)"></i>Who is it for</span>
        ${sticky('#cfe9ff', 'Dealership owners', 'PL', 0.2)}${sticky('#cfe9ff', 'Sales team on the floor', 'DS', 0.32)}${sticky('#cfe9ff', 'Buyers trading in a car', 'You', 0.44)}</div>
      <div class="wb__col"><span class="wb__h"><i style="background:var(--pink)"></i>What hurts today</span>
        ${sticky('#ffd6e6', 'Valuations done by hand', 'You', 0.5, vote('var(--pink)', 2.2) + vote('var(--blue)', 2.35))}${sticky('#ffd6e6', 'Quotes take 3 days', 'PL', 0.62, vote('var(--pink)', 2.6) + vote('var(--mint)', 2.7) + vote('var(--blue)', 2.8))}${sticky('#ffd6e6', 'Data spread over 5 tools', 'DS', 0.74)}</div>
      <div class="wb__col"><span class="wb__h"><i style="background:var(--sun)"></i>What v1 must do</span>
        ${sticky('#fff0b8', 'Value a trade-in in minutes', 'PL', 0.8)}${sticky('#fff0b8', 'Send the quote with EMI', 'You', 0.92)}${sticky('#fff0b8', 'Sync every lead to the CRM', 'DS', 1.04)}</div>
      <div class="wb__col"><span class="wb__h"><i style="background:var(--mint)"></i>How we’ll know</span>
        <div class="metric-card" ${kf('pop', 4.3)}>
          <small>Time to quote</small>
          <b>3 days <span>→</span> 10 min</b>
          <svg viewBox="0 0 110 60"><path class="metric-card__grid" d="M0 12H110M0 34H110M0 56H110"/><path class="metric-card__line" ${kf('draw', 4.6)} pathLength="1" d="M4 10C30 12 40 20 56 34S88 52 106 54"/><circle class="metric-card__pt" cx="106" cy="54" r="3.5" ${kf('pop', 5.4)}/></svg>
          <span class="metric-card__foot"><i></i>Target for v1</span>
        </div>
      </div>
    </div>
    <svg class="wb__frame" viewBox="0 0 560 380"><rect ${kf('draw', 3.1)} pathLength="1" x="276" y="6" width="139" height="246" rx="8"/></svg>
    <span class="wb__label" ${kf('pop', 4.4)}>v1 scope · 3 must-haves</span>
    <div class="wb__park" ${kf('rise', 5.2)}><span>Parking lot</span><i>Dealer app</i><i>Auctions</i><i>Finance partners</i></div>
    <span class="toast" ${kf('pop', 6.4)}>${ic('check')}Brief v1 shared with the team</span>
  </div>
  ${cursor('0.2:78,86;1.9:44,30;2.2:44,30;2.5:44,47;2.8:44,47;3.6:66,86;6.1:79,92;6.4:79,92', { name: 'You', color: 'var(--pink)', clicks: [2.2, 2.6, 6.3] })}
  ${cursor('0.4:30,70;2.8:50,12;3.1:50,12;4.4:74,70;5.0:88,40;5.6:88,40', { name: 'Product lead', color: 'var(--blue)', clicks: [3.1] })}
  ${tag()}
</div>`;

// 02 Design: the design file. The wireframe (with a note on it), the finished valuation screen being laid out, a push in
// on the screen as it comes to life, then the prototype wired up (tap → quote sent) and presented.
const iphone = (cls, inner) => `<div class="iph ${cls}"><div class="iph__screen">${statusBar()}${inner}</div></div>`;
const design = () => `<div class="scene scene--design" data-cycle="10">
  <div class="appbar appbar--figma">
    <span class="fg-tools"><i class="is-on">${ic('move')}</i><i>${ic('frame')}</i><i>${ic('pen')}</i><i>${ic('text')}</i></span>
    <b>Valuation app</b><span class="appbar__path">/ Prototype v2</span>
    <span class="faces"><i style="--c:var(--lilac)">DS</i><i style="--c:var(--pink)">You</i></span>
    <span class="appbar__play">${ic('play')}</span><span class="appbar__share">Share</span>
  </div>
  <div class="canvas">
    <div class="cam" ${kf('cam', 0, 'data-cam="0:1,0,0;3.4:1,0,0;4.2:1.52,-100,-70;6.3:1.52,-100,-70;7:1,0,0"')}>
      <span class="fr__cap" style="left:16px;top:26px">Wireframe</span>
      <div class="wf" style="left:16px;top:42px">
        <div class="wf__bar"><i></i><i></i></div>
        <div class="wf__img"><svg viewBox="0 0 100 50" preserveAspectRatio="none"><path d="M0 0L100 50M100 0L0 50"/></svg><span>Car photo</span></div>
        <i class="wf__l" style="width:80%"></i><i class="wf__l" style="width:55%"></i>
        <span class="wf__k">Estimated value</span><i class="wf__big"></i>
        <div class="wf__range"><i></i></div>
        <i class="wf__btn"></i>
      </div>
      <span class="pin" style="left:34px;top:176px" ${kf('pop', 0.8)}><i>DS</i><span>Price is<br>the hero</span></span>
      <span class="fr__cap" style="left:140px;top:14px">Valuation · iPhone</span>
      <div class="phone-wrap" style="left:140px;top:30px">${iphone('iph--main', `
        <div class="val__top"><span>‹</span><b>Valuation</b><i>DS</i></div>
        <div class="val__car" ${kf('rise', 1.2)}>${img('suv-gls-side', 'val__img', 904, 324)}<i class="val__floor"></i></div>
        <div class="val__name" ${kf('rise', 1.5)}><b>Mercedes-Benz GLS 450</b><small>2021 · 32,000 km · Diesel</small><span class="val__chips"><em>1 owner</em><em>No accidents</em></span></div>
        <div class="val__price" ${kf('rise', 2)}><small>Estimated value</small><b>₹52–56 L</b>
          <span class="val__range"><i class="val__fill" ${kf('growX', 4.3)}></i><i class="val__dot" ${kf('pop', 4.8)}></i></span>
          <span class="val__ends"><span>₹48 L</span><em ${kf('pop', 5)}>Fair price</em><span>₹60 L</span></span>
          <small class="val__src">Based on 1,284 similar sales</small></div>
        <span class="val__cta" ${kf('press', 5.6)}>Send quote<i class="cur__ping is-light" ${kf('ping', 5.6)}></i></span>
        <span class="val__alt">Book an inspection</span>`)}</div>
      <svg class="noodle" viewBox="0 0 428 380"><circle cx="262" cy="281" r="3.5" ${kf('pop', 7.1)}/><path ${kf('draw', 7.1)} pathLength="1" d="M262 281C306 281 282 170 314 170"/><path class="noodle__head" ${kf('pop', 7.7)} d="M308 164L318 170L308 176"/></svg>
      <span class="fr__cap" style="left:318px;top:52px">Quote sent</span>
      <div class="phone-wrap phone-wrap--mini" style="left:318px;top:68px" ${kf('pop', 7.6)}>${iphone('iph--mini', `
        <span class="sent__tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><b class="sent__t">Quote sent</b><small class="sent__s">Mercedes-Benz GLS 450<br>₹54 L · EMI ₹1.1 L / mo</small><span class="sent__btn">Done</span>`)}</div>
      <span class="sel" ${kf('path', 0.4, 'data-e="3.5" data-path="0.4:3.3,10.6,25.8,62;1.3:35.5,20.3,27.6,14.7;2.1:35.5,44.5,27.6,15.5;2.9:35.5,74.6,27.6,6.6;3.4:35.5,74.6,27.6,6.6"')}><i></i><i></i><i></i><i></i></span>
    </div>
    <span class="approved" ${kf('pop', 8.4)}><span class="faces"><i style="--c:var(--mint)">CL</i><i style="--c:var(--lilac)">DS</i></span>Prototype v2 approved</span>
  </div>
  <div class="inspect">
    <div class="inspect__tabs" ${kf('hide', 7)}><span class="is-on">Design</span><span>Prototype</span></div>
    <div class="inspect__tabs inspect__tabs--2" ${kf('show', 7)}><span>Design</span><span class="is-on">Prototype</span></div>
    <div class="inspect__body" ${kf('hide', 7)}>
      <span class="inspect__h">Frame</span><div class="inspect__row"><span>W</span><b>390</b><span>H</span><b>844</b></div>
      <span class="inspect__h">Auto layout</span><div class="inspect__row"><span>↕</span><b>16</b><span>▢</span><b>20</b></div>
      <span class="inspect__h">Fill</span><div class="inspect__row"><i class="sw" style="background:var(--blue)"></i><b>3D5AFE</b><span>100%</span></div>
      <span class="inspect__h">Text</span><div class="inspect__row inspect__row--1"><b>Figtree · Semibold · 22</b></div>
      <span class="inspect__h">Colour styles</span><div class="inspect__sw"><i style="background:var(--blue)"></i><i style="background:var(--lilac)"></i><i style="background:var(--sun)"></i><i style="background:var(--mint)"></i><i style="background:var(--ink)"></i></div>
    </div>
    <div class="inspect__body" ${kf('show', 7)}>
      <span class="inspect__h">Interaction</span><div class="inspect__row inspect__row--1"><b>On tap</b></div>
      <div class="inspect__row inspect__row--1"><b>→ Navigate to “Quote sent”</b></div>
      <span class="inspect__h">Animation</span><div class="inspect__row inspect__row--1"><b>Smart animate</b></div>
      <div class="inspect__row"><span>Ease out</span><b>300 ms</b></div>
      <svg class="inspect__curve" viewBox="0 0 100 50"><path d="M4 46C30 46 36 4 96 4"/></svg>
    </div>
  </div>
  ${cursor('0.2:60,90;2.8:58,88;6.8:58,88;7.9:84.5,5.5;8.2:84.5,5.5;9:70,40', { clicks: [8.1] })}
  ${tag()}
</div>`;

// 03 Build: the editor, the tests running in its terminal, and the pull request going green and merged; the
// integrations it wires up underneath.
const code = [
  ['<k>import</k> { db, crm, payments } <k>from</k> <s>\'@/lib\'</s>', 0],
  ['', 0],
  ['<k>export async function</k> <f>valueTradeIn</f>(car: <t>Car</t>) {', 0],
  ['<k>const</k> comps = <k>await</k> db.sales.<f>similar</f>(car)', 1],
  ['<k>const</k> range = model.<f>predict</f>(comps)', 1],
  ['<k>await</k> crm.<f>attach</f>(car.leadId, range)', 1],
  ['<k>return</k> <f>quote</f>(range, { emi: <k>true</k> })', 1],
  ['}', 0],
];
const check = (label, d, sub = '') => `<span class="ci__row"><span class="ci__st"><i class="spin" ${kf('hide', d)}></i><i class="ok" ${kf('pop', d)}>${ic('check')}</i></span><span>${label}</span>${sub ? `<small>${sub}</small>` : ''}</span>`;
const build = () => `<div class="scene scene--build" data-cycle="9">
  <div class="ide__bar"><span class="lights"><i></i><i></i><i></i></span><span class="ide__tab is-on">valuation.service.ts</span><span class="ide__tab">quote.ts</span><span class="ide__tab">crm.ts</span></div>
  <div class="ide">
    <div class="ide__act">${ic('files')}${ic('search')}<span class="ide__git">${ic('git')}<em>3</em></span>${ic('gear')}</div>
    <div class="ide__main">
      <div class="ide__code">${code.map(([t, ind], i) => `<span class="ln${i === 4 ? ' is-cur' : ''}"><em>${i + 1}</em><span style="--ind:${ind}" ${t ? kf('type', (0.2 + i * 0.32).toFixed(2)) : ''}>${t}</span></span>`).join('')}<i class="caret" data-kf="blink"></i></div>
      <div class="term">
        <div class="term__tabs"><span class="is-on">Terminal</span><span>Problems</span><span>Output</span></div>
        <span class="term__l" ${kf('rise', 2.8)}><b>$</b> npm test</span>
        <span class="term__l" ${kf('rise', 3.4)}><em>✓</em> valuation.spec.ts <small>(12 tests) 184 ms</small></span>
        <span class="term__l" ${kf('rise', 3.8)}><em>✓</em> quote.spec.ts <small>(8 tests) 96 ms</small></span>
        <span class="term__l" ${kf('rise', 4.2)}><em>✓</em> crm.sync.spec.ts <small>(28 tests) 412 ms</small></span>
        <span class="term__l term__l--sum" ${kf('rise', 4.7)}>Tests <em>48 passed</em> (48)</span>
      </div>
    </div>
    <div class="pr">
      <div class="pr__card">
        <span class="pr__state"><span class="pr__open" ${kf('hide', 7.2)}>${ic('git')}Open</span><span class="pr__merged" ${kf('show', 7.2)}>${ic('git')}Merged</span></span>
        <b class="pr__t">Trade-in valuation <small>#128</small></b>
        <span class="pr__br"><code>feat/valuation</code> → <code>main</code></span>
        <div class="ci">${check('Lint', 3)}${check('Unit tests', 4.9, '48')}${check('CRM + payments', 5.5, 'integration')}${check('Preview deploy', 6.1, 'ready')}</div>
        <span class="pr__btn" ${kf('press', 7)}><span ${kf('hide', 7.2)}>Merge pull request</span><span class="pr__btn-done" ${kf('show', 7.2)}>${ic('check')}Merged to main</span><i class="cur__ping is-light" ${kf('ping', 7)}></i></span>
      </div>
      <div class="wires">
        <span class="wires__node">${ic('layers')}App</span>
        <svg viewBox="0 0 190 70"><path d="M40 35H150M40 35C80 35 80 8 150 8M40 35C80 35 80 62 150 62"/>${[[1, 0], [1.6, -27], [2.2, 27]].map(([d, ty]) => `<circle class="pkt" cx="44" cy="35" r="3" ${kf('travel', d, `data-u="0.1" data-tx="104" data-ty="${ty}"`)}/>`).join('')}</svg>
        <span class="wires__to"><em>REST API</em><em>CRM</em><em>Payments</em></span>
      </div>
    </div>
  </div>
  <div class="ide__status"><span>${ic('git')}feat/valuation</span><span>✓ 0 &nbsp;⚠ 0</span><span class="ide__sprint">Sprint 04 of 06 · agile</span></div>
  ${tag()}
</div>`;

// 04 Launch: the launch dashboard. Users climbing after the release (a marker where v1 went live, the pointer reading
// the line), uptime, speed, and the rollout reaching everyone.
const launchChart = () => {
  const w = 332, h = 250, v = [900, 1200, 1500, 2600, 3500, 4700, 5900, 7400], max = 8000;
  const x = (i) => 30 + (i * (w - 40)) / (v.length - 1), y = (n) => 12 + (h - 34) * (1 - n / max);
  const pts = v.map((n, i) => [x(i), y(n)]), d = smooth(pts);
  return `<svg class="lchart" viewBox="0 0 ${w} ${h}">
    ${[0, 2000, 4000, 6000, 8000].map((t) => `<path class="lchart__grid" d="M30 ${r1(y(t))}H${w - 6}"/><text class="lchart__tick" x="24" y="${r1(y(t) + 3)}">${t ? `${t / 1000}k` : '0'}</text>`).join('')}
    <path class="lchart__launch" d="M${r1(x(2.5))} 10V${r1(y(0))}"/>
    <path class="lchart__area" ${kf('show', 1.4)} d="${d}L${r1(x(7))} ${r1(y(0))}L${r1(x(0))} ${r1(y(0))}Z"/>
    <path class="lchart__line" ${kf('draw', 0.4)} pathLength="1" d="${d}"/>
    ${v.map((_, i) => `<text class="lchart__x" x="${r1(x(i))}" y="${h - 4}">W${i + 1}</text>`).join('')}
  </svg>
  <span class="lchart__flag" style="left:${r1((x(2.5) / w) * 100)}%" ${kf('pop', 1.2)}>🚀 v1 live</span>
  <span class="xhair" ${kf('path', 2.2, `data-path="${[[2.2, 4], [3.2, 5], [4.2, 6], [5.2, 7], [6.6, 7]].map(([t, i]) => `${t}:${r1((x(i) / w) * 100)},${r1((y(v[i]) / h) * 100)}`).join(';')}"`)}><i></i></span>
  <span class="ltip" style="left:${r1((x(7) / w) * 100)}%;top:${r1((y(v[7]) / h) * 100)}%" ${kf('pop', 5.3)}><b>7,412</b> users · W8</span>`;
};
const launch = () => `<div class="scene scene--launch" data-cycle="9">
  <div class="dash__top">
    <span class="dash__env"><i></i>Production</span><b>Valuation app <small>v1.4</small></b>
    <span class="seg"><span>7d</span><span class="is-on">30d</span><span>90d</span></span>
  </div>
  <div class="dash__kpis">
    <div class="dkpi" ${kf('rise', 0.2)}><small>Weekly users</small><b>7,412</b><em>↑ 45%</em></div>
    <div class="dkpi" ${kf('rise', 0.3)}><small>Quotes sent</small><b>3,208</b><em>↑ 62%</em></div>
    <div class="dkpi" ${kf('rise', 0.4)}><small>Crash-free</small><b>99.9%</b><em class="is-flat">30 days</em></div>
  </div>
  <div class="dash__grid">
    <div class="dcard dcard--chart"><span class="dcard__h">Weekly active users <em>since launch</em></span><div class="lchart-wrap">${launchChart()}</div></div>
    <div class="dash__side">
      <div class="dcard"><span class="dcard__h">Uptime <b>99.98%</b></span><span class="upt">${Array.from({ length: 30 }, (_, i) => `<i class="${i === 11 ? 'is-warn' : ''}" style="--i:${i}" ${kf('growY', (0.6 + i * 0.03).toFixed(2))}></i>`).join('')}</span><span class="upt__x"><span>30 days ago</span><span>Today</span></span></div>
      <div class="dcard"><span class="dcard__h">p95 response <b>182 ms</b></span><svg class="spark" viewBox="0 0 120 30"><path ${kf('draw', 1.4)} pathLength="1" d="M2 20L14 18L26 22L38 12L50 15L62 10L74 13L86 9L98 11L118 8"/></svg></div>
      <div class="dcard dcard--roll"><span class="dcard__h">Rollout
        <b class="roll__n"><span ${kf('hide', 3.6)}>10%</span><span class="roll__abs" ${kf('show', 3.6, 'data-e="5.6"')}>50%</span><span class="roll__abs" ${kf('show', 5.6)}>100%</span></b></span>
        <span class="roll"><i class="roll__a" ${kf('growX', 2.4)}></i><i class="roll__b" ${kf('growX', 3.6)}></i><i class="roll__c" ${kf('growX', 5.6)}></i></span></div>
    </div>
  </div>
  <div class="push" ${kf('slide', 6.2, 'data-dy="-40px"')}><span class="push__app"><svg viewBox="0 0 10 10"><path d="M0 0L10 5L0 10L3 5Z"/></svg></span><span><b>Released to everyone</b><small>v1.4 is live for 100% of users · 0 errors</small></span><em>now</em></div>
  ${tag()}
</div>`;

const stageScenes = [idea, design, build, launch];

// ---------- Services: a working product for each ----------

// AI & ML: a copilot. Asked for a forecast, it reads the sources (each step ticking off), answers with the chart and its
// range, and drafts the restock order when asked.
const forecast = () => {
  const w = 336, h = 110, act = [820, 1040, 960, 1310], fc = [1310, 1520, 1780], lo = [1310, 1380, 1560], hi = [1310, 1660, 2000], max = 2100;
  const x = (i) => 26 + (i * (w - 34)) / 6, y = (n) => 8 + (h - 28) * (1 - n / max);
  const A = act.map((n, i) => [x(i), y(n)]), F = fc.map((n, i) => [x(i + 3), y(n)]);
  const band = `M${hi.map((n, i) => `${r1(x(i + 3))} ${r1(y(n))}`).join('L')}L${lo.map((n, i) => [x(i + 3), y(n)]).reverse().map(([a, b]) => `${r1(a)} ${r1(b)}`).join('L')}Z`;
  return `<svg class="fc" viewBox="0 0 ${w} ${h}">
    ${[0, 1000, 2000].map((t) => `<path class="fc__grid" d="M26 ${r1(y(t))}H${w - 4}"/><text class="fc__tick" x="20" y="${r1(y(t) + 3)}">${t ? `${t / 1000}k` : '0'}</text>`).join('')}
    <rect class="fc__future" x="${r1(x(3))}" y="4" width="${r1(x(6) - x(3) + 4)}" height="${h - 24}" rx="4"/>
    <path class="fc__band" ${kf('show', 3.9)} d="${band}"/>
    <path class="fc__act" ${kf('draw', 3.3)} pathLength="1" d="${smooth(A)}"/>
    <path class="fc__fc" ${kf('draw', 3.9)} pathLength="1" d="${smooth(F)}"/>
    ${F.slice(1).map(([a, b], i) => `<circle class="fc__pt" cx="${r1(a)}" cy="${r1(b)}" r="3" ${kf('pop', (4.4 + i * 0.15).toFixed(2))}/>`).join('')}
    ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => `<text class="fc__x${i > 3 ? ' is-next' : ''}" x="${r1(x(i))}" y="${h - 4}">${m}</text>`).join('')}
    <text class="fc__note" x="${r1(x(3) + 6)}" y="16">Forecast</text>
  </svg>`;
};
const step = (t, d) => `<span class="step"><span class="step__st"><i class="spin" ${kf('hide', d)}></i><i class="ok" ${kf('pop', d)}>${ic('check')}</i></span>${t}</span>`;
const ai = () => `<div class="demo demo--ai" data-cycle="10">
  <div class="win">
    <div class="cp__side">
      <span class="cp__brand">${img('sparkle', 'cp__logo')}Copilot</span>
      <span class="cp__new">${ic('plus')}New question</span>
      <small>Today</small><span class="cp__hist is-on">Demand forecast</span><span class="cp__hist">Churn drivers</span><small>This week</small><span class="cp__hist">Price anomalies</span><span class="cp__hist">Supplier delays</span>
      <span class="cp__src"><small>Connected</small><span><i></i>Sales DB</span><span><i></i>Inventory</span><span><i></i>Seasonality</span></span>
    </div>
    <div class="cp__main">
      <div class="cp__chat">
        <span class="msg msg--me" ${kf('rise', 0.2)}><span ${kf('type', 0.3)}>Forecast orders for June and July. Any stock risk?</span></span>
        <div class="msg msg--ai" ${kf('rise', 1.3)}>
          <span class="msg__who">${img('sparkle')}Copilot</span>
          <span class="steps">${step('18 months of orders', 1.8)}${step('Stock for 42 products', 2.3)}${step('Seasonal model', 2.8)}</span>
          <span class="msg__txt" ${kf('rise', 3.1)}>June demand should rise <b>36%</b> on April. <b>2 products</b> run out by 12 June.</span>
          <div class="fc-card" ${kf('rise', 3.2)}>${forecast()}<span class="fc__legend"><span><i class="is-act"></i>Actual</span><span><i class="is-fc"></i>Forecast</span><span><i class="is-band"></i>Likely range</span><span class="fc__conf">Confidence 87%</span></span></div>
          <span class="msg__acts" ${kf('rise', 4.9)}><span class="btn-p" ${kf('press', 6.2)}>Draft restock order<i class="cur__ping is-light" ${kf('ping', 6.2)}></i></span><span class="btn-g">Show the 2 products</span></span>
        </div>
      </div>
      <div class="cp__input"><span>Ask about your data…</span><i>${ic('send')}</i></div>
      <span class="toast toast--dark" ${kf('pop', 6.7)}>${ic('check')}Restock order #1182 drafted · 2 products</span>
    </div>
  </div>
  ${cursor('0.2:70,98;5.3:62,90;6.1:40,75.5;6.5:40,75.5;8:55,62')}
</div>`;

// Web, Mobile & SaaS: the web app (overview, revenue, new sign-ups) and its phone app, where a new order lands.
const revenue = () => {
  const w = 270, h = 96, a = [22, 30, 27, 38, 44, 41, 56], b = [18, 22, 24, 26, 30, 29, 34], max = 60;
  const x = (i) => 22 + (i * (w - 28)) / 6, y = (n) => 6 + (h - 22) * (1 - n / max);
  const A = a.map((n, i) => [x(i), y(n)]), B = b.map((n, i) => [x(i), y(n)]);
  return `<svg class="rev" viewBox="0 0 ${w} ${h}">
    ${[0, 20, 40, 60].map((t) => `<path class="rev__grid" d="M22 ${r1(y(t))}H${w - 4}"/><text class="rev__tick" x="17" y="${r1(y(t) + 3)}">${t}k</text>`).join('')}
    <path class="rev__area" ${kf('show', 1.2)} d="${smooth(A)}L${r1(x(6))} ${r1(y(0))}L${r1(x(0))} ${r1(y(0))}Z"/>
    <path class="rev__b" ${kf('draw', 0.9)} pathLength="1" d="${smooth(B)}"/>
    <path class="rev__a" ${kf('draw', 0.7)} pathLength="1" d="${smooth(A)}"/>
    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((t, i) => `<text class="rev__x" x="${r1(x(i))}" y="${h - 3}">${t}</text>`).join('')}
  </svg>
  <span class="xhair xhair--sm" ${kf('path', 2.4, `data-path="${[[2.4, 3], [3.4, 4], [4.4, 6], [6, 6]].map(([t, i]) => `${t}:${r1((x(i) / w) * 100)},${r1((y(a[i]) / h) * 100)}`).join(';')}"`)}><i></i></span>
  <span class="ltip ltip--sm" style="left:${r1((x(6) / w) * 100)}%;top:${r1((y(56) / h) * 100)}%" ${kf('pop', 4.5)}><b>$5.6k</b> Sun</span>`;
};
const kpi = (label, value, delta, d, spark) => `<div class="skpi" ${kf('rise', d)}><small>${label}</small><b>${value}</b><span><em>${delta}</em><svg viewBox="0 0 40 14"><path d="${spark}"/></svg></span></div>`;
const web = () => `<div class="demo demo--web" data-cycle="9">
  <div class="win win--browser">
    <div class="chrome"><span class="lights"><i></i><i></i><i></i></span><span class="chrome__url">${ic('shield')}app.yourproduct.com/overview</span></div>
    <div class="saas">
      <div class="saas__side"><b class="saas__logo"><i></i>Pulse</b>${[['home', 'Overview', 1], ['users', 'Customers'], ['card', 'Billing'], ['chart', 'Reports'], ['gear', 'Settings']].map(([i, t, on]) => `<span${on ? ' class="is-on"' : ''}>${ic(i)}${t}</span>`).join('')}</div>
      <div class="saas__main">
        <div class="saas__head"><b>Overview</b><span class="saas__search">${ic('search')}Search<kbd>⌘K</kbd></span>${img('person2', 'saas__me')}</div>
        <div class="saas__kpis">${kpi('Active users', '8.4k', '↑ 12%', 0.3, 'M1 12L8 9L15 10L22 6L29 7L39 2')}${kpi('Revenue', '$42k', '↑ 8%', 0.4, 'M1 11L8 10L15 7L22 8L29 4L39 3')}${kpi('Churn', '1.8%', '↓ 0.4', 0.5, 'M1 3L8 5L15 4L22 8L29 9L39 11')}</div>
        <div class="saas__chart"><span class="saas__k">Revenue <em><i class="is-a"></i>This week</em><em><i class="is-b"></i>Last week</em></span><div class="rev-wrap">${revenue()}</div></div>
        <div class="saas__table"><span class="saas__k">New sign-ups</span>${[['person', 'Riya Shah', 'Team', '$96'], ['person3', 'Arjun Mehta', 'Pro', '$48'], ['person2', 'Sara Iyer', 'Starter', '$12']].map(([p, n, plan, v], i) => `<span class="trow" ${kf('rise', (1.4 + i * 0.15).toFixed(2))}>${img(p)}<b>${n}</b><em class="plan plan--${plan.toLowerCase()}">${plan}</em><span>${v}/mo</span></span>`).join('')}</div>
      </div>
    </div>
  </div>
  <div class="phone-wrap phone-wrap--web" ${kf('slide', 0.6, 'data-dx="30px" data-dy="0px"')}>${iphone('iph--web', `
    <div class="ord__head"><b>Orders</b><span class="seg seg--sm"><span class="is-on">Today</span><span>Week</span></span></div>
    ${[['sneaker', 'Runners', '#2289', 'Shipped', 'ok'], ['watch', 'Watch', '#2290', 'Packed', 'mid'], ['handbag', 'Day bag', '#2291', 'New', 'new']].map(([p, n, id, s, c], i) => `<span class="ord" ${kf(i === 2 ? 'slide' : 'rise', i === 2 ? 3.4 : 0.9 + i * 0.12, i === 2 ? 'data-dy="-12px"' : '')}><span class="ord__img">${img(p)}</span><span><b>${n}</b><small>${id}</small></span><em class="pill pill--${c}">${s}</em></span>`).join('')}
    <div class="ord__sum"><span>Today</span><b>24 orders</b><small>$3,180</small></div>
    <div class="tabbar">${ic('home')}${ic('bag')}${ic('bell')}${ic('users')}</div>
    <div class="ios-push" ${kf('slide', 3, 'data-dy="-30px" data-e="5.8"')}><span class="push__app"><svg viewBox="0 0 10 10"><path d="M0 0L10 5L0 10L3 5Z"/></svg></span><span><b>New order #2291</b><small>Day bag · $140 · paid</small></span></div>`)}</div>
</div>`;

// E-commerce: the store, where a coat goes into the bag, and the checkout, paid, checked and placed.
const good = (name, title, price, tint, d, stars = '★★★★★') => `<div class="prod" ${kf('rise', d)}><span class="prod__img" style="background:${tint}">${img(name)}<i class="prod__fav">${ic('heart')}</i></span><b>${title}</b><span class="prod__row"><span>${price}</span><em>${stars}</em></span></div>`;
const ecom = () => `<div class="demo demo--ecom" data-cycle="10">
  <div class="win win--store">
    <div class="shop__nav"><b class="shop__logo">atelier</b><span>New</span><span>Women</span><span>Men</span><span class="shop__search">${ic('search')}Coats, bags…</span><span class="shop__bag">${ic('bag')}<em ${kf('pop', 2.6)}>1</em></span></div>
    <div class="shop__promo">Free shipping over $150 · Returns in 30 days</div>
    <div class="shop__hero" ${kf('rise', 0.1)}><span><small>New season</small><b>The autumn edit</b><em>Shop coats →</em></span>${img('kimono', 'shop__hero-a')}${img('dress', 'shop__hero-b')}</div>
    <div class="shop__grid">
      <div class="prod prod--hot" ${kf('rise', 0.2)}><span class="prod__img" style="background:#f6e3cf">${img('blazer')}<i class="prod__fav">${ic('heart')}</i><span class="prod__add" ${kf('show', 1.3)}><span ${kf('press', 1.9)}>Add to bag</span></span></span><b>Linen coat</b><span class="prod__row"><span>$180</span><em>★★★★★</em></span></div>
      ${good('scarf', 'Silk scarf', '$95', '#ffe0e4', 0.3)}${good('handbag', 'Day bag', '$140', '#ece3da', 0.4, '★★★★☆')}${good('sneaker', 'Runner Lite', '$120', '#e7e3ff', 0.5, '★★★★☆')}
    </div>
    <div class="shop__reco" ${kf('rise', 2.9)}><b>✦ Pairs well with the coat</b><span>${img('scarf')}${img('handbag')}</span><small>Picked for you</small></div>
    <span class="fly" ${kf('travel', 2, 'data-u="0.06" data-tx="277" data-ty="-210"')}>${img('blazer')}</span>
  </div>
  <div class="win win--pay">
    <div class="pay__steps"><span class="is-done">Bag</span><i></i><span class="is-done">Details</span><i></i><span class="is-on">Pay</span></div>
    <div class="pay__empty" ${kf('hide', 2.8)}>${ic('bag')}<b>Your bag is empty</b><small>Add something you love</small></div>
    <span class="pay__item" ${kf('rise', 3)}><span class="pay__thumb">${img('blazer')}</span><span><b>Linen coat</b><small>Size M · Sand</small></span><b>$180</b></span>
    <span class="pay__row" ${kf('rise', 3.3)}><span>Shipping</span><b>Free · arrives Thu</b></span>
    <span class="pay__row" ${kf('rise', 3.5)}><span>Card</span><b class="pay__card">${img('card')}•••• 4242</b></span>
    <span class="pay__row" ${kf('rise', 3.7)}><span>Fraud check</span><b class="is-ok">${ic('shield')}Passed</b></span>
    <span class="pay__total" ${kf('rise', 3.9)}><span>Total</span><b>$180.00</b></span>
    <span class="pay__btn" ${kf('press', 5)}>Pay $180.00<i class="cur__ping is-light" ${kf('ping', 5)}></i></span>
    <div class="pay__done" ${kf('show', 5.5)}>
      <svg viewBox="0 0 64 64"><circle ${kf('draw', 5.6)} pathLength="1" cx="32" cy="32" r="28"/><path ${kf('draw', 5.9)} pathLength="1" d="M20 33l8 8 16-17"/></svg>
      <b>Order placed</b><small>#4521 · arrives Thursday</small>
      <span class="pay__track">Track order</span>
    </div>
  </div>
  ${cursor('0.2:30,92;1.2:15,62;1.8:12,68.5;2.3:12,68.5;4.3:82,90;5.2:82,90;7:62,62', { clicks: [1.9, 5] })}
</div>`;

// Cloud: the console. Traffic comes in through the edge to the cluster, which scales from 2 to 6 nodes for a spike and
// back; latency holds while it does.
const node = (icon, t, s, x, y, cls = '') => `<div class="cnode ${cls}" style="left:${x}px;top:${y}px"><span class="cnode__ic">${ic(icon)}</span><b>${t}</b><small>${s}</small></div>`;
const traffic = () => {
  const w = 366, h = 98, v = [30, 34, 32, 38, 70, 92, 88, 60, 40, 36], lat = [48, 50, 47, 49, 55, 52, 50, 49, 48, 47];
  const x = (i) => 4 + (i * (w - 8)) / (v.length - 1), y = (n) => 6 + (h - 16) * (1 - n / 100), yl = (n) => 6 + (h - 16) * (1 - n / 120);
  const A = v.map((n, i) => [x(i), y(n)]);
  return `<svg class="traf" viewBox="0 0 ${w} ${h}">
    <path class="traf__grid" d="M4 ${r1(y(0))}H${w - 4}M4 ${r1(y(50))}H${w - 4}M4 ${r1(y(100))}H${w - 4}"/>
    <path class="traf__area" ${kf('show', 1.4)} d="${smooth(A)}L${r1(x(9))} ${r1(y(0))}L${r1(x(0))} ${r1(y(0))}Z"/>
    <path class="traf__line" ${kf('draw', 1.2)} pathLength="1" d="${smooth(A)}"/>
    <path class="traf__lat" ${kf('draw', 1.6)} pathLength="1" d="${smooth(lat.map((n, i) => [x(i), yl(n)]))}"/>
    <path class="traf__mark" d="M${r1(x(4))} 4V${h - 8}"/>
  </svg>
  <span class="traf__tag" style="left:${r1((x(4) / w) * 100)}%" ${kf('pop', 3.2)}>Auto-scaled 2 → 6 nodes</span>`;
};
const cloud = () => `<div class="demo demo--cloud" data-cycle="10">
  <div class="win win--console">
    <div class="con__top"><b class="con__logo">${ic('layers')}Console</b><span class="con__crumb">production / valuation-api</span><span class="con__ok"><i></i>All systems normal</span></div>
    <div class="con__map">
      <svg class="con__links" viewBox="0 0 528 196">
        <path d="M94 106H128M212 106H250M332 106C378 106 378 68 424 68M332 106C378 106 378 152 424 152"/>
        ${[[0.4, 34, 0, 94], [1.2, 38, 0, 212], [2, 38, 0, 212], [0.8, 92, -38, 332], [2.4, 92, 46, 332], [2.8, 34, 0, 94], [3.4, 38, 0, 212]].map(([d, tx, ty, cx]) => `<circle class="pkt" cx="${cx}" cy="106" r="3.5" ${kf('travel', d, `data-u="0.06" data-tx="${tx}" data-ty="${ty}"`)}/>`).join('')}
      </svg>
      ${node('globe', 'Users', '3 regions', 10, 70)}${node('bolt', 'Edge / CDN', 'cache 94%', 128, 70)}
      <div class="cnode cnode--k8s" style="left:250px;top:40px"><span class="cnode__ic">${ic('layers')}</span><b>Cluster</b><small>valuation-api</small>
        <span class="pods">${Array.from({ length: 8 }, (_, i) => `<i class="${i < 2 ? 'is-base' : i < 6 ? 'is-up' : ''}" ${i >= 2 && i < 6 ? kf('pop', (2.6 + (i - 2) * 0.18).toFixed(2), 'data-e="7.6"') : ''}></i>`).join('')}</span>
        <span class="pods__n"><span ${kf('hide', 2.6, 'data-e="7.6"')}>2 nodes</span><span class="pods__abs" ${kf('show', 2.6, 'data-e="7.6"')}>6 nodes</span></span></div>
      ${node('db', 'Postgres', 'primary · ap-south', 424, 30, 'cnode--db')}${node('db', 'Replica', 'eu-west · lag 40 ms', 424, 114, 'cnode--db cnode--dim')}
    </div>
    <div class="con__foot">
      <div class="con__chart"><span class="con__k">Requests / min <em><i class="is-t"></i>Traffic</em><em><i class="is-l"></i>p95 latency</em></span><div class="traf-wrap">${traffic()}</div></div>
      <div class="con__stats">${[['Uptime', '99.99%'], ['p95', '48 ms'], ['Cost', '−32%'], ['Backups', 'every 5 min']].map(([k, v], i) => `<span ${kf('rise', (0.3 + i * 0.1).toFixed(1))}><small>${k}</small><b>${v}</b></span>`).join('')}</div>
    </div>
  </div>
</div>`;

const demos = { ai, web, ecom, cloud };

module.exports = { stageScenes, demos };
