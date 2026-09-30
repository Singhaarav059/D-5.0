// About page: who we are (beside where the name comes from) and the record, what drives us (four values as
// stops down a Demaze route), the founder's words, and why teams choose us.
'use strict';

const C = require('../content');
const { esc, pad, kicker, words } = require('./helpers');
const { doodle } = require('./doodles');
const { metrics, print, quote, pageHead } = require('./shared');

const team = C.metrics.find((m) => /team/i.test(m.label));
const intro = () => `${pageHead({ label: 'About Demaze', title: C.about.title, room: '#ff85b8', aside: 'about', doodles: [['heart', 'pink'], ['bulb', 'sun'], ['star', 'mint']],
  lead: `Demaze is ${team.value}${team.suffix} ${C.about.whoWeAre}` })}
<section class="wrap about-record">${metrics('metrics--big')}</section>`;

// What drives us: the four values as stops down a Demaze route. The heading stays in view while the values scroll past;
// the route draws down through each value's picture as it arrives and lights it (site.js, [data-drives]).
const VALUES = [['sparkle', 'sun'], ['hands', 'pink'], ['tree', 'mint'], ['books', 'sky']];
const drives = () => `<section class="sheet-wrap" data-room="#ffcb45">
  <div class="sheet drives" data-light>
    <div class="drives__head">
      ${kicker('What drives us', 'kicker--blue', ['bulb', 'sun'])}
      <h2 class="display display--l" data-reveal>Four reasons <em class="quiet-ink">we do this.</em></h2>
      <p class="drives__count" aria-hidden="true"><b data-drives-n>01</b> / ${pad(C.about.drives.length)}</p>
    </div>
    <ol class="drives__list" data-drives>
      <li class="drives__route" aria-hidden="true"><i class="drives__track"></i><i class="drives__line" data-drives-line></i></li>${C.about.drives.map((d, i) => `
      <li class="drive" data-drive style="--mk:var(--${VALUES[i][1]})">
        <span class="drive__art"><img src="./assets/img/reel/${VALUES[i][0]}.webp" alt="" width="224" height="224" loading="lazy" decoding="async"></span>
        <div class="drive__text">
          <span class="drive__n">${pad(i + 1)}</span>
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.description)}</p>
        </div>
      </li>`).join('')}
    </ol>
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
