// Case study pages (/projects/<image key>): the same story as the project dialog, told as a page of its own that can
// be found, linked and shared. The project's motion reel plays large beside the story (public/assets/reel.js); the
// neighbouring cases and the contact block follow.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, icon, pic, shot, btn } = require('./helpers');
const { pageHero } = require('./shared');
const { reelAttr, servicesOf } = require('./projects');

const caseHero = (p, i) => pageHero(`Case study · ${pad(i + 1)} / ${pad(C.projects.length)} · ${p.sector}`, esc(p.title), p.brief,
  `<div class="hero__ctas" data-hero-fade>${btn('Discuss a similar project', C.calendly, 'btn--primary', 'target="_blank" rel="noopener"')}${btn('All projects', './projects', 'btn--ghost')}</div>`,
  [['rocket', 'tomato'], ['star', 'sun'], ['heart', 'pink']]);

// The hero carries the brief; the story goes on with what we built and the outcome. Beside it: the reel (or the
// screens without motion), then the services the project drew on.
const caseStory = (p, i) => {
  const used = C.services.filter((s) => servicesOf(p).split(' ').includes(s.id));
  return `<section class="section case" style="--tint:${p.tint}">
  <div class="wrap case__grid">
    <div class="case__aside">
      <figure class="pcard__media case__media" style="--tint:${p.tint};${shot(p.image)}"${reelAttr(p, i)}>${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 620px', attrs: 'fetchpriority="high" decoding="async"' })}</figure>
      ${used.length ? `<p class="case__svcs"><span>Services</span>${used.map((s) => `<a href="./services#${s.id}">${esc(s.title)}</a>`).join('')}</p>` : ''}
    </div>
    <div class="case__body" data-stagger>
      <section class="case__part"><h2>What we built</h2>
        ${p.description ? `<p>${esc(p.description)}</p>` : ''}<ul class="checks checks--list">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul></section>
      <section class="case__part"><h2>The outcome</h2><p>${esc(p.outcome)}</p></section>
    </div>
  </div>
</section>`;
};

// The previous and next case, so a reader can keep going without the grid.
const caseMore = (i) => {
  const n = C.projects.length;
  const card = (j, label) => {
    const p = C.projects[(j + n) % n];
    return `<a class="case-more__card" href="${caseHref(p)}" style="--tint:${p.tint}"><span class="case-more__shot">${pic(p.image, '', { sizes: '(max-width: 560px) 92vw, 280px' })}</span><span class="case-more__text"><small>${label}</small><b>${esc(p.name)}</b><span>${esc(p.sector)}</span></span>${icon.arrow}</a>`;
  };
  return `<nav class="section case-more" aria-label="More case studies">
  <div class="wrap case-more__row" data-stagger>${card(i - 1, 'Previous case')}${card(i + 1, 'Next case')}</div>
</nav>`;
};

module.exports = { caseHero, caseStory, caseMore };
