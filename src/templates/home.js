// Home page sections: the stacked project cards and "Who we are" (the hero is templates/journey.js).
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, shot, btn, head } = require('./helpers');
const { reasons, stats } = require('./about');

const projectCard = (p, i, total) => `<article class="stack-card" style="--tint:${p.tint};--i:${i}" data-stack-card>
  <div class="stack-card__inner">
    <i class="stack-card__shade" aria-hidden="true"></i>
    <div class="stack-card__copy">
      <span class="stack-card__num">${pad(i + 1)} / ${pad(total)}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <ul class="tags">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <a class="link-arrow" href="./projects#${p.image}">Read the case study ${icon.arrow}</a>
    </div>
    <figure class="stack-card__media" style="${shot(p.image)}" data-tour="${esc(JSON.stringify(p.tour))}">${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 640px' })}</figure>
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
    ${stats()}
    ${reasons()}
  </div>
</section>`;

module.exports = { work, studio };
