// Services sections (several also appear on the home page): services, tools & technologies, industries, how we work.
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../content');
const { PUBLIC, esc, pad, icon, btn, eyebrow } = require('./helpers');

// Tools & technologies: six categories from content.js (the AI & ML one carries roles and groups).
// Brand marks are self-hosted in public/assets/img/tech (the CSP only allows same-origin images); a slug
// with no local file (.svg preferred, then .png) falls back to a two-letter monogram.
const techIcon = (slug) => {
  const file = slug && [`${slug}.svg`, `${slug}.png`].find((f) => fs.existsSync(path.join(PUBLIC, 'assets/img/tech', f)));
  return file ? `./assets/img/tech/${file}` : null;
};

const stackTabs = () => C.tools.map((t, i) => ({
  tab: t.tab,
  items: i === 0
    ? C.stack.items.map((s) => ({ name: s.name, role: s.role, group: s.group, logo: techIcon(s.icon) }))
    : t.items.map(([name, slug]) => ({ name, logo: techIcon(slug) })),
}));

// Knowledge map (after a "knowledge index" UI): the Demaze sphere wires into six discipline cards, and the
// active card fans out to its tools. All six lists ship in the HTML as tab panels; site.js draws the wires.
const KMAP_ICONS = {
  'AI & ML': '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1"/><circle cx="12" cy="12" r="3"/>',
  Web: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  'Mobile App': '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  'UI/UX': '<path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>',
  eCommerce: '<path d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/>',
  Cloud: '<path d="M7 18h10.5a4 4 0 00.6-7.96A6 6 0 006.3 9.5 4.3 4.3 0 007 18z"/>',
};

const kmapIcon = (tab) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${KMAP_ICONS[tab] || KMAP_ICONS.Web}</svg>`;

const kmapItem = (t) => `<li class="kmap__item"><i class="kmap__dot" data-kmap-dot></i>${t.logo ? `<img src="${t.logo}" alt="" width="22" height="22" loading="lazy">` : `<b class="kmap__mono">${esc(t.name.slice(0, 2))}</b>`}<span>${esc(t.name)}</span>${t.role ? `<small>${esc(t.role)}</small>` : ''}</li>`;

const techStack = () => {
  const tabs = stackTabs();
  const total = new Set(tabs.flatMap((t) => t.items.map((x) => x.name))).size;
  return `<section class="section kmap" id="tools" data-kmap>
  <div class="wrap">
    <div class="section-head">
      <h2 class="h2" data-split>Tools &amp; technologies</h2>
      <p class="lead" data-reveal>${esc(C.stack.lead)}</p>
    </div>
    <div class="kmap__stage" data-tabs data-kmap-stage data-reveal>
      <svg class="kmap__wires" aria-hidden="true" data-kmap-wires></svg>
      <div class="kmap__core" aria-hidden="true">
        <p class="kmap__title">Demaze stack</p>
        <p class="kmap__sub"><b>${tabs.length}</b> disciplines · <b>${total}</b> tools</p>
        <canvas class="kmap__sphere" width="440" height="440" data-kmap-sphere></canvas>
        <p class="kmap__live"><i></i>Stack index</p>
      </div>
      <div class="kmap__cats" role="tablist" aria-label="Technology categories" aria-orientation="vertical">${tabs.map((t, i) => `
        <button class="kmap__cat" role="tab" type="button" id="stk-tab-${i}" aria-controls="stk-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-kmap-cat>
          <span class="kmap__icon">${kmapIcon(t.tab)}</span><span class="kmap__name">${esc(t.tab)}</span><span class="kmap__count"><b>${t.items.length}</b> tools</span>
        </button>`).join('')}
      </div>
      <div class="kmap__lists">${tabs.map((t, i) => `
        <div class="kmap__panel" role="tabpanel" id="stk-panel-${i}" aria-labelledby="stk-tab-${i}"${i ? ' hidden' : ''}><ul class="kmap__list">${t.items.map(kmapItem).join('')}</ul></div>`).join('')}
      </div>
    </div>
  </div>
</section>`;
};

// Service art, drawn in code (same line-and-dot language as the globe and the knowledge map).
// .flow strokes carry a moving dash (CSS) so each drawing has one quiet sign of life.
const SVC_ART = {
  ai: `<g class="art__edges">${[[40, 40], [40, 70], [40, 100]].flatMap(([x1, y1]) => [[120, 28], [120, 56], [120, 84], [120, 112]].map(([x2, y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`)).join('')}${[[120, 28], [120, 56], [120, 84], [120, 112]].flatMap(([x1, y1]) => [[200, 52], [200, 88]].map(([x2, y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}"/>`)).join('')}</g>
    <path class="flow" d="M40 70L120 56L200 88"/>
    ${[[40, 40], [40, 70], [40, 100], [120, 28], [120, 56], [120, 84], [120, 112], [200, 52], [200, 88]].map(([x, y], i) => `<circle class="art__node${i === 1 || i === 4 || i === 8 ? ' is-hot' : ''}" cx="${x}" cy="${y}" r="6"/>`).join('')}`,
  web: `<rect class="art__frame" x="22" y="20" width="150" height="100" rx="9"/><path class="art__edges" d="M22 38H172"/>
    ${[34, 44, 54].map((x) => `<circle class="art__dot" cx="${x}" cy="29" r="2.5"/>`).join('')}
    <rect class="art__block" x="36" y="50" width="60" height="30" rx="4"/><rect class="art__block" x="104" y="50" width="54" height="12" rx="3"/><rect class="art__block" x="104" y="68" width="40" height="12" rx="3"/>
    <path class="art__edges" d="M36 92H158M36 104H130"/>
    <rect class="art__frame is-front" x="160" y="46" width="52" height="88" rx="10"/><path class="art__edges" d="M178 124H194"/>
    <rect class="art__block is-hot" x="168" y="60" width="36" height="22" rx="4"/>
    <path class="flow" d="M96 65C124 65 132 71 168 71"/>`,
  ecom: `<path class="art__frame" d="M36 54H92L86 118H42Z"/><path class="art__edges" d="M50 54V46A14 14 0 0 1 78 46V54"/>
    <path class="flow" d="M94 86C126 86 130 58 158 58"/>
    <rect class="art__frame is-front" x="158" y="36" width="52" height="44" rx="6"/><path class="art__edges" d="M158 50H210M184 36V50"/>
    <rect class="art__frame" x="150" y="94" width="66" height="36" rx="6"/><rect class="art__block is-hot" x="158" y="102" width="18" height="12" rx="2"/><path class="art__edges" d="M182 118H208"/>
    <path class="flow" d="M184 80V94"/>
    ${[[64, 84], [58, 100], [72, 100]].map(([x, y]) => `<circle class="art__dot" cx="${x}" cy="${y}" r="2.5"/>`).join('')}`,
  cloud: `<path class="art__frame" d="M78 70H168A22 22 0 0 0 164 26A32 32 0 0 0 104 30A24 24 0 0 0 78 70Z"/>
    ${[[62, 118], [122, 122], [182, 118]].map(([x, y]) => `<path class="flow" d="M122 70L${x} ${y - 10}"/><rect class="art__frame is-front" x="${x - 20}" y="${y - 10}" width="40" height="22" rx="5"/><circle class="art__dot is-hot" cx="${x - 10}" cy="${y + 1}" r="2.5"/><path class="art__edges" d="M${x - 2} ${y + 1}H${x + 12}"/>`).join('')}
    <circle class="art__node is-hot" cx="122" cy="48" r="7"/>`,
};

const serviceArt = (id) => `<svg class="svc-art" viewBox="0 0 240 140" aria-hidden="true">${SVC_ART[id] || SVC_ART.web}</svg>`;

const servicePanel = (s, i) => `<article class="svc-panel${i === 0 ? ' is-active' : ''}" id="${s.id}" data-svc-panel>
  <div class="svc-panel__art">${serviceArt(s.id)}</div>
  <div class="svc-panel__body">
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.description)}</p>
    <ul class="checks">${s.items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul>
  </div>
</article>`;

const services = (withHead = true) => `<section class="section services" data-services>
  <div class="services__pin">
    <div class="wrap services__grid">
      <div class="services__side">
        ${withHead ? `${eyebrow('Services', true)}<h2 class="h2" data-split>Apps, websites, AI and more</h2>` : ''}
        <ol class="svc-list" role="list">${C.services.map((s, i) => `<li><button type="button" class="svc-list__btn${i === 0 ? ' is-active' : ''}" data-svc-btn="${i}"><span class="svc-list__num">${pad(i + 1)}</span>${esc(s.title)}<i class="svc-list__bar"><i></i></i></button></li>`).join('')}</ol>
      </div>
      <div class="services__stage">${C.services.map(servicePanel).join('')}</div>
    </div>
  </div>
</section>`;

const industries = () => `<section class="section industries" id="industries">
  <div class="wrap ind" data-tabs data-ind-auto>
    <div class="ind__side">
      <h2 class="h2" data-split>Industries we serve</h2>
      <p class="lead" data-reveal>${C.industries.length} industries. Pick one to see the kinds of systems we build for it.</p>
      <div class="ind__tabs" role="tablist" aria-label="Industries">${C.industries.map(([n], i) => `<button role="tab" type="button" id="ind-tab-${i}" aria-controls="ind-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(n)}</button>`).join('')}</div>
    </div>
    <div class="ind__stage">${C.industries.map(([n, items], i) => `<div class="ind__panel" role="tabpanel" id="ind-panel-${i}" aria-labelledby="ind-tab-${i}" style="--hue:${(i * 23) % 150 - 40}deg"${i ? ' hidden' : ''}><span class="ind__big" aria-hidden="true">${pad(i + 1)}</span><div class="ind__head"><span>${pad(i + 1)} / ${C.industries.length}</span><h3>${esc(n)}</h3></div><ul>${items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>`;

// "How we work", told on paper: an ink character walks through the four stages while the page scrolls
// (ink.js draws it; the stage text below is the real content and reads fine without the drawing).
const processSection = () => `<section class="section process ink" data-process data-ink>
  <div class="ink__track">
    <div class="ink__sticky">
      <div class="ink__paper">
        <i class="grain" aria-hidden="true"></i>
        <div class="ink__head">
          <div>${eyebrow('How we work', true)}<h2 class="h2 ink__title">From a first idea to a product at scale</h2></div>
          <div>${btn('Book a call', C.calendly, 'btn--ink', 'target="_blank" rel="noopener"')}</div>
        </div>
        <div class="ink__stage"><canvas class="ink__canvas" aria-hidden="true" data-ink-canvas></canvas></div>
        <ol class="ink__steps">${C.process.map((s, i) => `
          <li class="ink__step" data-ink-step><span class="ink__num">${pad(i + 1)} / ${pad(C.process.length)}</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></li>`).join('')}
        </ol>
      </div>
    </div>
  </div>
</section>`;

module.exports = { techStack, services, industries, processSection };
