// Projects page: compact cards; each opens a dialog with the full case (content lives in a <template>).
// The case reads as a short story: the brief, what we built, the outcome. The brief and outcome are the same lines
// the project's reel tells (src/content.js `reels`), so the film and the text never disagree. The real product screens
// sit under "What we built" (the reel covers them in the media column); their alt is empty there because the media
// column's copy of the image already carries it.
'use strict';

const C = require('../content');
const { esc, pad, icon, pic, btn } = require('./helpers');

const reelAttr = (p, i) => (C.reels[p.image] ? ` data-reel="${esc(JSON.stringify({ ...C.reels[p.image], num: pad(i + 1) }))}"` : '');

const caseBody = (p, i) => {
  const r = C.reels[p.image] || {};
  return `<div class="pdlg__body">
          <p class="pdlg__meta"><span>${pad(i + 1)} / ${pad(C.projects.length)}</span>${esc(p.sector)}</p>
          <h2 id="pdlg-title-${i}">${esc(p.title)}</h2>
          ${r.brief ? `<section class="pdlg__part"><h3>The brief</h3><p>${esc(r.brief.text)}</p></section>` : ''}
          <section class="pdlg__part"><h3>What we built</h3>
            <figure class="pdlg__shot">${pic(p.image, '', { sizes: '(max-width: 1024px) 92vw, 500px' })}</figure>
            ${p.description ? `<p>${esc(p.description)}</p>` : ''}<ul class="checks checks--list">${p.features.map((f) => `<li>${icon.check}${esc(f)}</li>`).join('')}</ul></section>
          ${r.outcome ? `<section class="pdlg__part"><h3>The outcome</h3><p>${esc(r.outcome.text)}</p></section>` : ''}
          <div class="pdlg__cta">${btn('Discuss a similar project', C.calendly, 'btn--primary', 'target="_blank" rel="noopener"')}</div>
        </div>`;
};

const projectsGrid = () => `<section class="section projects">
  <div class="wrap">
    <div class="pgrid">${C.projects.map((p, i) => `<article class="pcard${i === 0 ? ' pcard--wide' : ''}" style="--tint:${p.tint}" data-reveal>
      <figure class="pcard__media"${reelAttr(p, i)}>${pic(p.image, `${p.title}, project preview`, { sizes: '(max-width: 560px) 92vw, (max-width: 1024px) 46vw, 400px' })}</figure>
      <div class="pcard__body">
        <p class="pcard__meta"><span class="pcard__num">${pad(i + 1)}</span>${esc(p.sector)}</p>
        <h2><button type="button" class="pcard__btn" data-proj="${i}" aria-haspopup="dialog">${esc(p.title)}</button></h2>
        ${p.description || C.reels[p.image]?.brief ? `<p>${esc(p.description || C.reels[p.image].brief.text)}</p>` : ''}
        <span class="pcard__more">View project ${icon.arrow}</span>
      </div>
      <template data-proj-tpl="${i}">
        <figure class="pdlg__media" style="--tint:${p.tint}"${reelAttr(p, i)}>${pic(p.image, `${p.title}, product screens`, { sizes: '(max-width: 860px) 92vw, 820px' })}</figure>
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
