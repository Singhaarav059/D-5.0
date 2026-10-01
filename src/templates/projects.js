// Projects page: compact cards; each links to its case study page (templates/case.js).
'use strict';

const C = require('../content');
const { esc, pad, caseHref, icon, pic } = require('./helpers');

const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    <div class="pgrid">${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" style="--tint:${p.tint}" data-reveal>
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
