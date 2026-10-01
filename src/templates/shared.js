// Sections used on more than one page: the subpage hero, the FAQ and the contact block.
'use strict';

const C = require('../content');
const { esc, pad, cal, icon, btn, eyebrow } = require('./helpers');

// Subpage heroes share the home stage: near-black with one blue light (no photo).
const sky = `<div class="hero__bg" aria-hidden="true"><i class="hero__glow" data-glow></i></div>`;

const pageHero = (kicker, title, lead, extra = '') => `<section class="phero" data-hero>
  <div class="phero__panel">
    ${sky}
    <div class="phero__content">
      <p class="hero__eyebrow" data-hero-fade><span>${esc(kicker)}</span></p>
      <h1 class="phero__title" data-split="hero">${title}</h1>
      <p class="hero__lead" data-hero-fade>${esc(lead)}</p>
      ${extra}
    </div>
  </div>
</section>`;

const faq = () => `<section class="section faq">
  <div class="wrap faq__grid">
    <div><h2 class="h2" data-split>Questions, answered</h2><p class="lead" data-reveal>Still curious? <a class="link" href="mailto:${C.email}">${C.email}</a></p></div>
    <div class="acc" data-stagger>
      ${C.faq.map((f, i) => `<div class="acc__item"><h3><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}" data-acc><span class="acc__num">${pad(i + 1)}</span><span class="acc__q">${esc(f.q)}</span><i class="acc__icon">${icon.plus}</i></button></h3><div class="acc__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>`;

// One field of the brief: its label, the control, and (for required fields) the line that says what's wrong.
const field = (name, label, control, optional = false) => `<label class="form__field" for="brief-${name}"><span>${label}${optional ? ' <em>(optional)</em>' : ''}</span>${control}${optional ? '' : `<small class="form__err" id="brief-${name}-err" data-err="${name}"></small>`}</label>`;

// The brief (contact page only): what they need, where they are, who they are and the problem. site.js checks it and
// sends it to /api/contact; if delivery fails, the brief stays filled in and can be emailed instead.
const brief = () => `<div class="brief" id="brief" data-reveal>
  <form class="form" data-form action="/api/contact" method="post" novalidate aria-labelledby="brief-title">
    <h3 id="brief-title">Tell us about your project</h3>
    <fieldset class="form__set"><legend>What do you need?</legend>
      <div class="chips">${[...C.services.map((s) => s.title), 'Not sure yet'].map((t, i) => `<label class="chip"><input type="checkbox" name="need" value="${esc(t)}" id="brief-need-${i}"><span>${esc(t)}</span></label>`).join('')}</div>
    </fieldset>
    <fieldset class="form__set"><legend>Where are you now? <em>(optional)</em></legend>
      <div class="chips">${C.brief.stages.map((t, i) => `<label class="chip"><input type="radio" name="stage" value="${esc(t)}" id="brief-stage-${i}"><span>${esc(t)}</span></label>`).join('')}</div>
    </fieldset>
    <div class="form__row">
      ${field('name', 'Your name', '<input id="brief-name" name="name" autocomplete="name" maxlength="120" required aria-describedby="brief-name-err">')}
      ${field('email', 'Work email', '<input id="brief-email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="brief-email-err">')}
    </div>
    ${field('company', 'Company', '<input id="brief-company" name="company" autocomplete="organization" maxlength="160">', true)}
    ${field('message', 'The problem, in a few lines', '<textarea id="brief-message" name="message" rows="4" minlength="10" maxlength="5000" required aria-describedby="brief-message-err" placeholder="What are you building, and where does it get stuck?"></textarea>')}
    <label class="form__trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
    <button class="btn btn--blue" type="submit"><span>Send the brief</span><i class="btn__icon">${icon.arrow}</i></button>
    <p class="form__note" data-form-note role="status">We only use your details to reply to you.</p>
  </form>
  <div class="form form--done" data-form-done tabindex="-1" hidden>
    <i class="form__done-icon" aria-hidden="true">${icon.check}</i>
    <h3>Thanks, your brief is on its way.</h3>
    <p>We’ll reply by email. If it’s urgent, book a call and we’ll talk it through.</p>
    <div class="form__done-ctas"><a class="btn btn--blue" ${cal}><span>Book a call</span><i class="btn__icon">${icon.arrow}</i></a><button class="btn btn--white" type="button" data-form-again><span>Send another</span></button></div>
  </div>
</div>`;

// The closing block every page ends with: the ways to reach us beside the brief on the contact page, and beside a
// short call to action everywhere else (the form lives on the contact page alone).
const contact = ({ form = false } = {}) => `<section class="section contact" id="${form ? 'form' : 'contact'}">
  <div class="contact__panel">
    <i class="grain" aria-hidden="true"></i><i class="contact__orb" aria-hidden="true"></i>
    <div class="contact__grid${form ? '' : ' contact__grid--cta'}">
      <div class="contact__copy">
        ${eyebrow('Contact', true)}
        <h2 class="h2 contact__title" data-split>${esc(C.closing)}</h2>
        <ul class="contact__ways" data-stagger>
          <li><a href="mailto:${C.email}"><i>${icon.mail}</i><span><small>Feel free to email us if you have any questions or need more details!</small>${C.email}</span></a></li>
          <li><a ${cal}><i>${icon.cal}</i><span><small>Feel free to book a call if that’s more convenient and easier for you.</small>Book with Calendly</span></a></li>
          <li><a href="${C.mapUrl}" target="_blank" rel="noopener"><i>${icon.pin}</i><span><small>Office Location</small>${esc(C.address)}</span></a></li>
        </ul>
      </div>
      ${form ? brief() : `<div class="contact__cta" data-reveal>
        <h3>Have a project in mind?</h3>
        <p>Tell us what you need and where you are. A few lines are enough, and we’ll come back with questions and a first plan.</p>
        <div class="contact__cta-btns">${btn('Start a project', './contact#form', 'btn--blue')}<a class="btn btn--white" ${cal}><span>Book a call</span><i class="btn__icon">${icon.arrow}</i></a></div>
      </div>`}
    </div>
  </div>
</section>`;

module.exports = { sky, pageHero, faq, contact };
