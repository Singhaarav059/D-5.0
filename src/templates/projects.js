// Projects: the story card every project plays wherever it appears (home's selected work, the projects grid, its case
// study), and the projects page grid with its filter.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, pic, SVC_COLOR } = require('./helpers');

// Seconds each chapter (one per feature) stays on screen.
const CHAPTER = 2.6;

// The services a project drew on, as ids ("ai web").
const servicesOf = (p) => C.services.filter((s) => s.work.includes(p.image)).map((s) => s.id);

// A project's reel: its screens on the project's pastel, slowly zooming, with story bars along the top and one
// chapter per feature rising in at the bottom (site.js plays it; [data-cycle] is the whole story's length).
// `size`: 'card' (grids), 'wide' (home's selected work) or 'hero' (the case study).
const reel = (p, { size = 'card', sizes = '(max-width: 860px) 92vw, 620px', eager = false } = {}) => {
  const n = p.features.length;
  const ch = p.features.map((f, j) => ({ label: f, n: pad(j + 1), d: (j * CHAPTER + 0.05).toFixed(2), e: ((j + 1) * CHAPTER).toFixed(2) }));
  return `<div class="reel reel--${size}" data-cycle="${(n * CHAPTER).toFixed(1)}" style="--tint:${p.tint}">
  ${pic(p.image, `${p.title}, product screens`, { sizes, cls: 'reel__img', attrs: `${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" data-kf="zoom"` })}
  <div class="reel__bars" aria-hidden="true">${ch.map((c) => `<span><i data-kf="bar" data-d="${c.d}" data-e="${c.e}"></i></span>`).join('')}</div>
  <div class="reel__chaps" aria-hidden="true">${ch.map((c) => `<div class="reel__chap" data-kf="chap" data-d="${c.d}" data-e="${c.e}"><b>${c.n}</b><span>${esc(c.label)}</span></div>`).join('')}</div>
</div>`;
};

// A project in the grid: its reel, then its number, sector, title and brief. The whole card opens the case study.
const projectCard = (p, i) => `<a class="pcard" href="${caseHref(p)}" data-svcs="${servicesOf(p).join(' ')}" data-reveal>
  <div class="pcard__media" data-tilt="5">${reel(p)}</div>
  <div class="pcard__foot">
    <div><span class="meta">${pad(i + 1)} · ${esc(p.sector)}</span><h3>${esc(p.title)}</h3><p>${esc(p.brief)}</p></div>
    <span class="round round--line" aria-hidden="true">→</span>
  </div>
</a>`;

// The filter: all work, or the projects of one service (site.js shows and hides the cards).
const projectsGrid = () => `<section class="wrap projects" data-room="#ff6242">
  <div class="filter" role="toolbar" aria-label="Filter projects">
    ${[{ id: 'all', title: 'All work', n: C.projects.length }, ...C.services.map((s) => ({ id: s.id, title: s.title, n: s.work.length }))]
      .map((f, i) => `<button type="button" class="filter__btn" data-filter="${f.id}" aria-pressed="${i === 0}"${f.id === 'all' ? '' : ` style="--c:${SVC_COLOR[f.id]}"`}>${esc(f.title)}<small>${f.n}</small></button>`).join('')}
  </div>
  <p class="sr-only" role="status" data-filter-status></p>
  <div class="projects__grid">${C.projects.map((p, i) => projectCard(p, i)).join('')}</div>
</section>`;

module.exports = { reel, projectsGrid, servicesOf };
