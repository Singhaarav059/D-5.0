// Pieces used on more than one page: the subpage heading, the record (four figures), the founder's print and his
// words lighting up as you scroll.
'use strict';

const C = require('../content');
const { esc, pad, pic, kicker, words, caseHref, SVC_ART } = require('./helpers');
const { doodle } = require('./doodles');
const { maze } = require('./maze');

// What sits beside each subpage's headline: something real from the page. `art` is up to three [doodle, colour]
// drawn around it (they draw themselves on, then keep a hand-drawn jitter; site.css).
const SECTORS = new Set(C.projects.map((p) => p.sector)).size;
const ASIDE = {
  // projects: three real screens, fanned like prints on a desk; each opens its case study
  projects: () => `<div class="aside-fan">${C.projects.slice(0, 3).map((p, i) => `<a class="aside-fan__card" href="${caseHref(p)}" style="--i:${i};--tint:${p.tint}">${pic(p.image, p.name, { sizes: '300px', cls: 'aside-fan__img' })}<span>${esc(p.name)}<small>${esc(p.sector)}</small></span></a>`).join('')}
    <p class="aside-chip"><b>${C.projects.length}</b> products · <b>${SECTORS}</b> sectors</p></div>`,
  // services: the four services as drawn tiles, each jumping to its card below
  services: () => `<div class="aside-svcs">${C.services.map((s, i) => `<a class="aside-svcs__tile" href="./services#${s.id}" style="--dd:var(--${SVC_ART[s.id][1]});--i:${i}"><span class="aside-svcs__icon">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span><b>${esc(s.title)}</b><small>${s.work.length} projects</small></a>`).join('')}</div>`,
  // about: where the name comes from, a dictionary entry over a small maze that solves itself
  about: () => `<figure class="aside-name">
    <p class="aside-name__word">de·maze <small>verb</small></p>
    <p class="aside-name__def">To take the maze out of building a product: the vague specs, the scope creep, the missed deadlines.</p>
    ${maze({ cols: 9, rows: 4, seed: 1907, tone: 'night', label: 'A small maze, solved from your idea to launch' })}
    <figcaption>Where our name comes from</figcaption></figure>`,
};

const art = (list) => (list.length ? `<div class="phead__art" aria-hidden="true">${list.map(([n, c], i) => doodle(n, { color: c, cls: `phead__dd phead__dd--${i + 1}` })).join('')}</div>` : '');

// Subpages open the same way: a label, the headline rising in word by word (its <em> part in the quieter grey), the
// lead, and beside them something from the page (`aside`, above) with doodles around it. `room` is the colour the
// background aura takes while it is in view.
const pageHead = ({ label, title, lead, room, aside = '', doodles = [] }) => `<section class="wrap phead${aside ? ' phead--aside' : ''}" data-room="${room}">
  <div class="phead__title">${kicker(label)}<h1 class="display display--xl" data-words>${words(title)}</h1>${lead ? `<p class="phead__lead" data-reveal>${esc(lead)}</p>` : ''}</div>
  ${aside ? `<div class="phead__aside" data-reveal data-delay="0.2">${art(doodles)}${ASIDE[aside]()}</div>` : art(doodles)}
</section>`;

// The record: four figures that count up as they arrive.
const metrics = (cls = '') => `<div class="metrics${cls ? ` ${cls}` : ''}">${C.metrics.map((m, i) => `<div class="metrics__item" data-reveal data-delay="${(i * 0.1).toFixed(1)}"><b data-count="${m.value}" data-pre="${esc(m.prefix)}" data-suf="${esc(m.suffix)}">${esc(m.prefix + m.value + m.suffix)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>`;

// The founder's photo as a print, taped to the page, tilting toward the cursor. `tape`: the tape's colour.
const print = ({ tilt = -3, tape = 'var(--sun)', eager = false } = {}) => `<figure class="print" data-tilt="8" style="--tilt:${tilt}deg;--tape:${tape}">
  <div class="print__paper" data-reveal>${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title} of Demaze`, { sizes: '380px', cls: 'print__img', attrs: eager ? 'decoding="async"' : undefined })}
    <figcaption>${esc(C.founder.name)} · <span>${esc(C.founder.title)}</span></figcaption><i class="print__tape"></i></div>
</figure>`;

// The founder's quote, lit word by word as it scrolls up the screen (site.js); the words of `founder.mark` get a
// marker line in `--mk` once lit.
const quote = (mk = 'var(--pink)') => {
  const all = C.founder.quote.split(' ');
  const mark = C.founder.mark.split(' ');
  const at = all.findIndex((_, i) => mark.every((w, j) => all[i + j] && all[i + j].replace(/[^\w’']/g, '') === w.replace(/[^\w’']/g, '')));
  return `<blockquote class="quote" data-quote style="--mk:${mk}"><p>${all.map((w, i) => `<span data-qw${at >= 0 && i >= at && i < at + mark.length ? ' data-mk' : ''}>${esc(w)}</span>`).join(' ')}</p></blockquote>`;
};

module.exports = { pageHead, metrics, print, quote, art };
