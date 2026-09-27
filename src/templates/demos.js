// Service demos: each service panel shows its work as a small, working-looking product (services.js). Real interface
// parts in HTML on a 520 x 240 canvas that site.js scales to the panel and plays while the panel is the active one:
// the markup is the finished picture, the timeline builds it up (with reduced motion or no JS it simply shows).
// Figures, names and messages are illustrative, like the reels' charts: they show the kind of thing we build, not
// client data. Decoration only (aria-hidden); the panel's text says what the service is.
'use strict';

const IMG = './assets/img/reel/';

const bar = (title = '', extra = '') => `<div class="sd-win__bar"><i></i><i></i><i></i>${title ? `<span>${title}</span>` : ''}${extra}</div>`;
const check = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6.5"/></svg>';
const spark = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5c.5 3.2 1.8 4.9 5.5 6.5-3.7 1.6-5 3.3-5.5 6.5-.5-3.2-1.8-4.9-5.5-6.5C6.2 6.4 7.5 4.7 8 1.5z"/></svg>';
const cursor = '<i class="sd-cursor"><svg viewBox="0 0 16 22" aria-hidden="true"><path d="M1 1v17l4.5-4 3.4 7.4 3.1-1.4-3.4-7.3H15z"/></svg></i>';

// AI & ML: an assistant answers a forecasting question with a chart, and a vision model inspects a car.
const ai = () => `
  <div class="sd-win sd-chat">${bar('Assistant')}
    <div class="sd-chat__body">
      <p class="sd-msg sd-msg--me">Forecast Q3 demand</p>
      <div class="sd-msg sd-msg--ai">
        <b class="sd-ava">${spark}</b>
        <div class="sd-answer">
          <p class="sd-stream"><span>Demand</span> <span>rises</span> <span><b>18%</b>,</span> <span>peaking</span> <span>in</span> <span>August.</span></p>
          <div class="sd-forecast">
            <svg viewBox="0 0 176 62" aria-hidden="true">
              <path class="sd-grid" d="M0 12H176M0 32H176M0 52H176"/>
              <path class="sd-band" d="M96 34C116 26 132 12 176 6V30C140 36 118 42 96 44z"/>
              <path class="sd-actual" d="M0 50C14 46 22 52 36 44S58 42 72 40 88 38 96 39" pathLength="1"/>
              <path class="sd-predict" d="M96 39C118 34 136 22 176 18" pathLength="1"/>
              <circle class="sd-now" cx="96" cy="39" r="3.2"/>
            </svg>
            <span class="sd-conf">94% confidence</span>
          </div>
        </div>
      </div>
      <div class="sd-typing"><i></i><i></i><i></i></div>
    </div>
  </div>
  <div class="sd-win sd-vision">${bar('Vision · inspection', '<em class="sd-live">Live</em>')}
    <div class="sd-shot">
      <img src="${IMG}suv-gls-side.webp" alt="" width="904" height="340" loading="lazy" decoding="async">
      <i class="sd-scan"></i>
      <b class="sd-box" style="left:1.5%;top:5%;width:97%;height:90%"><span>Vehicle 98%</span></b>
      <b class="sd-box is-warn" style="left:40%;top:36%;width:11%;height:19%"><span>Scratch 91%</span></b>
      <b class="sd-box is-low" style="left:10.5%;top:53%;width:13%;height:39%"><span>Tyre 96%</span></b>
    </div>
    <div class="sd-score"><span>Condition</span><i><em></em></i><b>8.6</b></div>
    <div class="sd-findings"><span class="sd-pill">3 findings</span><span class="sd-pill is-warn">1 to repair</span><span class="sd-pill is-ok">${check}Report ready</span></div>
  </div>`;

// Web / Mobile App / SaaS: a SaaS dashboard fills in and is published; the phone app shows the same release.
const BARS = [0.42, 0.55, 0.48, 0.66, 0.6, 0.78, 0.92];
const web = () => `
  <div class="sd-win sd-browser">${bar('', '<span class="sd-url">app.yourproduct.com</span>')}
    <div class="sd-app">
      <nav class="sd-nav"><b class="sd-logo"></b><i class="is-on">Overview</i><i>Customers</i><i>Billing</i><i>Reports</i><i>Settings</i></nav>
      <div class="sd-main">
        <header class="sd-head"><b>Overview</b><span class="sd-btn sd-publish"><em class="sd-publish__a">Publish</em><em class="sd-publish__b">${check}Published</em></span></header>
        <div class="sd-kpis">
          <div><small>Revenue</small><b>₹<span data-to="12.4" data-dec="1">12.4</span>L</b><em class="is-up">+12%</em></div>
          <div><small>Active users</small><b><span data-to="8210">8,210</span></b><em class="is-up">+6%</em></div>
          <div><small>Churn</small><b><span data-to="1.8" data-dec="1">1.8</span>%</b><em>−0.4</em></div>
        </div>
        <div class="sd-chart"><small>Weekly signups</small><div class="sd-bars">${BARS.map((h) => `<i style="--h:${h}"></i>`).join('')}</div></div>
      </div>
    </div>
    ${cursor}
  </div>
  <div class="sd-phone">
    <div class="sd-phone__screen">
      <div class="sd-phone__status"><b>9:41</b><i></i></div>
      <b class="sd-phone__title">Overview</b>
      <div class="sd-phone__kpi"><small>Revenue</small><b>₹12.4L</b></div>
      <div class="sd-bars is-small">${BARS.map((h) => `<i style="--h:${h}"></i>`).join('')}</div>
      <div class="sd-phone__row"><i></i><span></span></div><div class="sd-phone__row"><i></i><span></span></div>
      <div class="sd-toast"><b class="sd-toast__icon">${check}</b><span><b>v2.4 is live</b><small>Web and mobile</small></span></div>
    </div>
  </div>`;

// E-commerce: a product is added to the cart, the store recommends what goes with it, and the order is confirmed.
const RECS = [['sneaker', 'Runner', '₹6,900'], ['watch', 'Classic', '₹9,200'], ['sunglasses', 'Aviator', '₹3,400']];
const ecom = () => `
  <div class="sd-win sd-store">${bar('', `<span class="sd-url">shop.yourbrand.com</span><b class="sd-cart"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h14l-1.4 10.2a1.5 1.5 0 01-1.5 1.3H5.9a1.5 1.5 0 01-1.5-1.3z"/><path d="M7 8V5.5a3 3 0 016 0V8"/></svg><em class="sd-badge">1</em></b>`)}
    <div class="sd-pdp">
      <div class="sd-pdp__img"><img src="${IMG}handbag.webp" alt="" width="224" height="224" loading="lazy" decoding="async"><span class="sd-tag">New</span></div>
      <div class="sd-pdp__info">
        <small>Atelier</small><b class="sd-pdp__name">Leather tote</b>
        <p class="sd-price">₹12,450</p>
        <div class="sd-swatches"><i style="--c:#7a4a2a"></i><i style="--c:#1f5c46"></i><i style="--c:#d9c3a3"></i></div>
        <span class="sd-btn sd-add"><em class="sd-add__a">Add to cart</em><em class="sd-add__b">${check}Added</em></span>
        <small class="sd-note">Free delivery in 2 days</small>
      </div>
    </div>
    <i class="sd-fly"></i>
    ${cursor}
  </div>
  <div class="sd-col">
    <div class="sd-card sd-recs"><header><b>Picked for you</b><span class="sd-ai">${spark}AI</span></header>
      <div class="sd-recs__row">${RECS.map(([img, n, p]) => `<div class="sd-rec"><i><img src="${IMG}${img}.webp" alt="" width="224" height="224" loading="lazy" decoding="async"></i><b>${n}</b><small>${p}</small></div>`).join('')}</div>
    </div>
    <div class="sd-card sd-order"><b class="sd-order__icon">${check}</b><span><b>Order confirmed</b><small>#2291 · Paid by UPI</small></span></div>
    <span class="sd-pill is-ok sd-fraud">${check}Fraud check passed</span>
  </div>`;

// Cloud: traffic runs through the production architecture while it scales out, a deploy goes through its pipeline,
// and the service stays up.
const cloud = () => `
  <div class="sd-win sd-topo">${bar('Architecture · production', '<em class="sd-live">Healthy</em>')}
    <svg class="sd-topo__map" viewBox="0 0 318 206" aria-hidden="true">
      <g class="sd-edges">
        <path d="M44 103H70"/><path d="M114 103H140"/>
        <path class="sd-edge-app" d="M184 103C196 103 196 52 212 52"/><path class="sd-edge-app" d="M184 103H212"/><path class="sd-edge-app sd-scale-edge" d="M184 103C196 103 196 154 212 154"/>
        <path d="M256 52C266 52 266 70 276 70M256 103C266 103 266 70 276 70M256 154C266 154 266 70 276 70"/>
        <path class="sd-repl" d="M298 86V122"/>
      </g>
      <g class="sd-flows">
        <path d="M44 103H70" pathLength="1"/><path d="M114 103H140" pathLength="1"/>
        <path d="M184 103C196 103 196 52 212 52" pathLength="1"/><path d="M184 103H212" pathLength="1"/><path class="sd-scale-flow" d="M184 103C196 103 196 154 212 154" pathLength="1"/>
      </g>
      <rect class="sd-group" x="202" y="24" width="64" height="158" rx="10"/>
      <text class="sd-group__t" x="234" y="18">Auto-scaling</text>
      <g class="sd-node"><circle class="sd-node__bg" cx="26" cy="103" r="18"/><path class="sd-ico" d="M20 110c1-4 3-6 6-6s5 2 6 6M26 101a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"/><text x="26" y="136">Users</text></g>
      <g class="sd-node"><rect class="sd-node__bg" x="70" y="85" width="44" height="36" rx="9"/><path class="sd-ico" d="M84 103a8 8 0 1016 0 8 8 0 10-16 0M84 103h16M92 95c3 3 3 13 0 16M92 95c-3 3-3 13 0 16"/><text x="92" y="136">CDN</text></g>
      <g class="sd-node"><rect class="sd-node__bg" x="140" y="85" width="44" height="36" rx="9"/><path class="sd-ico" d="M154 103h16M166 98l5 5-5 5M158 98l-5 5 5 5"/><text x="162" y="136">Balancer</text></g>
      ${[52, 103, 154].map((y, i) => `<g class="sd-node sd-app${i === 2 ? ' sd-scale' : ''}"><rect class="sd-node__bg" x="212" y="${y - 16}" width="44" height="32" rx="8"/><rect class="sd-srv" x="220" y="${y - 7}" width="28" height="5" rx="2"/><rect class="sd-srv" x="220" y="${y + 2}" width="28" height="5" rx="2"/><circle class="sd-led" cx="244" cy="${y - 4.5}" r="1.6"/></g>`).join('')}
      <g class="sd-node"><rect class="sd-node__bg" x="276" y="54" width="36" height="32" rx="8"/><ellipse class="sd-ico" cx="294" cy="64" rx="8" ry="3"/><path class="sd-ico" d="M286 64v12c0 1.7 3.6 3 8 3s8-1.3 8-3V64M286 70c0 1.7 3.6 3 8 3s8-1.3 8-3"/><text x="294" y="44">Primary</text></g>
      <g class="sd-node"><rect class="sd-node__bg is-ghost" x="276" y="122" width="36" height="32" rx="8"/><ellipse class="sd-ico" cx="294" cy="132" rx="8" ry="3"/><path class="sd-ico" d="M286 132v12c0 1.7 3.6 3 8 3s8-1.3 8-3V132M286 138c0 1.7 3.6 3 8 3s8-1.3 8-3"/><text x="294" y="170">Replica</text></g>
    </svg>
  </div>
  <div class="sd-col">
    <div class="sd-card sd-pipe"><header><b>Deploy #148</b><small class="sd-pipe__state"><em class="sd-pipe__a">Running</em><em class="sd-pipe__b">Done in 2m 14s</em></small></header>
      <ol>${['Build', 'Test', 'Deploy'].map((s) => `<li><b class="sd-step">${check}</b>${s}</li>`).join('')}</ol>
      <div class="sd-progress"><em></em></div>
    </div>
    <div class="sd-card sd-metrics">
      <div><small>Uptime · 30 days</small><b>99.99%</b></div>
      <div><small>p95 latency</small><b>82 ms</b><svg viewBox="0 0 80 22" aria-hidden="true"><path class="sd-spark" d="M0 14l8-3 8 4 8-6 8 2 8-7 8 5 8-2 8 4 8-5" pathLength="1"/></svg></div>
    </div>
    <span class="sd-pill is-ok sd-backup">${check}Backup verified 02:00</span>
  </div>`;

const DEMOS = { ai, web, ecom, cloud };

const serviceDemo = (id) => (DEMOS[id] ? `<div class="sd sd--${id}" data-demo="${id}" aria-hidden="true">${DEMOS[id]()}</div>` : '');

module.exports = { serviceDemo };
