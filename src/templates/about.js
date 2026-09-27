// About page sections: who we are, why choose us (the reasons are also used on the home page) and the founder quote.
'use strict';

const C = require('../content');
const { esc, pad, pic, head } = require('./helpers');
const { doodle, doodleAt } = require('./doodles');
const { chevron, tag } = require('./maze');

// What drives us, drawn: the four values as stations on a Demaze route (the maze's way through), each in the colour of
// its card beside it. Hovering a card lights its station and back (site.js). Decoration: the cards say it all.
const VALUES = [['bulb', 'sun', 'Innovation', 124, 74, -1], ['heart', 'pink', 'Client success', 262, 196, 1], ['sprout', 'mint', 'Tech for good', 392, 74, -1], ['book', 'sky', 'Learning', 510, 196, 1]];
const valuesMap = () => `<svg class="values" viewBox="0 0 600 272" aria-hidden="true" focusable="false" data-reveal data-values>
  <circle class="values__start" cx="22" cy="74" r="7"/>
  <path class="values__route" d="M22 74H190V196H330V74H450V196H566" pathLength="1"/>
  <path class="values__mark" d="${chevron(582, 196, 30)}"/>
  ${VALUES.map(([d, c, label, x, y, side], i) => `<g class="values__stop" data-v="${i}" style="--i:${i}"><g class="values__pop"><circle class="values__halo" style="--dd:var(--${c})" cx="${x}" cy="${y}" r="38"/><circle class="values__disc" cx="${x}" cy="${y}" r="30"/>${doodleAt(d, x, y, 50, { color: c })}${tag(label, x, y + side * 54, 13, c, side * 4)}</g></g>`).join('')}
</svg>`;

// About page: "Who we are" beside the four "What drives us" values (the founding line is the page hero's lead).
const about = () => `<section class="section about" id="about">
  <div class="wrap">
    ${head({ label: 'About', title: 'Who <em>we are</em>', mark: ['heart', 'pink'] })}
    <div class="about__grid">
      <div class="about__copy">
        <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
        ${valuesMap()}
      </div>
      <div class="about__drives">
        <h3 class="about__label" data-reveal>What drives us</h3>
        <div class="drives__grid" data-stagger>${C.about.drives.map((d, i) => `<article class="drive" data-v="${i}"><span>${pad(i + 1)}</span><h4>${esc(d.title)}</h4><p>${esc(d.description)}</p></article>`).join('')}</div>
      </div>
    </div>
  </div>
</section>`;

// The four figures, counting up as they arrive (site.js [data-count]).
const stats = () => `<ul class="stats" data-stagger>${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${esc(m.label)}</small></li>`).join('')}</ul>`;

const reasons = () => `<ol class="reasons" data-stagger>${C.whyUs.map((w, i) => `<li class="reason"><span class="reason__num">${pad(i + 1)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></li>`).join('')}</ol>`;

const whyUs = () => `<section class="section why">
  <div class="wrap">
    ${head({ label: 'Why us', title: 'Why teams <em>choose us</em>', mark: ['star', 'sun'] })}
    ${reasons()}
  </div>
</section>`;

// The founder's words (about page, and the home studio card): the promise at their heart gets a marker line.
const quoteHtml = () => esc(C.founder.quote).replace(esc(C.founder.mark), `<mark>${esc(C.founder.mark)}</mark>`);

// About: the quote beside the founder's photo, pinned to the sheet like a print (paper border, a strip of tape).
const founder = () => `<section class="section sheet quote" id="founder">
  <figure class="wrap quote__inner">
    <div class="quote__copy">
      <span class="quote__mark" aria-hidden="true">“</span>
      <blockquote data-reveal><p>${quoteHtml()}</p></blockquote>
      <figcaption data-reveal><span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>
    </div>
    <div class="quote__print" data-reveal>
      ${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title}`, { sizes: '320px', cls: 'quote__photo' })}
      <span class="quote__cap"><img src="${C.logoMark}" alt="" width="14" height="14">Demaze · Ahmedabad</span>
      <i class="quote__tape" aria-hidden="true"></i>
      ${doodle('star', { color: 'sun', cls: 'quote__star' })}
    </div>
  </figure>
</section>`;

module.exports = { about, stats, reasons, whyUs, founder, quoteHtml };
