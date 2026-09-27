// About page sections: who we are, why choose us (the reasons are also used on the home page) and the founder quote.
'use strict';

const C = require('../content');
const { esc, pad, pic, head } = require('./helpers');

// About page: "Who we are" beside the four "What drives us" values (the founding line is the page hero's lead).
const about = () => `<section class="section about" id="about">
  <div class="wrap">
    ${head({ label: 'About', title: 'Who we are' })}
    <div class="about__grid">
      <div class="about__copy">
        <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
      </div>
      <div class="about__drives">
        <h3 class="about__label" data-reveal>What drives us</h3>
        <div class="drives__grid" data-stagger>${C.about.drives.map((d, i) => `<article class="drive"><span>${pad(i + 1)}</span><h4>${esc(d.title)}</h4><p>${esc(d.description)}</p></article>`).join('')}</div>
      </div>
    </div>
  </div>
</section>`;

// The four figures, counting up as they arrive (site.js [data-count]).
const stats = () => `<ul class="stats" data-stagger>${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${esc(m.label)}</small></li>`).join('')}</ul>`;

const reasons = () => `<ol class="reasons" data-stagger>${C.whyUs.map((w, i) => `<li class="reason"><span class="reason__num">${pad(i + 1)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></li>`).join('')}</ol>`;

const whyUs = () => `<section class="section why">
  <div class="wrap">
    ${head({ label: 'Why us', title: 'Why teams <em>choose us</em>' })}
    ${reasons()}
  </div>
</section>`;

const founder = () => `<section class="section sheet quote" id="founder">
  <figure class="wrap quote__inner">
    <div>
      <blockquote><p>“${esc(C.founder.quote)}”</p></blockquote>
      <figcaption data-reveal><span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
    </div>
    ${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title}`, { sizes: '300px', cls: 'quote__photo', attrs: 'loading="lazy" data-reveal' })}
  </figure>
</section>`;

module.exports = { about, stats, reasons, whyUs, founder };
