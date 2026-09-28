// Home page sections: the stacked project cards and "Who we are" (the hero and "How we work" are templates/journey.js).
'use strict';

const C = require('../content');
const { esc, pad, caseHref, vt, icon, pic, shot, btn, head } = require('./helpers');
const { quoteHtml } = require('./about');
const { SVC_ART } = require('./shared');
const { doodle } = require('./doodles');

// --hue: the project's reel accent, which washes the card (site.css); the pastel --tint stays for the picture's frame
const projectCard = (p, i, total) => `<article class="stack-card" style="--tint:${p.tint};--hue:${esc(C.reels[p.image]?.accent || '#3d5afe')};--i:${i}" data-stack-card>
  <div class="stack-card__inner">
    <i class="stack-card__shade" aria-hidden="true"></i>
    <div class="stack-card__copy">
      <span class="stack-card__num">${pad(i + 1)} / ${pad(total)}</span>
      <h3 style="${vt(p, 'title')}">${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <ul class="tags">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <a class="link-arrow" href="${caseHref(p)}">Read the case study ${icon.arrow}</a>
    </div>
    <figure class="stack-card__media" style="${shot(p.image)};${vt(p, 'media')}"${C.reels[p.image] ? ` data-reel="${esc(JSON.stringify({ ...C.reels[p.image], num: pad(i + 1) }))}"` : ''}>${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 560px' })}</figure>
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
      lead: esc(`Three of the ${C.projects.length} products we’ve designed and built, across luxury automotive, legal investigation and luxury retail.`),
      side: btn('View all work', './projects', 'btn--ghost'),
      mark: ['star', 'tomato'],
    })}
    <div class="stack" data-deck>${C.projects.slice(0, 3).map((p, i) => projectCard(p, i, 3)).join('')}</div>
  </div>
  </div>
</section>`;

// Home: one "who we are" section in place of four (about, what drives us, why us, founder quote):
// the story and the founder's words side by side, then the three reasons as numbered columns.
const studio = () => `<section class="section sheet studio" id="about">
  <div class="wrap">
    ${head({ label: 'Studio', title: 'Who <em>we are</em>', mark: ['heart', 'pink'] })}
    <div class="studio__top">
      <div class="studio__copy">
        <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
        <p class="about__sub" data-reveal>${esc(C.about.whoWeAre[1])}</p>
        <a class="link-arrow" href="./about-us" data-reveal>More about us ${icon.arrow}</a>
      </div>
      <figure class="studio__quote" id="founder" data-reveal>
        <span class="quote__mark" aria-hidden="true">“</span>
        <blockquote>${quoteHtml()}</blockquote>
        <figcaption>${pic(C.founder.photo, '', { small: true, sizes: '52px' })}<span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
      </figure>
    </div>
  </div>
</section>`;

// Home: the four services as tiles (the full panels, demos and tools live on the services page), each with the work
// that shows it; then a way to ask when it isn't obvious which one fits.
const build = () => `<section class="section sheet sheet--day sheet--mint build" id="services">
  <div class="wrap">
    ${head({ label: 'Services', title: 'What we <em>build</em>', lead: 'Four kinds of product. Most of what we ship uses two or three together.', side: btn('All services', './services', 'btn--ghost'), mark: ['pencil', 'lilac'] })}
    <ul class="build__grid" data-stagger>${C.services.map((s) => `
      <li><a class="build__tile" href="./services#${s.id}" style="--dd:var(--${SVC_ART[s.id][1]})">
        <span class="build__icon">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.summary)}</p>
        <span class="build__work">${s.work.length} projects · ${s.work.slice(0, 2).map((k) => esc(C.projects.find((p) => p.image === k).name)).join(', ')}</span>
        <span class="build__more">Explore ${icon.arrow}</span>
      </a></li>`).join('')}
    </ul>
    <p class="build__help"><b>Not sure which you need?</b> Tell us the problem and we’ll map the route. <a class="link" href="./contact">Start a project</a></p>
  </div>
</section>`;

module.exports = { work, studio, build };
