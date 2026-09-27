// Services sections (the services list also appears on the home page): services, tools & technologies, industries.
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../content');
const { PUBLIC, esc, pad, icon, head } = require('./helpers');
const { serviceDemo } = require('./demos');

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
    ${head({ label: 'Stack', title: 'Tools &amp; technologies, <em>built for production</em>', lead: esc(C.stack.lead), mark: ['gear', 'mint'] })}
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

// Each service has its own marker colour (the panel's art, its bar in the list, its ticks).
const SVC_MARK = { ai: 'lilac', web: 'sky', ecom: 'tomato', cloud: 'mint' };

// Each service names the projects that show it and links into their case studies (and to all of them, filtered).
const seenIn = (s) => `<p class="svc-panel__work"><span>Seen in</span>${s.work.slice(0, 4).map((k) => C.projects.find((p) => p.image === k)).map((p) => `<a href="./projects#${p.image}">${esc(p.name)}</a>`).join('')}<a class="svc-panel__all" href="./projects?filter=${s.id}">All ${s.work.length} ${icon.arrow}</a></p>`;

const servicePanel = (s, i) => `<article class="svc-panel${i === 0 ? ' is-active' : ''}" id="${s.id}" style="--mk:var(--${SVC_MARK[s.id] || 'sun'})" data-svc-panel>
  <div class="svc-panel__art">${serviceDemo(s.id)}</div>
  <div class="svc-panel__body">
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.description)}</p>
    <ul class="checks">${s.items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul>
    ${seenIn(s)}
  </div>
</article>`;

const services = (withHead = true) => `<section class="section services" data-services>
  <div class="services__pin">
    <div class="wrap services__grid">
      <div class="services__side">
        ${head(withHead ? { label: 'Services', title: 'Apps, websites, <em>AI and more</em>', stack: true, mark: ['pencil', 'lilac'] } : { label: 'Services', title: 'What we <em>build</em>', stack: true, mark: ['pencil', 'lilac'] })}
        <ol class="svc-list" role="list">${C.services.map((s, i) => `<li><button type="button" class="svc-list__btn${i === 0 ? ' is-active' : ''}" style="--mk:var(--${SVC_MARK[s.id] || 'sun'})" data-svc-btn="${i}"><span class="svc-list__num">${pad(i + 1)}</span>${esc(s.title)}<i class="svc-list__bar"><i></i></i></button></li>`).join('')}</ol>
      </div>
      <div class="services__stage">${C.services.map(servicePanel).join('')}</div>
    </div>
  </div>
</section>`;

const industries = () => `<section class="section industries" id="industries">
  <div class="wrap">
    ${head({ label: 'Industries', title: 'Industries <em>we serve</em>', lead: `${C.industries.length} industries. Pick one to see the kinds of systems we build for it.`, mark: ['star', 'sky'] })}
  </div>
  <div class="wrap ind" data-tabs>
    <div class="ind__side">
      <div class="ind__tabs" role="tablist" aria-label="Industries">${C.industries.map(([n], i) => `<button role="tab" type="button" id="ind-tab-${i}" aria-controls="ind-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(n)}</button>`).join('')}</div>
    </div>
    <div class="ind__stage">${C.industries.map(([n, items], i) => `<div class="ind__panel" role="tabpanel" id="ind-panel-${i}" aria-labelledby="ind-tab-${i}"${i ? ' hidden' : ''}><span class="ind__big" aria-hidden="true">${pad(i + 1)}</span><div class="ind__head"><span>${pad(i + 1)} / ${C.industries.length}</span><h3>${esc(n)}</h3></div><ul>${items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>`;

module.exports = { techStack, services, industries };
