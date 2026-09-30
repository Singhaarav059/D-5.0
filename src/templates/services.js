// Services page: the four services in full (what each covers and the work that shows it), the tools we use by
// discipline, the industries we build for (one card at a time) and the FAQ.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, pic, kicker, MARK, SVC_COLOR } = require('./helpers');

const byKey = (k) => C.projects.find((p) => p.image === k);

const serviceList = () => `<section class="wrap svcs">${C.services.map((s, i) => `
  <article class="svcs__item" id="${s.id}" data-reveal>
    <div class="svcs__main">
      <span class="kicker kicker--dim"><i class="dot" style="background:${SVC_COLOR[s.id]}"></i>${pad(i + 1)} / ${pad(C.services.length)}</span>
      <h2 class="display display--l">${esc(s.title)}</h2>
      <p>${esc(s.description)}</p>
      <div class="svcs__work">${s.work.map((k) => { const p = byKey(k); return `<a class="avatar-chip" href="${caseHref(p)}" title="${esc(p.title)}"><span style="background:${p.tint}">${pic(p.image, '', { sizes: '36px' })}</span>${esc(p.name)}</a>`; }).join('')}</div>
    </div>
    <ol class="numlist">${s.items.map((t, j) => `<li><span>${pad(j + 1)}</span>${esc(t)}</li>`).join('')}</ol>
  </article>`).join('')}
</section>`;

// Tools: one tab per discipline (site.js switches them; without JS every list shows under its tab name).
const tools = () => `<section class="wrap tools" data-room="#62c1ff">
  <div class="sec-head">
    <div>${kicker('Tools & technologies')}<h2 class="display display--l" data-reveal>The stack, <em class="quiet">chosen per product.</em></h2></div>
    <div class="tabs" role="tablist" aria-label="Disciplines">${C.tools.map((t, i) => `<button type="button" role="tab" id="tools-tab-${i}" aria-controls="tools-${i}" aria-selected="${i === 0}" data-tab="${i}">${esc(t.tab)}</button>`).join('')}</div>
  </div>
  ${C.tools.map((t, i) => `<div class="tools__list" role="tabpanel" id="tools-${i}" aria-labelledby="tools-tab-${i}" data-tabpanel="${i}"${i ? ' hidden' : ''}>${t.items.map(([name]) => `<span>${esc(name)}</span>`).join('')}</div>`).join('')}
</section>`;

// Industries: pick one (click, or hover with a mouse) and the card shows what we build for it and the work in it.
const industries = () => `<section class="wrap ind" data-room="#ff85b8">
  <div class="sec-head">${kicker('Industries')}<h2 class="display display--l" data-reveal>Where we’ve found <em class="quiet">the way through.</em></h2></div>
  <div class="ind__grid">
    <div class="ind__list">${C.industries.map(([name, , { color }], i) => `<button type="button" data-ind="${i}" aria-pressed="${i === 4}" aria-controls="ind-card" style="--c:${MARK[color]}">${esc(name)}</button>`).join('')}</div>
    <div class="ind__cards" id="ind-card" aria-live="polite">${C.industries.map(([name, systems, { color, work }], i) => `
      <div class="ind__card" data-ind-card="${i}"${i === 4 ? '' : ' hidden'}>
        <span class="kicker kicker--ink"><i class="dot" style="background:${MARK[color]}"></i>What we build for</span>
        <h3 class="display display--m">${esc(name)}</h3>
        <ul>${systems.map((t, j) => `<li><span>${pad(j + 1)}</span>${esc(t)}</li>`).join('')}</ul>
        ${work.length ? `<div class="ind__work">${work.map((k) => `<a href="${caseHref(byKey(k))}">${esc(byKey(k).name)} →</a>`).join('')}</div>` : `<p class="ind__none">No public case study here yet. <a href="./contact">Ask us about it</a>.</p>`}
      </div>`).join('')}
    </div>
  </div>
</section>`;

// The FAQ: one question open at a time (site.js); a native <details> so it works without JS.
const faq = () => `<section class="wrap faq" data-room="#ffcb45">
  <div class="sec-head">${kicker('FAQ')}<h2 class="display display--l" data-reveal>Good questions.</h2></div>
  ${C.faq.map((f, i) => `<details class="faq__item" name="faq"${i === 0 ? ' open' : ''}><summary><span class="faq__n">${pad(i + 1)}</span><span class="faq__q">${esc(f.q)}</span><span class="faq__plus" aria-hidden="true">+</span></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('')}
</section>`;

module.exports = { serviceList, tools, industries, faq };
