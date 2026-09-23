/**
 * Homepage-wide cleanup after hydration: Framer images that shipped with
 * template alt text (e.g. "image of flowers") or none at all are decorative
 * here, so they get an empty alt. Nav and footer are static/shared markup
 * (see index.html and assets/demaze/demaze-shared.js).
 */
(function () {
  if (!window.DemazeOverride) return;

  var TEMPLATE_ALTS = /^(image of|bg image|why demaze$)/i;

  function apply(main) {
    main.querySelectorAll('img').forEach(function (img) {
      var alt = img.getAttribute('alt');
      if (alt === null || TEMPLATE_ALTS.test(alt)) img.setAttribute('alt', '');
    });
  }

  window.DemazeOverride.run({
    getRoot: function () { return document.querySelector('[data-framer-name="Main"]'); },
    isHydrated: function (m) { return !!(m && m.querySelector('h1')); },
    apply: apply,
    verify: function (m) { return !m.querySelector('img:not([alt]), img[alt^="image of" i]'); }
  });
})();
