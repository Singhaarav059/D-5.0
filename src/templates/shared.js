// Pieces used on more than one page: the subpage heading, the record (four figures), the founder's print and his
// words lighting up as you scroll.
'use strict';

const C = require('../content');
const { esc, pad, pic, kicker, words, caseHref, SVC_ART } = require('./helpers');
const { doodle, doodleAt } = require('./doodles');

// What sits beside each subpage's headline: something real from the page. `art` is up to three [doodle, colour]
// drawn around it (they draw themselves on, then keep a hand-drawn jitter; site.css).
const delivered = C.metrics.find((m) => /project/i.test(m.label));
const ASIDE = {
  // projects: three real screens, fanned like prints on a desk; each opens its case study
  projects: () => `<div class="aside-fan">${C.projects.slice(0, 3).map((p, i) => `<a class="aside-fan__card" href="${caseHref(p)}" style="--i:${i};--tint:${p.tint}">${pic(p.image, p.name, { sizes: '300px', cls: 'aside-fan__img' })}<span>${esc(p.name)}<small>${esc(p.sector)}</small></span></a>`).join('')}
    <p class="aside-chip"><b>${C.projects.length}</b> featured · <b>${delivered.value}${delivered.suffix}</b> delivered</p></div>`,
  // services: the four services as drawn tiles, each jumping to its card below
  services: () => `<div class="aside-svcs">${C.services.map((s, i) => `<a class="aside-svcs__tile" href="./services#${s.id}" style="--dd:var(--${SVC_ART[s.id][1]});--i:${i}"><span class="aside-svcs__icon">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span><b>${esc(s.title)}</b><small>${s.work.length} products</small></a>`).join('')}</div>`,
  // about: where the name comes from: a tangle (the maze of a product) straightened into one route to launch
  about: () => `<figure class="aside-name">
    <p class="aside-name__word">de·maze <small>verb</small></p>
    <p class="aside-name__def">To take the maze out of building a product: the vague specs, the scope creep, the missed deadlines.</p>
    <svg class="demaze" viewBox="0 0 520 190" aria-hidden="true">
      <path class="demaze__knot" pathLength="1" d="M20 96c30-60 60 50 90-4s-40-70-10-26 60 40 40 64-70 10-50-30 70-50 90-10-10 70-40 50 20-70 60-50"/>
      ${doodleAt('ghost', 58, 40, 34, { color: 'lilac' })}${doodleAt('bug', 150, 150, 34, { color: 'tomato' })}${doodleAt('clock', 120, 32, 30, { color: 'sun' })}
      <path class="demaze__arrow" pathLength="1" d="M236 96h44M270 86l12 10-12 10"/>
      <path class="demaze__route" pathLength="1" d="M300 150H360V100H420V56H486"/>
      ${[['bulb', 'sun', 330, 170], ['pencil', 'lilac', 390, 120], ['gear', 'sky', 450, 76]].map(([d, c, x, y]) => doodleAt(d, x, y, 30, { color: c })).join('')}
      <path class="demaze__flag" d="M488 42l22 14-22 14 6-14z"/>
      <text class="demaze__t" x="112" y="186">the maze</text><text class="demaze__t is-blue" x="400" y="186">the route</text>
    </svg>
    <figcaption>Where our name comes from</figcaption></figure>`,
  // contact: what happens after you get in touch, as three stops on a route
  contact: () => `<ol class="aside-next">${[['cup', 'tomato', 'You tell us what you’re building', 'By email, the brief below or a call: whatever is easiest.'], ['chat', 'sky', 'We talk it through', 'A 30-minute call to understand the goal, the users and what stands in the way.'], ['rocket', 'sun', 'You get a route', 'A plan for the first release: scope, stages and the team who will build it.']]
    .map(([d, c, t, p], i) => `<li style="--i:${i};--mk:var(--${c})"><span class="aside-next__art">${doodle(d, { color: c })}</span><span><small>Step ${pad(i + 1)}</small><b>${t}</b>${p}</span></li>`).join('')}</ol>`,
};

const art = (list) => (list.length ? `<div class="phead__art" aria-hidden="true">${list.map(([n, c], i) => doodle(n, { color: c, cls: `phead__dd phead__dd--${i + 1}` })).join('')}</div>` : '');

// Subpages open the same way: a label, the headline rising in word by word (its <em> part in the quieter grey), the
// lead, and beside them something from the page (`aside`, above) with doodles around it. `room` is the colour the
// background aura takes while it is in view.
const pageHead = ({ label, title, lead, room, aside = '', doodles = [] }) => `<section class="wrap phead${aside ? ' phead--aside' : ''}" data-room="${room}">
  <div class="phead__title">${kicker(label, '', doodles[0] || null)}<h1 class="display display--xl" data-words>${words(title)}</h1>${lead ? `<p class="phead__lead" data-reveal>${esc(lead)}</p>` : ''}</div>
  ${aside ? `<div class="phead__aside" data-reveal data-delay="0.2">${art(doodles)}${ASIDE[aside]()}</div>` : art(doodles)}
</section>`;

// The record: four figures as equal cards, each with its drawing and colour, counting up as they arrive.
const METRIC_ART = [['rocket', 'tomato'], ['star', 'sun'], ['heart', 'pink'], ['clock', 'sky']];
const metrics = (cls = '') => `<div class="metrics${cls ? ` ${cls}` : ''}">${C.metrics.map((m, i) => `<div class="metric" data-reveal data-delay="${(i * 0.08).toFixed(2)}" data-tilt="5" style="--mk:var(--${METRIC_ART[i % 4][1]})"><span class="metric__art">${doodle(METRIC_ART[i % 4][0], { color: METRIC_ART[i % 4][1] })}</span><b data-count="${m.value}" data-pre="${esc(m.prefix)}" data-suf="${esc(m.suffix)}">${esc(m.prefix + m.value + m.suffix)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>`;

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
