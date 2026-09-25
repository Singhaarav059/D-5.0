// About page sections: who we are, why choose us (the reasons are also used on the home page) and the founder quote.
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, eyebrow } = require('./helpers');

// About page: "Who we are" beside the four "What drives us" values.
const about = ({ metrics = false, link = true } = {}) => `<section class="section about" id="about">
  <div class="wrap about__grid">
    <div class="about__copy">
      ${eyebrow('About us')}
      <h2 class="h2" data-split>Who we are</h2>
      <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
      <p class="about__sub" data-reveal>${esc(C.about.whoWeAre[1])}</p>
      ${link ? `<a class="link-arrow" href="./about-us" data-reveal>More about us ${icon.arrow}</a>` : ''}
    </div>
    <div class="about__drives">
      <h3 class="about__label" data-reveal>What drives us</h3>
      <div class="drives__grid" data-stagger>${C.about.drives.map((d, i) => `<article class="drive drive--${i}"><span>${pad(i + 1)}</span><h4>${esc(d.title)}</h4><p>${esc(d.description)}</p></article>`).join('')}</div>
    </div>
  </div>
  ${metrics ? `<div class="wrap"><ul class="metrics" data-stagger>${C.metrics.map((m) => `<li class="metric"><span class="metric__value">${m.prefix}<b data-count="${m.value}">${m.value}</b>${m.suffix}</span><span class="metric__label">${m.label}</span></li>`).join('')}</ul></div>` : ''}
</section>`;

const reasons = () => `<ol class="reasons" data-stagger>${C.whyUs.map((w, i) => `<li class="reason"><span class="reason__num">${pad(i + 1)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></li>`).join('')}</ol>`;

const whyUs = () => `<section class="section why">
  <div class="wrap">
    <div class="section-head"><h2 class="h2" data-split>Why choose us</h2></div>
    ${reasons()}
  </div>
</section>`;

const founder = () => `<section class="section quote" id="founder">
  <div class="quote__panel">
    <i class="grain" aria-hidden="true"></i>
    <figure class="wrap quote__inner">
      <div>
        <blockquote><p data-scrub-words>“${esc(C.founder.quote)}”</p></blockquote>
        <figcaption data-reveal><span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
      </div>
      ${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title}`, { sizes: '300px', cls: 'quote__photo', attrs: 'loading="lazy" data-reveal' })}
    </figure>
  </div>
</section>`;

module.exports = { about, reasons, whyUs, founder };
