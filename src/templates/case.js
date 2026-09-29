// Case study pages (/projects/<image key>): the same story as the project dialog, told as a page of its own that can
// be found, linked and shared. The project's motion reel plays large beside the story (public/assets/reel.js); the
// neighbouring cases and the contact block follow.
'use strict';

const C = require('../content');
const { esc, pad, caseHref, vt, icon, pic, shot, btn } = require('./helpers');
const { pageHero } = require('./shared');
const { reelAttr, servicesOf } = require('./projects');

// The facts of the project under the brief: its sector, the services it drew on and, where we can name it, the client.
const facts = (p) => {
  const used = C.services.filter((s) => servicesOf(p).split(' ').includes(s.id));
  const client = C.reels[p.image]?.client;
  const row = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
  return `<dl class="case__facts" data-hero-fade>${row('Sector', esc(p.sector))}${used.length ? row('Services', used.map((s) => `<a href="./services#${s.id}">${esc(s.title)}</a>`).join('')) : ''}${client ? row('Client', esc(client.replace(/^Built for (\w)/, (_, c) => c.toUpperCase()))) : ''}</dl>`;
};

const caseHero = (p, i) => pageHero(`Case study · ${pad(i + 1)} / ${pad(C.projects.length)} · ${p.sector}`, esc(p.title), p.brief,
  `<div class="hero__ctas" data-hero-fade>${btn('Discuss a similar project', C.calendly, 'btn--primary', 'target="_blank" rel="noopener"')}${btn('All projects', './projects', 'btn--ghost')}</div>${facts(p)}`,
  [['rocket', 'tomato'], ['star', 'sun'], ['heart', 'pink']], '', vt(p, 'title')); // (the title arrives with the card, so no word-by-word intro)

// The hero carries the brief and the facts; the story goes on with what we built (the reel, or the screens without
// motion, beside it) and closes on the outcome, set large in the project's own colour.
const caseStory = (p, i) => `<section class="section case" style="--tint:${p.tint};--hue:${esc(C.reels[p.image]?.accent || '#3d5afe')}">
  <div class="wrap">
    <div class="case__grid">
      <div class="case__aside">
        <figure class="pcard__media case__media" style="--tint:${p.tint};${shot(p.image)};${vt(p, 'media')}"${reelAttr(p, i)}>${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 620px', attrs: 'fetchpriority="high" decoding="async"' })}</figure>
      </div>
      <div class="case__body">
        <h2 class="case__label" data-reveal>What we built</h2>
        ${p.description ? `<p class="case__lead" data-reveal>${esc(p.description)}</p>` : ''}
        <ul class="case__features" data-stagger>${p.features.map((f) => `<li>${icon.check}<span>${esc(f)}</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="case__outcome" data-reveal>
      <h2 class="case__label">The outcome</h2>
      <p>${esc(p.outcome)}</p>
    </div>
  </div>
</section>`;

// The previous and next case, so a reader can keep going without the grid.
const caseMore = (i) => {
  const n = C.projects.length;
  const card = (j, label) => {
    const p = C.projects[(j + n) % n];
    return `<a class="case-more__card" href="${caseHref(p)}" style="--tint:${p.tint}"><span class="case-more__shot" style="${vt(p, 'media')}">${pic(p.image, '', { sizes: '(max-width: 560px) 92vw, 280px' })}</span><span class="case-more__text"><small>${label}</small><b>${esc(p.name)}</b><span>${esc(p.sector)}</span></span>${icon.arrow}</a>`;
  };
  return `<nav class="section case-more" aria-label="More case studies">
  <div class="wrap case-more__row" data-stagger>${card(i - 1, 'Previous case')}${card(i + 1, 'Next case')}</div>
</nav>`;
};

module.exports = { caseHero, caseStory, caseMore };
