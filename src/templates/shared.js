// Sections used on more than one page: the subpage hero, the FAQ and the contact block.
'use strict';

const C = require('../content');
const { esc, pad, cal, icon, eyebrow } = require('./helpers');

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

const contact = (id = 'contact') => `<section class="section contact" id="${id}">
  <div class="contact__panel">
    <i class="grain" aria-hidden="true"></i><i class="contact__orb" aria-hidden="true"></i>
    <div class="contact__grid">
      <div class="contact__copy">
        ${eyebrow('Contact', true)}
        <h2 class="h2 contact__title" data-split>${esc(C.closing)}</h2>
        <ul class="contact__ways" data-stagger>
          <li><a href="mailto:${C.email}"><i>${icon.mail}</i><span><small>Feel free to email us if you have any questions or need more details!</small>${C.email}</span></a></li>
          <li><a ${cal}><i>${icon.cal}</i><span><small>Feel free to book a call if that’s more convenient and easier for you.</small>Book with Calendly</span></a></li>
          <li><a href="${C.mapUrl}" target="_blank" rel="noopener"><i>${icon.pin}</i><span><small>Office Location</small>${esc(C.address)}</span></a></li>
        </ul>
      </div>
      <form class="form" data-form data-reveal action="/api/contact" method="post" novalidate>
        <h3>Reach us at anytime</h3>
        <div class="form__row"><label>Name<input name="name" autocomplete="name" maxlength="120" required></label>
        <label>Email<input name="email" type="email" autocomplete="email" maxlength="254" required></label></div>
        <label>Subject of interest<select name="subject"><option>General enquiry</option>${C.services.map((s) => `<option>${esc(s.title)}</option>`).join('')}</select></label>
        <label>How may we assist you?<textarea name="message" rows="3" maxlength="5000" minlength="10" required></textarea></label>
        <label class="form__trap" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <button class="btn btn--blue" type="submit"><span>Submit</span><i class="btn__icon">${icon.arrow}</i></button>
        <p class="form__note" data-form-note aria-live="polite">Your details are sent securely when contact delivery is configured; otherwise your email app will be offered as a fallback.</p>
      </form>
    </div>
  </div>
</section>`;

module.exports = { pageHero, faq, contact };
