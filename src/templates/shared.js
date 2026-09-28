// Sections used on more than one page: the subpage hero, the FAQ and the contact block.
'use strict';

const C = require('../content');
const { esc, pad, cal, icon, head, pic, btn } = require('./helpers');
const { doodle } = require('./doodles');

// Each service's icon and marker colour (as in the tools map), and a service as a small tile: its icon, name and a
// line on what it covers. Used by the nav's menu and the services hero.
const SVC_ART = { ai: ['chip', 'lilac'], web: ['browser', 'sky'], ecom: ['bag', 'tomato'], cloud: ['cloud', 'mint'] };
const svcTile = (s, cls = 'nav__svc') => `<a class="${cls}" href="./services#${s.id}"><span class="nav__svc-icon" style="--dd:var(--${SVC_ART[s.id][1]})">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span><span><b>${esc(s.title)}</b><small>${esc(s.summary)}</small></span></a>`;

// What follows a message: the contact hero lists these after "you tell us", and the form's thank-you repeats them.
const NEXT_STEPS = `<li><b>We talk it through</b>A 30-minute call to understand the goal, the users and what stands in the way.</li>
    <li><b>You get a route</b>A plan for the first release: scope, stages and the team who will build it.</li>`;

// What sits beside each subpage's headline: something real from the page, on glass (the doodles ride on it).
const SECTORS = new Set(C.projects.map((p) => p.sector)).size;
const heroAside = {
  projects: () => `<div class="phero__show phero-fan" data-hero-fade>${C.projects.slice(0, 3).map((p, i) => `<a class="phero-fan__card" href="./projects#${p.image}" style="--i:${i};--tint:${p.tint}">${pic(p.image, p.name, { sizes: '300px', cls: 'phero-fan__img' })}<span>${esc(p.name)}<small>${esc(p.sector)}</small></span></a>`).join('')}
    <p class="phero-chip"><b>${C.projects.length}</b> products · <b>${SECTORS}</b> sectors</p></div>`,
  services: () => `<div class="phero__show phero-svcs" data-hero-fade>${C.services.map((s) => svcTile(s, 'nav__svc phero-svcs__tile')).join('')}</div>`,
  about: () => `<figure class="phero__show phero-team" data-hero-fade>${pic(C.founder.photo, `${C.founder.name}, ${C.founder.title}`, { sizes: '420px', cls: 'phero-team__img' })}
    <figcaption><b>Founder-led</b>${esc(C.founder.name)}, ${esc(C.founder.title)}, with a team of ${C.metrics.find((m) => /team/i.test(m.label)).value}+ in Ahmedabad</figcaption></figure>`,
  contact: () => `<div class="phero__show phero-next" data-hero-fade><p class="phero-next__label">What happens next</p><ol>
    <li><b>You tell us what you’re building</b>By email, the form below or a call: whatever is easiest.</li>
    ${NEXT_STEPS}</ol></div>`,
};

// Subpage heroes share the home hero's type: a label on a hairline, the headline with its quieter second half,
// and the lead. `title` is HTML (the part in <em> is set in the quieter tone).
// `art`: up to three [doodle, colour]; the first colour marks the headline. `aside`: a heroAside key; with one, the
// hero is two columns and the doodles sit around it; without, they are drawn beside the headline on wide screens.
const pageHero = (kicker, title, lead, extra = '', art = [], aside = '', titleStyle = '') => `<section class="phero${aside ? ' phero--aside' : ''}" data-hero${art.length ? ` style="--mk:var(--${art[0][1]})"` : ''}>
  ${art.length ? `<div class="phero__art" aria-hidden="true">${art.map(([n, c], i) => doodle(n, { color: c, cls: `phero__dd phero__dd--${i + 1}` })).join('')}</div>` : ''}
  <div class="wrap phero__content">
    <p class="hero__label" data-hero-fade>${esc(kicker)}</p>
    <div class="phero__copy">
      ${titleStyle ? `<h1 class="phero__title" style="${titleStyle}">${title}</h1>` : `<h1 class="phero__title" data-split="hero">${title}</h1>`}
      <p class="hero__lead" data-hero-fade>${esc(lead)}</p>
      ${extra}
    </div>
    ${aside ? heroAside[aside]() : ''}
  </div>
</section>`;

// `limit` shows the first few questions (home) with a way to the rest on the contact page.
const faq = (limit = C.faq.length) => `<section class="section sheet sheet--day sheet--sun faq"${limit < C.faq.length ? '' : ' id="faq"'}>
  <div class="wrap faq__grid">
    ${head({ label: 'FAQ', title: 'Questions, <em>answered</em>', lead: limit < C.faq.length ? `${C.faq.length - limit} more on the <a class="link" href="./contact#faq">contact page</a>, or ask us at <a class="link" href="mailto:${C.email}">${C.email}</a>` : `Still curious? <a class="link" href="mailto:${C.email}">${C.email}</a>`, stack: true, mark: ['question', 'sky'] })}
    <div class="acc" data-stagger>
      ${C.faq.slice(0, limit).map((f, i) => `<div class="acc__item"><h3><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}" data-acc><span class="acc__num">${pad(i + 1)}</span><span class="acc__q">${esc(f.q)}</span><i class="acc__icon">${icon.plus}</i></button></h3><div class="acc__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>`;

// The project brief: what they need, a rough budget and timeline (optional pick-one chips), then who they are and
// the project. Each field has its own error, tied to it for screen readers; site.js validates, keeps an unsent draft
// in the browser and swaps the form for a thank-you with the next steps. `id` keeps its ids unique on the page.
const chips = (id, name, legend, options, required = false) => `<fieldset class="chips" data-chips="${name}"${required ? ` aria-describedby="${id}-${name}-err"` : ''}><legend>${legend}</legend><div class="chips__row">${options.map((o) => `<label class="chip"><input type="radio" name="${name}" value="${esc(o)}"${required ? ' required' : ''}><span>${esc(o)}</span></label>`).join('')}</div>${required ? `<p class="form__err" id="${id}-${name}-err" hidden></p>` : ''}</fieldset>`;
const field = (id, name, label, control, hint = '') => `<div class="form__field"><label for="${id}-${name}">${label}</label>${control}<p class="form__err" id="${id}-${name}-err" hidden></p>${hint}</div>`;
const brief = (id) => `<div class="form-wrap" id="${id}-brief" data-reveal>
    <form class="form" data-form action="/api/contact" method="post" novalidate aria-labelledby="${id}-form-title">
      <h3 id="${id}-form-title">Start a project</h3>
      ${chips(id, 'subject', 'What do you need?', [...C.services.map((s) => s.title), 'Something else'], true)}
      ${chips(id, 'budget', 'Rough budget <small>optional</small>', C.brief.budgets)}
      ${chips(id, 'timeline', 'When do you want to start? <small>optional</small>', C.brief.timelines)}
      <div class="form__row">
        ${field(id, 'name', 'Name', `<input id="${id}-name" name="name" autocomplete="name" maxlength="120" required aria-describedby="${id}-name-err">`)}
        ${field(id, 'email', 'Email', `<input id="${id}-email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="${id}-email-err">`)}
      </div>
      ${field(id, 'message', 'What are you building?', `<textarea id="${id}-message" name="message" rows="4" maxlength="5000" required aria-describedby="${id}-message-err ${id}-message-hint"></textarea>`, `<p class="form__hint" id="${id}-message-hint">The goal, who it’s for, and anything you already have. A few sentences is plenty.</p>`)}
      <label class="form__trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <div class="form__foot">
        <button class="btn btn--primary" type="submit"><span>Send message</span><i class="btn__icon">${icon.arrow}</i></button>
        <p class="form__note" data-form-note role="status">We only use your details to reply to you.</p>
      </div>
    </form>
    <div class="form-done" data-form-done tabindex="-1" hidden>
      <span class="form-done__mark" aria-hidden="true">${doodle('star', { color: 'sun' })}</span>
      <h3 data-form-done-title>Thanks, your message is on its way.</h3>
      <p data-form-done-lead>We’ll reply by email.</p>
      <ol class="form-done__steps">${NEXT_STEPS}</ol>
      <div class="form-done__actions"><a class="btn btn--primary" ${cal}><span>Book a call now</span><i class="btn__icon">${icon.arrow}</i></a><button class="btn btn--ghost" type="button" data-form-again><span>Send another message</span></button></div>
    </div>
  </div>`;

// `C.closing` is trusted HTML from content.js (its <em> sets the quieter half).
// The crew band stays empty and hidden unless crew3d.js puts the Demaze crew there.
const contact = (id = 'contact') => `<section class="section sheet sheet--blue contact" id="${id}">
  <div class="wrap contact__grid">
    <div class="contact__copy">
      <div class="contact__plane" aria-hidden="true" data-reveal><svg class="contact__trail" viewBox="0 0 220 90"><path pathLength="1" d="M4 84C40 80 60 40 96 46s34 36 70 18 40-40 50-56"/></svg>${doodle('plane', { color: 'sun' })}</div>
      ${head({ label: 'Contact', title: C.closing, stack: true, mark: ['star', 'sun'] })}
      <ul class="contact__ways" data-stagger>
        <li><a href="mailto:${C.email}"><i>${icon.mail}</i><span><small>Email us with any question</small>${C.email}</span></a></li>
        <li><a ${cal}><i>${icon.cal}</i><span><small>Prefer to talk? Book a 30-minute call</small>Book with Calendly</span></a></li>
        <li><a href="${C.mapUrl}" target="_blank" rel="noopener"><i>${icon.pin}</i><span><small>Office</small>${esc(C.address)}</span></a></li>
      </ul>
      <div class="crew-band" data-crew aria-hidden="true"></div>
    </div>
    ${brief(id)}
  </div>
</section>`;

// How every other page closes: the same promise, the two ways to start (the brief on the contact page, or a call)
// and the email, over the Demaze crew. The full brief form lives on the contact page only.
const cta = () => `<section class="section sheet sheet--blue contact contact--cta" id="contact">
  <div class="wrap">
    <div class="contact__plane" aria-hidden="true" data-reveal><svg class="contact__trail" viewBox="0 0 220 90"><path pathLength="1" d="M4 84C40 80 60 40 96 46s34 36 70 18 40-40 50-56"/></svg>${doodle('plane', { color: 'sun' })}</div>
    ${head({ label: 'Contact', title: C.closing, lead: 'Tell us what you’re building in a short brief, or talk it over on a 30-minute call.', mark: ['star', 'sun'], side: `<div class="contact__actions">${btn('Start a project', './contact#form-brief', 'btn--primary')}${btn('Book a 30-minute call', C.calendly, 'btn--ghost', 'target="_blank" rel="noopener"')}</div><a class="contact__mail" href="mailto:${C.email}"><i>${icon.mail}</i>${C.email}</a>` })}
    <div class="crew-band" data-crew aria-hidden="true"></div>
  </div>
</section>`;

// The moving band: what we build, each followed by its own drawing, running sideways (faster as you scroll; site.js).
// Marker colours that read on the tomato strip.
const FILLS = ['sun', 'sky', 'mint', 'lilac'];
const band = () => `<div class="band" aria-hidden="true"><div class="band__track">${[0, 1].map(() => `<div class="band__run">${C.band.map(([t, d], i) => `<span>${esc(t)}</span>${doodle(d, { color: FILLS[i % FILLS.length] })}`).join('')}</div>`).join('')}</div></div>`;

module.exports = { pageHero, faq, contact, cta, band, SVC_ART, svcTile };
