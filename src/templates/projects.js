// Projects page: compact cards; each links to its case study page (templates/case.js).
'use strict';

const C = require('../content');
const { esc, pad, caseHref, icon, pic } = require('./helpers');

// The services a project drew on (content.js `work` lists them per service), for the filter.
const servicesOf = (p) => C.services.filter((s) => s.work.includes(p.image)).map((s) => s.id);

// The filter: all work, or the projects under one service (site.js shows and hides the cards, and glides the pill to
// the choice). A project can sit under several services, so the counts overlap.
const filter = () => `<div class="pfilter" role="toolbar" aria-label="Filter projects by service" data-seg>
  ${[{ id: 'all', title: 'All work', n: C.projects.length }, ...C.services.map((s) => ({ id: s.id, title: s.title, n: s.work.length }))]
    .map((f, i) => `<button type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${esc(f.title)}<span>${f.n}</span></button>`).join('')}
</div>
<p class="sr-only" role="status" data-filter-status></p>`;

const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    ${filter()}
    <div class="pgrid">${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" style="--tint:${p.tint}" data-svcs="${servicesOf(p).join(' ')}" data-reveal>
      <figure class="pcard__media"${C.reels[p.image] ? ` data-reel="${esc(JSON.stringify({ ...C.reels[p.image], num: pad(i + 1) }))}"` : ''}>${pic(p.image, `${p.title}, project preview`, { sizes: '(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 400px' })}</figure>
      <div class="pcard__body">
        <span class="pcard__num">${pad(i + 1)} · ${esc(p.sector)}</span>
        <h2><a class="pcard__btn" href="${caseHref(p)}">${esc(p.title)}</a></h2>
        ${p.description ? `<p>${esc(p.description)}</p>` : ''}
        <span class="pcard__more" aria-hidden="true">Read the case study ${icon.arrow}</span>
      </div>
    </article>`).join('')}</div>
  </div>
</section>`;

module.exports = { projectsGrid };
