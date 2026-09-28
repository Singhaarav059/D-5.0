// About page sections: who we are, why choose us (the reasons are also used on the home page) and the founder quote.
'use strict';

const C = require('../content');
const { esc, pad, pic, head } = require('./helpers');
const { doodle, doodleAt } = require('./doodles');
const { chevron } = require('./maze');

// What drives us, drawn: the four values as stations on a Demaze route (the maze's way through) across the section,
// each over its own column of words, in its colour. Hovering a column lights its station and back (site.js).
// Stations sit at the centres of four equal columns (x 100, 300, 500, 700 of 800); the route steps between two heights.
const VALUES = [['bulb', 'sun'], ['heart', 'pink'], ['sprout', 'mint'], ['book', 'sky']];
const valuesMap = () => `<svg class="values" viewBox="0 0 800 150" aria-hidden="true" focusable="false" data-reveal data-values>
  <circle class="values__start" cx="8" cy="55" r="7"/>
  <path class="values__route" d="M8 55H200V95H400V55H600V95H768" pathLength="1"/>
  <path class="values__mark" d="${chevron(782, 95, 28)}"/>
  ${VALUES.map(([d, c], i) => { const x = 100 + i * 200, y = i % 2 ? 95 : 55; return `<g class="values__stop" data-v="${i}" style="--i:${i}"><g class="values__pop"><circle class="values__halo" style="--dd:var(--${c})" cx="${x}" cy="${y}" r="38"/><circle class="values__disc" cx="${x}" cy="${y}" r="30"/>${doodleAt(d, x, y, 50, { color: c })}</g></g>`; }).join('')}
</svg>`;

// About page: who we are in one statement, then what drives us: the route of four values over their words.
const about = () => `<section class="section about" id="about">
  <div class="wrap">
    ${head({ label: 'About', title: 'Who <em>we are</em>', mark: ['heart', 'pink'] })}
    <p class="about__text" data-scrub-words>${esc(C.about.whoWeAre[0])}</p>
    <div class="about__drives">
      <h3 class="about__label" data-reveal>What drives us</h3>
      ${valuesMap()}
      <div class="drives__grid" data-stagger>${C.about.drives.map((d, i) => `<article class="drive" data-v="${i}">${doodle(VALUES[i][0], { color: VALUES[i][1], cls: 'drive__dd' })}<span>${pad(i + 1)}</span><h4>${esc(d.title)}</h4><p>${esc(d.description)}</p></article>`).join('')}</div>
    </div>
  </div>
</section>`;

// The four figures, counting up as they arrive (site.js [data-count]).
const stats = () => `<ul class="stats" data-stagger>${C.metrics.map((m) => `<li><b>${m.prefix}<span data-count="${m.value}">${m.value}</span>${m.suffix}</b><small>${esc(m.label)}</small></li>`).join('')}</ul>`;

const reasons = () => `<ol class="reasons" data-stagger>${C.whyUs.map((w, i) => `<li class="reason"><span class="reason__num">${pad(i + 1)}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></li>`).join('')}</ol>`;

const whyUs = () => `<section class="section sheet sheet--day sheet--sky why">
  <div class="wrap">
    ${head({ label: 'Why us', title: 'Why teams <em>choose us</em>', mark: ['star', 'sun'] })}
    ${reasons()}
  </div>
</section>`;

// The founder's words (about page, and the home studio card): the promise at their heart gets a marker line.
const quoteHtml = () => esc(C.founder.quote).replace(esc(C.founder.mark), `<mark>${esc(C.founder.mark)}</mark>`);

// The founder's photo, pinned to the sheet like a print (paper border, a strip of tape, a star).
const print = () => `<div class="quote__print" data-reveal>
      ${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title}`, { sizes: '320px', cls: 'quote__photo' })}
      <span class="quote__cap"><img src="${C.logoMark}" alt="" width="14" height="14">Demaze · Ahmedabad</span>
      <i class="quote__tape" aria-hidden="true"></i>
      ${doodle('star', { color: 'sun', cls: 'quote__star' })}
    </div>`;

// The founder's words and name.
const founderWords = () => `<span class="quote__mark" aria-hidden="true">“</span>
      <blockquote data-reveal><p>${quoteHtml()}</p></blockquote>
      <figcaption data-reveal><span><a href="${C.founder.href}" target="_blank" rel="noopener">${C.founder.name}</a><small>${C.founder.title}</small></span></figcaption>`;

// About: the quote beside the founder's print.
const founder = () => `<section class="section sheet quote" id="founder">
  <figure class="wrap quote__inner">
    <div class="quote__copy">
      ${founderWords()}
    </div>
    ${print()}
  </figure>
</section>`;

module.exports = { about, stats, reasons, whyUs, founder, print, founderWords };
