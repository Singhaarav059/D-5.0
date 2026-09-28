// Projects page: open cards; each opens a dialog with the full case (content lives in a <template>). Every card and
// the dialog play the project's motion reel (public/assets/reel.js; its script is `reels` in content.js). The case
// reads as a short story: the brief, what we built (with the real product screens), the outcome.
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, shot, btn } = require('./helpers');
const { sketch } = require('./sketches');

const reelAttr = (p, i) => (C.reels[p.image] ? ` data-reel="${esc(JSON.stringify({ ...C.reels[p.image], num: pad(i + 1) }))}"` : '');

// The real screens sit under "What we built"; their alt is empty there because the media column's copy of the
// image (under the reel) already carries it.
const caseBody = (p, i) => `<div class="pdlg__body">
          <p class="pdlg__meta"><span>${pad(i + 1)} / ${pad(C.projects.length)}</span>${esc(p.sector)}</p>
          <h2 id="pdlg-title-${i}">${esc(p.title)}</h2>
          <section class="pdlg__part"><h3>The brief</h3><p>${esc(p.brief)}</p></section>
          <section class="pdlg__part"><h3>What we built</h3>
            <figure class="pdlg__shot" style="--tint:${p.tint}">${pic(p.image, '', { sizes: '(max-width: 1024px) 92vw, 500px' })}</figure>
            ${p.description ? `<p>${esc(p.description)}</p>` : ''}<ul class="checks checks--list">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul></section>
          <section class="pdlg__part"><h3>The outcome</h3><p>${esc(p.outcome)}</p></section>
          <div class="pdlg__cta">${btn('Discuss a similar project', C.calendly, 'btn--primary', 'target="_blank" rel="noopener"')}</div>
        </div>`;

// Filters: the services each project shows (content.js `services[].work`). ?filter=<service id> preselects one.
const servicesOf = (p) => C.services.filter((s) => s.work.includes(p.image)).map((s) => s.id).join(' ');
const filters = () => `<div class="pfilter" role="group" aria-label="Show projects by service" data-reveal>
      <button type="button" aria-pressed="true" data-filter="all">All <span>${C.projects.length}</span></button>${C.services.map((s) => `
      <button type="button" aria-pressed="false" data-filter="${s.id}">${esc(s.title)} <span>${s.work.length}</span></button>`).join('')}
    </div>`;

// Each card is an anchor target (#<image key>): opening that link opens the case (site.js).
const projectsGrid = () => `<section class="section projects">
  ${sketch('phone', { side: 'right', color: 'mint', top: '9%', tilt: 3 })}${sketch('db', { color: 'sky', top: '34%', tilt: -2 })}${sketch('flow', { side: 'right', color: 'sun', top: '58%', tilt: -2 })}${sketch('git', { color: 'pink', top: '82%', tilt: 2 })}
  <div class="wrap">
    ${filters()}
    <div class="pgrid" data-pgrid>${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" id="${p.image}" style="--tint:${p.tint};${shot(p.image)};view-transition-name:pcard-${i}" data-services="${servicesOf(p)}" data-reveal>
      <figure class="pcard__media"${reelAttr(p, i)}>${pic(p.image, `${p.title}, project preview`, { sizes: '(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 400px' })}</figure>
      <div class="pcard__body">
        <p class="pcard__meta"><span class="pcard__num">${pad(i + 1)}</span>${esc(p.sector)}</p>
        <h2><button type="button" class="pcard__btn" data-proj="${i}" aria-haspopup="dialog">${esc(p.title)}</button></h2>
        <p>${esc(p.description || p.brief)}</p>
        <span class="pcard__more">View project ${icon.arrow}</span>
      </div>
      <template data-proj-tpl="${i}">
        <figure class="pdlg__media" style="--tint:${p.tint};${shot(p.image)}"${reelAttr(p, i)}>${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 820px' })}</figure>
        ${caseBody(p, i)}
      </template>
    </article>`).join('')}</div>
  </div>
  <dialog class="pdlg" aria-label="Project details" data-pdlg data-lenis-prevent>
    <div class="pdlg__bar">
      <button type="button" class="pdlg__nav" aria-label="Previous project" data-pdlg-step="-1">${icon.arrow}</button>
      <button type="button" class="pdlg__nav" aria-label="Next project" data-pdlg-step="1">${icon.arrow}</button>
      <button type="button" class="pdlg__close" aria-label="Close" data-pdlg-close>${icon.plus}</button>
    </div>
    <div class="pdlg__inner" data-pdlg-body></div>
  </dialog>
</section>`;

module.exports = { projectsGrid };
