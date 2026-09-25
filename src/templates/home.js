// Home page sections: the cinematic hero, the stacked project cards and "Who we are".
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, btn, eyebrow } = require('./helpers');
const { reasons } = require('./about');

// Home hero: a short code-drawn opening (cine.js) — a spark grows into a network of connections that folds
// into a dotted globe — then the globe settles as a horizon under the headline. Without JS it is just the copy.
const hero = () => `<section class="hero hero--cine" data-hero>
  <div class="hero__panel">
    <div class="cine" aria-hidden="true" data-cine>
      <i class="cine__glow"></i>
      <div class="cine__globe" data-globe></div>
      <svg class="cine__net" data-net></svg>
      <div class="cine__tokens" data-tokens></div>
      <p class="cine__label"><i></i>Demaze Technologies</p>
      <p class="cine__caption" data-caption></p>
    </div>
    <div class="hero__content">
      <h1 class="hero__title" data-split="hero">Your Strategic Partner in Building <em>Scalable AI Products</em></h1>
      <div class="hero__aside">
        <p class="hero__lead" data-hero-fade>${esc(C.tagline)}</p>
        <div class="hero__ctas" data-hero-fade>${btn("Let's Connect", './contact', 'btn--blue')}${btn('Explore Services', './services', 'btn--white')}</div>
      </div>
    </div>
    <div class="hero__proof" data-hero-proof>
      <a class="hero__note" href="#founder">
        ${pic(C.founder.photo, '', { small: true, sizes: '44px', attrs: 'decoding="async"' })}
        <span><q>When you thrive, we thrive</q><small>${C.founder.name}, ${C.founder.title}</small></span>
      </a>
      <ul class="hero__stats">${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${m.label}</small></li>`).join('')}</ul>
    </div>
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
    <figure class="stack-card__media">${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 560px' })}</figure>
  </div>
</article>`;

const work = () => `<section class="section work" id="work">
  <div class="wrap">
    <div class="section-head section-head--split">
      <div>${eyebrow('Our work')}<h2 class="h2" data-split>The projects we did</h2><p class="lead" data-reveal>Four of the ${C.projects.length} products we’ve designed and built, from luxury automotive to senior care.</p></div>
      <div>${btn('View all work', './projects', 'btn--white')}</div>
    </div>
    <div class="stack" data-deck>${C.projects.slice(0, 4).map((p, i) => projectCard(p, i, 4)).join('')}</div>
  </div>
</section>`;

// Home: one "who we are" section in place of four (about, what drives us, why us, founder quote):
// the story and the founder's words side by side, then the three reasons as numbered columns.
const studio = () => `<section class="section studio" id="about">
  <div class="wrap">
    <div class="studio__top">
      <div class="studio__copy">
        ${eyebrow('About us')}
        <h2 class="h2" data-split>Who we are</h2>
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
