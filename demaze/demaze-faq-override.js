/**
 * FAQ + closing contact band on the homepage (MOVIQ's "Faq" section).
 * Both live in this section so the DOM order matches the visual order; every
 * MOVIQ "CTA" and "Pricing" section stays hidden by the layout-order CSS.
 * Markup comes from demaze/demaze-blocks.js, styles from demaze-system.css.
 */
(function () {
  if (!window.DemazeOverride || !window.DemazeBlocks) return;

  function ensureStyle() {
    if (document.getElementById('demaze-faq-style')) return;
    var s = document.createElement('style');
    s.id = 'demaze-faq-style';
    s.textContent = "section[data-framer-name=\"Faq\"]{display:block!important;height:auto!important;min-height:0!important;padding:var(--dz-section-y) 0 0!important;margin:0!important;background:var(--dz-paper)!important;overflow:visible!important;}section[data-framer-name=\"Faq\"] > :not(.dz-faq):not(.dz-contact){display:none!important;}";
    document.head.appendChild(s);
  }

  function apply(section) {
    ensureStyle();
    if (section.querySelector('.dz-faq')) return;
    section.appendChild(window.DemazeBlocks.faq());
    section.appendChild(window.DemazeBlocks.contact());
  }

  window.DemazeOverride.run({
    getRoot: function () { return document.querySelector('section[data-framer-name="Faq"]'); },
    isHydrated: function (s) { return !!(s && s.querySelector('[data-framer-name="Container"]')); },
    apply: apply,
    verify: function (s) { return !!(s && s.querySelector('.dz-faq') && s.querySelector('.dz-contact')); }
  });
})();
