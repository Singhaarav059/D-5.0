// About page: who we are (beside where the name comes from) and the record, what drives us (four values as
// stations on a Demaze route), the founder's words, and why teams choose us.
'use strict';

const C = require('../content');
const { esc, pad, kicker, words } = require('./helpers');
const { doodle, doodleAt } = require('./doodles');
const { metrics, print, quote, pageHead } = require('./shared');

const team = C.metrics.find((m) => /team/i.test(m.label));
const intro = () => `${pageHead({ label: 'About Demaze', title: C.about.title, room: '#ff85b8', aside: 'about', doodles: [['heart', 'pink'], ['bulb', 'sun'], ['star', 'mint']],
  lead: `Demaze is ${team.value}${team.suffix} ${C.about.whoWeAre}` })}
<section class="wrap about-record">${metrics('metrics--big')}</section>`;

// What drives us, drawn: the four values as stations on a Demaze route across the sheet, each over its own card, in
// its colour. Hovering a card lights its station, and the other way round (site.js).
const VALUES = [['bulb', 'sun'], ['heart', 'pink'], ['sprout', 'mint'], ['book', 'sky']];
const chevronPath = (x, y, s) => `M${x - s / 2} ${y - s / 2}L${x + s / 2} ${y}L${x - s / 2} ${y + s / 2}L${x - s / 5} ${y}Z`;
const valuesMap = () => `<svg class="values" viewBox="0 0 800 150" aria-hidden="true" focusable="false" data-values>
  <circle class="values__start" cx="8" cy="55" r="7"/>
  <path class="values__route" d="M8 55H200V95H400V55H600V95H768" pathLength="1"/>
  <path class="values__mark" d="${chevronPath(782, 95, 28)}"/>
  ${VALUES.map(([d, c], i) => { const x = 100 + i * 200, y = i % 2 ? 95 : 55; return `<g class="values__stop" data-v="${i}" style="--i:${i}"><g class="values__pop"><circle class="values__halo" style="--dd:var(--${c})" cx="${x}" cy="${y}" r="38"/><circle class="values__disc" cx="${x}" cy="${y}" r="30"/>${doodleAt(d, x, y, 50, { color: c })}</g></g>`; }).join('')}
</svg>`;

const drives = () => `<section class="sheet-wrap" data-room="#ffcb45">
  <div class="sheet drives">
    <div class="drives__head">${kicker('What drives us', 'kicker--blue', ['bulb', 'sun'])}<h2 class="display display--l" data-reveal>Four reasons <em class="quiet-ink">we do this.</em></h2></div>
    ${valuesMap()}
    <div class="drives__grid">${C.about.drives.map((d, i) => `
      <div class="drive" data-v="${i}" data-reveal data-delay="${(i * 0.08).toFixed(2)}" style="--mk:var(--${VALUES[i][1]})">
        <span class="drive__n">${pad(i + 1)}</span>
        <h3>${esc(d.title)}</h3>
        <p>${esc(d.description)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;

const founder = () => `<section class="wrap studio studio--about" data-room="#3d5afe">
  <div class="studio__grid">
    ${print({ tilt: 3, tape: 'var(--pink)' })}
    <div class="studio__words">
      ${kicker('From the founder', '', ['cup', 'tomato'])}
      ${quote('var(--blue)')}
      <a class="ulink" href="${C.founder.href}" target="_blank" rel="noopener">${esc(C.founder.name.split(' ')[0])} on LinkedIn ↗</a>
    </div>
  </div>
</section>`;

// Why teams choose us: three claims, each over its evidence taken from the data itself (content.js `whyUs[].proof`),
// on the night ground so the section reads as evidence rather than a colour block.
const WHY = [['chip', 'lilac'], ['spiral', 'sky'], ['star', 'sun']];
const ai = C.services.find((s) => s.id === 'ai');
const PROOF = {
  ai: () => [[`${ai.work.length} of ${C.projects.length}`, 'products built with AI & ML'], ['Seen in', ai.work.map((k) => C.projects.find((p) => p.image === k).name).join(', ')]],
  route: () => [[`${C.process.length} stages`, C.process.map((s) => s.title.split(' ')[0]).join(' → ')], ['1 team', 'from the first workshop to scale']],
  record: () => C.metrics.map((m) => [`${m.prefix}${m.value}${m.suffix}`, m.label.toLowerCase()]),
};
const why = () => `<section class="wrap why" data-room="#62c1ff">
  <div class="sec-head"><div>${kicker('Why Demaze', '', ['star', 'sun'])}<h2 class="display display--l" data-words>${words('Why teams <em>choose us.</em>')}</h2></div></div>
  <ol class="reasons">${C.whyUs.map((w, i) => `
    <li class="reason" data-reveal data-delay="${(i * 0.1).toFixed(1)}" style="--mk:var(--${WHY[i][1]})">
      <span class="reason__art">${doodle(WHY[i][0], { color: WHY[i][1] })}</span>
      <h3>${esc(w.title)}</h3>
      <p>${esc(w.description)}</p>
      <dl class="reason__proof">${PROOF[w.proof]().map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </li>`).join('')}
  </ol>
</section>`;

module.exports = { intro, drives, founder, why };
