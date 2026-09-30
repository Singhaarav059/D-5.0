// Case study pages (/projects/<image key>), one per project: the title and the brief with the services it drew on,
// its reel playing large, what we built (the description and the features), the outcome, and the next case.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, pic, btn, SVC_COLOR } = require('./helpers');
const { reel, servicesOf } = require('./projects');

const caseStudy = (p, i) => {
  const used = C.services.filter((s) => servicesOf(p).includes(s.id));
  const next = C.projects[(i + 1) % C.projects.length];
  return `<article class="wrap case">
  <a class="case__back" href="./projects">← All projects</a>
  <header class="case__head" data-room="#3d5afe">
    <div class="case__title"><span class="kicker">${pad(i + 1)} · ${esc(p.sector)}</span><h1 class="display display--case" data-reveal>${esc(p.title)}</h1></div>
    <div class="case__brief">
      <span class="kicker kicker--dim">The brief</span>
      <p data-reveal>${esc(p.brief)}</p>
      ${used.length ? `<div class="case__svcs">${used.map((s) => `<a class="tagline-chip" href="./services#${s.id}"><i style="background:${SVC_COLOR[s.id]}"></i>${esc(s.title)}</a>`).join('')}</div>` : ''}
    </div>
  </header>
  <div data-reveal>${reel(p, { size: 'hero', sizes: '(max-width: 1340px) 94vw, 1244px', eager: true })}</div>
  <section class="case__built">
    <div>
      <h2 class="kicker">What we built</h2>
      ${p.description ? `<p class="case__desc" data-reveal>${esc(p.description)}</p>` : ''}
    </div>
    <ol class="case__features">${p.features.map((f, j) => `<li data-reveal><span>${pad(j + 1)}</span>${esc(f)}</li>`).join('')}</ol>
  </section>
  <section class="case__outcome" data-reveal>
    <div><h2 class="kicker kicker--blue">The outcome</h2><p>${esc(p.outcome)}</p></div>
    ${btn('Build something similar', './contact', { tone: 'ink' })}
  </section>
  <a class="case__next" href="${caseHref(next)}" data-reveal>
    <span class="case__next-main"><span class="case__next-shot" style="--tint:${next.tint}">${pic(next.image, '', { sizes: '140px' })}</span><span><small>Next case · ${esc(next.sector)}</small><b>${esc(next.title)}</b></span></span>
    <span class="round round--paper" aria-hidden="true">→</span>
  </a>
</article>`;
};

module.exports = { caseStudy };
