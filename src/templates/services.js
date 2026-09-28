// Services sections (the services list also appears on the home page): services, tools & technologies, industries.
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../content');
const { PUBLIC, esc, pad, icon, head } = require('./helpers');
const { serviceDemo } = require('./demos');
const { doodle } = require('./doodles');
const { chevron } = require('./maze');
const { sketch } = require('./sketches');

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

// The tools map: the Demaze stack drawn as a pile of six layers, one per discipline, each wired into its card. Picking
// a discipline pulls its layer out of the pile in its marker colour and lays a line from its card to each of its
// tools (site.js). All six lists ship in the HTML as tab panels. Each discipline has the drawing it has on the moving
// band (templates/doodles.js).
const KMAP_ART = { 'AI & ML': ['chip', 'lilac'], Web: ['browser', 'sky'], 'Mobile App': ['phone', 'sun'], 'UI/UX': ['pen', 'pink'], eCommerce: ['bag', 'tomato'], Cloud: ['cloud', 'mint'] };
const kmapArt = (tab) => KMAP_ART[tab] || ['layers', 'sky'];

// The pile, in isometric: plate i's top face is a rhombus centred on (CX, y_i), with a thin edge below it. Drawn from
// the bottom up so each plate covers the ones under it. A port past each plate's right corner is where its wire starts.
const CX = 104, HW = 84, HH = 33, T = 9;
const plateY = (i) => 58 + i * 28;
const stackArt = (tabs) => `<svg class="kmap__stack" viewBox="0 0 250 250" aria-hidden="true" focusable="false">
  ${tabs.map((t, i) => {
    const y = plateY(i);
    const top = `M${CX} ${y - HH}L${CX + HW} ${y}L${CX} ${y + HH}L${CX - HW} ${y}Z`;
    const left = `M${CX - HW} ${y}L${CX} ${y + HH}V${y + HH + T}L${CX - HW} ${y + T}Z`;
    const right = `M${CX} ${y + HH}L${CX + HW} ${y}V${y + T}L${CX} ${y + HH + T}Z`;
    return { i, svg: `<g class="kmap__plate${i === 0 ? ' is-on' : ''}" style="--mk:var(--${kmapArt(t.tab)[1]})" data-kmap-plate="${i}"><path class="kmap__side is-left" d="${left}"/><path class="kmap__side" d="${right}"/><path class="kmap__face" d="${top}"/>${i === 0 ? `<path class="kmap__logo" d="${chevron(CX, y, 26)}"/>` : `<path class="kmap__lines" d="M${CX - 34} ${y - 2}l22 11M${CX - 22} ${y - 8}l34 17"/>`}</g>` };
  }).reverse().map((p) => p.svg).join('')}
  ${tabs.map((_, i) => `<path class="kmap__stub" d="M${CX + HW} ${plateY(i) + T / 2}H${CX + HW + 26}"/><circle class="kmap__port" cx="${CX + HW + 28}" cy="${plateY(i) + T / 2}" r="3.4" data-kmap-port="${i}"/>`).join('')}
</svg>`;

const kmapItem = (t) => `<li class="kmap__item"><i class="kmap__dot" data-kmap-dot></i>${t.logo ? `<img src="${t.logo}" alt="" width="22" height="22" loading="lazy">` : `<b class="kmap__mono">${esc(t.name.slice(0, 2))}</b>`}<span>${esc(t.name)}</span>${t.role ? `<small>${esc(t.role)}</small>` : ''}</li>`;

const techStack = () => {
  const tabs = stackTabs();
  const total = new Set(tabs.flatMap((t) => t.items.map((x) => x.name))).size;
  return `<section class="section kmap" id="tools" data-kmap>
  ${sketch('code', { color: 'mint', tilt: -3 })}${sketch('git', { side: 'right', color: 'sun', top: 'calc(clamp(72px, 10vw, 136px) + 240px)', tilt: 2 })}
  <div class="wrap">
    ${head({ label: 'Stack', title: 'Tools &amp; technologies, <em>built for production</em>', lead: esc(C.stack.lead), mark: ['gear', 'mint'] })}
    <div class="kmap__stage" style="--mk:var(--${kmapArt(tabs[0].tab)[1]})" data-tabs data-kmap-stage data-reveal>
      <svg class="kmap__wires" aria-hidden="true" data-kmap-wires></svg>
      <div class="kmap__core" aria-hidden="true">
        ${stackArt(tabs)}
        <p class="kmap__title">The Demaze stack</p>
        <p class="kmap__sub"><b>${tabs.length}</b> layers · <b>${total}</b> tools</p>
      </div>
      <div class="kmap__cats" role="tablist" aria-label="Technology categories" aria-orientation="vertical">${tabs.map((t, i) => `
        <button class="kmap__cat" role="tab" type="button" id="stk-tab-${i}" aria-controls="stk-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--mk:var(--${kmapArt(t.tab)[1]})" data-kmap-cat>
          <span class="kmap__icon">${doodle(kmapArt(t.tab)[0], { color: kmapArt(t.tab)[1] })}</span><span class="kmap__name">${esc(t.tab)}</span><span class="kmap__count"><b>${t.items.length}</b> tools</span>
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
    ${sketch('pen', { side: 'right', color: 'lilac', top: '22%', tilt: 3 })}
    <div class="wrap services__grid">
      <div class="services__side">
        ${head(withHead ? { label: 'Services', title: 'Apps, websites, <em>AI and more</em>', stack: true, mark: ['pencil', 'lilac'] } : { label: 'Services', title: 'What we <em>build</em>', stack: true, mark: ['pencil', 'lilac'] })}
        <ol class="svc-list" role="list">${C.services.map((s, i) => `<li><button type="button" class="svc-list__btn${i === 0 ? ' is-active' : ''}" style="--mk:var(--${SVC_MARK[s.id] || 'sun'})" data-svc-btn="${i}"><span class="svc-list__num">${pad(i + 1)}</span>${esc(s.title)}<i class="svc-list__bar"><i></i></i></button></li>`).join('')}</ol>
      </div>
      <div class="services__stage">${C.services.map(servicePanel).join('')}</div>
    </div>
  </div>
</section>`;

// Industries: an index of drawn tiles beside one card at a time. The card draws the industry, lists the kinds of
// systems we build for it and links to our case studies in that sector. While it is on screen the index moves on by
// itself, a bar filling on the current tile, until the visitor picks one (site.js).
const workIn = (keys) => keys.map((k) => C.projects.find((p) => p.image === k)).filter(Boolean);
const industries = () => `<section class="section industries" id="industries">
  ${sketch('chart', { color: 'tomato', tilt: -2 })}
  <div class="wrap">
    ${head({ label: 'Industries', title: 'Industries <em>we serve</em>', lead: `${C.industries.length} industries. Pick one to see the kinds of systems we build for it.`, mark: ['star', 'sky'] })}
  </div>
  <div class="wrap ind" data-tabs data-ind>
    <div class="ind__tabs" role="tablist" aria-label="Industries">${C.industries.map(([n, , a], i) => `
      <button class="ind__tile" role="tab" type="button" id="ind-tab-${i}" aria-controls="ind-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--mk:var(--${a.color})"><span class="ind__icon">${doodle(a.doodle, { color: a.color })}</span><span class="ind__name">${esc(n)}</span><i class="ind__timer" aria-hidden="true"></i></button>`).join('')}
    </div>
    <div class="ind__stage">${C.industries.map(([n, items, a], i) => {
      const work = workIn(a.work);
      return `
      <div class="ind__panel" role="tabpanel" id="ind-panel-${i}" aria-labelledby="ind-tab-${i}" style="--mk:var(--${a.color})"${i ? ' hidden' : ''}>
        <div class="ind__top">
          <div class="ind__art" aria-hidden="true">${doodle(a.doodle, { color: a.color })}</div>
          <div class="ind__head"><span>${pad(i + 1)} / ${C.industries.length}</span><h3>${esc(n)}</h3><p>${items.length} kinds of systems we build</p></div>
        </div>
        <ul class="ind__list">${items.map((t) => `<li>${icon.check}${esc(t)}</li>`).join('')}</ul>
        ${work.length ? `<p class="ind__work"><span>Our work here</span>${work.map((p) => `<a href="./projects#${p.image}">${esc(p.name)}</a>`).join('')}</p>` : `<p class="ind__work"><span>Building for ${esc(n.toLowerCase())}?</span><a href="./contact">Tell us about it</a></p>`}
      </div>`;
    }).join('')}
    </div>
  </div>
</section>`;

module.exports = { techStack, services, industries };
