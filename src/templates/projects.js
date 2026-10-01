// Projects page: the filter, the featured work as large cards, then the rest of the portfolio; each card links to its
// case study page (templates/case.js). `media` is the frame a project's screens and reel share wherever they appear.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, icon, pic, shot } = require('./helpers');

// The services a project drew on (content.js `work` lists them per service), for the filter.
const servicesOf = (p) => C.services.filter((s) => s.work.includes(p.image)).map((s) => s.id);

// A project's real screens on its own tint, over a blurred copy of themselves, with its motion reel (reel.js plays
// `reels` from content.js over them, one card at a time; the screens show whenever the reel rests). `cls` names the
// frame: pcard__media, stack-card__media, case__media.
const media = (p, i, { cls, sizes, attrs = 'loading="lazy" decoding="async"', reel = true } = {}) => `<figure class="${cls} shot" style="--tint:${p.tint};${shot(p.image)}"${reel && C.reels[p.image] ? ` data-reel="${esc(JSON.stringify({ ...C.reels[p.image], num: pad(i + 1) }))}"` : ''}>${pic(p.image, `${p.title}, product screens`, { sizes, attrs })}<span class="shot__label" aria-hidden="true">Real screens</span></figure>`;

// The filter: all work, or the projects under one service (site.js shows and hides the cards, and glides the pill to
// the choice). A project can sit under several services, so the counts overlap.
const filter = () => `<div class="pfilter" role="toolbar" aria-label="Filter projects by service" data-seg>
  ${[{ id: 'all', title: 'All work', n: C.projects.length }, ...C.services.map((s) => ({ id: s.id, title: s.title, n: s.work.length }))]
    .map((f, i) => `<button type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${esc(f.title)}<span>${f.n}</span></button>`).join('')}
</div>
<p class="sr-only" role="status" data-filter-status></p>`;

const card = (p, i, featured) => `<article class="pcard${featured ? ' pcard--featured' : ''}" data-svcs="${servicesOf(p).join(' ')}" data-reveal>
  ${media(p, i, { cls: 'pcard__media', sizes: featured ? '(max-width: 860px) 92vw, 590px' : '(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 390px' })}
  <div class="pcard__body">
    <span class="pcard__num">${pad(i + 1)} · ${esc(p.sector)}</span>
    <h3><a class="pcard__btn" href="${caseHref(p)}">${esc(p.title)}</a></h3>
    <p>${esc(p.brief)}</p>
    <span class="pcard__more" aria-hidden="true">Read the case study ${icon.arrow}</span>
  </div>
</article>`;

// The first FEATURED projects in content.js lead as large cards; filtered, both grids read as one list (site.css).
const FEATURED = 4;
const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    ${filter()}
    <h2 class="projects__sub">Featured work</h2>
    <div class="pgrid pgrid--featured">${C.projects.slice(0, FEATURED).map((p, i) => card(p, i, true)).join('')}</div>
    <h2 class="projects__sub projects__sub--more">More projects</h2>
    <div class="pgrid">${C.projects.slice(FEATURED).map((p, i) => card(p, i + FEATURED, false)).join('')}</div>
  </div>
</section>`;

module.exports = { media, projectsGrid };
