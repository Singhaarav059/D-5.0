// Case study pages (/projects/<image key>), one per project: the page hero with the brief and the services it drew on,
// its reel playing large, what we built, its real screens, the outcome, and the cases either side of it.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, icon, pic, btn, eyebrow } = require('./helpers');
const { media } = require('./projects');
const { sky } = require('./shared');


const neighbour = (p, label, cls) => `<a class="case__pager-link ${cls}" href="${caseHref(p)}">
  <span class="case__pager-shot" style="--tint:${p.tint}">${pic(p.image, '', { sizes: '120px' })}</span>
  <span><small>${label} · ${esc(p.sector)}</small><b>${esc(p.title)}</b></span>
</a>`;

const caseStudy = (p, i) => {
  const used = C.services.filter((s) => s.work.includes(p.image));
  const prev = C.projects[(i - 1 + C.projects.length) % C.projects.length];
  const next = C.projects[(i + 1) % C.projects.length];
  return `<section class="phero phero--case" data-hero>
  <div class="phero__panel">
    ${sky}
    <div class="phero__content">
      <nav class="case__crumbs" aria-label="Breadcrumb" data-hero-fade><a href="./projects">Projects</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <p class="hero__eyebrow" data-hero-fade><span>${pad(i + 1)} · ${esc(p.sector)}</span></p>
      <h1 class="phero__title" data-split="hero">${esc(p.title)}</h1>
      <p class="hero__lead" data-hero-fade>${esc(p.brief)}</p>
      ${used.length ? `<ul class="case__svcs" data-hero-fade aria-label="Services used">${used.map((s) => `<li><a href="./services#${s.id}">${esc(s.title)}</a></li>`).join('')}</ul>` : ''}
    </div>
  </div>
</section>
<section class="section case">
  <div class="wrap">
    ${media(p, i, { cls: 'case__media', sizes: '(max-width: 1240px) calc(100vw - 40px), 1200px', attrs: 'decoding="async" fetchpriority="high"' })}
    <div class="case__grid">
      <div class="case__built">
        ${eyebrow('What we built')}
        <h2 class="h2" data-split>${esc(p.name)}</h2>
        ${p.description ? `<p class="case__desc" data-reveal>${esc(p.description)}</p>` : ''}
      </div>
      <div class="case__features" data-reveal>
        <h3>Highlights</h3>
        <ul class="checks checks--ink">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul>
      </div>
    </div>
    <figure class="case__screens" data-reveal>
      ${media(p, i, { cls: 'case__shot', sizes: '(max-width: 1240px) calc(100vw - 40px), 1200px', reel: false })}
      <figcaption>The product as shipped: ${esc(p.name)}’s real screens.</figcaption>
    </figure>
    <div class="case__outcome" data-reveal>
      <div>${eyebrow('The outcome')}<p class="case__outcome-text">${esc(p.outcome)}</p></div>
      <div class="case__outcome-ctas">${btn('Discuss a similar project', './contact#form', 'btn--blue')}${btn('All projects', './projects', 'btn--white')}</div>
    </div>
    <nav class="case__pager" aria-label="More case studies" data-reveal>${neighbour(prev, 'Previous', 'is-prev')}${neighbour(next, 'Next', 'is-next')}</nav>
  </div>
</section>`;
};

module.exports = { caseStudy };
