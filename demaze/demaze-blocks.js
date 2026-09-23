/**
 * Shared page blocks built from DEMAZE_CONTENT, used on every page:
 * - DemazeBlocks.faq()     accordion (styles in demaze-system.css, .dz-faq)
 * - DemazeBlocks.contact() closing contact band (.dz-contact)
 * Static pages opt in with <div data-dz-block="faq"></div> / "contact".
 */
(function () {
  var C = window.DEMAZE_CONTENT || {};

  function faq() {
    var f = C.faq;
    var el = document.createElement('div');
    el.className = 'dz-faq dz-container';
    el.innerHTML =
      '<div class="dz-faq-head"><span class="dz-eyebrow">' + f.eyebrow + '</span><h2 class="dz-h2">' + f.heading + '</h2><p class="dz-lead">' + f.subheading + '</p></div>' +
      '<ul class="dz-faq-list">' + f.items.map(function (it, i) {
        var open = i === 0;
        return '<li class="dz-faq-item' + (open ? ' is-open' : '') + '">' +
          '<h3 class="dz-faq-q" data-dz-font><button type="button" class="dz-faq-btn" id="dz-faq-q' + i + '" aria-expanded="' + open + '" aria-controls="dz-faq-a' + i + '">' +
          '<span>' + it.question + '</span><span class="dz-faq-icon" aria-hidden="true"></span></button></h3>' +
          '<div class="dz-faq-a" id="dz-faq-a' + i + '" role="region" aria-labelledby="dz-faq-q' + i + '"' + (open ? '' : ' inert') + '><div><p>' + it.answer + '</p></div></div>' +
          '</li>';
      }).join('') + '</ul>';

    el.querySelectorAll('.dz-faq-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.dz-faq-item');
        var open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        item.querySelector('.dz-faq-a').toggleAttribute('inert', !open);
      });
    });
    return el;
  }

  function contact() {
    var c = C.contact, cta = C.finalCTA;
    var email = c.cards[0], call = c.cards[1], office = c.cards[2];
    var el = document.createElement('div');
    el.className = 'dz-contact';
    el.innerHTML =
      '<div class="dz-container"><div class="dz-contact-panel">' +
      '<span class="dz-eyebrow">' + c.eyebrow + '</span>' +
      '<h2 class="dz-h2">' + c.heading + '</h2>' +
      '<p class="dz-lead">' + cta.heading + '</p>' +
      '<div class="dz-contact-actions">' +
      '  <a class="dz-btn" href="/contact">' + cta.primaryCTA.text + '</a>' +
      '  <a class="dz-btn dz-btn--secondary" href="' + email.link + '">' + email.title + '</a>' +
      '</div>' +
      '<ul class="dz-contact-details">' +
      '  <li><span>' + email.label + '</span><a href="' + email.link + '">' + email.title + '</a></li>' +
      '  <li><span>' + call.label + '</span><a href="/contact">' + call.desc + '</a></li>' +
      '  <li><span>' + office.label + '</span><p>' + office.desc + '</p></li>' +
      '</ul>' +
      '</div></div>';
    return el;
  }

  window.DemazeBlocks = { faq: faq, contact: contact };

  function mountStatic() {
    document.querySelectorAll('[data-dz-block]').forEach(function (slot) {
      var make = window.DemazeBlocks[slot.getAttribute('data-dz-block')];
      if (make && !slot.firstChild) slot.appendChild(make());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountStatic);
  else mountStatic();
})();
