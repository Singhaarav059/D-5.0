// Sections used on more than one page: the subpage hero, the FAQ and the contact block.
'use strict';

const C = require('../content');
const { esc, pad, cal, icon, head } = require('./helpers');

// Subpage heroes share the home hero's type: a label on a hairline, the headline with its quieter second half,
// and the lead. `title` is HTML (the part in <em> is set in the quieter tone).
const pageHero = (kicker, title, lead, extra = '') => `<section class="phero" data-hero>
  <div class="wrap phero__content">
    <p class="hero__label" data-hero-fade>${esc(kicker)}</p>
    <h1 class="phero__title" data-split="hero">${title}</h1>
    <p class="hero__lead" data-hero-fade>${esc(lead)}</p>
    ${extra}
  </div>
</section>`;

const faq = () => `<section class="section faq">
  <div class="wrap faq__grid">
    ${head({ label: 'FAQ', title: 'Questions, <em>answered</em>', lead: `Still curious? <a class="link" href="mailto:${C.email}">${C.email}</a>`, stack: true })}
    <div class="acc" data-stagger>
      ${C.faq.map((f, i) => `<div class="acc__item"><h3><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}" data-acc><span class="acc__num">${pad(i + 1)}</span><span class="acc__q">${esc(f.q)}</span><i class="acc__icon">${icon.plus}</i></button></h3><div class="acc__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>`;

// `C.closing` is trusted HTML from content.js (its <em> sets the quieter half).
const contact = (id = 'contact') => `<section class="section sheet contact" id="${id}">
  <div class="wrap contact__grid">
    <div class="contact__copy">
      ${head({ label: 'Contact', title: C.closing, stack: true })}
      <ul class="contact__ways" data-stagger>
        <li><a href="mailto:${C.email}"><i>${icon.mail}</i><span><small>Email us with any question</small>${C.email}</span></a></li>
        <li><a ${cal}><i>${icon.cal}</i><span><small>Prefer to talk? Book a 30-minute call</small>Book with Calendly</span></a></li>
        <li><a href="${C.mapUrl}" target="_blank" rel="noopener"><i>${icon.pin}</i><span><small>Office</small>${esc(C.address)}</span></a></li>
      </ul>
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

module.exports = { pageHero, faq, contact };
