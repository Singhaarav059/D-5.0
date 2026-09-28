// Sections used on more than one page: the subpage hero, the FAQ and the contact block.
'use strict';

const C = require('../content');
const { esc, pad, cal, icon, head, pic } = require('./helpers');
const { doodle } = require('./doodles');

// Each service's icon and marker colour (as in the tools map), and a service as a small tile: its icon, name and a
// line on what it covers. Used by the nav's menu and the services hero.
const SVC_ART = { ai: ['chip', 'lilac'], web: ['browser', 'sky'], ecom: ['bag', 'tomato'], cloud: ['cloud', 'mint'] };
const svcTile = (s, cls = 'nav__svc') => `<a class="${cls}" href="./services#${s.id}"><span class="nav__svc-icon" style="--dd:var(--${SVC_ART[s.id][1]})">${doodle(SVC_ART[s.id][0], { color: SVC_ART[s.id][1] })}</span><span><b>${esc(s.title)}</b><small>${esc(s.summary)}</small></span></a>`;

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
    <li><b>We talk it through</b>A 30-minute call to understand the goal, the users and what stands in the way.</li>
    <li><b>You get a route</b>A plan for the first release: scope, stages and the team who will build it.</li></ol></div>`,
};

// Subpage heroes share the home hero's type: a label on a hairline, the headline with its quieter second half,
// and the lead. `title` is HTML (the part in <em> is set in the quieter tone).
// `art`: up to three [doodle, colour]; the first colour marks the headline. `aside`: a heroAside key; with one, the
// hero is two columns and the doodles sit around it; without, they are drawn beside the headline on wide screens.
const pageHero = (kicker, title, lead, extra = '', art = [], aside = '') => `<section class="phero${aside ? ' phero--aside' : ''}" data-hero${art.length ? ` style="--mk:var(--${art[0][1]})"` : ''}>
  ${art.length ? `<div class="phero__art" aria-hidden="true">${art.map(([n, c], i) => doodle(n, { color: c, cls: `phero__dd phero__dd--${i + 1}` })).join('')}</div>` : ''}
  <div class="wrap phero__content">
    <p class="hero__label" data-hero-fade>${esc(kicker)}</p>
    <div class="phero__copy">
      <h1 class="phero__title" data-split="hero">${title}</h1>
      <p class="hero__lead" data-hero-fade>${esc(lead)}</p>
      ${extra}
    </div>
    ${aside ? heroAside[aside]() : ''}
  </div>
</section>`;

const faq = () => `<section class="section faq">
  <div class="wrap faq__grid">
    ${head({ label: 'FAQ', title: 'Questions, <em>answered</em>', lead: `Still curious? <a class="link" href="mailto:${C.email}">${C.email}</a>`, stack: true, mark: ['question', 'sky'] })}
    <div class="acc" data-stagger>
      ${C.faq.map((f, i) => `<div class="acc__item"><h3><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}" data-acc><span class="acc__num">${pad(i + 1)}</span><span class="acc__q">${esc(f.q)}</span><i class="acc__icon">${icon.plus}</i></button></h3><div class="acc__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>`;

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
    <form class="form" data-form data-reveal action="/api/contact" method="post" novalidate>
      <h3>Tell us about your project</h3>
      <div class="form__row"><label>Name<input name="name" autocomplete="name" maxlength="120" required></label>
      <label>Email<input name="email" type="email" autocomplete="email" maxlength="254" required></label></div>
      <label>Subject of interest<select name="subject"><option>General enquiry</option>${C.services.map((s) => `<option>${esc(s.title)}</option>`).join('')}</select></label>
      <label>How can we help?<textarea name="message" rows="4" maxlength="5000" minlength="10" required></textarea></label>
      <label class="form__trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <button class="btn btn--primary" type="submit"><span>Send message</span><i class="btn__icon">${icon.arrow}</i></button>
      <p class="form__note" data-form-note aria-live="polite">Your details are sent securely when contact delivery is configured; otherwise your email app will be offered as a fallback.</p>
    </form>
  </div>
</section>`;

// The moving band: what we build, each followed by its own drawing, running sideways (faster as you scroll; site.js).
// Marker colours that read on the tomato strip.
const FILLS = ['sun', 'sky', 'mint', 'lilac'];
const band = () => `<div class="band" aria-hidden="true"><div class="band__track">${[0, 1].map(() => `<div class="band__run">${C.band.map(([t, d], i) => `<span>${esc(t)}</span>${doodle(d, { color: FILLS[i % FILLS.length] })}`).join('')}</div>`).join('')}</div></div>`;

module.exports = { pageHero, faq, contact, band, SVC_ART, svcTile };
