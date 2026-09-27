// Home page sections: the hero, the stacked project cards and "Who we are".
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, btn, head } = require('./helpers');
const { reasons } = require('./about');
const { maze } = require('./maze');

// Hero: the name as the promise. The headline says it; the maze under it shows it: one route finds its way
// through and lands on the Demaze chevron. Two drawings of the maze, one shaped for wide screens and one for phones.
const hero = () => `<section class="hero" data-hero>
  <div class="wrap hero__top">
    <p class="hero__label" data-hero-fade>${esc(C.hero.label)}</p>
    <div class="hero__grid">
      <h1 class="hero__title" data-split="hero">${C.hero.headline}</h1>
      <div class="hero__aside">
        <p class="hero__lead" data-hero-fade>${esc(C.hero.lead)}</p>
        <div class="hero__ctas" data-hero-fade>${btn('Start a project', './contact')}${btn('See our work', '#work', 'btn--ghost')}</div>
      </div>
    </div>
  </div>
  <div class="hero__maze" data-maze>
    ${maze({ cols: 22, rows: 5, seed: 1892, entry: 2, exit: 2, cls: 'maze--wide' })}
    ${maze({ cols: 10, rows: 6, seed: 1900, entry: 2, exit: 3, cls: 'maze--narrow' })}
  </div>
  <div class="wrap">
    <ul class="hero__stats" data-hero-fade>${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${m.label}</small></li>`).join('')}</ul>
  </div>
</section>`;

const projectCard = (p, i, total) => `<article class="stack-card" style="--tint:${p.tint};--i:${i}" data-stack-card>
  <div class="stack-card__inner">
    <i class="stack-card__shade" aria-hidden="true"></i>
    <div class="stack-card__copy">
      <span class="stack-card__num">${pad(i + 1)} / ${pad(total)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <ul class="tags">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    </div>
    <figure class="stack-card__media"${C.reels[p.image] ? ` data-reel="${esc(JSON.stringify({ ...C.reels[p.image], num: pad(i + 1) }))}"` : ''}>${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 560px' })}</figure>
  </div>
</article>`;

// The section pins (site.js); the dark sheet sits inside it, because a pinned element with side margins is
// measured without them and would run off the right edge.
const work = () => `<section class="work" id="work">
  <div class="section sheet">
  <div class="wrap">
    ${head({
      label: 'Work',
      title: 'Selected work, <em>from brief to launch</em>',
      lead: esc(`Four of the ${C.projects.length} products we’ve designed and built, from luxury automotive to senior care.`),
      side: btn('View all work', './projects', 'btn--ghost'),
    })}
    <div class="stack" data-deck>${C.projects.slice(0, 4).map((p, i) => projectCard(p, i, 4)).join('')}</div>
  </div>
  </div>
</section>`;

// Home: one "who we are" section in place of four (about, what drives us, why us, founder quote):
// the story and the founder's words side by side, then the three reasons as numbered columns.
const studio = () => `<section class="section sheet studio" id="about">
  <div class="wrap">
    ${head({ label: 'Studio', title: 'Who we are' })}
    <div class="studio__top">
      <div class="studio__copy">
        <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
        <p class="about__sub" data-reveal>${esc(C.about.whoWeAre[1])}</p>
        <a class="link-arrow" href="./about-us" data-reveal>More about us ${icon.arrow}</a>
      </div>
      <figure class="studio__quote" id="founder" data-reveal>
        <blockquote>“${esc(C.founder.quote)}”</blockquote>
        <figcaption>${pic(C.founder.photo, '', { small: true, sizes: '52px' })}<span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
      </figure>
    </div>
    ${reasons()}
  </div>
</section>`;

module.exports = { hero, work, studio };
