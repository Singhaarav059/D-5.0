// Home page sections: the selected work and "Who we are" (the hero and "How we work" are templates/journey.js).
'use strict';

const C = require('../content');
const { esc, pad, caseHref, vt, icon, pic, shot, btn, head } = require('./helpers');
const { print, founderWords } = require('./about');
const { SVC_ART } = require('./shared');
const { doodle } = require('./doodles');

// --hue: the project's reel accent, which washes the card (site.css); the pastel --tint stays for the picture's frame
const projectCard = (p, i, total) => `<article class="stack-card" style="--tint:${p.tint};--hue:${esc(C.reels[p.image]?.accent || '#3d5afe')};--i:${i}">
  <div class="stack-card__inner">
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

// The three latest projects as a bento (site.css), each playing its reel.
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
    <div class="stack">${C.projects.slice(0, 3).map((p, i) => projectCard(p, i, 3)).join('')}</div>
  </div>
  </div>
</section>`;

// Home: who we are, as a person: the founder's print beside his words, then the team in one line (the full story,
// the values and the reasons live on the about page).
const team = C.metrics.find((m) => /team/i.test(m.label));
const studio = () => `<section class="section sheet quote studio" id="about">
  <div class="wrap">
    ${head({ label: 'Studio', title: 'Who <em>we are</em>', mark: ['heart', 'pink'] })}
    <div class="studio__founder">
      ${print()}
      <div class="studio__words">
        <figure class="quote__copy">
          ${founderWords()}
        </figure>
        <p class="studio__team" data-reveal>${esc(C.founder.name.split(' ')[0])} leads a team of ${team.value}${team.suffix} technologists, designers and strategists in Ahmedabad who build your product with you, as one long-term team.</p>
        <a class="link-arrow" href="./about-us" data-reveal>More about us ${icon.arrow}</a>
      </div>
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
    <p class="build__help"><b>Not sure which you need?</b> Tell us the problem and we’ll map the route. <a class="link" href="./contact#form-brief">Start a project</a></p>
  </div>
</section>`;

module.exports = { work, studio, build };
