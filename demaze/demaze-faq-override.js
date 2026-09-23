/**
 * FAQ + closing contact band (MOVIQ's "Faq" section).
 * Both live in this section so the DOM order matches the visual order; every
 * MOVIQ "CTA" and "Pricing" section stays hidden by the layout-order CSS.
 */
(function () {
  var C = window.DEMAZE_CONTENT || {};
  var faq = C.faq, contact = C.contact, finalCTA = C.finalCTA;
  if (!faq || !contact || !window.DemazeOverride) return;

  function ensureStyle() {
    if (document.getElementById('demaze-faq-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-faq-style';
    s.textContent = [
      'section[data-framer-name="Faq"]{display:block!important;height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0 0!important;margin:0!important;background:var(--dz-paper)!important;overflow:visible!important;}',
      'section[data-framer-name="Faq"] > :not(.dz-faq):not(.dz-contact){display:none!important;}',

      '.dz-faq{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:40px clamp(40px,6vw,96px);align-items:start;}',
      '.dz-faq-head{position:sticky;top:120px;}',
      '.dz-faq-list{margin:0;padding:0;list-style:none;border-top:1px solid var(--dz-line);}',
      '.dz-faq-item{border-bottom:1px solid var(--dz-line);}',
      '.dz-faq-q{margin:0;}',
      '.dz-faq-btn{all:unset;box-sizing:border-box;width:100%;display:grid;grid-template-columns:1fr 24px;gap:24px;align-items:center;padding:24px 0;cursor:pointer;font:500 18px/1.4 var(--dz-font-text);color:var(--dz-ink);}',
      '.dz-faq-btn:focus-visible{outline:2px solid var(--dz-accent);outline-offset:4px;border-radius:6px;}',
      '.dz-faq-icon{position:relative;width:24px;height:24px;border-radius:50%;color:var(--dz-ink-3);transition:transform var(--dz-base) var(--dz-ease-out),color var(--dz-fast) ease;}',
      '.dz-faq-icon::before,.dz-faq-icon::after{content:"";position:absolute;left:50%;top:50%;width:12px;height:1.5px;margin:-.75px 0 0 -6px;background:currentColor;border-radius:1px;}',
      '.dz-faq-icon::after{transform:rotate(90deg);}',
      '.dz-faq-btn[aria-expanded="true"] .dz-faq-icon{transform:rotate(45deg);color:var(--dz-accent);}',
      '@media (hover:hover) and (pointer:fine){.dz-faq-btn:hover .dz-faq-icon{color:var(--dz-ink);}}',
      '.dz-faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows 280ms var(--dz-ease-out);}',
      '.dz-faq-a > div{overflow:hidden;}',
      '.dz-faq-a p{margin:0;padding:0 48px 28px 0;font:400 16px/1.65 var(--dz-font-text);color:var(--dz-ink-2);max-width:68ch;}',
      '.dz-faq-item.is-open .dz-faq-a{grid-template-rows:1fr;}',
      '@media (prefers-reduced-motion: reduce){.dz-faq-a,.dz-faq-icon{transition:none;}}',

      '.dz-contact{margin-top:var(--dz-section-y);padding-bottom:var(--dz-gutter);}',
      '.dz-contact-panel{position:relative;overflow:hidden;border-radius:calc(var(--dz-radius-lg) + 8px);padding:clamp(48px,7vw,96px) clamp(24px,6vw,80px) clamp(32px,4vw,48px);background:var(--dz-sky);isolation:isolate;}',
      '.dz-contact-panel::before{content:"";position:absolute;inset:0;z-index:-1;background:url("./assets/demaze/subpage-clouds-wide.jpg") center 30%/cover no-repeat;}',
      '.dz-contact-panel::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(255,255,255,.35) 0%,rgba(255,255,255,.72) 60%,rgba(255,255,255,.92) 100%);}',
      '.dz-contact .dz-h2{max-width:18ch;}',
      '.dz-contact .dz-lead{color:var(--dz-ink-2);}',
      '.dz-contact-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px;}',
      '.dz-contact-details{margin:clamp(48px,6vw,80px) 0 0;padding:28px 0 0;list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 40px;border-top:1px solid rgba(11,14,23,.12);}',
      '.dz-contact-details span{display:block;margin-bottom:6px;font:500 12px/1.2 var(--dz-font-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--dz-ink-3);}',
      '.dz-contact-details a,.dz-contact-details p{margin:0;font:500 15px/1.5 var(--dz-font-text);color:var(--dz-ink);text-decoration:none;}',
      '.dz-contact-details p{font-weight:400;color:var(--dz-ink-2);}',
      '@media (hover:hover) and (pointer:fine){.dz-contact-details a:hover{text-decoration:underline;text-underline-offset:4px;}}',

      '@media (max-width: 900px){.dz-faq{grid-template-columns:1fr;}.dz-faq-head{position:static;}.dz-contact-details{grid-template-columns:1fr;}}',
      '@media (max-width: 600px){.dz-faq-btn{font-size:16px;padding:20px 0;}.dz-faq-a p{padding-right:0;}.dz-contact-actions .dz-btn{flex:1 1 100%;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function buildFaq() {
    var el = document.createElement('div');
    el.className = 'dz-faq dz-container';
    el.innerHTML =
      '<div class="dz-faq-head"><span class="dz-eyebrow">' + faq.eyebrow + '</span><h2 class="dz-h2">' + faq.heading + '</h2><p class="dz-lead">' + faq.subheading + '</p></div>' +
      '<ul class="dz-faq-list">' + faq.items.map(function (it, i) {
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

  function buildContact() {
    var email = contact.cards[0], call = contact.cards[1], office = contact.cards[2];
    var el = document.createElement('div');
    el.className = 'dz-contact';
    el.id = 'contact';
    el.innerHTML =
      '<div class="dz-container"><div class="dz-contact-panel">' +
      '<span class="dz-eyebrow">' + contact.eyebrow + '</span>' +
      '<h2 class="dz-h2">' + contact.heading + '</h2>' +
      '<p class="dz-lead">' + finalCTA.heading + '</p>' +
      '<div class="dz-contact-actions">' +
      '  <a class="dz-btn" href="' + finalCTA.primaryCTA.href + '">' + finalCTA.primaryCTA.text + '</a>' +
      '  <a class="dz-btn dz-btn--secondary" href="' + email.link + '">' + email.title + '</a>' +
      '</div>' +
      '<ul class="dz-contact-details">' +
      '  <li><span>' + email.label + '</span><a href="' + email.link + '">' + email.title + '</a></li>' +
      '  <li><span>' + call.label + '</span><a href="' + call.link + '">' + call.desc + '</a></li>' +
      '  <li><span>' + office.label + '</span><p>' + office.desc + '</p></li>' +
      '</ul>' +
      '</div></div>';
    return el;
  }

  function getSection() { return document.querySelector('section[data-framer-name="Faq"]'); }

  function apply(section) {
    ensureStyle();
    if (section.querySelector('.dz-faq')) return;
    section.appendChild(buildFaq());
    section.appendChild(buildContact());
  }

  window.DemazeOverride.run({
    getRoot: getSection,
    isHydrated: function (s) { return !!(s && s.querySelector('[data-framer-name="Container"]')); },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelector('.dz-faq') && s.querySelector('.dz-contact')); }
  });
})();
