// Pieces used on more than one page: the subpage heading, the record (four figures), the founder's print and his
// words lighting up as you scroll.
'use strict';

const C = require('../content');
const { esc, pic, kicker, words } = require('./helpers');

// Subpages open the same way: a label, the headline rising in word by word (its <em> part in the quieter grey) and
// the lead beside it. `room` is the colour the background aura takes while it is in view.
const pageHead = ({ label, title, lead, room }) => `<section class="wrap phead" data-room="${room}">
  <div class="phead__title">${kicker(label)}<h1 class="display display--xl" data-words>${words(title)}</h1></div>
  ${lead ? `<p class="phead__lead" data-reveal>${esc(lead)}</p>` : ''}
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

module.exports = { pageHead, metrics, print, quote };
