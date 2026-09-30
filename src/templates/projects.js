// Projects: the frame every project's motion reel plays in wherever it appears (home's selected work, the projects
// grid, its case study), and the projects page grid with its filter.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, pic, shot, SVC_COLOR } = require('./helpers');

// The services a project drew on, as ids ("ai web").
const servicesOf = (p) => C.services.filter((s) => s.work.includes(p.image)).map((s) => s.id);

// A project's screens on its own tint, with its motion reel (public/assets/reel.js plays `reels` from content.js over
// them; the screenshot stays underneath as the fallback, with a blurred copy of itself behind it). `size`: 'card'
// (grids), 'wide' (home's selected work) or 'hero' (the case study).
const media = (p, i, { size = 'card', sizes = '(max-width: 860px) 92vw, 620px', eager = false } = {}) => {
  const reel = C.reels[p.image];
  return `<figure class="shot shot--${size}" style="--tint:${p.tint};${shot(p.image)}"${reel ? ` data-reel="${esc(JSON.stringify({ ...reel, num: pad(i + 1) }))}"` : ''}>${pic(p.image, `${p.title}, product screens`, { sizes, cls: 'shot__img', attrs: eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"' })}</figure>`;
};

// A project in the grid: its reel, then its number, sector, title and brief. The whole card opens the case study.
const projectCard = (p, i) => `<a class="pcard" href="${caseHref(p)}" data-svcs="${servicesOf(p).join(' ')}" data-reveal>
  <div class="pcard__media" data-tilt="4">${media(p, i)}</div>
  <div class="pcard__foot">
    <div><span class="meta">${pad(i + 1)} · ${esc(p.sector)}</span><h3>${esc(p.title)}</h3><p>${esc(p.brief)}</p></div>
    <span class="round round--line" aria-hidden="true">→</span>
  </div>
</a>`;

// The filter: all work, or the projects under one service (site.js shows and hides the cards). A project can
// carry several services, so the counts overlap; the note says so. Unfiltered, the first four read as the story
// (larger) and the rest as the deeper portfolio; filtered, the two grids read as one list (site.css, [data-filtered]).
const LEAD = 4;
const projectsGrid = () => `<section class="wrap projects" data-room="#ff6242">
  <div class="filter" role="toolbar" aria-label="Filter projects">
    ${[{ id: 'all', title: 'All work', n: C.projects.length }, ...C.services.map((s) => ({ id: s.id, title: s.title, n: s.work.length }))]
      .map((f, i) => `<button type="button" class="filter__btn" data-filter="${f.id}" aria-pressed="${i === 0}"${f.id === 'all' ? '' : ` style="--c:${SVC_COLOR[f.id]}"`}>${f.id === 'all' ? '' : '<i></i>'}${esc(f.title)}<small>${f.n}</small></button>`).join('')}
  </div>
  <p class="projects__note">Most projects use two or three services, so a project can appear under more than one.</p>
  <p class="sr-only" role="status" data-filter-status></p>
  <h2 class="projects__sub">Start with these four</h2>
  <div class="projects__grid projects__grid--lead">${C.projects.slice(0, LEAD).map((p, i) => projectCard(p, i)).join('')}</div>
  <h2 class="projects__sub projects__sub--more">The deeper portfolio</h2>
  <div class="projects__grid">${C.projects.slice(LEAD).map((p, i) => projectCard(p, i + LEAD)).join('')}</div>
</section>`;

module.exports = { media, projectsGrid, servicesOf };
