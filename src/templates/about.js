// About page: who we are and the record, what drives us, the founder's words, and why Demaze.
'use strict';

const C = require('../content');
const { esc, pad, kicker, words } = require('./helpers');
const { metrics, print, quote } = require('./shared');

const team = C.metrics.find((m) => /team/i.test(m.label));
const intro = () => `<section class="wrap about" data-room="#ff85b8">
  ${kicker('About Demaze')}
  <h1 class="display display--xl about__title" data-words>${words('Digital transformation <em>architects.</em>')}</h1>
  <div class="about__cols">
    <p class="about__big" data-reveal>We’re more than developers: a passionate team of ${team.value}${team.suffix} technologists, innovators and strategic thinkers who believe in the power of AI to reshape businesses.</p>
    <p class="about__small" data-reveal data-delay="0.1">${esc(C.about.whoWeAre[1])}</p>
  </div>
  ${metrics('metrics--big')}
</section>`;

const DRIVE_COLORS = ['var(--sun)', 'var(--pink)', 'var(--mint)', 'var(--sky)'];
const drives = () => `<section class="sheet-wrap" data-room="#ffcb45">
  <div class="sheet drives">
    ${kicker('What drives us', 'kicker--blue')}
    <h2 class="display display--l" data-reveal>Four reasons <em class="quiet-ink">we do this.</em></h2>
    <div class="drives__grid">${C.about.drives.map((d, i) => `
      <div class="drive" data-reveal data-delay="${(i * 0.08).toFixed(2)}" data-tilt="6">
        <span class="drive__n" style="background:${DRIVE_COLORS[i]}">${pad(i + 1)}</span>
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
      ${kicker('From the founder')}
      ${quote('var(--blue)')}
      <a class="ulink" href="${C.founder.href}" target="_blank" rel="noopener">${esc(C.founder.name.split(' ')[0])} on LinkedIn ↗</a>
    </div>
  </div>
</section>`;

const why = () => `<section class="wrap why" data-room="#2fd0a0">
  ${kicker('Why Demaze')}
  <div class="why__list">${C.whyUs.map((y, i) => `
    <div class="why__row" data-reveal><h3><small>${pad(i + 1)}</small>${esc(y.title)}</h3><p>${esc(y.description)}</p></div>`).join('')}
  </div>
</section>`;

module.exports = { intro, drives, founder, why };
