// Services page: the four services as cards that stack as you scroll (each working in its live demo), the tools map
// (the Demaze stack wired to its disciplines and their tools), the industries we build for (drawn tiles beside one
// card at a time) and the FAQ.
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../content');
const { PUBLIC, esc, pad, caseHref, pic, kicker, SVC_COLOR, SVC_ART } = require('./helpers');
const { doodle } = require('./doodles');
const { demos } = require('./scenes');

const byKey = (k) => C.projects.find((p) => p.image === k);

// ---------- the four services ----------

// Each card sticks under the nav as the next one slides up over it; the ones underneath settle back (site.js). On
// the left what the service is, what it covers and the work that shows it; on the right the service working.
const serviceList = () => `<section class="wrap svcs" data-stack>${C.services.map((s, i) => `
  <article class="svcs__item" id="${s.id}" style="--i:${i};--c:${SVC_COLOR[s.id]};--dd:var(--${SVC_ART[s.id][1]})" data-stack-card>
    <div class="svcs__main">
      <div class="svcs__top"><span class="svcs__icon">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span><span class="kicker kicker--dim">${pad(i + 1)} / ${pad(C.services.length)} · ${s.work.length} projects</span></div>
      <h2 class="display display--l">${esc(s.title)}</h2>
      <p>${esc(s.description)}</p>
      <ul class="svcs__items">${s.items.map((t) => `<li><i>✓</i>${esc(t)}</li>`).join('')}</ul>
      <div class="svcs__work"><span>Seen in</span>${s.work.slice(0, 3).map((k) => { const p = byKey(k); return `<a class="avatar-chip" href="${caseHref(p)}" title="${esc(p.title)}"><span style="background:${p.tint}">${pic(p.image, '', { sizes: '36px' })}</span>${esc(p.name)}</a>`; }).join('')}${s.work.length > 3 ? `<a class="avatar-chip avatar-chip--more" href="./projects">+${s.work.length - 3} more</a>` : ''}</div>
    </div>
    <div class="svcs__demo"><div class="svcs__screen"><div data-fit>${demos[s.id]()}</div></div><span class="svcs__caption">Demo is illustrative · sample data</span></div>
  </article>`).join('')}
</section>`;

// ---------- the tools map ----------

// Brand marks are self-hosted in public/assets/img/tech (the CSP only allows same-origin images); a slug with no local
// file (.svg preferred, then .png) falls back to a two-letter monogram.
const techIcon = (slug) => {
  const file = slug && [`${slug}.svg`, `${slug}.png`].find((f) => fs.existsSync(path.join(PUBLIC, 'assets/img/tech', f)));
  return file ? `./assets/img/tech/${file}` : null;
};
const stackTabs = () => C.tools.map((t, i) => ({
  tab: t.tab,
  items: i === 0 ? C.stack.items.map((s) => ({ name: s.name, role: s.role, logo: techIcon(s.icon) })) : t.items.map(([name, slug]) => ({ name, logo: techIcon(slug) })),
}));
const KMAP_ART = { 'AI & ML': ['chip', 'lilac'], Web: ['browser', 'sky'], Mobile: ['phone', 'sun'], 'UI/UX': ['pen', 'pink'], 'E-commerce': ['bag', 'tomato'], Cloud: ['cloud', 'mint'] };
const kmapArt = (tab) => KMAP_ART[tab] || ['layers', 'sky'];

// The Demaze stack in isometric: a pile of six plates, one per discipline, each with a port where its wire starts.
// Picking a discipline pulls its plate out in its colour and wires its card to each of its tools (site.js).
const CX = 104, HW = 84, HH = 33, T = 9;
const plateY = (i) => 58 + i * 28;
const chevronPath = (x, y, s) => `M${x - s / 2} ${y - s / 2}L${x + s / 2} ${y}L${x - s / 2} ${y + s / 2}L${x - s / 5} ${y}Z`;
const stackArt = (tabs) => `<svg class="kmap__stack" viewBox="0 0 250 250" aria-hidden="true" focusable="false">
  ${tabs.map((t, i) => {
    const y = plateY(i);
    const top = `M${CX} ${y - HH}L${CX + HW} ${y}L${CX} ${y + HH}L${CX - HW} ${y}Z`;
    const left = `M${CX - HW} ${y}L${CX} ${y + HH}V${y + HH + T}L${CX - HW} ${y + T}Z`;
    const right = `M${CX} ${y + HH}L${CX + HW} ${y}V${y + T}L${CX} ${y + HH + T}Z`;
    return `<g class="kmap__plate${i === 0 ? ' is-on' : ''}" style="--mk:var(--${kmapArt(t.tab)[1]})" data-kmap-plate="${i}"><path class="kmap__side is-left" d="${left}"/><path class="kmap__side" d="${right}"/><path class="kmap__face" d="${top}"/>${i === 0 ? `<path class="kmap__logo" d="${chevronPath(CX, y, 26)}"/>` : `<path class="kmap__lines" d="M${CX - 34} ${y - 2}l22 11M${CX - 22} ${y - 8}l34 17"/>`}</g>`;
  }).reverse().join('')}
  ${tabs.map((_, i) => `<path class="kmap__stub" d="M${CX + HW} ${plateY(i) + T / 2}H${CX + HW + 26}"/><circle class="kmap__port" cx="${CX + HW + 28}" cy="${plateY(i) + T / 2}" r="3.4" data-kmap-port="${i}"/>`).join('')}
</svg>`;
const kmapItem = (t) => `<li class="kmap__item"><i class="kmap__dot" data-kmap-dot></i>${t.logo ? `<img src="${t.logo}" alt="" width="22" height="22" loading="lazy">` : `<b class="kmap__mono">${esc(t.name.slice(0, 2))}</b>`}<span>${esc(t.name)}</span>${t.role ? `<small>${esc(t.role)}</small>` : ''}</li>`;

const tools = () => {
  const tabs = stackTabs();
  const total = new Set(tabs.flatMap((t) => t.items.map((x) => x.name))).size;
  return `<section class="wrap tools kmap" id="tools" data-room="#62c1ff">
  <div class="sec-head">
    <div>${kicker('Tools & technologies', '', ['gear', 'sky'])}<h2 class="display display--l" data-reveal>How we build it, <em class="quiet">layer by layer.</em></h2></div>
    <p class="sec-head__lead">${esc(C.stack.lead)}</p>
  </div>
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
</section>`;
};

// ---------- industries ----------

// An index of drawn tiles beside one card at a time: the card draws the industry, lists the kinds of systems we build
// for it and links to our work in that sector. While it is on screen the index moves on by itself, a bar filling on
// the current tile, until the visitor picks one (site.js).
const industries = () => `<section class="wrap inds" id="industries" data-room="#ff85b8">
  <div class="sec-head">
    <div>${kicker('Industries', '', ['store', 'pink'])}<h2 class="display display--l" data-reveal>Where we’ve found <em class="quiet">the way through.</em></h2></div>
    <p class="sec-head__lead">The industries we serve. Pick one to see the kinds of systems we build for it.</p>
  </div>
  <div class="ind" data-tabs data-ind>
    <div class="ind__tabs" role="tablist" aria-label="Industries">${C.industries.map(([n, , a], i) => `
      <button class="ind__tile" role="tab" type="button" id="ind-tab-${i}" aria-controls="ind-panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--mk:var(--${a.color})"><span class="ind__icon">${doodle(a.doodle, { color: a.color })}</span><span class="ind__name">${esc(n)}</span><i class="ind__timer" aria-hidden="true"></i></button>`).join('')}
    </div>
    <div class="ind__stage">${C.industries.map(([n, items, a], i) => {
      const work = a.work.map(byKey).filter(Boolean);
      return `
      <div class="ind__panel" role="tabpanel" id="ind-panel-${i}" aria-labelledby="ind-tab-${i}" style="--mk:var(--${a.color})"${i ? ' hidden' : ''}>
        <div class="ind__top">
          <div class="ind__art" aria-hidden="true">${doodle(a.doodle, { color: a.color })}</div>
          <div class="ind__head"><span>${pad(i + 1)}</span><h3>${esc(n)}</h3><p>${items.length} kinds of systems we build</p></div>
        </div>
        <ul class="ind__list">${items.map((t) => `<li><i>✓</i>${esc(t)}</li>`).join('')}</ul>
        ${work.length ? `<p class="ind__work"><span>Our work here</span>${work.map((p) => `<a href="${caseHref(p)}">${esc(p.name)} →</a>`).join('')}</p>` : `<p class="ind__work"><span>Building for ${esc(n.toLowerCase())}?</span><a href="./contact">Tell us about it →</a></p>`}
      </div>`;
    }).join('')}
    </div>
  </div>
</section>`;

// ---------- FAQ ----------

// One question open at a time (a native exclusive <details> group, so it works without JS).
const faq = () => `<section class="wrap faq" data-room="#ffcb45">
  <div class="sec-head">${kicker('FAQ', '', ['question', 'sky'])}<h2 class="display display--l" data-reveal>Good questions.</h2></div>
  ${C.faq.map((f, i) => `<details class="faq__item" name="faq"${i === 0 ? ' open' : ''}><summary><span class="faq__n">${pad(i + 1)}</span><span class="faq__q">${esc(f.q)}</span><span class="faq__plus" aria-hidden="true">+</span></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('')}
</section>`;

module.exports = { serviceList, tools, industries, faq, techIcon };
