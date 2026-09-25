// Projects page: compact cards; each opens a dialog with the full case (content lives in a <template>).
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, btn } = require('./helpers');

const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    <div class="pgrid">${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" style="--tint:${p.tint}" data-reveal>
      <figure class="pcard__media">${pic(p.image, `${p.title}, project preview`, { sizes: '(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 400px' })}</figure>
      <div class="pcard__body">
        <span class="pcard__num">${pad(i + 1)}</span>
        <h2><button type="button" class="pcard__btn" data-proj="${i}" aria-haspopup="dialog">${esc(p.title)}</button></h2>
        ${p.description ? `<p>${esc(p.description)}</p>` : ''}
        <span class="pcard__more">View project ${icon.arrow}</span>
      </div>
      <template data-proj-tpl="${i}">
        <figure class="pdlg__media" style="--tint:${p.tint}">${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 820px' })}</figure>
        <div class="pdlg__body">
          <span class="pcard__num">${pad(i + 1)} / ${pad(C.projects.length)}</span>
          <h2 id="pdlg-title-${i}">${esc(p.title)}</h2>
          ${p.description ? `<p>${esc(p.description)}</p>` : ''}
          <h3>Highlights</h3>
          <ul class="checks checks--ink">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul>
          <div class="pdlg__cta">${btn('Discuss a similar project', C.calendly, 'btn--blue', 'target="_blank" rel="noopener"')}</div>
        </div>
      </template>
    </article>`).join('')}</div>
  </div>
  <dialog class="pdlg" aria-label="Project details" data-pdlg data-lenis-prevent>
    <button type="button" class="pdlg__close" aria-label="Close" data-pdlg-close>${icon.plus}</button>
    <div class="pdlg__inner" data-pdlg-body></div>
  </dialog>
</section>`;

module.exports = { projectsGrid };
